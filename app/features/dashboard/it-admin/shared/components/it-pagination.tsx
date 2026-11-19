import { useTranslation } from 'react-i18next'
import { itButtonClass } from './it-form'

export function ItPagination({
  page,
  total,
  pageSize,
  onChange,
  disabled = false
}: {
  page: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('itAdmin')
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-end gap-3 py-4 text-sm'>
      <span className='font-mono tabular-nums'>{translate('page', { page, total: pages, count: total })}</span>
      <button
        type='button'
        className={itButtonClass}
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        {translate('previous')}
      </button>
      <button
        type='button'
        className={itButtonClass}
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        {translate('next')}
      </button>
    </nav>
  )
}
