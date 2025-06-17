'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExportDataButtonProps<T> {
  data: T[] | undefined;
  fileName: string;
  buttonText?: string;
  isLoading?: boolean;
}

export function ExportDataButton<T extends Record<string, any>>({
  data,
  fileName,
  buttonText = 'Exportar Datos',
  isLoading = false,
}: ExportDataButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      toast.warning('No hay datos para exportar');
      return;
    }

    try {
      setIsExporting(true);
      
      // Crear una hoja de trabajo de Excel
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Ajustar el ancho de las columnas
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(
          10, // ancho mínimo
          Math.min(30, Math.max(key.length, ...(data.map(item => String(item[key] || '').length))))
        )
      }));
      
      ws['!cols'] = colWidths;
      
      // Crear un libro de trabajo y agregar la hoja
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      
      // Generar el archivo Excel
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar datos:', error);
      toast.error('Error al exportar los datos');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToExcel}
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
  );
}

export default ExportDataButton;
