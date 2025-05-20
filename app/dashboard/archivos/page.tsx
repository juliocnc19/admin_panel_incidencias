"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, DownloadIcon, FileIcon, ImageIcon, FileTextIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import { useGetIncidents } from "@/hooks/incidents/useGetIncidents"
import { useDownloadIncident } from "@/hooks/incidents/useDownloadIncident"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  const { toast } = useToast()
  const itemsPerPage = 5

  // Hooks
  const { data: incidentsData, isLoading: isLoadingIncidents } = useGetIncidents()
  const downloadAttachment = useDownloadIncident()

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
      const filtered = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment
          .map(att => ({
            ...att,
            name: att.attachment_path.split('/').pop() || '',
            type: att.attachment_path.split('.').pop() || '',
            size: '0 KB'
          }))
          .filter(att => 
            att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
      })
      setFilteredAttachments(filtered)
      setCurrentPage(1)
    } else if (incidentsData?.data) {
      const allAttachments = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment.map(att => ({
          ...att,
          name: att.attachment_path.split('/').pop() || '',
          type: att.attachment_path.split('.').pop() || '',
          size: '0 KB'
        }))
      })
      setFilteredAttachments(allAttachments)
    }
  }, [searchTerm, incidentsData])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredAttachments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAttachments = filteredAttachments.slice(startIndex, endIndex)

  const handleDownload = async (filename: string) => {
    try {
      const response = await downloadAttachment.mutateAsync(filename)
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast({
        title: "Archivo descargado",
        description: "El archivo se ha descargado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-4 w-4" />
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileTextIcon className="h-4 w-4" />
      default:
        return <FileIcon className="h-4 w-4" />
    }
  }

  if (isLoadingIncidents) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Archivos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Archivos adjuntos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[300px]" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Archivos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Archivos adjuntos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar archivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAttachments.map((attachment) => (
                    <TableRow key={attachment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getFileIcon(attachment.type)}
                          {attachment.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{attachment.type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{attachment.size}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(attachment.attachment_path)}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
