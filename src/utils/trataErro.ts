import { api, apiFrota } from '../api/axios'
import { autentica } from '../api/autentica'
import { sendTelegram } from './utils'
import { autenticaFrota } from '../api/autenticaFrota'

export const trataErro = async (descricao: string, error: any) => {
  if (error.response) {
    const { data } = error.response
    if (data) {
      if (data?.mensagens[0] === 'Token de autenticação JWT inválido.') {
        console.log('renovar token!')
        await autentica(api)
        await autenticaFrota(apiFrota)
        await sendTelegram(`${descricao} - gerado novo token`)
        return
      } else {
        console.log(descricao, data)
        await sendTelegram(`${descricao} - ${JSON.stringify(data)}`)
        return
      }
    }
  }

  console.log(`${descricao} - ${error.message}`)
  await sendTelegram(`${descricao} - ${error.message}`)
}
