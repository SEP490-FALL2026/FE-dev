import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AccessReviewPagination({
  page,
  size,
  total,
  totalPages,
  selected,
  onPage,
  onSize,
  onReview,
  onClear
}: {
  page: number
  size: number
  total: number
  totalPages: number
  selected: number
  onPage: (page: number) => void
  onSize: (size: string) => void
  onReview: () => void
  onClear: () => void
}) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const control = 'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-brand-500'
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 p-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          disabled={!selected}
          onClick={onReview}
          className='rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {t('accessReview.reviewSelected', { value: number.format(selected) })}
        </button>
        {selected > 0 && (
          <button type='button' onClick={onClear} className='text-xs text-brand-600'>
            {t('accessReview.clearSelection')}
          </button>
        )}
      </div>
      <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-500'>
        <span role='status'>
          {t('accessReview.showing', {
            from: number.format(total ? (page - 1) * size + 1 : 0),
            to: number.format(Math.min(page * size, total)),
            total: number.format(total)
          })}
        </span>
        <button
          type='button'
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label={t('accessReview.previous')}
          className={`${control} disabled:opacity-40`}
        >
          <ChevronLeft size={14} aria-hidden='true' />
        </button>
        <span className='rounded-lg bg-brand-100 px-3 py-2 font-medium text-brand-600'>{number.format(page)}</span>
        <button
          type='button'
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          aria-label={t('accessReview.next')}
          className={`${control} disabled:opacity-40`}
        >
          <ChevronRight size={14} aria-hidden='true' />
        </button>
        <select
          aria-label={t('accessReview.pageSize')}
          value={size}
          onChange={(event) => onSize(event.target.value)}
          className={control}
        >
          {[2, 5, 10, 20].map((value) => (
            <option key={value} value={value}>
              {t('accessReview.perPage', { value: number.format(value) })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
