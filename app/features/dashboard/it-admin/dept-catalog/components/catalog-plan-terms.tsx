import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlanTermsGet } from '~/shared/api/generated/operations/plan-terms/plan-terms-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { CatalogTermsEditor } from './catalog-terms-editor'

export function CatalogPlanTerms({ planId, onBack }: { planId: string; onBack: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [editing, setEditing] = useState(false)
  const query = usePlanTermsGet(planId)
  const data = query.data?.data
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
          </>
        )}
      </ItQueryState>
      {editing && data && <CatalogTermsEditor planId={planId} onClose={() => setEditing(false)} />}
    </section>
  )
}
