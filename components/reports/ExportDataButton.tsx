'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';

interface ExportDataButtonProps<T> {
  data: T[] | undefined;
  fileName: string;
  buttonText?: string;
  isLoading?: boolean;
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

export function ExportDataButton<T extends Record<string, any>>({
  data,
  fileName,
  buttonText = 'Exportar Datos',
  isLoading = false,
}: ExportDataButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filtrar los datos por fecha desde
  const filteredData = selectedDate && data
    ? data.filter((item) => {
        if (!item.created_at) return true;
        return new Date(item.created_at) >= selectedDate;
      })
    : data || [];

  const exportToPDF = async () => {
    if (!filteredData || filteredData.length === 0) {
      toast.warning('No hay datos para exportar');
      return;
    }
    try {
      setIsExporting(true);
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
      const logoWidth = 30;
      const logoHeight = 20;
      const yLogo = 10;
      const yTitle = 20;
      // Agregar logos a los costados del título
      doc.addImage(logoAIS, 'PNG', margin, yLogo, logoWidth, logoHeight);
      doc.addImage(logoUNERG, 'PNG', pageWidth - margin - logoWidth, yLogo, logoWidth, logoHeight);
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text(`Exportación de ${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`, pageWidth / 2, yTitle, { align: 'center' } as any);
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
      const omitFields = ['password', 'role_id','user_id'];
      const flatRow = (row: any) => {
        const result: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
          if (omitFields.includes(key)) return;
          if (typeof value === 'object' && value !== null) {
            // Si es un objeto, mostrar solo campos relevantes
            if (key === 'role' && typeof value === 'object' && value !== null && 'name' in value) result['rol'] = (value as any).name;
            else if (key === 'user' && typeof value === 'object' && value !== null && 'first_name' in value && 'last_name' in value) result['usuario'] = (value as any).first_name + ' ' + (value as any).last_name;
            // Si es otro objeto, ignorar
          } else {
            result[key] = value;
          }
        });
        return result;
      };
      const prettyHeader = (key: string) => {
        const map: Record<string, string> = {
          first_name: 'Nombre',
          last_name: 'Apellido',
          email: 'Email',
          username: 'Usuario',
          cedula: 'Cédula',
          created_at: 'Fecha de creación',
          updated_at: 'Fecha de actualización',
          status_id: 'Estado',
          title: 'Título',
          description: 'Descripción',
          response: 'Respuesta',
          usuario: 'Usuario',
          rol: 'Rol',
        };
        return map[key] || key;
      };
      const tableRows = filteredData.map(flatRow);
      const columns = Object.keys(tableRows[0] || {});
      autoTable(doc, {
        startY: 40,
        head: [columns.map(prettyHeader)],
        body: tableRows.map(row => columns.map(col => String(row[col] ?? ''))),
        theme: 'grid',
        headStyles: {
          fillColor: [33, 37, 41],
          textColor: 255,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 9,
          halign: 'center',
        },
        styles: {
          cellPadding: 2,
        },
        columnStyles: Object.fromEntries(columns.map((col, i) => [i, { cellWidth: 'auto' }]))
      } as any);
      doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Datos exportados exitosamente');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      toast.error('Error al exportar los datos');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={isLoading || isExporting || !data || data.length === 0}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isExporting || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isExporting ? 'Exportando...' : 'Cargando...'}
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona la fecha desde la cual exportar los datos</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border bg-background shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
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
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {selectedDate ? `Desde: ${selectedDate.toLocaleDateString()}` : 'Selecciona una fecha'}
            </span>
          </div>
          <DialogFooter>
            <Button
              onClick={exportToPDF}
              disabled={!selectedDate || isExporting}
              className="w-full bg-primary text-white font-semibold text-base py-3 rounded-lg shadow-md hover:bg-primary/90 transition"
            >
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExportDataButton;
