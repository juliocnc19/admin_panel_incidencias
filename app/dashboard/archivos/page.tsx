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

// Tipo para archivo
interface Attachment {
  id: string
  name: string
  type: "image" | "document" | "other"
  size: string
  uploadedBy: string
  uploadedAt: string
  relatedTo: string
}

// Datos de ejemplo
const mockAttachments: Attachment[] = [
  {
    id: "1",
    name: "screenshot.png",
    type: "image",
    size: "1.2 MB",
    uploadedBy: "Juan Pérez",
    uploadedAt: "2023-05-15",
    relatedTo: "Incidente #1",
  },
  {
    id: "2",
    name: "informe.pdf",
    type: "document",
    size: "3.5 MB",
    uploadedBy: "María López",
    uploadedAt: "2023-05-16",
    relatedTo: "Incidente #2",
  },
  {
    id: "3",
    name: "datos.xlsx",
    type: "document",
    size: "2.1 MB",
    uploadedBy: "Carlos Gómez",
    uploadedAt: "2023-05-10",
    relatedTo: "Incidente #3",
  },
  {
    id: "4",
    name: "error-log.txt",
    type: "document",
    size: "0.5 MB",
    uploadedBy: "Ana Martínez",
    uploadedAt: "2023-05-05",
    relatedTo: "Incidente #4",
  },
  {
    id: "5",
    name: "app-screenshot.jpg",
    type: "image",
    size: "2.8 MB",
    uploadedBy: "Roberto Sánchez",
    uploadedAt: "2023-05-18",
    relatedTo: "Incidente #5",
  },
  {
    id: "6",
    name: "reporte-mensual.pdf",
    type: "document",
    size: "4.2 MB",
    uploadedBy: "Laura Torres",
    uploadedAt: "2023-05-20",
    relatedTo: "Incidente #6",
  },
  {
    id: "7",
    name: "config.json",
    type: "other",
    size: "0.2 MB",
    uploadedBy: "Pedro Ramírez",
    uploadedAt: "2023-05-19",
    relatedTo: "Incidente #7",
  },
  {
    id: "8",
    name: "factura.pdf",
    type: "document",
    size: "1.5 MB",
    uploadedBy: "Sofía Castro",
    uploadedAt: "2023-05-14",
    relatedTo: "Incidente #8",
  },
]

export default function AttachmentsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [filteredAttachments, setFilteredAttachments] = useState<Attachment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAttachment, setCurrentAttachment] = useState<Attachment | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "document" as "image" | "document" | "other",
    size: "",
    uploadedBy: "",
    uploadedAt: "",
    relatedTo: "",
  })
  const { toast } = useToast()
  const itemsPerPage = 5

  useEffect(() => {
    // Simulamos una carga de datos
    setTimeout(() => {
      setAttachments(mockAttachments)
      setFilteredAttachments(mockAttachments)
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = attachments.filter(
        (attachment) =>
          attachment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attachment.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attachment.relatedTo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAttachments(filtered)
      setCurrentPage(1)
    } else {
      setFilteredAttachments(attachments)
    }
  }, [searchTerm, attachments])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredAttachments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAttachments = filteredAttachments.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenDialog = () => {
    const today = new Date().toISOString().split("T")[0]
    setFormData({
      id: "",
      name: "",
      type: "document",
      size: "0 MB",
      uploadedBy: "Admin User", // Usuario actual
      uploadedAt: today,
      relatedTo: "",
    })
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (attachment: Attachment) => {
    setCurrentAttachment(attachment)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simular subida de archivo
    const newAttachment = {
      ...formData,
      id: (attachments.length + 1).toString(),
    }
    const updatedAttachments = [...attachments, newAttachment]
    setAttachments(updatedAttachments)
    setFilteredAttachments(updatedAttachments)
    toast({
      title: "Archivo subido",
      description: `El archivo "${formData.name}" ha sido subido correctamente.`,
    })

    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (currentAttachment) {
      const updatedAttachments = attachments.filter((attachment) => attachment.id !== currentAttachment.id)
      setAttachments(updatedAttachments)
      setFilteredAttachments(updatedAttachments)
      toast({
        title: "Archivo eliminado",
        description: `El archivo "${currentAttachment.name}" ha sido eliminado correctamente.`,
      })
      setIsDeleteDialogOpen(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      case "document":
        return <FileTextIcon className="h-4 w-4 text-green-500" />
      default:
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Subido por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Relacionado con</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAttachments.length > 0 ? (
                      paginatedAttachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {getFileIcon(attachment.type)}
                            {attachment.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                attachment.type === "image"
                                  ? "border-blue-500 text-blue-700"
                                  : attachment.type === "document"
                                    ? "border-green-500 text-green-700"
                                    : "border-gray-500 text-gray-700"
                              }
                            >
                              {attachment.type === "image"
                                ? "Imagen"
                                : attachment.type === "document"
                                  ? "Documento"
                                  : "Otro"}
                            </Badge>
                          </TableCell>
                          <TableCell>{attachment.size}</TableCell>
                          <TableCell>{attachment.uploadedBy}</TableCell>
                          <TableCell>{attachment.uploadedAt}</TableCell>
                          <TableCell>{attachment.relatedTo}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
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
                        <TableCell colSpan={7} className="text-center py-8">
                          No se encontraron archivos
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

      {/* Diálogo para subir archivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Archivo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Archivo</Label>
                <Input
                  id="file"
                  type="file"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Simulamos la obtención de datos del archivo
                      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB"
                      let fileType: "image" | "document" | "other" = "other"

                      if (file.type.startsWith("image/")) {
                        fileType = "image"
                      } else if (
                        file.type === "application/pdf" ||
                        file.type.includes("document") ||
                        file.type.includes("sheet") ||
                        file.type === "text/plain"
                      ) {
                        fileType = "document"
                      }

                      setFormData({
                        ...formData,
                        name: file.name,
                        type: fileType,
                        size: fileSizeMB,
                      })
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Relacionado con</Label>
                <Select
                  value={formData.relatedTo}
                  onValueChange={(value) => setFormData({ ...formData, relatedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar incidente relacionado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Incidente #1">Incidente #1</SelectItem>
                    <SelectItem value="Incidente #2">Incidente #2</SelectItem>
                    <SelectItem value="Incidente #3">Incidente #3</SelectItem>
                    <SelectItem value="Incidente #4">Incidente #4</SelectItem>
                    <SelectItem value="Incidente #5">Incidente #5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Subir archivo</Button>
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
              ¿Estás seguro de que deseas eliminar el archivo <strong>{currentAttachment?.name}</strong>?
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
