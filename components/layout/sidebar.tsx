"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboardIcon, UsersIcon, AlertCircleIcon, FileIcon, MenuIcon, XIcon } from "lucide-react"
import { useAuthStore } from "@/context/auth-store"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "analyst"]
  },
  {
    title: "Usuarios",
    href: "/dashboard/usuarios",
    icon: UsersIcon,
    roles: ["admin"]
  },
  {
    title: "Incidentes",
    href: "/dashboard/incidentes",
    icon: AlertCircleIcon,
    roles: ["admin", "analyst"]
  },
  {
    title: "Archivos",
    href: "/dashboard/archivos",
    icon: FileIcon,
    roles: ["admin", "analyst"]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const userRole = user?.role?.name?.toLowerCase() || ""

  const filteredItems = sidebarItems.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon /> : <MenuIcon />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{user?.username || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
