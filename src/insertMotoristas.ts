import { Request, Response } from 'express'
import { apiFrota } from './api/axios'
import { insertOrUpdate, queryBuilder } from './utils/knex'

export async function insertMotoristas (req: Request, res: Response): Promise<Response> {
  try {
    const { data } = await apiFrota.post('/api/frotista/motorista/pesquisa', {})

    const dadosFormatados = data.registros.map((item:any) => ({
      identificador: item.identificador,
      cpf: item.cpf,
      nome: item.nome,
      matricula: item.matricula,
      dataNascimento: item.dataNascimento,
      email: item.email,
      celular: `${item.celular.ddd}${item.celular.numeroCelular}`,
      cnh: item.cnh.numero,
      cnhVencimento: item.cnh.dataVencimento,
      classificacao: item.classificacao.valor
    }))
    const retornoInsert = await insertOrUpdate(queryBuilder, 'profrotas_motoristas', dadosFormatados)
    return res.json(retornoInsert)
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    return res.json(error.response.data)
  }
}
