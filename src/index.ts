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
export const EsperaEntreConsultas = 1000 * 4 // 4 seg
export const IntervaloConsulta = 1000 * 60 * 12 // 12 horas
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
  const data24horasAtras = moment().subtract(24, 'hours').toDate()
  const dataAgora = moment().toDate()
  await abastecimentos(data24horasAtras, dataAgora)
})

setInterval(async () => {
  await logDB({ obs: 'IntervaloConsulta' })
  const data24horasAtras = moment().subtract(24, 'hours').toDate()
  const dataAgora = moment().toDate()
  await abastecimentos(data24horasAtras, dataAgora)
  console.log(IntervaloConsulta)
}, IntervaloConsulta)
