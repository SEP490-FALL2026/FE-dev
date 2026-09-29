import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GhostSeatFilters } from '../hooks/use-ghost-seat-filters'

export function GhostSeatPagination(state: GhostSeatFilters) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500'>
      <p>
        {t('ghostSeat.results', {
          from: number.format(state.filtered.length ? (state.page - 1) * state.size + 1 : 0),
          to: number.format(Math.min(state.page * state.size, state.filtered.length)),
          total: number.format(state.filtered.length)
        })}
      </p>
      <div className='flex items-center gap-2'>
        <label className='flex items-center gap-2'>
          <span>{t('ghostSeat.pageSize')}</span>
          <select
            value={state.size}
            onChange={(e) => state.update('size', e.target.value)}
            className='rounded-lg border border-neutral-200 bg-white p-1.5 outline-brand-500'
          >
            {[5, 10].map((size) => (
              <option key={size} value={size}>
                {number.format(size)}
              </option>
            ))}
          </select>
        </label>
        <button
          type='button'
          disabled={state.page === 1}
          onClick={() => state.update('page', String(state.page - 1))}
          aria-label={t('ghostSeat.previous')}
          className='rounded-lg border border-neutral-200 p-1.5 hover:bg-brand-bg disabled:opacity-40'
        >
          <ChevronLeft size={16} aria-hidden='true' />
        </button>
        {Array.from({ length: state.pages }, (_, index) => index + 1).map((page) => (
          <button
            type='button'
            key={page}
            onClick={() => state.update('page', String(page))}
            aria-label={t('ghostSeat.page', { count: page })}
            aria-current={state.page === page ? 'page' : undefined}
            className={`size-7 rounded-lg border ${state.page === page ? 'border-brand-500 bg-brand-500 text-white' : 'border-neutral-200 hover:bg-brand-bg'}`}
          >
            {number.format(page)}
          </button>
        ))}
        <button
          type='button'
          disabled={state.page === state.pages}
          onClick={() => state.update('page', String(state.page + 1))}
          aria-label={t('ghostSeat.next')}
          className='rounded-lg border border-neutral-200 p-1.5 hover:bg-brand-bg disabled:opacity-40'
        >
          <ChevronRight size={16} aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}
