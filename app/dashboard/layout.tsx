"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/context/auth-store"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, token } = useAuthStore((state) => state)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || !token) {
        console.log("No autenticado - Redirigiendo a login")
        router.replace("/login")
      }
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, token, router])

  if (isLoading || !isAuthenticated || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
