import { Request, Response } from 'express'
import moment from 'moment'
import { EsperaEntreConsultas } from '.'
import { apiFrota } from './api/axios'
import { insertOrUpdate, logDB, queryBuilder } from './utils/knex'
import { delay } from './utils/utils'

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
    return res.json(error.response.data)
  }

  // return res.json(data)
}

export async function abastecimentos (dataInicialDate: Date, dataFinalDate : Date) {
  const dataInicial = moment(dataInicialDate).utc().format('YYYY-MM-DDTHH:mm:ss')
  const dataFinal = moment(dataFinalDate).utc().format('YYYY-MM-DDTHH:mm:ss')
  await logDB({ obs: `abast. inicial:${dataInicial}, final:${dataFinal}` })

  let pagina = 1
  const { data } = await apiFrota.post('/api/frotista/abastecimento/pesquisa', {
    dataInicial,
    dataFinal,
    pagina
  })
  let totalRegistros = data.registros.length
  const tamanhoPagina = data.tamanhoPagina
  let dadosTotais = data.registros

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

  const dadosFormatados = dadosTotais.map((item:any) => ({
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
  retornoInsert.push(await insertOrUpdate(queryBuilder, 'profrotas_abastecimentos', dadosFormatados))
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

  retornoInsert.push(await insertOrUpdate(queryBuilder, 'profrotas_abastecimentos_itens', dadosFormatadosItens))
  await logDB({ obs: 'profrotas_abastecimentos_itens', qtdInserida: dadosFormatadosItens.length })
  return retornoInsert
}
