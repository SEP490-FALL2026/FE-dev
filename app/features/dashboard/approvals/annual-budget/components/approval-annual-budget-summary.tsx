import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'

export function ApprovalBudgetWaitingNotice({ reason }: { reason: string | null }) {
  const { t: translate } = useTranslation('approvalsBudget')
  if (!reason) return null
  return (
    <p
      role='status'
      className='flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-ink'
    >
      <Clock aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
      <span>{translate(`waitingReason.${reason}`, { defaultValue: translate('waitingReason.unknown') })}</span>
    </p>
  )
}

function Fact({ label, value, numeric = false }: { label: string; value: string; numeric?: boolean }) {
  return (
    <div className='min-w-0'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd
        className={`mt-1 truncate text-sm ${numeric ? 'text-right font-mono tabular-nums sm:text-left' : ''}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  )
}

export function ApprovalAnnualBudgetSummary({ version }: { version: VersionResponseDtoDataVersion }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('unavailable')
  const quarters = version.quarters
  return (
    <>
      <ApprovalsStatGrid>
        <ApprovalsStat label={translate('total')} value={money(version.total)} emphasis />
        <ApprovalsStat label={translate('base')} value={money(version.base)} />
        <ApprovalsStat label={translate('reserve')} value={money(version.reserve)} />
        <ApprovalsStat label={translate('previousTotal')} value={money(version.previousTotal)} />
        <ApprovalsStat label={translate('highValueAmount')} value={money(version.highValueAmount)} />
        <ApprovalsStat label={translate('highValuePercent')} value={`${version.highValuePercent}%`} />
      </ApprovalsStatGrid>
      <ApprovalsSection title={translate('versionInfo')}>
        <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Fact label={translate('year')} value={String(version.year)} numeric />
          <Fact label={translate('number')} value={String(version.number)} numeric />
          <Fact
            label={translate('kindLabel')}
            value={translate(`kind.${version.kind}`, { defaultValue: translate('unavailable') })}
          />
          <Fact label={translate('createdBy')} value={version.createdBy?.fullName ?? translate('unavailable')} />
          <Fact label={translate('createdAt')} value={formatDate(version.createdAt)} numeric />
          <Fact
            label={translate('sentAt')}
            value={version.sentAt ? formatDate(version.sentAt) : translate('unavailable')}
            numeric
          />
          {version.reason && (
            <div className='min-w-0 sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('reason')}</dt>
              <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{version.reason}</dd>
            </div>
          )}
        </dl>
      </ApprovalsSection>
      {quarters && (
        <ApprovalsSection title={translate('quarters')}>
          <dl className='grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4'>
            {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter) => (
              <ApprovalsStat key={quarter} label={translate(quarter)} value={money(quarters[quarter])} />
            ))}
          </dl>
        </ApprovalsSection>
      )}
      {version.decision && (
        <ApprovalsSection title={translate('recordedDecision')}>
          <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-3'>
            <div className='min-w-0'>
              <dt className='text-xs text-muted-foreground'>{translate('decision')}</dt>
              <dd className='mt-1'>
                <ApprovalsStatus value={version.decision.decision} />
              </dd>
            </div>
            <Fact label={translate('decisionBy')} value={version.decision.by?.fullName ?? translate('unavailable')} />
            <Fact label={translate('decisionAt')} value={formatDateTime(version.decision.at)} numeric />
            {version.decision.reason && (
              <div className='min-w-0 sm:col-span-3'>
                <dt className='text-xs text-muted-foreground'>{translate('reason')}</dt>
                <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{version.decision.reason}</dd>
              </div>
            )}
          </dl>
        </ApprovalsSection>
      )}
    </>
  )
}
