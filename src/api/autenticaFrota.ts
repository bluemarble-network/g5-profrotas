import { AxiosInstance } from 'axios'
import { api } from './axios'
import { sendTelegram } from '../utils/utils'

export async function autenticaFrota (apiFrota: AxiosInstance) {
  // const login = process.env.USUARIO_PROFROTAS
  // const password = process.env.SENHA_TOSP

  try {
    apiFrota.defaults.headers.common.Authorization = ''
    const { data } = await api.post('/api/apiToken/frota/2359')
    if (!data.token) {
      sendTelegram('Erro autenticaFrota, sem token!')
    }
    console.log('Bearer ' + data.token)
    apiFrota.defaults.headers.common.Authorization = 'Bearer ' + data.token
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
export async function setTokenFixo (api: AxiosInstance) {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3VhcmlvLmZyb3RhIjoyMzU5LCJ0b2tlbi50aXBvIjoiQVBJX0ZST1RJU1RBIiwidG9rZW4udmVyc2FvIjoiUC0wMDAyIiwiaXNzIjoiQm9sZWlhIiwidG9rZW4uZGF0YUdlcmFjYW8iOjE2NTk1NDYwNTIsInVzdWFyaW8ucGVybWlzc29lcyI6WyJBUElfRlJPVElTVEEiXSwiZXhwIjoxNjYyMTM4MDUyLCJ1c3VhcmlvLmlkIjotOTA4NDIzNjk4OTYwNTk1NjY4MSwidXN1YXJpby5ub21lIjoiRzUgU29sdWNvZXMgTG9naXN0aWNhcyIsInVzdWFyaW8udGlwbyI6IkZST1RBIiwidG9rZW4uY29udGFkb3JSZW5vdmFjb2VzIjowfQ.v6CJhgXcrst18fo1Me0ZBkTOspFdrKKe6GRqDe0cg7U'
  api.defaults.headers.common.Authorization = 'Bearer ' + token
}
