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

// Tipo para incidente
interface Incident {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  createdBy: string
  createdAt: string
}

// Datos de ejemplo
const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Error en el sistema de login",
    description: "Los usuarios no pueden iniciar sesión en la plataforma",
    status: "in_progress",
    priority: "high",
    createdBy: "Juan Pérez",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    title: "Página de contacto no funciona",
    description: "El formulario de contacto no envía los mensajes",
    status: "pending",
    priority: "medium",
    createdBy: "María López",
    createdAt: "2023-05-16",
  },
  {
    id: "3",
    title: "Problemas con el procesamiento de pagos",
    description: "Las transacciones fallan intermitentemente",
    status: "resolved",
    priority: "critical",
    createdBy: "Carlos Gómez",
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    title: "Error en la carga de imágenes",
    description: "Las imágenes no se cargan correctamente en la galería",
    status: "closed",
    priority: "low",
    createdBy: "Ana Martínez",
    createdAt: "2023-05-05",
  },
  {
    id: "5",
    title: "Problemas de rendimiento en la app móvil",
    description: "La aplicación se cierra inesperadamente",
    status: "in_progress",
    priority: "high",
    createdBy: "Roberto Sánchez",
    createdAt: "2023-05-18",
  },
  {
    id: "6",
    title: "Error en la generación de reportes",
    description: "Los reportes mensuales muestran datos incorrectos",
    status: "pending",
    priority: "medium",
    createdBy: "Laura Torres",
    createdAt: "2023-05-20",
  },
  {
    id: "7",
    title: "Problemas con la sincronización de datos",
    description: "Los datos no se sincronizan entre dispositivos",
    status: "in_progress",
    priority: "high",
    createdBy: "Pedro Ramírez",
    createdAt: "2023-05-19",
  },
  {
    id: "8",
    title: "Error en el módulo de facturación",
    description: "Las facturas se generan con información incorrecta",
    status: "pending",
    priority: "critical",
    createdBy: "Sofía Castro",
    createdAt: "2023-05-14",
  },
  {
    id: "9",
    title: "Problemas con el servidor de correo",
    description: "Los correos electrónicos no se envían correctamente",
    status: "resolved",
    priority: "high",
    createdBy: "Miguel Ángel",
    createdAt: "2023-05-12",
  },
  {
    id: "10",
    title: "Error en la API de integración",
    description: "La API devuelve errores 500 intermitentemente",
    status: "in_progress",
    priority: "critical",
    createdBy: "Lucía Fernández",
    createdAt: "2023-05-21",
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    status: "pending" as "pending" | "in_progress" | "resolved" | "closed",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    createdBy: "",
    createdAt: "",
  })
  const { toast } = useToast()
  const itemsPerPage = 5

  useEffect(() => {
    // Simulamos una carga de datos
    setTimeout(() => {
      setIncidents(mockIncidents)
      setFilteredIncidents(mockIncidents)
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = incidents.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredIncidents(filtered)
      setCurrentPage(1)
    } else {
      setFilteredIncidents(incidents)
    }
  }, [searchTerm, incidents])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenDialog = (incident?: Incident) => {
    if (incident) {
      setCurrentIncident(incident)
      setFormData({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        status: incident.status,
        priority: incident.priority,
        createdBy: incident.createdBy,
        createdAt: incident.createdAt,
      })
    } else {
      setCurrentIncident(null)
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        id: "",
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        createdBy: "Admin User", // Usuario actual
        createdAt: today,
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (incident: Incident) => {
    setCurrentIncident(incident)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentIncident) {
      // Editar incidente existente
      const updatedIncidents = incidents.map((incident) =>
        incident.id === currentIncident.id ? { ...formData } : incident,
      )
      setIncidents(updatedIncidents)
      setFilteredIncidents(updatedIncidents)
      toast({
        title: "Incidente actualizado",
        description: `El incidente "${formData.title}" ha sido actualizado correctamente.`,
      })
    } else {
      // Crear nuevo incidente
      const newIncident = {
        ...formData,
        id: (incidents.length + 1).toString(),
      }
      const updatedIncidents = [...incidents, newIncident]
      setIncidents(updatedIncidents)
      setFilteredIncidents(updatedIncidents)
      toast({
        title: "Incidente creado",
        description: `El incidente "${formData.title}" ha sido creado correctamente.`,
      })
    }

    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (currentIncident) {
      const updatedIncidents = incidents.filter((incident) => incident.id !== currentIncident.id)
      setIncidents(updatedIncidents)
      setFilteredIncidents(updatedIncidents)
      toast({
        title: "Incidente eliminado",
        description: `El incidente "${currentIncident.title}" ha sido eliminado correctamente.`,
      })
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En Progreso</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resuelto</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cerrado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Baja
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Media
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Alta
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Crítica
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocida</Badge>
    }
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

          {loading ? (
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
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Creado por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIncidents.length > 0 ? (
                      paginatedIncidents.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell className="font-medium">{incident.title}</TableCell>
                          <TableCell>{getStatusBadge(incident.status)}</TableCell>
                          <TableCell>{getPriorityBadge(incident.priority)}</TableCell>
                          <TableCell>{incident.createdBy}</TableCell>
                          <TableCell>{incident.createdAt}</TableCell>
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
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para crear/editar incidente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentIncident ? "Editar Incidente" : "Crear Incidente"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "pending" | "in_progress" | "resolved" | "closed") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="closed">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{currentIncident ? "Guardar cambios" : "Crear incidente"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              ¿Estás seguro de que deseas eliminar el incidente <strong>{currentIncident?.title}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
