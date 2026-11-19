import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalGet } from '~/shared/api/generated/operations/subscription-renewals'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { formatDay } from '../../shared/finance-date'
import { formatMoney } from '../../shared/finance-money'
import { useOwnerLabel } from '../hooks/use-owner-label'
import { SubscriptionAdjustmentPanel } from './subscription-adjustment-panel'

function Facts({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return (
    <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3'>
      {rows.map(([label, value]) => (
        <div key={label} className='min-w-0'>
          <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
          <dd className='mt-1 text-sm wrap-break-word text-foreground'>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** One recorded adjustment of a subscription: the period it was for, what was chosen and what the vendor did. */
export function SubscriptionRenewalDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const query = useSubscriptionRenewalGet(id)
  const renewal = query.data?.data?.renewal
  const ownerLabel = useOwnerLabel()
  const day = (value: string | null | undefined) => formatDay(value, i18n.language)
  const yesNo = (value: boolean) => translate(value ? 'yes' : 'no')
  const none = translate('renewals.none')
  const outcome = renewal?.outcomeDetail
  const quantity = renewal?.decision?.quantity ?? renewal?.proposedQuantity ?? null

  return (
    <FinancePage
      title={
        renewal
          ? `${renewal.subscription.applicationName} · ${renewal.subscription.planName}`
          : translate('renewals.title')
      }
      actions={
        <FinanceButton variant='ghost' onClick={onBack}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('renewals.back')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={query}>
        {renewal ? (
          <>
            <FinanceStatGrid columns={4}>
              <FinanceStat
                label={translate('renewals.state')}
                value={
                  <FinanceStatus
                    value={renewal.state === 'OUTCOME_RECORDED' ? 'COMPLETED' : renewal.state}
                    label={translate(`renewals.states.${renewal.state}`, { defaultValue: renewal.state })}
                  />
                }
              />
              <FinanceStat
                label={translate('renewals.choice')}
                value={
                  <span className='font-sans'>
                    {translate(`renewals.choices.${renewal.decision?.choice ?? renewal.proposedChoice}`, {
                      defaultValue: renewal.proposedChoice
                    })}
                  </span>
                }
              />
              <FinanceStat label={translate('renewals.quantity')} value={quantity ?? none} />
              <FinanceStat
                label={translate('renewals.milestone')}
                value={
                  <span className='flex flex-col gap-0.5'>
                    <span>{day(renewal.milestone.baseDate)}</span>
                    <span className='font-sans text-xs font-normal text-muted-foreground'>
                      {translate(`renewals.basis.${renewal.milestone.basis}`, {
                        defaultValue: renewal.milestone.basis
                      })}
                    </span>
                  </span>
                }
              />
            </FinanceStatGrid>
            {renewal.lateFlagged && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('renewals.lateNote')}
              </p>
            )}
            <FinanceSection title={translate('renewals.period')}>
              <Facts
                rows={[
                  [translate('renewals.owner'), ownerLabel(renewal.subscription.ownerDepartmentId)],
                  [translate('renewals.purchased'), renewal.period.purchasedQuantity ?? none],
                  [translate('renewals.inUse'), renewal.period.seatsInUse],
                  [
                    translate('billingCycle'),
                    renewal.period.billingCycle
                      ? translate(`enum.${renewal.period.billingCycle}`, { defaultValue: renewal.period.billingCycle })
                      : none
                  ],
                  [translate('renewals.startDate'), day(renewal.period.startDate)],
                  [translate('renewals.endDate'), day(renewal.period.endDate)],
                  [translate('renewalDate'), day(renewal.period.renewalDate)],
                  [translate('autoRenew'), yesNo(renewal.period.autoRenew)],
                  [translate('renewals.midTermReduction'), yesNo(renewal.period.allowsMidTermReduction)],
                  [translate('renewals.usage'), translate(`renewals.usageStatus.${renewal.usage.status}`)]
                ]}
              />
            </FinanceSection>
            <FinanceSection title={translate('renewals.outcomeTitle')}>
              {outcome ? (
                <Facts
                  rows={[
                    [translate('renewals.outcome'), translate(`renewals.outcomes.${outcome.kind}`)],
                    [translate('renewals.recordedOn'), day(outcome.recordedAt)],
                    [
                      translate('renewals.savings'),
                      outcome.realisedSavings ? formatMoney(outcome.realisedSavings, i18n.language) : none
                    ],
                    [translate('renewals.followUp'), yesNo(outcome.vendorFollowUpOpen)],
                    ...(outcome.note ? ([[translate('renewals.note'), outcome.note]] as const) : [])
                  ]}
                />
              ) : (
                <FinanceEmpty message={translate('renewals.noOutcome')} />
              )}
            </FinanceSection>
            <SubscriptionAdjustmentPanel subscriptionId={renewal.subscription.id} />
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
    </FinancePage>
  )
}
