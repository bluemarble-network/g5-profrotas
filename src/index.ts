import express from 'express'
import cors from 'cors'
import ip from 'ip'
import { routes } from './routes'
import { api, apiFrota } from './api/axios'
import 'dotenv/config'
import { autenticaFrota, setTokenFixo } from './api/autenticaFrota'
import { autentica } from './api/autentica'
export const EsperaEntreConsultas = 1000 * 60 * 1 // 1 min
// export const EsperaEntreConsultas = 1000 * 2 // 10 seg para testar em DEV
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port, async function () {
  const msg = `Start G5 Profrotas http://${ip.address()}:${port}`
  console.log(msg)
  console.log('teste_asdf')
  // sendTelegram(msg)
  // await logDB({ imo: '-', datas: msg, aplicacao: 'Profrotas' })
  // await autentica(api)
  // await autenticaFrota(apiFrota)
  await setTokenFixo(apiFrota)
  // const retorno = await apiFrota.post('/api/frotista/motorista/pesquisa', {
  //   cpf: 43223281487
  // })
  //   paginacao: { pagina: 1, tamanhoPagina: 25, parametrosOrdenacaoColuna: [{ nome: 'nome', decrescente: false }] },
  //   vencimentoCNH: { name: null, label: 'Todos' },
  //   unidade: { id: null, nome: 'Todas' },
  //   grupo: { id: null, grupoOperacionalFormatado: 'Todos' },
  //   status: { name: 'ATIVO' },
  //   empresaAgregada: { id: null, razaoSocial: 'Todas' },
  //   classificacao: { name: null, label: 'Todos' }
  // })
  // console.log(retorno.data)

  // await getCookie(api)
  // await pesagens1HoraAtras()
  // await delay(EsperaEntreConsultas)
  // await verificaDiferenca()

  // await pesagensTotaisPorImo() // Só para testes, deixar só este DEV
})
