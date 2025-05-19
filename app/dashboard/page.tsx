"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon, FileIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"
import { useGetIncidents } from "@/hooks/incidents/useGetIncidents"
import { useGetUsers } from "@/hooks/users/useGetUsers"
import { useGetStatuses } from "@/hooks/statuses/useGetStatuses"
import { Skeleton } from "@/components/ui/skeleton"
import Incident from "@/core/models/Incident"
import Status from "@/core/models/Status"

export default function DashboardPage() {
  const { data: incidents, isLoading: isLoadingIncidents } = useGetIncidents()
  const { data: users, isLoading: isLoadingUsers } = useGetUsers()
  const { data: statuses, isLoading: isLoadingStatuses } = useGetStatuses()

  const getStatusCount = (statusId: number) => {
    return incidents?.data?.filter((incident: Incident) => incident.status_id === statusId).length || 0
  }

  const getTotalAttachments = () => {
    return incidents?.data?.reduce((total: number, incident: Incident) => total + (incident.attachment?.length || 0), 0) || 0
  }

  const getRecentActivity = () => {
    if (!incidents?.data) return []
    return incidents.data
      .sort((a: Incident, b: Incident) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
  }

  if (isLoadingIncidents || isLoadingUsers || isLoadingStatuses) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[50px]" />
                <Skeleton className="h-4 w-[120px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total de usuarios registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Incidentes</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total de incidentes reportados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Archivos</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalAttachments()}</div>
            <p className="text-xs text-muted-foreground">Total de archivos adjuntos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentActivity().map((incident: Incident) => (
                <div key={incident.id} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{incident.user?.first_name} {incident.user?.last_name} ha reportado un nuevo incidente</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(incident.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Incidentes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statuses?.data?.map((status: Status) => {
                const count = getStatusCount(status.id)
                const percentage = incidents?.data?.length ? (count / incidents.data.length) * 100 : 0
                return (
                  <div key={status.id}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{status.name}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status.id === 1 ? 'bg-yellow-500' :
                          status.id === 2 ? 'bg-blue-500' :
                          'bg-green-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
