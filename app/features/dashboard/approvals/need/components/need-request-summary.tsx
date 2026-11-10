import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'

export function NeedRequestSummary({ request }: { request: AccessRequestResponseDtoDataRequest }) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const { formatDate, formatNumber } = useDashboardFormat()
  const softwareName = request.plan?.applicationName ?? request.proposal?.softwareName ?? translate('unknown')
  const waitingReason = request.needStep.waitingReason
  const facts = [
    { label: translate('requester'), value: request.requester.fullName },
    { label: translate('beneficiary'), value: request.beneficiary?.fullName ?? translate('unknown') },
    { label: translate('department'), value: request.department.name }
  ]
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='max-w-full min-w-0 truncate text-lg font-semibold' title={softwareName}>
          {softwareName}
        </h2>
        <ApprovalsStatus value={request.needStep.state} />
      </div>
      {waitingReason && (
        <p
          role='status'
          className='flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-ink'
        >
          <Clock aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          {translate(`waitingReason.${waitingReason}`, { defaultValue: translate('waitingReason.unknown') })}
        </p>
      )}
      <ApprovalsStatGrid>
        <ApprovalsStat
          label={translate('cost')}
          value={request.pricing.amount ? formatMoney(request.pricing.amount, i18n.language) : translate('unknown')}
          emphasis
        />
        <ApprovalsStat
          label={translate('term')}
          value={request.termMonths === null ? '?' : formatNumber(request.termMonths)}
        />
        <ApprovalsStat
          label={translate('assignedAt')}
          value={request.needStep.assignedAt ? formatDate(request.needStep.assignedAt) : translate('unknown')}
        />
      </ApprovalsStatGrid>
      <ApprovalsSection title={translate('requestInfo')}>
        <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
          {facts.map((fact) => (
            <div key={fact.label} className='min-w-0'>
              <dt className='text-xs text-muted-foreground'>{fact.label}</dt>
              <dd title={fact.value} className='mt-1 truncate text-sm'>
                {fact.value}
              </dd>
            </div>
          ))}
          <div className='min-w-0 sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>{translate('businessReason')}</dt>
            <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</dd>
          </div>
        </dl>
      </ApprovalsSection>
      {request.needDecision && (
        <ApprovalsSection title={translate('currentDecision')}>
          <div className='space-y-2 rounded-lg border border-border/70 bg-surface p-4'>
            <ApprovalsStatus value={request.needDecision.decision} />
            {request.needDecision.reason && (
              <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.needDecision.reason}</p>
            )}
          </div>
        </ApprovalsSection>
      )}
    </div>
  )
}
