import knex from 'knex'
import 'dotenv/config'

export const queryBuilder = knex({
  client: 'mysql',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 4, idleTimeoutMillis: 60 * 1000 }
})

export async function insertOrUpdate(knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex.raw(
    knex(tableName).insert(data).toQuery() +
      ' ON DUPLICATE KEY UPDATE ' +
      Object.getOwnPropertyNames(firstData)
        .map((field) => `${field}=VALUES(${field})`)
        .join(', ')
  )
}

export async function insertOrUpdatetoQuery(knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex
    .raw(
      knex(tableName).insert(data).toQuery() +
        ' ON DUPLICATE KEY UPDATE ' +
        Object.getOwnPropertyNames(firstData)
          .map((field) => `${field}=VALUES(${field})`)
          .join(', ')
    )
    .toQuery()
}

interface iLogDB {
  obs: string
  qtdRetornada?: number
  qtdInserida?: number
}

export async function logDB(dadosLog: iLogDB) {
  return await queryBuilder('profrotas_log').insert(dadosLog)
}
