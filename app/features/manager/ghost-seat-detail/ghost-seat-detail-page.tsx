import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { filterGhostSeats, ghostSeats, seatTier } from '~/entities/license/ghost-seats-demo'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { SeatActions, SeatRecommendation, SeatRelated } from './components/seat-actions-related'
import { SeatEvidence } from './components/seat-evidence'
import { SeatFacts } from './components/seat-facts'
import { SeatSummary } from './components/seat-summary'
import { SeatTabs } from './components/seat-tabs'
import { SeatTimelineNotes } from './components/seat-timeline-notes'
import { figmaDetail, ghostDetailTabs, type GhostDetailTab } from './ghost-seat-detail-demo'

export function GhostSeatDetailPage({ seatId }: { seatId: string }) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const seat = ghostSeats.find((item) => item.id === seatId)
  useDocumentTitle(t('ghostDetail.documentTitle'))
  const selected = ghostDetailTabs.find((tab) => tab === params.get('panel')) ?? 'overview'
  const changeTab = (tab: GhostDetailTab) => {
    const next = new URLSearchParams(params)
    next.set('panel', tab)
    setParams(next, { replace: true })
  }
  const backParams = new URLSearchParams(params)
  backParams.delete('panel')
  backParams.delete('id')
  const query = backParams.size ? `?${backParams}` : ''
  const backLink = (
    <Link
      to={`/manager/ghost-seat-review${query}`}
      className='inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:underline'
    >
      <ArrowLeft size={15} aria-hidden='true' />
      {t('ghostDetail.back')}
    </Link>
  )
  if (!seat)
    return (
      <section className='space-y-4 rounded-xl border border-neutral-200 bg-white p-8'>
        <h1 className='text-2xl font-bold'>{t('ghostDetail.notFound')}</h1>
        <p className='text-sm text-neutral-500'>{t('ghostDetail.notFoundHint')}</p>
        {backLink}
      </section>
    )
  const detailed = seat.id === figmaDetail.seatId
  const filtered = filterGhostSeats(params)
  const index = filtered.findIndex((item) => item.id === seat.id)
  const previous = index > 0 ? filtered[index - 1] : undefined
  const next = index >= 0 ? filtered[index + 1] : undefined
  return (
    <div className='space-y-6 text-neutral-900'>
      <div>
        {backLink}
        <div className='mt-3 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>{t('ghostDetail.title')}</h1>
            <p className='mt-1 text-sm text-neutral-500'>{t('ghostDetail.subtitle')}</p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='rounded-lg border border-brand-200 bg-brand-100 px-3 py-2 text-xs font-medium text-brand-600'>
              {t('ghostDetail.status', { tier: t(`ghostSeat.tiers.${seatTier(seat)}`), count: seat.inactiveDays })}
            </span>
            <nav
              aria-label={t('ghostDetail.recordNavigation')}
              className='flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1'
            >
              {previous ? (
                <Link
                  to={`/manager/ghost-seat-review/${previous.id}${query}`}
                  aria-label={t('ghostDetail.previous')}
                  className='rounded p-1.5 hover:bg-brand-100'
                >
                  <ChevronLeft size={16} aria-hidden='true' />
                </Link>
              ) : (
                <button type='button' disabled aria-label={t('ghostDetail.previous')} className='p-1.5 opacity-40'>
                  <ChevronLeft size={16} aria-hidden='true' />
                </button>
              )}
              <span className='px-2 text-xs'>
                {index >= 0
                  ? t('ghostDetail.position', { index: index + 1, total: filtered.length })
                  : t('ghostDetail.outsideFilter')}
              </span>
              {next ? (
                <Link
                  to={`/manager/ghost-seat-review/${next.id}${query}`}
                  aria-label={t('ghostDetail.next')}
                  className='rounded p-1.5 hover:bg-brand-100'
                >
                  <ChevronRight size={16} aria-hidden='true' />
                </Link>
              ) : (
                <button type='button' disabled aria-label={t('ghostDetail.next')} className='p-1.5 opacity-40'>
                  <ChevronRight size={16} aria-hidden='true' />
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
      <p className='text-xs leading-relaxed text-neutral-500'>
        {t(detailed ? 'ghostDetail.sample' : 'ghostDetail.partial')}
      </p>
      <div className='grid gap-6 xl:grid-cols-3'>
        <div className='min-w-0 space-y-6 xl:col-span-2'>
          <SeatSummary seat={seat} detailed={detailed} />
          <SeatTabs selected={selected} onChange={changeTab} />
          <div
            role='tabpanel'
            id='ghost-detail-panel'
            aria-labelledby={`ghost-tab-${selected}`}
            tabIndex={0}
            className='space-y-6 outline-brand-500'
          >
            {selected === 'overview' ? (
              <>
                <SeatRecommendation recommendation={seat.recommendation} detailed={detailed} />
                <SeatFacts seat={seat} detailed={detailed} />
                <SeatTimelineNotes key={seat.id} detailed={detailed} />
              </>
            ) : selected === 'evidence' ? (
              <SeatEvidence detailed={detailed} full />
            ) : selected === 'requests' ? (
              <SeatRelated detailed={detailed} />
            ) : (
              <section className='rounded-xl border border-neutral-200 bg-white p-6'>
                <h2 className='font-semibold'>{t('ghostDetail.tabs.audit')}</h2>
                <p className='mt-3 text-sm text-neutral-500'>{t('ghostDetail.noAudit')}</p>
              </section>
            )}
          </div>
        </div>
        <aside aria-label={t('ghostDetail.context')} className='space-y-6'>
          <SeatEvidence detailed={detailed} onView={() => changeTab('evidence')} />
          <SeatRelated detailed={detailed} onRequests={() => changeTab('requests')} />
          <SeatActions />
        </aside>
      </div>
    </div>
  )
}
