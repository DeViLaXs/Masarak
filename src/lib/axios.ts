import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    ClientType: 'web',
    Accept: 'application/json',
    Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },

})

// Response interceptor to handle backend error structure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data

    // Extract error messages from backend format
    if (data?.errors) {
      let messages: string = ''
      if (Array.isArray(data.errors)) {
        messages = data.errors.join('\n')
      } else if (typeof data.errors === 'object' && data.errors !== null) {
        const errList: string[] = []
        for (const key of Object.keys(data.errors)) {
          const val = data.errors[key]
          if (Array.isArray(val)) {
            errList.push(...val.map(String))
          } else if (typeof val === 'string') {
            errList.push(val)
          } else if (val) {
            errList.push(JSON.stringify(val))
          }
        }
        messages = errList.join('\n')
      } else {
        messages = String(data.errors)
      }

      return Promise.reject({
        message: messages,
        status: error.response?.status,
      })
    }

    if (data?.message) {
      return Promise.reject({
        message: String(data.message),
        status: error.response?.status,
      })
    }

    return Promise.reject(error)
  },
)

export default api
