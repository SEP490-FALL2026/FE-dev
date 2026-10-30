import { useTranslation } from 'react-i18next'

export interface AdminPage {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
export function AdminPagination({
  pagination,
  onPageChange,
  disabled = false
}: {
  pagination?: AdminPage
  onPageChange: (page: number) => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('admin')
  if (!pagination) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-end gap-3 py-4 text-sm'>
      <span className='font-mono tabular-nums'>
        {translate('page', { page: pagination.page, total: pagination.totalPages, count: pagination.totalItems })}
      </span>
      <button
        type='button'
        className='min-h-11 rounded-md border border-border px-3 disabled:opacity-40 md:min-h-9'
        disabled={disabled || pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        {translate('previous')}
      </button>
      <button
        type='button'
        className='min-h-11 rounded-md border border-border px-3 disabled:opacity-40 md:min-h-9'
        disabled={disabled || pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        {translate('next')}
      </button>
    </nav>
  )
}
