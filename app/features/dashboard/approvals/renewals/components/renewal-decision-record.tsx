import { useTranslation } from 'react-i18next'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { formatMoney } from '../../shared/approvals-money'
import { ApprovalsSection } from '../../shared/components/approvals-ui'
import { RENEWAL_STATE } from '../enums/renewal-state'
import { SNAPSHOT_SOURCE } from '../enums/snapshot-source'
import { RenewalFacts, RenewalText, type RenewalFact } from './renewal-facts'

type Renewal = SubscriptionRenewalResponseDtoDataRenewal
type Decision = NonNullable<Renewal['decision']>

function SnapshotFacts({ snapshot }: { snapshot: Decision['snapshot'] }) {
  const { t: translate, i18n } = useTranslation('approvalsRenewal')
  const { formatDate } = useWorkspaceFormat()
  if (!snapshot || snapshot.source === SNAPSHOT_SOURCE.NOT_CONNECTED)
    return <p className='text-sm text-muted-foreground'>{translate('notProvided')}</p>
  const { financial } = snapshot
  const money = (amount: string | null) =>
    amount !== null && financial.currency
      ? formatMoney({ amount, currency: financial.currency }, i18n.language)
      : translate('notProvided')
  const figures: [string, string | null][] = [
    ['budget', financial.budget],
    ['spent', financial.spent],
    ['committed', financial.committed],
    ['remaining', financial.remaining],
    ['pendingRequests', financial.pendingRequests],
    ['periodCost', financial.periodEffectiveCost],
    ['periodTax', financial.periodDeductibleTax]
  ]
  return (
    <div className='space-y-2'>
      <RenewalFacts
        facts={[
          {
            key: 'status',
            label: translate('record.financialStatus'),
            value: translate(`values.financialStatus.${financial.status}`, { defaultValue: translate('unknown') })
          },
          {
            key: 'year',
            label: translate('record.fiscalYear'),
            value: financial.fiscalYear === null ? translate('notProvided') : String(financial.fiscalYear),
            numeric: true
          },
          ...figures.map(([key, amount]) => ({
            key,
            label: translate(`record.${key}` as 'record.budget'),
            value: money(amount),
            numeric: true
          }))
        ]}
      />
      <p className='text-right text-xs text-muted-foreground'>
        {translate('record.asOf', { date: formatDate(financial.asOf) })}
      </p>
    </div>
  )
}

/** Read-only view of a decision already taken and, once recorded, the vendor outcome. */
export function RenewalDecisionRecord({ renewal }: { renewal: Renewal }) {
  const { t: translate, i18n } = useTranslation('approvalsRenewal')
  const { formatDateTime, formatNumber } = useWorkspaceFormat()
  const { decision, outcomeDetail } = renewal
  if (!decision) return null
  const facts: RenewalFact[] = [
    {
      key: 'choice',
      label: translate('record.choice'),
      value: translate(`values.choice.${decision.choice}`, { defaultValue: translate('unknown') })
    },
    {
      key: 'executionPoint',
      label: translate('record.executionPoint'),
      value: translate(`values.executionPoint.${decision.executionPoint}`, { defaultValue: translate('unknown') })
    },
    {
      key: 'decidedAt',
      label: translate('record.decidedAt'),
      value: formatDateTime(decision.decidedAt),
      numeric: true
    },
    {
      key: 'role',
      label: translate('record.deciderRole'),
      value: translate(`values.deciderRole.${decision.deciderRole}`, { defaultValue: translate('unknown') })
    },
    {
      key: 'seatsAtDecision',
      label: translate('record.seatsAtDecision'),
      value: formatNumber(decision.seatsInUseAtDecision),
      numeric: true
    },
    {
      key: 'released',
      label: translate('record.releasedSeats'),
      value: formatNumber(decision.releasedSeatCount),
      numeric: true
    }
  ]
  if (decision.quantity !== null)
    facts.splice(1, 0, {
      key: 'quantity',
      label: translate('record.quantity'),
      value: formatNumber(decision.quantity),
      numeric: true
    })

  return (
    <>
      <ApprovalsSection title={translate('record.title')}>
        <RenewalFacts facts={facts} />
        {decision.decidedAfterDeadline && (
          <p className='text-sm text-warning-ink'>{translate('record.afterDeadline')}</p>
        )}
        {renewal.lateFlaggedAt && (
          <p className='text-sm font-medium text-danger'>
            {translate('record.lateFlaggedAt', { time: formatDateTime(renewal.lateFlaggedAt) })}
          </p>
        )}
        {decision.reason && <RenewalText label={translate('record.reason')} text={decision.reason} />}
        {renewal.state === RENEWAL_STATE.DECIDED && (
          <p className='text-sm text-muted-foreground'>{translate('record.awaitingOutcome')}</p>
        )}
      </ApprovalsSection>

      <ApprovalsSection title={translate('record.snapshot')}>
        <SnapshotFacts snapshot={decision.snapshot} />
      </ApprovalsSection>

      {outcomeDetail && (
        <ApprovalsSection title={translate('outcome.title')}>
          <RenewalFacts
            facts={[
              {
                key: 'kind',
                label: translate('outcome.kind'),
                value: translate(`values.outcome.${outcomeDetail.kind}`, { defaultValue: translate('unknown') })
              },
              {
                key: 'recordedAt',
                label: translate('outcome.recordedAt'),
                value: formatDateTime(outcomeDetail.recordedAt),
                numeric: true
              },
              ...(outcomeDetail.realisedSavings
                ? [
                    {
                      key: 'savings',
                      label: translate('outcome.savings'),
                      value: formatMoney(outcomeDetail.realisedSavings, i18n.language),
                      numeric: true
                    }
                  ]
                : [])
            ]}
          />
          {outcomeDetail.vendorFollowUpOpen && (
            <p className='text-sm text-warning-ink'>{translate('outcome.followUp')}</p>
          )}
          {outcomeDetail.nextSubscriptionId && (
            <p className='text-sm text-muted-foreground'>{translate('outcome.nextPeriod')}</p>
          )}
          {outcomeDetail.note && <RenewalText label={translate('outcome.note')} text={outcomeDetail.note} />}
        </ApprovalsSection>
      )}
    </>
  )
}
