'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetUsers } from '@/hooks/users/useGetUsers';
import { useGetIncidents } from '@/hooks/incidents/useGetIncidents';
import { useGetAttachments } from '@/hooks/attachments/useGetAttachments';
import { useGetStatuses } from '@/hooks/statuses/useGetStatuses';
import Status from '@/core/models/Status';
import Incident from '@/core/models/Incident';
import User from '@/core/models/User';
import Attachment from '@/core/models/Attachment';

interface StatusWithColor extends Status {
  color?: string;
}

interface ApiResponse<T> {
  data: T;
  detail: string;
  token?: string;
  length?: number;
}

export default function GenerateReportButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsers();
  const { data: incidentsResponse, isLoading: isLoadingIncidents } = useGetIncidents();
  const { data: attachmentsResponse, isLoading: isLoadingAttachments } = useGetAttachments();
  const { data: statusesResponse, isLoading: isLoadingStatuses } = useGetStatuses();

  const isLoading = isLoadingUsers || isLoadingIncidents || isLoadingAttachments || isLoadingStatuses;
  
  const users: User[] = (usersResponse as unknown as ApiResponse<User[]>)?.data || [];
  const incidents: Incident[] = (incidentsResponse as unknown as ApiResponse<Incident[]>)?.data || [];
  const attachments: Attachment[] = (attachmentsResponse as unknown as ApiResponse<Attachment[]>)?.data || [];
  const statuses: StatusWithColor[] = (statusesResponse as unknown as ApiResponse<StatusWithColor[]>)?.data || [];
  
  const stats = {
    users: users.length,
    incidents: incidents.length,
    attachments: attachments.length,
    statuses: statuses.map((status: StatusWithColor) => {
      const name = 'name' in status ? status.name : 'Desconocido';
      const statusId = 'id' in status ? status.id : 0;
      const color = 'color' in status ? status.color : '#000000';
      
      return {
        name,
        count: incidents.filter((incident: Incident) => 'status_id' in incident ? incident.status_id === statusId : false).length,
        color,
      };
    }),
  };

  const generatePDF = async (stats: any) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text('Reporte de Estadísticas', pageWidth / 2, 20, { align: 'center' } as any);
      
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(
        `Generado el: ${new Date().toLocaleString()}`,
        pageWidth - margin,
        30,
        { align: 'right' } as any
      );
      
      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.text('Resumen General', margin, 50);
      
      autoTable(doc, {
        startY: 60,
        head: [['Métrica', 'Cantidad']],
        body: [
          ['Usuarios', stats.users.toString()],
          ['Incidencias', stats.incidents.toString()],
          ['Archivos adjuntos', stats.attachments.toString()],
          ['Total por estados', stats.statuses.reduce((sum: number, status: any) => sum + status.count, 0).toString()],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [33, 37, 41],
          textColor: 255,
        },
      } as any);
      
      const firstTableEndY = (doc as any).lastAutoTable?.finalY || 100;
      
      doc.setFontSize(14);
      doc.text('Incidencias por Estado', margin, firstTableEndY + 20);
      
      const totalIncidents = stats.statuses.reduce((sum: number, status: any) => sum + status.count, 0);
      
      autoTable(doc, {
        startY: firstTableEndY + 25,
        head: [['Estado', 'Cantidad', 'Porcentaje']],
        body: stats.statuses.map((status: any) => [
          status.name,
          status.count.toString(),
          totalIncidents > 0 ? `${Math.round((status.count / totalIncidents) * 100)}%` : '0%',
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [33, 37, 41],
          textColor: 255,
        },
      } as any);
      
      doc.save(`reporte-estadisticas-${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      return false;
    }
  };

  const handleGenerateReport = async () => {
    if (!stats) return;
    
    try {
      setIsGenerating(true);
      toast.info('Generando reporte, por favor espere...');
      
      const success = await generatePDF(stats);
      
      if (success) {
        toast.success('Reporte generado exitosamente');
      } else {
        throw new Error('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={isLoading || isGenerating}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
    >
      {isGenerating || isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isGenerating ? 'Generando...' : 'Cargando datos...'}
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Generar Reporte
        </>
      )}
    </Button>
  );
}
