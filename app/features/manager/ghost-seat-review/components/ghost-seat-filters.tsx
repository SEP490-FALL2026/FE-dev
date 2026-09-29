import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ghostSeats } from '~/entities/license/ghost-seats-demo'
import type { GhostSeatFilters } from '../hooks/use-ghost-seat-filters'

export function GhostSeatFilterBar(state: GhostSeatFilters) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  return (
    <div className='border-b border-neutral-200 p-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div role='group' aria-label={t('ghostSeat.views')} className='flex flex-wrap gap-1 rounded-xl bg-brand-bg p-1'>
          <button
            type='button'
            aria-pressed={state.tab === 'all'}
            onClick={() => state.update('tab', '')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold ${state.tab === 'all' ? 'bg-brand-500 text-white' : 'text-neutral-500 hover:bg-brand-100'}`}
          >
            {t('ghostSeat.all')}
          </button>
          <button
            type='button'
            disabled
            title={t('ghostSeat.pendingUnavailable')}
            className='rounded-lg px-4 py-2 text-xs text-neutral-500 disabled:cursor-not-allowed'
          >
            {t('ghostSeat.needsReview')}
          </button>
          <button
            type='button'
            aria-pressed={state.tab === 'critical'}
            onClick={() => state.update('tab', 'critical')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold ${state.tab === 'critical' ? 'bg-brand-500 text-white' : 'text-neutral-500 hover:bg-brand-100'}`}
          >
            {t('ghostSeat.critical')}
          </button>
        </div>
        <div className='flex w-full gap-2 sm:w-auto'>
          <div className='relative min-w-0 flex-1 sm:w-72'>
            <Search size={15} aria-hidden='true' className='absolute top-2.5 left-3 text-neutral-500' />
            <input
              type='search'
              value={state.search}
              onChange={(e) => state.update('search', e.target.value)}
              aria-label={t('ghostSeat.search')}
              placeholder={t('ghostSeat.search')}
              className='w-full rounded-xl border border-neutral-200 py-2 pr-3 pl-9 text-xs outline-brand-500'
            />
          </div>
          <button
            type='button'
            aria-expanded={expanded}
            aria-controls='ghost-seat-filters'
            onClick={() => setExpanded(!expanded)}
            className='flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs hover:bg-brand-bg'
          >
            <SlidersHorizontal size={15} aria-hidden='true' />
            {t('ghostSeat.filter')}
          </button>
        </div>
      </div>
      {expanded && (
        <div id='ghost-seat-filters' className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <label className='space-y-1 text-xs text-neutral-500'>
            <span>{t('ghostSeat.columns.application')}</span>
            <select
              value={state.application}
              onChange={(e) => state.update('application', e.target.value)}
              className='block w-full rounded-lg border border-neutral-200 bg-white p-2 text-neutral-900 outline-brand-500'
            >
              <option value=''>{t('ghostSeat.any')}</option>
              {ghostSeats.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {seat.application}
                </option>
              ))}
            </select>
          </label>
          <label className='space-y-1 text-xs text-neutral-500'>
            <span>{t('ghostSeat.columns.tier')}</span>
            <select
              value={state.tier}
              onChange={(e) => state.update('tier', e.target.value)}
              className='block w-full rounded-lg border border-neutral-200 bg-white p-2 text-neutral-900 outline-brand-500'
            >
              <option value=''>{t('ghostSeat.any')}</option>
              {(['critical', 'medium', 'low'] as const).map((tier) => (
                <option key={tier} value={tier}>
                  {t(`ghostSeat.tiers.${tier}`)}
                </option>
              ))}
            </select>
          </label>
          <label className='space-y-1 text-xs text-neutral-500'>
            <span>{t('ghostSeat.columns.recommendation')}</span>
            <select
              value={state.recommendation}
              onChange={(e) => state.update('recommendation', e.target.value)}
              className='block w-full rounded-lg border border-neutral-200 bg-white p-2 text-neutral-900 outline-brand-500'
            >
              <option value=''>{t('ghostSeat.any')}</option>
              {(['reclaim', 'keep', 'exempt'] as const).map((item) => (
                <option key={item} value={item}>
                  {t(`ghostSeat.recommendations.${item}`)}
                </option>
              ))}
            </select>
          </label>
          <button
            type='button'
            onClick={state.reset}
            className='self-end rounded-lg border border-neutral-200 p-2 text-xs text-brand-600 hover:bg-brand-100'
          >
            {t('ghostSeat.reset')}
          </button>
        </div>
      )}
    </div>
  )
}
