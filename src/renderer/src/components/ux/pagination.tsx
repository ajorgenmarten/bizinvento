import { ChevronLeft, ChevronRight } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'
import { formatNumber } from '@renderer/lib/format'

type PaginationProps = {
  totalItems: number
  totalPages: number
  page: number
  paginationSize: number
  onPageChange: (page: number) => void
}

export default function Pagination(props: PaginationProps): JSX.Element | null {
  const { totalPages, page, paginationSize, totalItems, onPageChange } = props

  if (totalPages <= 1) return null

  const currentPage = Math.min(Math.max(1, page), totalPages)

  const getPageRange = (): number[] => {
    if (totalPages <= paginationSize) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfSize = Math.floor(paginationSize / 2)
    let start = Math.max(1, currentPage - halfSize)
    const end = Math.min(totalPages, start + paginationSize - 1)

    if (end - start + 1 < paginationSize) {
      start = Math.max(1, end - paginationSize + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getPageRange()

  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage)
    }
  }

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 pt-1 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Página <span className="font-medium text-foreground">{currentPage}</span> de {totalPages}
        <span className="mx-2 text-border">·</span>
        {formatNumber(totalItems)} productos
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        {visiblePages.map((pageNumber) => {
          const isActive = pageNumber === currentPage
          return (
            <Button
              key={pageNumber}
              variant={isActive ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn('text-xs tabular-nums', !isActive && 'text-muted-foreground')}
              onClick={() => goToPage(pageNumber)}
              aria-label={`Ir a la página ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
