"use client"
import React from "react"
import { Badge } from "@/components/ui/badge"

export const incidentStatusConfig = {
  draft: {
    label: "Borrador",
    color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  },
  in_progress: {
    label: "En Progreso",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  resolved: {
    label: "Resuelto",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  rejected: {
    label: "Rechazado",
    color: "bg-red-500/10 text-red-700 border-red-500/20",
  }
} as const

// Traducciones y estilos para roles de usuario
export const userRoleConfig = {
  admin: {
    label: "Administrador",
    color: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  },
  student: {
    label: "Estudiante",
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  analyst: {
    label: "Analista",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  teacher: {
    label: "Profesor",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  }
} as const

type IncidentStatus = keyof typeof incidentStatusConfig
type UserRole = keyof typeof userRoleConfig

interface BadgeProps {
  status?: string
  role?: string
}


// Componente para mostrar el estado de un incidente
export const IncidentStatusBadge = ({ status = 'pending' }: BadgeProps) => {
  const config = incidentStatusConfig[status as IncidentStatus]
  if (!config) return <Badge variant="outline">{status}</Badge>
  
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  )
}

// Componente para mostrar el rol de un usuario
export const UserRoleBadge = ({ role = 'user' }: BadgeProps) => {
  const config = userRoleConfig[role as UserRole]
  if (!config) return <Badge variant="outline">{role}</Badge>
  
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  )
}

// Función para obtener la traducción de un estado
export function getIncidentStatusLabel(status: string): string {
  return incidentStatusConfig[status as IncidentStatus]?.label || status
}

// Función para obtener la traducción de un rol
export function getUserRoleLabel(role: string): string {
  return userRoleConfig[role as UserRole]?.label || role
}

// Función para obtener el color de un estado
export function getIncidentStatusColor(status: string): string {
  return incidentStatusConfig[status as IncidentStatus]?.color || ""
}

// Función para obtener el color de un rol
export function getUserRoleColor(role: string): string {
  return userRoleConfig[role as UserRole]?.color || ""
} 