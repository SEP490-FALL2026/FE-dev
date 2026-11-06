import { useTranslation } from 'react-i18next'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { RENEWAL_CHOICE } from '../enums/renewal-choice'
import { USAGE_STATUS } from '../enums/usage-status'
import { WAITING_REASON } from '../enums/waiting-reason'
import { RenewalFacts, RenewalText } from './renewal-facts'

type Renewal = SubscriptionRenewalResponseDtoDataRenewal

export function RenewalOverview({ renewal }: { renewal: Renewal }) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const { formatDate, formatDateTime, formatNumber } = useWorkspaceFormat()
  const { period, proposal, milestone } = renewal
  const date = (value: string | null) => (value ? formatDate(value) : translate('notProvided'))
  const yesNo = (value: boolean) => translate(value ? 'yes' : 'no')
  const proposalLabel =
    proposal.choice === RENEWAL_CHOICE.REDUCE && proposal.quantity !== null
      ? `${translate(`values.choice.${proposal.choice}`)} · ${translate('seats', { value: formatNumber(proposal.quantity) })}`
      : translate(`values.choice.${proposal.choice}`, { defaultValue: translate('unknown') })

  return (
    <>
      <div className='flex flex-wrap items-center gap-3 text-sm'>
        <ApprovalsStatus value={renewal.state} />
        {renewal.lateFlagged && <span className='font-medium text-danger'>{translate('lateBadge')}</span>}
        {renewal.waitingReason === WAITING_REASON.NO_HEAD && (
          <span className='text-muted-foreground'>{translate('waitingNoApprover')}</span>
        )}
      </div>

      <ApprovalsStatGrid>
        <ApprovalsStat
          label={translate('stats.purchased')}
          value={period.purchasedQuantity === null ? translate('unknown') : formatNumber(period.purchasedQuantity)}
        />
        <ApprovalsStat label={translate('stats.inUse')} value={formatNumber(period.seatsInUse)} />
        <ApprovalsStat label={translate('stats.milestone')} value={formatDate(milestone.baseDate)} emphasis />
      </ApprovalsStatGrid>

      <ApprovalsSection title={translate('period.title')}>
        <RenewalFacts
          facts={[
            {
              key: 'basis',
              label: translate('period.basis'),
              value: translate(`values.basis.${milestone.basis}`, { defaultValue: translate('unknown') })
            },
            { key: 'start', label: translate('period.startDate'), value: date(period.startDate), numeric: true },
            { key: 'end', label: translate('period.endDate'), value: date(period.endDate), numeric: true },
            { key: 'renewal', label: translate('period.renewalDate'), value: date(period.renewalDate), numeric: true },
            {
              key: 'cycle',
              label: translate('period.billingCycle'),
              value: period.billingCycle ?? translate('notProvided')
            },
            { key: 'auto', label: translate('period.autoRenew'), value: yesNo(period.autoRenew) },
            { key: 'midTerm', label: translate('period.midTerm'), value: yesNo(period.allowsMidTermReduction) }
          ]}
        />
      </ApprovalsSection>

      <ApprovalsSection title={translate('usage.title')}>
        <div className='space-y-1 rounded-lg border border-border/70 bg-surface p-4 text-sm'>
          <p className={renewal.usage.status === USAGE_STATUS.NOT_AVAILABLE ? 'font-medium text-warning-ink' : ''}>
            {translate(`usage.${renewal.usage.status}`, { defaultValue: translate('unknown') })}
          </p>
          <p className='text-xs text-muted-foreground'>{translate('usage.seatsHint')}</p>
        </div>
      </ApprovalsSection>

      <ApprovalsSection title={translate('proposal.title')}>
        <RenewalFacts
          facts={[
            { key: 'choice', label: translate('proposal.choice'), value: proposalLabel },
            {
              key: 'proposedAt',
              label: translate('proposal.proposedAt'),
              value: formatDateTime(proposal.proposedAt),
              numeric: true
            }
          ]}
        />
        {proposal.note && <RenewalText label={translate('proposal.note')} text={proposal.note} />}
        {proposal.businessOwnerOpinion && (
          <RenewalText
            label={translate('proposal.opinion')}
            hint={translate('proposal.opinionHint')}
            text={proposal.businessOwnerOpinion}
          />
        )}
      </ApprovalsSection>
    </>
  )
}
