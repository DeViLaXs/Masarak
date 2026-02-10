import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    ClientType: 'bej',
    Accept: 'application/json',
  },
})

export default api
