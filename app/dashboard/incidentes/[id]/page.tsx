"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IncidentStatusBadge } from "@/components/ui/translations"
import { useGetIncidentById } from "@/hooks/incidents/useGetIncidentById"
import { useGetAttachmentsByIncident } from "@/hooks/attachments/useGetAttachmentsByIncident"
import { downloadUrl } from "@/lib/dowloadUrl"
import { ArrowLeft } from "lucide-react"


function getFileName(path: string) {
  return path.split("/").pop() || path
}

export default function IncidentDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { data: incidentData, isLoading: isLoadingIncident } = useGetIncidentById(id)
  const { data: attachmentsData, isLoading: isLoadingAttachments } = useGetAttachmentsByIncident(id)
  const incident = incidentData?.data
  const attachments = attachmentsData?.data
    ? Array.isArray(attachmentsData.data)
      ? attachmentsData.data
      : [attachmentsData.data]
    : []
  const router = useRouter();

  if (isLoadingIncident) {
    return <div className="p-8 text-center">Cargando incidente...</div>
  }
  if (!incident) {
    return <div className="p-8 text-center text-red-600">No se encontró el incidente.</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Detalle del Incidente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <span className="font-semibold">Título:</span> {incident.title}
          </div>
          <div>
            <span className="font-semibold">Descripción:</span> {incident.description}
          </div>
          <div>
            <span className="font-semibold">Estado:</span> <IncidentStatusBadge status={incident.status?.name || 'pending'} />
          </div>
          <div>
            <span className="font-semibold">Reportado por:</span> {incident.user?.first_name} {incident.user?.last_name}
          </div>
          <div>
            <span className="font-semibold">Fecha:</span> {new Date(incident.created_at).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Respuesta:</span> {incident.response}
          </div>
          <div>
            <span className="font-semibold">Archivos relacionados:</span>
            <ul className="mt-2 space-y-2">
              {attachments && attachments.length > 0 ? (
                attachments.map((file) => (
                  <li key={file.id} className="flex items-center gap-4 border p-2 rounded bg-gray-100">
                    <span className="flex-1 truncate">{getFileName(file.attachment_path)}</span>
                    <a href={downloadUrl(getFileName(file.attachment_path))} download>
                      <Button variant="outline" size="sm">Descargar</Button>
                    </a>
                  </li>
                ))
              ) : isLoadingAttachments ? (
                <li className="text-gray-500">Cargando archivos...</li>
              ) : (
                <li className="text-gray-500">No hay archivos adjuntos.</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 