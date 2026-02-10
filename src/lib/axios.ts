import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    ClientType: 'web',
    Accept: 'application/json',
  },
})

export default api
