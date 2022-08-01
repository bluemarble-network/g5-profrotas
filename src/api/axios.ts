import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api-portal.profrotas.com.br'
})

export const apiFrota = axios.create({
  baseURL: 'https://api-portal.profrotas.com.br'
})
