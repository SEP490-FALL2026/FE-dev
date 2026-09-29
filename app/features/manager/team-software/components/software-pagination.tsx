import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareFilters } from '../hooks/use-software-filters'

export function SoftwarePagination({ page, pageSize, pageCount, filtered, update }: SoftwareFilters) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const button =
    'flex size-8 items-center justify-center rounded border border-neutral-200 hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 p-4 text-sm text-neutral-500'>
      <p>
        {t('teamSoftware.showing', {
          from: number.format(filtered.length ? (page - 1) * pageSize + 1 : 0),
          to: number.format(Math.min(page * pageSize, filtered.length)),
          total: number.format(filtered.length)
        })}
      </p>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          disabled={page === 1}
          aria-label={t('teamSoftware.previous')}
          onClick={() => update('page', String(page - 1))}
          className={button}
        >
          <ChevronLeft size={14} aria-hidden='true' />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => (
          <button
            key={value}
            type='button'
            aria-label={t('teamSoftware.page', { value: number.format(value) })}
            aria-current={value === page ? 'page' : undefined}
            onClick={() => update('page', String(value))}
            className={`${button} ${value === page ? 'border-brand-500 bg-brand-100 font-medium text-brand-600' : ''}`}
          >
            {number.format(value)}
          </button>
        ))}
        <button
          type='button'
          disabled={page === pageCount}
          aria-label={t('teamSoftware.next')}
          onClick={() => update('page', String(page + 1))}
          className={button}
        >
          <ChevronRight size={14} aria-hidden='true' />
        </button>
        <select
          aria-label={t('teamSoftware.size')}
          value={pageSize}
          onChange={(event) => update('size', event.target.value)}
          className='ml-2 rounded border border-neutral-200 bg-white px-3 py-1.5 outline-brand-500'
        >
          {[4, 10, 20].map((value) => (
            <option key={value} value={value}>
              {t('teamSoftware.perPage', { value: number.format(value) })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
