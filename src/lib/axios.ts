import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // use .env var for base url
    withCredentials:true, // imp for cookies thst handled by BE
});

api.interceptors.request.use((config) => {
    return config;
},
(error) => {
    return Promise.reject(error);
}
);
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)

export default api;
