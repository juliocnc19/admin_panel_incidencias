"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Función para generar los números de página
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Si hay menos páginas que el máximo visible, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1)

      // Calcular el rango de páginas a mostrar
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        endPage = 4
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Añadir elipsis si es necesario
      if (startPage > 2) {
        pages.push("...")
      }

      // Añadir páginas intermedias
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Añadir elipsis si es necesario
      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      // Siempre mostrar la última página
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <PaginationContent>
      <PaginationPrevious href="#" onClick={handlePrevious} disabled={currentPage === 1}>
        <ChevronLeftIcon className="h-4 w-4 mr-2" />
        Anterior
      </PaginationPrevious>
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <PaginationEllipsis key={`ellipsis-${index}`} />
        ) : (
          <PaginationItem key={`page-${page}`} active={currentPage === page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                typeof page === "number" && onPageChange(page)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ),
      )}
      <PaginationNext href="#" onClick={handleNext} disabled={currentPage === totalPages}>
        Siguiente
        <ChevronRightIcon className="h-4 w-4 ml-2" />
      </PaginationNext>
    </PaginationContent>
  )
}

export const PaginationContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex w-full items-center justify-center gap-2", className)} {...props} />
}

export const PaginationItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "h-9 w-9",
        active
          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
          : "border-muted hover:bg-secondary hover:text-foreground",
        className,
      )}
      {...props}
    />
  )
})
PaginationItem.displayName = "PaginationItem"

export const PaginationLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationLink.displayName = "PaginationLink"

export const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("h-9 w-9 select-none items-center justify-center rounded-md text-sm font-medium", className)}
      {...props}
    >
      ...
    </span>
  )
}
PaginationEllipsis.displayName = "PaginationEllipsis"

export const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Button ref={ref} variant="outline" className={cn("gap-1.5", className)} {...props}>
        <ChevronLeftIcon className="h-4 w-4" />
        Anterior
      </Button>
    )
  },
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Button ref={ref} variant="outline" className={cn("gap-1.5", className)} {...props}>
        Siguiente
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    )
  },
)
PaginationNext.displayName = "PaginationNext"
