import { useTranslation } from 'react-i18next'

import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { RequestFilters } from './components/request-filters'
import { RequestPagination } from './components/request-pagination'
import { RequestSummary } from './components/request-summary'
import { RequestTable } from './components/request-table'
import { useRequestFilters } from './hooks/use-request-filters'

export function TeamRequestsPage() {
  const { t } = useTranslation()
  const state = useRequestFilters()
  useDocumentTitle(t('teamRequests.documentTitle'))
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold'>{t('teamRequests.title')}</h1>
        <p className='mt-1 text-sm text-neutral-500'>{t('teamRequests.subtitle')}</p>
        <p className='mt-3 text-xs leading-relaxed text-neutral-500'>{t('teamRequests.sample')}</p>
      </div>
      <RequestSummary filters={state.filters} update={state.update} />
      <section className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm'>
        <RequestFilters {...state} />
        <RequestTable {...state} />
        <RequestPagination {...state} />
      </section>
    </div>
  )
}
