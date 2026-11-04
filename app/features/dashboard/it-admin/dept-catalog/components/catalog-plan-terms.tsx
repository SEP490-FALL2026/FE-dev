import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlanTermsGet } from '~/shared/api/generated/operations/plan-terms/plan-terms-get'
import {
  usePlanTermOpinionList,
  getPlanTermOpinionListQueryKey
} from '~/shared/api/generated/operations/plan-terms/plan-term-opinion-list'
import { getPlanTermsGetQueryKey } from '~/shared/api/generated/operations/plan-terms/plan-terms-get'
import { usePlanTermOpinionRecord } from '~/shared/api/generated/operations/plan-terms/plan-term-opinion-record'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass, itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { CatalogTermsEditor } from './catalog-terms-editor'

export function CatalogPlanTerms({ planId, onBack }: { planId: string; onBack: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [editing, setEditing] = useState(false)
  const [opinionOpen, setOpinionOpen] = useState(false)
  const [page, setPage] = useState(1)
  const query = usePlanTermsGet(planId)
  const data = query.data?.data
  const opinions = usePlanTermOpinionList(
    planId,
    { page, pageSize: 20 },
    { query: { enabled: data?.applicable === true } }
  )
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold tracking-tight'>{translate('terms.title')}</h1>
        {data?.applicable && (
          <button type='button' className={itPrimaryClass} disabled={query.isFetching} onClick={() => setEditing(true)}>
            {translate('terms.edit')}
          </button>
        )}
      </header>
      <ItQueryState query={query}>
        {!data ? (
          <ItEmpty />
        ) : !data.applicable ? (
          <p className='text-sm text-muted-foreground'>{translate('terms.notApplicable')}</p>
        ) : (
          <>
            <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-5 sm:grid-cols-2'>
              {(
                [
                  'termsUrl',
                  'lastReviewedOn',
                  'aiTraining',
                  'dataLocation',
                  'commercialUse',
                  'cancellationRefund'
                ] as const
              ).map((key) => (
                <div key={key}>
                  <dt className='text-xs text-muted-foreground'>{translate(`terms.${key}`)}</dt>
                  <dd
                    className={`mt-1 break-words text-sm ${key === 'lastReviewedOn' ? 'text-right font-mono tabular-nums' : ''}`}
                  >
                    {data.terms?.[key]
                      ? key === 'lastReviewedOn'
                        ? formatDate(data.terms[key])
                        : data.terms[key]
                      : translate('unknown')}
                  </dd>
                </div>
              ))}
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('terms.maxDevicesPerKey')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                  {data.terms?.installLimit?.maxDevicesPerKey ?? translate('unknown')}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('terms.installNote')}</dt>
                <dd className='mt-1 break-words text-sm'>{data.terms?.installLimit?.note ?? translate('unknown')}</dd>
              </div>
            </dl>
            <section className='space-y-3'>
              <header className='flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-lg font-semibold'>{translate('terms.opinions')}</h2>
                <button type='button' className={itButtonClass} onClick={() => setOpinionOpen(true)}>
                  {translate('terms.recordOpinion')}
                </button>
              </header>
              <ItQueryState query={opinions}>
                {opinions.data?.data?.items.length ? (
                  <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
                    {opinions.data.data.items.map((item) => (
                      <article key={item.id} className='space-y-2 p-4'>
                        <p className='truncate text-sm font-medium' title={item.businessOwner.fullName}>
                          {item.businessOwner.fullName}
                        </p>
                        <p className='whitespace-pre-wrap break-words text-sm'>{item.opinion}</p>
                        <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                          {formatDateTime(item.recordedAt)}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <ItEmpty />
                )}
              </ItQueryState>
              {opinions.data?.data && (
                <ItPagination
                  page={page}
                  total={opinions.data.data.pagination.totalItems}
                  pageSize={20}
                  onChange={setPage}
                />
              )}
            </section>
          </>
        )}
      </ItQueryState>
      {editing && data && <CatalogTermsEditor planId={planId} onClose={() => setEditing(false)} />}
      {opinionOpen && <OpinionDialog planId={planId} onClose={() => setOpinionOpen(false)} />}
    </section>
  )
}

function OpinionDialog({ planId, onClose }: { planId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const [opinion, setOpinion] = useState('')
  const [uncertain, setUncertain] = useState(false)
  const feedback = useItMutationFeedback(
    [getPlanTermOpinionListQueryKey(planId), getPlanTermsGetQueryKey(planId)],
    onClose
  )
  const mutation = usePlanTermOpinionRecord({
    mutation: {
      ...feedback,
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('terms.recordOpinion')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={translate('terms.saveOpinion')}
      submitDisabled={!opinion.trim() || uncertain}
      onSubmit={(event) => {
        event.preventDefault()
        if (opinion.trim() && !mutation.isPending && !uncertain)
          mutation.mutate({ id: planId, data: { opinion: opinion.trim() } })
      }}
    >
      <ItField label={translate('terms.opinion')} hint={translate('terms.opinionHint')}>
        <textarea
          required
          maxLength={10000}
          value={opinion}
          onChange={(event) => setOpinion(event.target.value)}
          placeholder={translate('terms.opinionPlaceholder')}
          className={itInputClass}
        />
      </ItField>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('terms.uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
