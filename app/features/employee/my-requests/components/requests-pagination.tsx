import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface RequestsPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function RequestsPagination({ currentPage, totalItems, itemsPerPage, onPageChange }: RequestsPaginationProps) {
  const { t } = useTranslation()

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(totalItems, currentPage * itemsPerPage)

  return (
    <div className='flex flex-col items-center justify-between gap-4 border-t border-neutral-200 bg-white px-6 py-4 sm:flex-row'>
      <div className='text-sm text-neutral-500'>
        {t('myRequests.pagination.showingRequests', { from, to, total: totalItems })}
      </div>

      <nav
        aria-label={t('myRequests.pagination.ariaLabel')}
        className='relative z-0 inline-flex -space-x-px rounded-md shadow-xs'
      >
        {/* Previous */}
        <button
          aria-label={t('myRequests.pagination.previous')}
          className='relative inline-flex items-center rounded-l-md border border-neutral-200 bg-white px-2.5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40'
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          type='button'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1
          const isActive = page === currentPage

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              aria-label={t('myRequests.pagination.page', { page })}
              className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'z-10 border-brand-500 bg-brand-500 text-white font-semibold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
              key={page}
              onClick={() => onPageChange(page)}
              type='button'
            >
              {page}
            </button>
          )
        })}

        {/* Next */}
        <button
          aria-label={t('myRequests.pagination.next')}
          className='relative inline-flex items-center rounded-r-md border border-neutral-200 bg-white px-2.5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40'
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type='button'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </nav>
    </div>
  )
}
