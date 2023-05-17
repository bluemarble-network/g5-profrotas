import { Router } from 'express'
import moment from 'moment'
import { apiFrota } from './api/axios'
import { abastecimentos, insertAbastecimentos } from './insertAbastecimentos'
import { insertCobrancas } from './insertCobrancas'
import { insertMotoristas } from './insertMotoristas'
import { insertNotasFiscais } from './insertNotasFiscais'
import { consultaInsereVeiculos, insertVeiculos } from './insertVeiculos'
import { insertOrUpdate, queryBuilder } from './utils/knex'
import { delay } from './utils/utils'
import { EsperaEntreConsultas } from '.'
const routes = Router()

routes.get('/abastecimentosRetroativosMensal/:mes', async (req, res) => {
  const mes = Number(req.params.mes) - 1

  const dataInicial = moment([2023, mes, 1]).toDate()
  const dataFinal = moment([2023, mes, 1]).add(1, 'month').toDate()
  console.log('inicio mensal', moment(dataInicial).format('YYYY-MM-DD'), moment(dataFinal).format('YYYY-MM-DD'))
  const retornoInsert = await abastecimentos(dataInicial, dataFinal)
  console.log('retornoInsert', retornoInsert)
  console.log('fim mensal')

  res.json({ retornoInsert })
})

routes.get('/abastecimentosRetroativosDiarios/:mes/:diaIni/:diaFim', async (req, res) => {
  const mes = Number(req.params.mes) - 1
  const diaIni = Number(req.params.diaIni)
  const diaFim = Number(req.params.diaFim)
  if (!mes) return res.send('sem param mes')
  if (!diaIni) return res.send('sem param diaIni')
  if (!diaFim) return res.send('sem param diaFim')
  const datas = []
  for (let dia = diaIni; dia <= diaFim; dia++) {
    // mes 2 = mes 03.
    const dataInicial = moment([2023, mes, dia]).toDate()
    const dataFinal = moment([2023, mes, dia]).add(1, 'days').toDate()
    console.log('inicio', moment(dataInicial).format('YYYY-MM-DD'), moment(dataFinal).format('YYYY-MM-DD'))
    await delay(EsperaEntreConsultas)
    const retornoInsert = await abastecimentos(dataInicial, dataFinal)
    console.log('retornoInsert', retornoInsert)
    console.log('fim')
    datas.push({ dataInicial, dataFinal })
  }
  console.log('fim - geral')

  res.json({ datas })
})

routes.get('/teste', async (req, res) => {
  const { data } = await apiFrota.post('/api/frotista/abastecimento/pesquisa', {
    dataInicial: '2022-01-25T09:00:00',
    dataFinal: '2022-01-25T15:00:00',
    pagina: '1'
  })
  res.json(data)
})

routes.get('/cota-veiculo/:placa', async (req, res) => {
  // não retornou nada.
  const placa = req.params.placa
  console.log(placa)
  try {
    const { data } = await apiFrota.get(`/api/frotista/cota-veiculo/${placa}`)
    res.json(data)
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    res.json(error.response.data)
  }
})

routes.get('/abastecimentos', insertAbastecimentos)
routes.get('/cobrancas', insertCobrancas)
routes.get('/motoristas', insertMotoristas)
routes.get('/notas-fiscais', insertNotasFiscais)
routes.get('/veiculos', insertVeiculos)

routes.get('/rota', async (req, res) => {
  // não consegui retornar nada
  try {
    const { data } = await apiFrota.get('/api/frotista/rota/1')
    res.json(data)
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    res.json(error.response.data)
  }
})

export { routes }
