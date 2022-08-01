import { Request, Response } from 'express'
import { apiFrota } from './api/axios'
import { insertOrUpdate, queryBuilder } from './utils/knex'
import { formataData2 } from './utils/utils'

export async function insertCobrancas (req: Request, res: Response): Promise<Response> {
  try {
    const { data } = await apiFrota.post('/api/frotista/cobranca/pesquisa', {
      mesInicial: '2022-01',
      mesFinal: '2022-08'
    })
    // 0 . Em Aberto | 1 . Pago | 2 . Vencido
    if (data.registros.length === 100) console.log('atenção, consulta com mais de 100 registros')

    const dadosFormatados = data.registros.map((item:any) => ({
      identificador: item.identificador,
      valorTotal: item.valorTotal,
      statusPagamento: item.statusPagamento,
      dataVencimento: formataData2(item.dataVencimento),
      dataPagamento: formataData2(item.dataPagamento),
      dataPeriodoInicial: formataData2(item.periodo.dataInicial),
      dataPeriodoFinal: formataData2(item.periodo.dataFinal)
    }))

    const retornoInsert = await insertOrUpdate(queryBuilder, 'profrotas_cobrancas', dadosFormatados)
    return res.json(retornoInsert)
  } catch (err : any) {
    console.log(err)
    return res.json({ erro: err.message })
  }
}
