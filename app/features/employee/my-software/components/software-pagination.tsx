import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SoftwarePaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function SoftwarePagination({ currentPage, totalItems, itemsPerPage, onPageChange }: SoftwarePaginationProps) {
  const { t } = useTranslation()

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(totalItems, currentPage * itemsPerPage)

  return (
    <div className='flex flex-col items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm sm:flex-row'>
      <div className='text-sm text-neutral-500'>
        {t('mySoftware.pagination.showingResults', { from, to, total: totalItems })}
      </div>

      <div className='flex items-center gap-2'>
        <button
          aria-label={t('mySoftware.pagination.previous')}
          className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40'
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          type='button'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1
          const isActive = page === currentPage

          return (
            <button
              aria-label={t('mySoftware.pagination.page', { page })}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                isActive
                  ? 'border border-brand-500 bg-brand-500 text-white'
                  : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
              key={page}
              onClick={() => onPageChange(page)}
              type='button'
            >
              {page}
            </button>
          )
        })}

        <button
          aria-label={t('mySoftware.pagination.next')}
          className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40'
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type='button'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}
