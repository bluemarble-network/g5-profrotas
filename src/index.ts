import express from 'express'
import cors from 'cors'
import ip from 'ip'
import { routes } from './routes'
import { api, apiFrota } from './api/axios'
import 'dotenv/config'
import { autenticaFrota, setTokenFixo } from './api/autenticaFrota'
import { autentica } from './api/autentica'
import { logDB } from './utils/knex'
import moment from 'moment'
import { abastecimentos } from './insertAbastecimentos'
import { consultaInsereVeiculos } from './insertVeiculos'
const SEGUNDO = 1000
const MINUTO = SEGUNDO * 60
const HORA = MINUTO * 60
export const EsperaEntreConsultas = 30 * SEGUNDO
const IntervaloAbastecimentos = 3 * HORA
const IntervaloVeiculos = 24 * HORA

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port, async function () {
  const msg = `Start G5 Profrotas http://${ip.address()}:${port}`
  console.log(msg)
  // sendTelegram(msg)
  // await logDB({ obs: msg })
  await autentica(api)
  await autenticaFrota(apiFrota)

  console.log('process.env.DEV', process.env.DEV)
  if (process.env.DEV) {
    // await consultaInsereVeiculos()
  }
  // await setTokenFixo(apiFrota)
  // const dataAnterior = moment().subtract(24, 'hours').toDate()
  // const dataAgora = moment().toDate()
  // const dataAnterior = moment().subtract(2, 'months').toDate()
  // const dataAnterior = moment('2022-02-14 00:00:00').subtract(3, 'hours').toDate()
  // const dataAgora = moment('2022-02-15 00:00:00').subtract(3, 'hours').toDate()

  // console.log(dataAnterior)
  // console.log(dataAgora)
  // await abastecimentos(dataAnterior, dataAgora)
})

setInterval(async () => {
  await logDB({ obs: 'IntervaloAbastecimentos' })
  const data24horasAtras = moment().subtract(24, 'hours').toDate()
  const dataAgora = moment().toDate()
  await abastecimentos(data24horasAtras, dataAgora)
}, IntervaloAbastecimentos)

setInterval(async () => {
  await logDB({ obs: 'IntervaloVeiculos' })
  await consultaInsereVeiculos()
}, IntervaloVeiculos)
