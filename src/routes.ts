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

routes.get('/teste', async (req, res) => {
  const { data } = await apiFrota.post('/api/frotista/abastecimento/pesquisa', {
    dataInicial: '2022-01-25T09:00:00',
    dataFinal: '2022-01-25T15:00:00',
    pagina: '1'
  })
  res.json(data)
})

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

export { routes }
