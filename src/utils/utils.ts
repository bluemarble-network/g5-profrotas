import axios from 'axios'
import moment from 'moment'

export async function delay (tempo_ms: number) {
  await new Promise((resolve) => setTimeout(resolve, tempo_ms))
}

export async function sendTelegram (text: string) {
  try {
    const botToken = 'bot1221548327:AAHe6kWjxuly7W_uARM6giFIXsIxyk6CXI4'
    const body = {
      chat_id: '-575400278', // Alertas COPI
      text,
      parse_mode: 'html'
    }
    await axios.post(`https://api.telegram.org/${botToken}/sendMessage`, body)
  } catch (error) {
    console.log('erro telegram!', error)
    console.log('texto telegram:', text)
  }
}

function formataData (date: string) {
  const dateString = new Date(
    `${date.split(' ')[0].split('/').reverse().join('/')} ${date.split(' ')[1]}`
  )
  return moment(dateString).add(-3, 'hours').toDate()
}
export function formataDataFromEMAP_API (date: string) {
  return moment(date, 'DD-MM-YYYY HH:mm:ss').add(-3, 'hours').toDate()
}
export function formataDataFromEMAP_API_WS (date: string) {
  return moment(date, 'YYYY-MM-DD HH:mm:ss').add(-3, 'hours').toDate()
}

export const formataData2 = (data : string) => moment(data).format('YYYY-MM-DD HH:mm:ss')

export { formataData }
