import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    ClientType: 'web',
    Accept: 'application/json',
  },
})

// Response interceptor to handle backend error structure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data

    // Extract error messages from backend format
    if (data?.errors) {
      const messages = Array.isArray(data.errors)
        ? data.errors.join('\n')
        : data.errors

      return Promise.reject({ message: messages })
    }

    return Promise.reject(error)
  },
)

export default api
