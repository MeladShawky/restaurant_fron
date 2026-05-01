import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    // Only redirect to login if NO token exists at all (truly not logged in)
    // Do NOT redirect on 401 from protected endpoints — let the component handle it
    if (status === 401 && !localStorage.getItem('token')) {
      window.location.href = '/login'
    }

    // For 403 Forbidden — show a toast but don't redirect
    if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    }

    return Promise.reject(error)
  }
)

export default api
