import axios from 'axios'
import moment from 'moment'
import { logDB } from './knex'

export async function delay(tempo_ms: number) {
  await new Promise((resolve) => setTimeout(resolve, tempo_ms))
}

export async function sendTelegram(text: string) {
  try {
    const botToken = 'bot1221548327:AAHe6kWjxuly7W_uARM6giFIXsIxyk6CXI4'
    const body = {
      chat_id: '-953192987', // Alertas Profrotas
      text,
      parse_mode: 'html'
    }
    await axios.post(`https://api.telegram.org/${botToken}/sendMessage`, body)
  } catch (error: any) {
    await logDB({ obs: `catch telegram, ${error.message}` })
    console.log('erro telegram!', error)
    console.log('texto telegram:', text)
  }
}

function formataData(date: string) {
  const dateString = new Date(`${date.split(' ')[0].split('/').reverse().join('/')} ${date.split(' ')[1]}`)
  return moment(dateString).add(-3, 'hours').toDate()
}

export const formataData2 = (data: string) => moment(data).format('YYYY-MM-DD HH:mm:ss')

export { formataData }
