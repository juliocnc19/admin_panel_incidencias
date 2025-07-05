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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';

interface StatusWithColor extends Status {
  color?: string;
}

interface ApiResponse<T> {
  data: T;
  detail: string;
  token?: string;
  length?: number;
}

// Función auxiliar para convertir una imagen pública a base64
const getImageBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function GenerateReportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsers();
  const { data: incidentsResponse, isLoading: isLoadingIncidents } = useGetIncidents();
  const { data: attachmentsResponse, isLoading: isLoadingAttachments } = useGetAttachments();
  const { data: statusesResponse, isLoading: isLoadingStatuses } = useGetStatuses();

  const isLoading = isLoadingUsers || isLoadingIncidents || isLoadingAttachments || isLoadingStatuses;
  
  const users: User[] = (usersResponse as unknown as ApiResponse<User[]>)?.data || [];
  const incidents: Incident[] = (incidentsResponse as unknown as ApiResponse<Incident[]>)?.data || [];
  const attachments: Attachment[] = (attachmentsResponse as unknown as ApiResponse<Attachment[]>)?.data || [];
  const statuses: StatusWithColor[] = (statusesResponse as unknown as ApiResponse<StatusWithColor[]>)?.data || [];
  
  // Filtrar incidentes, usuarios y adjuntos por fecha desde
  const filteredIncidents = selectedDate
    ? incidents.filter((incident) => new Date(incident.created_at) >= selectedDate)
    : incidents;
  const filteredUsers = selectedDate
    ? users.filter((user) => new Date(user.created_at) >= selectedDate)
    : users;
  const filteredAttachments = selectedDate
    ? attachments.filter((att) => new Date(att.created_at) >= selectedDate)
    : attachments;

  const filteredStats = {
    users: filteredUsers.length,
    incidents: filteredIncidents.length,
    attachments: filteredAttachments.length,
    statuses: statuses.map((status: StatusWithColor) => {
      const name = 'name' in status ? status.name : 'Desconocido';
      const statusId = 'id' in status ? status.id : 0;
      const color = 'color' in status ? status.color : '#000000';
      return {
        name,
        count: filteredIncidents.filter((incident: Incident) => 'status_id' in incident ? incident.status_id === statusId : false).length,
        color,
      };
    }),
  };

  const generatePDF = async (stats: any) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      // Cargar imágenes en base64
      const [logoAIS, logoUNERG] = await Promise.all([
        getImageBase64('/logo_ais.png'),
        getImageBase64('/logo_unerg.png'),
      ]);

      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const logoWidth = 30; // Ajusta el tamaño según necesidad
      const logoHeight = 20;
      const yLogo = 10;
      const yTitle = 20;
      
      // Agregar logos a los costados del título
      doc.addImage(logoAIS, 'PNG', margin, yLogo, logoWidth, logoHeight);
      doc.addImage(logoUNERG, 'PNG', pageWidth - margin - logoWidth, yLogo, logoWidth, logoHeight);
      
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text('Reporte de Estadísticas', pageWidth / 2, yTitle, { align: 'center' } as any);
      
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      // Mostrar la fecha desde y la fecha de generación en la misma línea
      let fechaDesdeText = selectedDate ? `Datos desde: ${selectedDate.toLocaleDateString()}` : '';
      let generadoElText = `Generado el: ${new Date().toLocaleString()}`;
      let combinedText = fechaDesdeText ? `${fechaDesdeText}   |   ${generadoElText}` : generadoElText;
      doc.text(
        combinedText,
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
    if (!filteredStats) return;
    try {
      setIsGenerating(true);
      toast.info('Generando reporte, por favor espere...');
      const success = await generatePDF(filteredStats);
      if (success) {
        toast.success('Reporte generado exitosamente');
        setIsDialogOpen(false);
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
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona la fecha desde la cual generar el reporte</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                fromYear={2000}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown"
                className="w-full"
                locale={es}
              />
            <span className="text-sm text-muted-foreground font-medium">
              {selectedDate ? `Desde: ${selectedDate.toLocaleDateString()}` : 'Selecciona una fecha'}
            </span>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedDate || isGenerating}
              className="w-full bg-primary text-white font-semibold text-base py-3 rounded-lg shadow-md hover:bg-primary/90 transition"
            >
              {isGenerating ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
