import { AxiosInstance } from 'axios'
import { sendTelegram } from '../utils/utils'

export async function autentica (api: AxiosInstance) {
  // const login = process.env.USUARIO_PROFROTAS
  // const password = process.env.SENHA_TOSP

  const body = new URLSearchParams({
    username: process.env.USUARIO_PROFROTAS as string,
    password: process.env.SENHA_PROFROTAS as string
  })

  try {
    api.defaults.headers.common.Authorization = ''
    const { data } = await api.post('/api/publico/login',
      body
      , { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
    if (!data.tokenJWT) {
      sendTelegram('Erro ao autenticar, sem tokenJWT!')
    }
    console.log('Bearer ' + data.tokenJWT)
    api.defaults.headers.common.Authorization = 'Bearer ' + data.tokenJWT
  } catch (error: any) {
    console.log('Catch ao autenticar api_ws:' + error.message)
    console.log('error.response.data:', error.response.data)
    sendTelegram('Catch ao autenticar api_ws:' + error.message)
    return {}
  }
}

export async function setAutenticacaoErrada (api: AxiosInstance) {
  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrZW5qaUB0aGVibHVlbWFyYmxlbmV0d29yay5jb20uYnIiLCJST0xFUyI6WyJPUEVSQURPUiJdLCJDTElFTlRFSUQiOjEzNSwiSlNFU1NJT05JRCI6Im1fbVZFVlNsSWlSY1k2bzJkZVZpQUU0a3VVTWdjanNlWHYxQVdPX1gudG9zIiwiVE9TQVVUSElEIjoid1BTSzk4NmdjWnAwN3I1SDVSTXlyQTJGWVJidVJlK2oveTRYNmNyNStVZWE5Q1RzazlRaTFwMm1xK3l0dFlOc0tGSFJSMWc2eWRtd2dOV2JIamVSdlE9PSIsImV4cCI6MTY1NTg4ODY1MH0.J0_BvvCjo4Xd0hbFqx147RaNQOFRDdAPqPGKsFdXOh2D2EJb2yI2QwmFE7sjx4_5w9cfLxkFRKAsvEZCZAx6kw'
  api.defaults.headers.common.Authorization = 'Bearer ' + token
}
