import { Request, Response } from 'express'
import moment from 'moment'
import { EsperaEntreConsultas } from '.'
import { apiFrota } from './api/axios'
import { insertOrUpdate, logDB, queryBuilder } from './utils/knex'
import { delay, sendTelegram } from './utils/utils'

export async function insertAbastecimentos (req: Request, res: Response): Promise<Response> {
  // período entre às duas não deve ser maior 2 meses
  // const dataInicial = '2022-04-01T00:00:00'
  // const dataFinal = '2022-05-01T00:00:00'
  // const pr = req.params.pr

  const dataInicial = moment().subtract(24, 'hours').toDate()
  const dataFinal = moment().toDate()

  try {
    return res.json(await abastecimentos(dataInicial, dataFinal))
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    await logDB({ obs: error.message as string })
    await sendTelegram('G5 profrotas: ' + error.message)
    return res.json(error.response.data)
  }
}

interface itemsProps {
  identificador: string
nome: string
tipo: { codigo:number, valor:string}
quantidade: number
valorUnitario: number
valorTotal: number
}

interface veiculoProps {
identificador: number
placa: string
tipo: { codigo:number, valor:string}
subtipo: { codigo:number, valor:string}
marca: string
modelo: string
anoModelo: number
anoFabricao: number
agregado: boolean
unidade:string
grupoOperacional: string
empresaAgregada: string
}

interface frotaProps {
  cnpj: number
  razaoSocial: string
}
interface motoristaProps {
  cpf: number
  nome: string | null
  agregado: string | null
  unidade: boolean
  grupoOperacional: string | null
  empresaAgregada: string | null
}

interface registroProps {
  identificador: number
  abastecimentoEstornado: number
  data: string
  dataAtualizacao: string
  statusEdicao: number
  dataTransacao: string
  statusAutorizacao: number
  motivoRecusa: string
  motivoCancelamento: null,
  hodometro: number
  horimetro: number
  frota: frotaProps
  motorista: motoristaProps
  veiculo: veiculoProps
  pontoVenda: pontoVendaProps
  items: [itemsProps]
}

interface retornoGeralProps {
  totalItems: number
  registros: [any]
  observacoes: string | null
  pagina: number
  tamanhoPagina: number
}

interface pontoVendaProps {
  cnpj: number
  razaoSocial: string
  postoInterno: boolean
  endereco: {
    cep: number
    logradouro:string
    numero: number
    complemento:string
    bairro:string
    municipio:string
    uf:string
    latitude: number
    longitude:number
  }
}

export async function abastecimentos (dataInicialDate: Date, dataFinalDate : Date) {
  const dataInicial = moment(dataInicialDate).utc().format('YYYY-MM-DDTHH:mm:ss')
  const dataFinal = moment(dataFinalDate).utc().format('YYYY-MM-DDTHH:mm:ss')
  await logDB({ obs: `abast. inicial:${dataInicial}, final:${dataFinal}` })

  let pagina = 1
  const { data } = await apiFrota.post<retornoGeralProps>('/api/frotista/abastecimento/pesquisa', {
    dataInicial,
    dataFinal,
    pagina
  })

  let totalRegistros = data.registros.length
  const tamanhoPagina = data.tamanhoPagina
  let dadosTotais :registroProps[] = data.registros

  while (totalRegistros === tamanhoPagina) {
    pagina++
    console.log(`atenção consulta maior que ${tamanhoPagina}x Registros, totalRegistros:${totalRegistros}, página:${pagina}`)
    await delay(EsperaEntreConsultas)
    const { data } = await apiFrota.post('/api/frotista/abastecimento/pesquisa', {
      dataInicial,
      dataFinal,
      pagina
    })
    dadosTotais = dadosTotais.concat(data.registros)
    totalRegistros = data.registros.length
  }
  // return res.json(dadosTotais)

  const dadosFormatados = dadosTotais.map((item) => ({
    identificador: item.identificador,
    abastecimentoEstornado: item.abastecimentoEstornado,
    data: item.data,
    dataAtualizacao: item.dataAtualizacao,
    dataTransacao: item.dataTransacao,
    statusEdicao: item.statusEdicao,
    statusAutorizacao: item.statusAutorizacao,
    motivoRecusa: item.motivoRecusa,
    motivoCancelamento: item.motivoCancelamento,
    hodometro: item.hodometro,
    motorista_cpf: item.motorista.cpf,
    veiculo_identificador: item.veiculo.identificador,
    pontoVenda_cnpj: item.pontoVenda.cnpj
  }))

  const retornoInsert = []
  if (dadosFormatados.length > 0) {
    retornoInsert.push(await insertOrUpdate(queryBuilder, 'profrotas_abastecimentos', dadosFormatados))
  }

  await logDB({ obs: 'profrotas_abastecimentos', qtdInserida: dadosFormatados.length })

  const dadosFormatadosItens = []

  for (const abastecimento of data.registros) {
    for (const item of abastecimento.items) {
      dadosFormatadosItens.push({
        identificador: abastecimento.identificador,
        identificador_itens: item.identificador,
        nome: item.nome,
        tipo_codigo: item.tipo.codigo,
        tipo_valor: item.tipo.valor,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal
      })
    }
  }

  if (dadosFormatadosItens.length > 0) {
    retornoInsert.push(await insertOrUpdate(queryBuilder, 'profrotas_abastecimentos_itens', dadosFormatadosItens))
  }
  await logDB({ obs: 'profrotas_abastecimentos_itens', qtdInserida: dadosFormatadosItens.length })

  const pontoVendaCnpjPossiveis = [...new Set(data.registros.map((item: registroProps) => String(item.pontoVenda.cnpj)))]
  const pontoVendaCnpjCadastrados = await queryBuilder('profrotas_ponto_venda').select(['cnpj']).whereIn('cnpj', pontoVendaCnpjPossiveis)
  const pontoVendaCnpjCadastradosArr = pontoVendaCnpjCadastrados.map(item => item.cnpj)
  const pontoVendaCnpjParaIncluir = pontoVendaCnpjPossiveis.filter(item => !pontoVendaCnpjCadastradosArr.includes(item))
  if (pontoVendaCnpjParaIncluir.length > 0) {
    const insertItens : pontoVendaProps[] = []
    for (const pontoVenda of pontoVendaCnpjParaIncluir) {
      insertItens.push({ ...data.registros.find((item: registroProps) => String(item.pontoVenda.cnpj) === pontoVenda).pontoVenda })
    }
    const insertFormatadado = insertItens.map(item => ({
      cnpj: item.cnpj,
      razaoSocial: item.razaoSocial,
      postoInterno: item.postoInterno,
      cep: item.endereco.cep,
      logradouro: item.endereco.logradouro,
      numero: item.endereco.numero,
      complemento: item.endereco.complemento,
      bairro: item.endereco.bairro,
      municipio: item.endereco.municipio,
      uf: item.endereco.uf,
      latitude: item.endereco.latitude,
      longitude: item.endereco.longitude
    }))
    if (insertFormatadado.length > 0) {
      retornoInsert.push(await insertOrUpdate(queryBuilder, 'profrotas_ponto_venda', insertFormatadado))
    }
  }

  return retornoInsert

  // "pontoVenda": {
  //   "cnpj": 20415295001901,
  //   "razaoSocial": "Rede Dom Pedro De Postos Ltda.",
  //   "postoInterno": false,
  //   "endereco": {
  //   "cep": 35540000,
  //   "logradouro": "Rodovia Br 381",
  //   "numero": 0,
  //   "complemento": "611",
  //   "bairro": "D.I.David Matar Ii",
  //   "municipio": "Oliveira",
  //   "uf": "MG",
  //   "latitude": -20.68374634,
  //   "longitude": -44.73849106
  //   }
  //   }
}
