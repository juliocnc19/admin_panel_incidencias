"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon, DownloadIcon, TrashIcon, FileIcon, ImageIcon, FileTextIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useGetIncidents } from "@/hooks/incidents/useGetIncidents"
import { useUploadIncident } from "@/hooks/incidents/useUploadIncident"
import { useDownloadIncident } from "@/hooks/incidents/useDownloadIncident"
import { useDeleteIncident } from "@/hooks/incidents/useDeleteIncident"
import Attachment from "@/core/models/Attachment"
import Incident from "@/core/models/Incident"

// Extend the Attachment interface with additional properties
interface ExtendedAttachment extends Attachment {
  name: string
  type: string
  size: string
}

export default function AttachmentsPage() {
  const [filteredAttachments, setFilteredAttachments] = useState<ExtendedAttachment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAttachment, setCurrentAttachment] = useState<ExtendedAttachment | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<string>("")
  const { toast } = useToast()
  const itemsPerPage = 5

  // Hooks
  const { data: incidentsData, isLoading: isLoadingIncidents } = useGetIncidents()
  const uploadAttachment = useUploadIncident()
  const downloadAttachment = useDownloadIncident()
  const deleteAttachment = useDeleteIncident()

  useEffect(() => {
    if (incidentsData?.data) {
      const allAttachments = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment.map(att => ({
          ...att,
          name: att.attachment_path.split('/').pop() || '',
          type: att.attachment_path.split('.').pop() || '',
          size: '0 KB' // TODO: Get actual file size
        }))
      })
      setFilteredAttachments(allAttachments)
    }
  }, [incidentsData])

  useEffect(() => {
    if (searchTerm && incidentsData?.data) {
      const allAttachments = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment.map(att => ({
          ...att,
          name: att.attachment_path.split('/').pop() || '',
          type: att.attachment_path.split('.').pop() || '',
          size: '0 KB' // TODO: Get actual file size
        }))
      })
      const filtered = allAttachments.filter(
        (attachment) =>
          attachment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attachment.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAttachments(filtered)
      setCurrentPage(1)
    } else if (incidentsData?.data) {
      const allAttachments = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment.map(att => ({
          ...att,
          name: att.attachment_path.split('/').pop() || '',
          type: att.attachment_path.split('.').pop() || '',
          size: '0 KB' // TODO: Get actual file size
        }))
      })
      setFilteredAttachments(allAttachments)
    }
  }, [searchTerm, incidentsData])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredAttachments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAttachments = filteredAttachments.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenDialog = () => {
    setSelectedFile(null)
    setSelectedIncident("")
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (attachment: ExtendedAttachment) => {
    setCurrentAttachment(attachment)
    setIsDeleteDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !selectedIncident) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo y un incidente.",
        variant: "destructive"
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('incident_id', selectedIncident)

      await uploadAttachment.mutateAsync(formData)
      toast({
        title: "Archivo subido",
        description: `El archivo "${selectedFile.name}" ha sido subido correctamente.`,
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al subir el archivo.",
        variant: "destructive"
      })
    }
  }

  const handleDownload = async (attachment: ExtendedAttachment) => {
    try {
      await downloadAttachment.mutateAsync(attachment.id.toString())
      toast({
        title: "Descarga iniciada",
        description: `El archivo "${attachment.name}" se está descargando.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al descargar el archivo.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (currentAttachment) {
      try {
        await deleteAttachment.mutateAsync(currentAttachment.id.toString())
        toast({
          title: "Archivo eliminado",
          description: `El archivo "${currentAttachment.name}" ha sido eliminado correctamente.`,
        })
        setIsDeleteDialogOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al eliminar el archivo.",
          variant: "destructive"
        })
      }
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (type.includes('pdf') || type.includes('document')) {
      return <FileTextIcon className="h-4 w-4 text-green-500" />
    } else {
      return <FileIcon className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Archivos</h1>
        <Button onClick={handleOpenDialog}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestión de Archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar archivos..."
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Incidente</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAttachments.length > 0 ? (
                      paginatedAttachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getFileIcon(attachment.type)}
                              {attachment.name}
                            </div>
                          </TableCell>
                          <TableCell>{attachment.type}</TableCell>
                          <TableCell>{attachment.size}</TableCell>
                          <TableCell>
                            {incidentsData?.data?.find(incident => 
                              incident.attachment?.some(att => att.id === attachment.id)
                            )?.title || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleDownload(attachment)}>
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(attachment)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No se encontraron archivos
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

      {/* Dialog para subir archivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Archivo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Archivo</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident">Incidente</Label>
              <Select
                value={selectedIncident}
                onValueChange={setSelectedIncident}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un incidente" />
                </SelectTrigger>
                <SelectContent>
                  {incidentsData?.data?.map((incident) => (
                    <SelectItem key={incident.id} value={incident.id.toString()}>
                      {incident.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploadAttachment.isPending}>
                Subir
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
          <p>¿Está seguro que desea eliminar el archivo "{currentAttachment?.name}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteAttachment.isPending}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
