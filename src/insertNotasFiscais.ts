import { Request, Response } from 'express'
import { apiFrota } from './api/axios'

export async function insertNotasFiscais (req: Request, res: Response): Promise<Response> {
  try {
    const { data } = await apiFrota.post('/api/frotista/nota-fiscal/pesquisa', {})
    return res.json(data)
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    return res.json(error.response.data)
  }
}
