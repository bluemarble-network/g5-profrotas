import { api, apiFrota } from '../api/axios'
import { autentica } from '../api/autentica'
import { sendTelegram } from './utils'
import { autenticaFrota } from '../api/autenticaFrota'
import { logDB } from './knex'

export const trataErro = async (descricao: string, error: any) => {
  if (error.response) {
    const { data } = error.response
    if (data) {
      if (data?.mensagens[0] === 'Token de autenticação JWT inválido.' || data?.mensagens[0] === 'Acesso Negado. Verifique sua chave de acesso e tente novamente.') {
        await logDB({ obs: `renovar token! - ${data?.mensagens[0]}` })
        await autentica(api)
        await autenticaFrota(apiFrota)
        await sendTelegram(`${descricao} - gerado novo token`)
        return
      } else {
        console.log(descricao, data)
        await logDB({ obs: `${descricao} - ${JSON.stringify(data)}` })
        await sendTelegram(`${descricao} - ${JSON.stringify(data)}`)
        return
      }
    }
  }

  console.log(`${descricao} - ${error.message}`)
  await logDB({ obs: `${descricao} - ${error.message}` })
  await sendTelegram(`${descricao} - ${error.message}`)
}
