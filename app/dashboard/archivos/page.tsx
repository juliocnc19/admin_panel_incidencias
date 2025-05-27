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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Attachment from "@/core/models/Attachment"
import { downloadUrl } from "@/lib/dowloadUrl"

// Extend the Attachment interface with additional properties
interface ExtendedAttachment extends Attachment {
  name: string
  type: string
  uploadedBy: string
  username: string
}

export default function AttachmentsPage() {
  const [filteredAttachments, setFilteredAttachments] = useState<ExtendedAttachment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const itemsPerPage = 5

  // Hooks
  const { data: incidentsData, isLoading: isLoadingIncidents } = useGetIncidents()

  useEffect(() => {
    if (incidentsData?.data) {
      const allAttachments = incidentsData.data.flatMap(incident => {
        if (!incident.attachment) return []
        return incident.attachment.map(att => ({
          ...att,
          name: att.attachment_path.split('/').pop() || '',
          type: att.attachment_path.split('.').pop() || '',
          uploadedBy: incident.user ? `${incident.user.first_name} ${incident.user.last_name}` : 'Desconocido',
          username: incident.user?.username || 'Desconocido',
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
            uploadedBy: incident.user ? `${incident.user.first_name} ${incident.user.last_name}` : 'Desconocido',
            username: incident.user?.username || 'Desconocido',
          }))
          .filter(att =>
            att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.username.toLowerCase().includes(searchTerm.toLowerCase())
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
          uploadedBy: incident.user ? `${incident.user.first_name} ${incident.user.last_name}` : 'Desconocido',
          username: incident.user?.username || 'Desconocido',
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
                    <TableHead>Subido por</TableHead>
                    <TableHead>Username</TableHead>
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
                      <TableCell>{attachment.uploadedBy}</TableCell>
                      <TableCell>{attachment.username}</TableCell>
                      <TableCell>
                        <a href={downloadUrl(attachment.name)} download>
                          <Button variant="ghost" size="icon">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </a>
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
