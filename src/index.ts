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
export const EsperaEntreConsultas = 1000 * 4 // 4 seg
export const IntervaloConsulta = 1000 * 60 * 60 * 3 // 3 horas
export const IntervaloConsultaVeiculos = 1000 * 60 * 60 * 24 // 24 horas
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port, async function () {
  const msg = `Start G5 Profrotas http://${ip.address()}:${port}`
  console.log(msg)
  // sendTelegram(msg)
  await logDB({ obs: msg })
  await autentica(api)
  await autenticaFrota(apiFrota)
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
  await logDB({ obs: 'IntervaloConsulta' })
  const data24horasAtras = moment().subtract(24, 'hours').toDate()
  const dataAgora = moment().toDate()
  await abastecimentos(data24horasAtras, dataAgora)
  console.log(IntervaloConsulta)
}, IntervaloConsulta)

setInterval(async () => {
  await logDB({ obs: 'IntervaloConsultaVeiculos' })
  await consultaInsereVeiculos()
  console.log(IntervaloConsultaVeiculos)
}, IntervaloConsultaVeiculos)
