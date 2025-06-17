"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, EditIcon, TrashIcon } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useGetIncidents } from "@/hooks/incidents/useGetIncidents"
import { useUpdateIncident } from "@/hooks/incidents/useUpdateIncident"
import { useDeleteIncident } from "@/hooks/incidents/useDeleteIncident"
import { useGetStatuses } from "@/hooks/statuses/useGetStatuses"
import { useAuthStore } from "@/context/auth-store"
import Incident from "@/core/models/Incident"
import { IncidentStatusBadge } from "@/components/ui/translations"
import { useRouter } from "next/navigation"
import { ExportDataButton } from "@/components/reports/ExportDataButton"

export default function IncidentsPage() {
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null)
  const [formData, setFormData] = useState({
    status_id: "",
    response: ""
  })
  const { toast } = useToast()
  const itemsPerPage = 5
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role?.name?.toLowerCase() === 'admin'
  const router = useRouter()

  // Hooks
  const { data: incidentsData, isLoading: isLoadingIncidents } = useGetIncidents()
  const { data: statusesData } = useGetStatuses()
  const updateIncident = useUpdateIncident()
  const deleteIncident = useDeleteIncident()

  useEffect(() => {
    if (incidentsData?.data) {
      setFilteredIncidents(incidentsData.data)
    }
  }, [incidentsData])

  useEffect(() => {
    if (searchTerm && incidentsData?.data) {
      const filtered = incidentsData.data.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${incident.user?.first_name} ${incident.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (incident.user?.cedula || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredIncidents(filtered)
      setCurrentPage(1)
    } else if (incidentsData?.data) {
      setFilteredIncidents(incidentsData.data)
    }
  }, [searchTerm, incidentsData])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenDialog = (incident: Incident) => {
    setCurrentIncident(incident)
    setFormData({
      status_id: incident.status_id.toString(),
      response: incident.response || ""
    })
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (incident: Incident) => {
    setCurrentIncident(incident)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentIncident) return

    if (!formData.response.trim()) {
      toast({
        title: "Error",
        description: "La respuesta es requerida.",
        variant: "destructive"
      })
      return
    }

    try {
      await updateIncident.mutateAsync({
        id: currentIncident.id,
        status_id: parseInt(formData.status_id),
        response: formData.response
      })
      toast({
        title: "Incidente actualizado",
        description: "El incidente ha sido actualizado correctamente.",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el incidente.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (currentIncident) {
      try {
        await deleteIncident.mutateAsync(currentIncident.id)
        toast({
          title: "Incidente eliminado",
          description: "El incidente ha sido eliminado correctamente.",
        })
        setIsDeleteDialogOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al eliminar el incidente.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incidencias</h1>
        <div className="flex gap-2">
          <ExportDataButton 
            data={incidentsData?.data} 
            fileName="incidencias"
            buttonText="Exportar Incidencias"
            isLoading={isLoadingIncidents}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestión de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar incidentes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoadingIncidents ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Reportado por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIncidents.length > 0 ? (
                      paginatedIncidents.map((incident) => (
                        <TableRow
                          key={incident.id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => router.push(`/dashboard/incidentes/${incident.id}`)}
                        >
                          <TableCell className="font-medium">{incident.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                          <TableCell>
                            <IncidentStatusBadge status={incident.status?.name || 'pending'} />
                          </TableCell>
                          <TableCell>{incident.user?.cedula || 'N/A'}</TableCell>
                          <TableCell>{incident.user?.first_name} {incident.user?.last_name}</TableCell>
                          <TableCell>{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(incident)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(incident)}>
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No se encontraron incidentes
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar incidente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Incidente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status_id}
                onValueChange={(value) => setFormData({ ...formData, status_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusesData?.data?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      <IncidentStatusBadge status={status.name} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="response">Respuesta <span className="text-red-500">*</span></Label>
              <Textarea
                id="response"
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                required
                placeholder="Ingrese la respuesta del incidente"
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateIncident.isPending || !formData.response.trim()}
              >
                Actualizar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro que desea eliminar el incidente "{currentIncident?.title}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteIncident.isPending}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
