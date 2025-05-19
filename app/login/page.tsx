"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/context/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLoginUser } from "@/hooks/auth/useLoginUser"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const { toast } = useToast()
  const loginMutation = useLoginUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          if (response.data && response.token) {
            login(response.data, response.token)
            router.push("/dashboard")
          } else {
            toast({
              title: "Error de autenticación",
              description: "No se recibió el token de autenticación",
              variant: "destructive",
              duration: 5000,
            })
          }
        },
        onError: (error: any) => {
          console.error("Error de login:", error)
          const errorMessage = error.response?.data?.detail || error.message || "Credenciales incorrectas"
          toast({
            title: "Error de autenticación",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          })
        }
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Panel Administrativo</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
