import axios from "axios";
import { useAuthStore } from "@/context/auth-store";

const url = "http://localhost:3004"

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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Solo cerrar sesión si estamos en el cliente y no estamos en la página de login
      if (!window.location.pathname.includes('/login')) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

