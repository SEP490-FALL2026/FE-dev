import { CalendarDays, Ghost } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { GhostSeatFilterBar } from './components/ghost-seat-filters'
import { GhostSeatMetrics } from './components/ghost-seat-metrics'
import { GhostSeatTable } from './components/ghost-seat-table'
import { useGhostSeatFilters } from './hooks/use-ghost-seat-filters'

export function GhostSeatReviewPage() {
  const { t, i18n } = useTranslation()
  const state = useGhostSeatFilters()
  useDocumentTitle(t('ghostSeat.documentTitle'))
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC'
  })
  return (
    <div className='space-y-6 text-neutral-900'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600'>
            <Ghost size={24} aria-hidden='true' />
          </span>
          <div>
            <h1 className='text-2xl font-bold'>{t('ghostSeat.title')}</h1>
            <p className='mt-1 text-sm text-neutral-500'>{t('ghostSeat.subtitle')}</p>
          </div>
        </div>
        <button
          type='button'
          disabled
          aria-label={t('ghostSeat.period')}
          title={t('ghostSeat.periodHint')}
          className='flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs disabled:cursor-not-allowed'
        >
          <CalendarDays size={16} aria-hidden='true' />
          {date.formatRange(new Date('2025-04-21T00:00:00Z'), new Date('2025-05-20T00:00:00Z'))}
        </button>
      </div>
      <GhostSeatMetrics />
      <p className='text-xs leading-relaxed text-neutral-500'>{t('ghostSeat.sample')}</p>
      <section
        aria-label={t('ghostSeat.seats')}
        className='overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm'
      >
        <GhostSeatFilterBar {...state} />
        <GhostSeatTable {...state} />
      </section>
    </div>
  )
}
