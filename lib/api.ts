import axios from "axios";
import { useAuthStore } from "@/context/auth-store";

const url = process.env.NEXT_PUBLIC_HOST

export const api = axios.create({
  baseURL: url
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const authStore = useAuthStore.getState();
      const isAuthenticated = authStore.isAuthenticated;
      const currentPath = window.location.pathname;
      
      if (isAuthenticated && !currentPath.includes('/login')) {
        const errorMessage = error.response?.data?.detail?.toLowerCase() || '';
        if (errorMessage.includes('token') || errorMessage.includes('invalid') || errorMessage.includes('expired')) {
          console.log("para aca llego");
          authStore.logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

