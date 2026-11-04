import { useTranslation } from 'react-i18next'
import type { useEmployeeCatalogSelection } from '../hooks/use-employee-catalog-selection'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'

export function EmployeeCatalogPlanDetails({
  selection,
  allowDraft = true
}: {
  selection: ReturnType<typeof useEmployeeCatalogSelection>
  allowDraft?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { details, plan, query } = selection
  if (!plan) return null
  return (
    <section aria-label={translate('requestExtras.plan.title')} className='space-y-3 border-b border-border/60 pb-5'>
      <EmployeeQueryState query={query} empty={!details} emptyTitle={translate('catalog.noDetails')} />
      {details && (
        <>
          <dl className='grid gap-4 text-sm sm:grid-cols-3'>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('catalog.vendor')}</dt>
              <dd className='mt-1 truncate' title={details.vendorName ?? undefined}>
                {details.vendorName ?? translate('noValue')}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('requestExtras.plan.sharing')}</dt>
              <dd className='mt-1'>
                {details.sharingPolicy
                  ? translate(`requestExtras.plan.sharingValues.${details.sharingPolicy}`, {
                      defaultValue: translate('unknownStatus')
                    })
                  : translate('noValue')}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('requestExtras.plan.dataLoss')}</dt>
              <dd className='mt-1'>
                {translate(details.dataLossOnRemoval ? 'requestExtras.plan.yes' : 'requestExtras.plan.no')}
              </dd>
            </div>
          </dl>
          <p className='text-xs text-muted-foreground'>{translate('requestExtras.plan.sharingHint')}</p>
          {!details.canSubmit && plan.canSubmit && (
            <p className='text-sm text-warning-ink'>
              {translate(allowDraft ? 'catalog.draftOnly' : 'requestExtras.serviceAccount.blocked')}
            </p>
          )}
        </>
      )}
    </section>
  )
}
