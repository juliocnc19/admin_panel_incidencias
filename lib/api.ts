import axios from "axios";
import { useAuthStore } from "@/context/auth-store";

const url = "http://192.168.1.31:3004"

export const api = axios.create({
  baseURL: url
})

// Interceptor para inyectar el token en cada request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expiró o es inválido, cerrar sesión
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

