import { AlertTriangle, Clock, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import { useBudgetProposalGet } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
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

function Notice({ tone, children }: { tone: 'danger' | 'info'; children: string }) {
  const Icon = tone === 'danger' ? AlertTriangle : Info
  const classes =
    tone === 'danger'
      ? 'border-danger/30 bg-danger/10 text-danger-ink'
      : 'border-border bg-surface-subtle text-foreground'
  return (
    <p role='status' className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${classes}`}>
      <Icon aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
      <span>{children}</span>
    </p>
  )
}

/** The department's own request next to the version Finance built from it: the approver weighs the two. */
function ProposalComparison({ proposalId, base }: { proposalId: string; base: { amount: string; currency: string } }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const query = useBudgetProposalGet(proposalId)
  const requested = query.data?.data?.proposal.requestedAmount
  if (!requested) return null
  const difference = Number(base.amount) - Number(requested.amount)
  return (
    <ApprovalsSection title={translate('comparisonTitle')}>
      <ApprovalsStatGrid>
        <ApprovalsStat label={translate('requestedAmount')} value={formatMoney(requested, i18n.language)} />
        <ApprovalsStat label={translate('base')} value={formatMoney(base, i18n.language)} />
        <ApprovalsStat
          label={translate('baseVsRequested')}
          value={
            difference === 0
              ? translate('sameAsRequested')
              : formatMoney({ amount: String(difference), currency: base.currency }, i18n.language)
          }
        />
      </ApprovalsStatGrid>
    </ApprovalsSection>
  )
}

export function ApprovalAnnualBudgetSummary({ version }: { version: VersionResponseDtoDataVersion }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('unavailable')
  const none = translate('unavailable')
  return (
    <>
      {version.belowCarriedOver && (
        <Notice tone='danger'>
          {translate('belowCarriedOverNotice', { shortfall: money(version.carriedOverShortfall) })}
        </Notice>
      )}
      {version.noProposalSubmitted && <Notice tone='info'>{translate('noProposalNotice')}</Notice>}
      {version.detachedAt && <Notice tone='info'>{translate('detachedNotice')}</Notice>}
      {version.neverCurrent && <Notice tone='info'>{translate('neverCurrentNotice')}</Notice>}
      <ApprovalsStatGrid>
        <ApprovalsStat label={translate('total')} value={money(version.total)} emphasis />
        <ApprovalsStat label={translate('base')} value={money(version.base)} />
        <ApprovalsStat label={translate('reserve')} value={money(version.reserve)} />
        <ApprovalsStat label={translate('carriedOverNextYear')} value={money(version.carriedOverNextYear)} />
        {version.reservePercent !== null && (
          <ApprovalsStat label={translate('reservePercent')} value={`${version.reservePercent} %`} />
        )}
        {version.defaultReserve && (
          <ApprovalsStat label={translate('defaultReserve')} value={money(version.defaultReserve)} />
        )}
      </ApprovalsStatGrid>
      {version.proposalId && <ProposalComparison proposalId={version.proposalId} base={version.base} />}
      <ApprovalsSection title={translate('versionInfo')}>
        <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Fact label={translate('year')} value={String(version.year)} numeric />
          <Fact label={translate('number')} value={String(version.number)} numeric />
          <Fact label={translate('kindLabel')} value={translate(`origin.${version.origin}`, { defaultValue: none })} />
          <Fact label={translate('createdBy')} value={version.createdBy?.fullName ?? none} />
          <Fact label={translate('createdAt')} value={formatDate(version.createdAt)} numeric />
          <Fact label={translate('sentAt')} value={version.sentAt ? formatDate(version.sentAt) : none} numeric />
          {version.expiredAt && <Fact label={translate('expiredAt')} value={formatDate(version.expiredAt)} numeric />}
          {version.baseReason && (
            <div className='min-w-0 sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('baseReason')}</dt>
              <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{version.baseReason}</dd>
            </div>
          )}
          {version.reserveReason && (
            <div className='min-w-0 sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('reserveReason')}</dt>
              <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{version.reserveReason}</dd>
            </div>
          )}
        </dl>
      </ApprovalsSection>
      {version.decision && (
        <ApprovalsSection title={translate('recordedDecision')}>
          <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-3'>
            <div className='min-w-0'>
              <dt className='text-xs text-muted-foreground'>{translate('decision')}</dt>
              <dd className='mt-1'>
                <ApprovalsStatus value={version.decision.decision} />
              </dd>
            </div>
            <Fact label={translate('decisionBy')} value={version.decision.by?.fullName ?? none} />
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
