import { Request, Response } from 'express'
import { apiFrota } from './api/axios'
import { insertOrUpdate, queryBuilder } from './utils/knex'

const TiposCombustivel : Record<number, string> = {
  1: 'Diesel S-500',
  2: 'Diesel S-10',
  3: 'Gasolina',
  4: 'Etanol',
  5: 'Flex'
}

export async function insertVeiculos (req: Request, res: Response): Promise<Response> {
  try {
    const { data } = await apiFrota.post('/api/frotista/veiculo/pesquisa', {})

    const dadosFormatados = data.registros.map((item:any) => ({
      identificador: item.identificador,
      placa: item.placa,
      chassi: item.chassi,
      status: item.status,
      numeroDeEixos: item.numeroDeEixos,
      hodometro: item.hodometro,
      marca: item.marca,
      modelo: item.modelo,
      anoModelo: item.anoModelo,
      anoFabricacao: item.anoFabricacao,
      tipoCombustivel: TiposCombustivel[item.tipoCombustivel],
      classificacao: item.classificacao,
      capacidadeTanque: item.capacidadeTanque,
      tipoVeiculo: item.tipo.valor,
      subtipoVeiculo: item.subtipo.valor
    }))
    const retornoInsert = await insertOrUpdate(queryBuilder, 'profrotas_veiculos', dadosFormatados)

    return res.json(retornoInsert)
  } catch (error: any) {
    console.log(error.code)
    console.log(error.message)
    console.log(error.response.data)
    return res.json(error.response.data)
  }
}
