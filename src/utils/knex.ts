import knex from 'knex'
import 'dotenv/config'

export const queryBuilder = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
})

export async function insertOrUpdate (knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex.raw(
    knex(tableName).insert(data).toQuery() +
      ' ON DUPLICATE KEY UPDATE ' +
      Object.getOwnPropertyNames(firstData)
        .map((field) => `${field}=VALUES(${field})`)
        .join(', ')
  )
}

export async function insertOrUpdatetoQuery (knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex.raw(
    knex(tableName).insert(data).toQuery() +
      ' ON DUPLICATE KEY UPDATE ' +
      Object.getOwnPropertyNames(firstData)
        .map((field) => `${field}=VALUES(${field})`)
        .join(', ')
  ).toQuery()
}

interface iLogDB {
  obs: string
  qtdRetornada?: number
  qtdInserida?: number
}

export async function logDB (dadosLog: iLogDB) {
  return await queryBuilder('profrotas_log').insert(dadosLog)
}
