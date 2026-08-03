import axios from 'axios'

// Configure global Axios instance using environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10s timeout
})

// Add standard interceptors for auth tokens or logging when backend is connected
api.interceptors.request.use(
  (config) => {
    // For future auth headers: config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error logger wrapper
    console.error('API request error:', error.message)
    return Promise.reject(error)
  }
)

export default api
