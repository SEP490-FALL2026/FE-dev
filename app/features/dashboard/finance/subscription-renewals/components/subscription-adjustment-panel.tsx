import { useTranslation } from 'react-i18next'
import { FinanceQueryState, FinanceSection, FinanceStat, FinanceStatGrid } from '../../shared/components/finance-ui'
import { formatDay } from '../../shared/finance-date'
import { errorStatus, useSubscriptionAdjustment } from '../subscription-adjustment-api'

/**
 * The adjustment point of one shared-pool subscription and the seats its next period needs, as the system counts
 * them. Finance reads it; IT Admin records the outcome. A subscription without an adjustment point (not a pool term,
 * missing dates, or a server that does not have the route yet) shows a short note instead of an error.
 */
export function SubscriptionAdjustmentPanel({ subscriptionId }: { subscriptionId: string }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const query = useSubscriptionAdjustment(subscriptionId)
  const status = errorStatus(query.error)
  const day = (value: string | null | undefined) => formatDay(value, i18n.language)
  const title = translate('renewals.adjustment.title')

  if (query.isError && (status === 404 || status === 409)) {
    const code = (query.error as { response?: { data?: { error?: { code?: string } } } }).response?.data?.error?.code
    return (
      <FinanceSection title={title}>
        <p className='rounded-lg border border-border/70 bg-surface-subtle p-4 text-sm text-muted-foreground'>
          {translate(
            code === 'SUBSCRIPTION_RENEWAL.CONTRACT_DATA_INCOMPLETE'
              ? 'renewals.adjustment.incomplete'
              : 'renewals.adjustment.none'
          )}
        </p>
      </FinanceSection>
    )
  }

  const adjustment = query.data?.data?.adjustment
  return (
    <FinanceSection title={title}>
      <FinanceQueryState query={query}>
        {adjustment && (
          <div className='space-y-4'>
            <FinanceStatGrid columns={4}>
              <FinanceStat
                label={translate('renewals.adjustment.deadline')}
                value={
                  <span className='flex flex-col gap-0.5'>
                    <span>{day(adjustment.deadline)}</span>
                    <span className='font-sans text-xs font-normal text-muted-foreground'>
                      {translate(`renewals.adjustment.deadlineKinds.${adjustment.deadlineKind}`)}
                    </span>
                  </span>
                }
              />
              <FinanceStat label={translate('renewals.adjustment.pointOn')} value={day(adjustment.adjustmentPointOn)} />
              <FinanceStat label={translate('renewals.adjustment.renewalOn')} value={day(adjustment.renewalOn)} />
              <FinanceStat
                label={translate('renewals.adjustment.redAlertOn')}
                value={adjustment.redAlertOn ? day(adjustment.redAlertOn) : translate('renewals.none')}
              />
            </FinanceStatGrid>
            <FinanceStatGrid columns={4}>
              <FinanceStat
                label={translate('renewals.purchased')}
                value={adjustment.purchasedQuantity ?? translate('renewals.none')}
              />
              <FinanceStat label={translate('renewals.adjustment.seatsNeeded')} value={adjustment.seatsNeeded.total} />
              <FinanceStat emphasis label={translate('renewals.adjustment.target')} value={adjustment.target} />
              <FinanceStat
                label={translate('renewals.adjustment.suggested')}
                value={
                  <span className='font-sans'>
                    {adjustment.suggestedChoice
                      ? translate(`renewals.choices.${adjustment.suggestedChoice}`)
                      : translate('renewals.adjustment.noSuggestion')}
                  </span>
                }
              />
            </FinanceStatGrid>
            <dl className='grid gap-3 rounded-lg border border-border/70 bg-surface p-4 text-sm sm:grid-cols-2 lg:grid-cols-4'>
              {(
                [
                  ['commitment', translate(`renewals.adjustment.commitments.${adjustment.commitment}`)],
                  ['heldPastRenewal', adjustment.seatsNeeded.heldPastRenewal],
                  ['pendingContinuations', adjustment.seatsNeeded.pendingContinuations],
                  ['approvedAwaitingGrant', adjustment.seatsNeeded.approvedAwaitingGrant],
                  ['vendorMinimum', adjustment.vendorMinimumSeats ?? translate('renewals.none')],
                  ['activeSeatsToday', adjustment.activeSeatsToday],
                  ['openRequests', adjustment.openRequests]
                ] as const
              ).map(([key, value]) => (
                <div key={key} className='min-w-0'>
                  <dt className='text-xs text-muted-foreground'>{translate(`renewals.adjustment.${key}`)}</dt>
                  <dd className='mt-0.5 wrap-break-word'>{value}</dd>
                </div>
              ))}
            </dl>
            {adjustment.recordedRenewalId && (
              <p role='note' className='text-sm text-muted-foreground'>
                {translate('renewals.adjustment.recorded')}
              </p>
            )}
          </div>
        )}
      </FinanceQueryState>
    </FinanceSection>
  )
}
