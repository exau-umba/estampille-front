import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} / {totalPages}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => onPageChange(Math.max(1, page - 1))}>
          Précédent
        </Button>
        <Button type="button" variant="secondary" onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
