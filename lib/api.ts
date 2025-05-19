import axios from "axios";

const url = "http://192.168.1.31:3004"

export const api = axios.create({
  baseURL: url
})

// Interceptor para inyectar el token en cada request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

