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
      const authStore = useAuthStore.getState();
      const isAuthenticated = authStore.isAuthenticated;
      const currentPath = window.location.pathname;
      
      // Solo redirigir si:
      // 1. El usuario está autenticado (tiene token)
      // 2. No estamos en la página de login
      // 3. El error es específicamente de token inválido o expirado
      if (isAuthenticated && !currentPath.includes('/login')) {
        const errorMessage = error.response?.data?.detail?.toLowerCase() || '';
        if (errorMessage.includes('token') || errorMessage.includes('invalid') || errorMessage.includes('expired')) {
          authStore.logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

