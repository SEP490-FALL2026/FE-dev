import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { SoftwareActions } from './components/software-actions'
import { SoftwareCharts } from './components/software-charts'
import { SoftwareFiltersBar } from './components/software-filters'
import { SoftwareMetrics } from './components/software-metrics'
import { SoftwarePagination } from './components/software-pagination'
import { SoftwareTable } from './components/software-table'
import { useSoftwareFilters } from './hooks/use-software-filters'

export function TeamSoftwarePage() {
  const { t } = useTranslation()
  const state = useSoftwareFilters()
  const table = useRef<HTMLElement>(null)
  useDocumentTitle(t('teamSoftware.documentTitle'))
  function reviewGhost() {
    state.update('ghost', '1')
    table.current?.focus()
  }
  return (
    <div className='space-y-6 text-neutral-900'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='mb-1 text-2xl font-bold'>{t('teamSoftware.title')}</h1>
          <p className='text-sm text-neutral-500'>{t('teamSoftware.subtitle')}</p>
        </div>
        <SoftwareActions {...state} />
      </div>
      <p className='text-xs leading-relaxed text-neutral-500'>{t('teamSoftware.sample')}</p>
      {state.hasSnapshot ? (
        <>
          <SoftwareMetrics />
          <SoftwareCharts onReviewGhost={reviewGhost} />
        </>
      ) : (
        <section className='rounded-xl border border-neutral-200 bg-white p-8 text-center'>
          <h2 className='font-semibold'>{t('teamSoftware.noPeriod')}</h2>
          <p className='mt-2 text-sm text-neutral-500'>{t('teamSoftware.periodHint')}</p>
          <button type='button' onClick={state.reset} className='mt-4 text-sm text-brand-600 hover:underline'>
            {t('teamSoftware.reset')}
          </button>
        </section>
      )}
      <section
        ref={table}
        tabIndex={-1}
        aria-label={t('teamSoftware.software')}
        className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm outline-brand-500'
      >
        <SoftwareFiltersBar {...state} />
        <SoftwareTable {...state} />
        <SoftwarePagination {...state} />
      </section>
    </div>
  )
}
