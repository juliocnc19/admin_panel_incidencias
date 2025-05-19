"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useGetIncidents } from "@/hooks/incidents/useGetIncidents"
import { useCreateIncident } from "@/hooks/incidents/useCreateIncident"
import { useUpdateIncident } from "@/hooks/incidents/useUpdateIncident"
import { useDeleteIncident } from "@/hooks/incidents/useDeleteIncident"
import { useGetStatuses } from "@/hooks/statuses/useGetStatuses"
import Incident from "@/core/models/Incident"
import { IncidentStatusBadge } from "@/components/ui/translations"

export default function IncidentsPage() {
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    status_id: "",
    response: "",
    user_id: ""
  })
  const { toast } = useToast()
  const itemsPerPage = 5

  // Hooks
  const { data: incidentsData, isLoading: isLoadingIncidents } = useGetIncidents()
  const { data: statusesData } = useGetStatuses()
  const createIncident = useCreateIncident()
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
          `${incident.user?.first_name} ${incident.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleOpenDialog = (incident?: Incident) => {
    if (incident) {
      setCurrentIncident(incident)
      setFormData({
        id: incident.id.toString(),
        title: incident.title,
        description: incident.description,
        status_id: incident.status_id.toString(),
        response: incident.response || "",
        user_id: incident.user_id.toString()
      })
    } else {
      setCurrentIncident(null)
      setFormData({
        id: "",
        title: "",
        description: "",
        status_id: "",
        response: "",
        user_id: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (incident: Incident) => {
    setCurrentIncident(incident)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentIncident) {
        // Editar incidente existente
        await updateIncident.mutateAsync({
          ...formData,
          id: currentIncident.id
        })
        toast({
          title: "Incidente actualizado",
          description: `El incidente "${formData.title}" ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo incidente
        await createIncident.mutateAsync(formData)
        toast({
          title: "Incidente creado",
          description: `El incidente "${formData.title}" ha sido creado correctamente.`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar la solicitud.",
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
          description: `El incidente "${currentIncident.title}" ha sido eliminado correctamente.`,
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

  const getStatusBadge = (statusId: number) => {
    const status = statusesData?.data?.find(s => s.id === statusId)
    if (!status) return null

    const variants = {
      1: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      2: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      3: "bg-green-100 text-green-800 hover:bg-green-100",
      4: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }

    return (
      <Badge
        variant="secondary"
        className={variants[statusId as keyof typeof variants]}
      >
        {status.name}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incidentes</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Incidente
        </Button>
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
                      <TableHead>Reportado por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIncidents.length > 0 ? (
                      paginatedIncidents.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell className="font-medium">{incident.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                          <TableCell>
                            <IncidentStatusBadge status={incident.status?.name || 'pending'} />
                          </TableCell>
                          <TableCell>{incident.user?.first_name} {incident.user?.last_name}</TableCell>
                          <TableCell>{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(incident)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(incident)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
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

      {/* Dialog para crear/editar incidente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentIncident ? "Editar Incidente" : "Nuevo Incidente"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
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
            {currentIncident && (
              <div className="space-y-2">
                <Label htmlFor="response">Respuesta</Label>
                <Textarea
                  id="response"
                  value={formData.response}
                  onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={createIncident.isPending || updateIncident.isPending}>
                {currentIncident ? "Actualizar" : "Crear"}
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
