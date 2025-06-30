import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReactQueryProvider } from "@/components/providers"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panel Administrativo",
  description: "Panel administrativo moderno",
  icons: {
    icon: '/logo_ais.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ToastProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}
