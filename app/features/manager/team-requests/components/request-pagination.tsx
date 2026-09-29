import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { RequestFilters } from '../hooks/use-request-filters'

export function RequestPagination({ page, pageSize, pageCount, filtered, update }: RequestFilters) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const button =
    'flex size-8 items-center justify-center rounded border border-neutral-200 hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 p-4 text-sm text-neutral-500'>
      <p>
        {t('teamRequests.showing', {
          from: number.format(filtered.length ? (page - 1) * pageSize + 1 : 0),
          to: number.format(Math.min(page * pageSize, filtered.length)),
          total: number.format(filtered.length)
        })}
      </p>
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            disabled={page === 1}
            onClick={() => update('page', String(page - 1))}
            aria-label={t('teamRequests.previous')}
            className={button}
          >
            <ChevronLeft size={14} aria-hidden='true' />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => (
            <button
              type='button'
              key={value}
              onClick={() => update('page', String(value))}
              aria-label={t('teamRequests.page', { value: number.format(value) })}
              aria-current={page === value ? 'page' : undefined}
              className={`${button} ${page === value ? 'border-brand-500 bg-brand-100 font-semibold text-brand-600' : ''}`}
            >
              {number.format(value)}
            </button>
          ))}
          <button
            type='button'
            disabled={page === pageCount}
            onClick={() => update('page', String(page + 1))}
            aria-label={t('teamRequests.next')}
            className={button}
          >
            <ChevronRight size={14} aria-hidden='true' />
          </button>
        </div>
        <select
          aria-label={t('teamRequests.size')}
          value={pageSize}
          onChange={(event) => update('size', event.target.value)}
          className='rounded border border-neutral-200 bg-white px-3 py-1.5 outline-brand-500'
        >
          {[3, 10, 20].map((value) => (
            <option key={value} value={value}>
              {t('teamRequests.perPage', { value: number.format(value) })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
