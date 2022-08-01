import { Router } from 'express'
import moment from 'moment'
import { api, apiFrota } from './api/axios'
import { insertAbastecimentos } from './insertAbastecimentos'
import { insertCobrancas } from './insertCobrancas'
import { insertMotoristas } from './insertMotoristas'
import { insertNotasFiscais } from './insertNotasFiscais'
import { insertVeiculos } from './insertVeiculos'
import { insertOrUpdate, queryBuilder } from './utils/knex'
const routes = Router()

routes.get('/cota-veiculo/:placa', async (req, res) => { // não retornou nada.
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

routes.get('/rota', async (req, res) => { // não consegui retornar nada
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

routes.get('/teste', async (req, res) => {
  const data = '2022-07-11T03:00:00.000+00:00'
  const dataFormatada = moment(data).format('YY-MM-DD HH:mm')
  res.send(dataFormatada)
})

export { routes }
