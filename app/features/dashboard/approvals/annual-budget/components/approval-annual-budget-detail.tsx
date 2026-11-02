import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionGet } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { formatMoney } from '../../shared/approvals-money'
import { versionState } from '../enums/version-state'
import type { ApprovalBudgetViewProps } from '../budget-view-props'
import { ApprovalAnnualBudgetDecision } from './approval-annual-budget-decision'
import { ApprovalAnnualBudgetLines } from './approval-annual-budget-lines'
import { ApprovalAnnualBudgetHistory } from './approval-annual-budget-history'

export function ApprovalAnnualBudgetDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const query = useBudgetVersionGet(itemId)
  const identity = useMeGet()
  const version = query.data?.data?.version
  const quarters = version?.quarters
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const employeeId = identity.data?.data?.employee.id
  const isSpendingApprover = identity.data?.data?.roles.effective.includes('SPENDING_APPROVER') === true
  const ownVersion = !!employeeId && employeeId === version?.createdBy?.employeeId
  const canDecide =
    version?.state === versionState.SENT &&
    isSpendingApprover &&
    !!employeeId &&
    !ownVersion &&
    !identity.isError &&
    !identity.isFetching &&
    !query.isError &&
    !query.isFetching
  return (
    <ApprovalsPage
      title={translate('title')}
      actions={<ApprovalsButton onClick={() => onSelectTab('annual-budget')}>{translate('back')}</ApprovalsButton>}
    >
      <ApprovalsQueryState query={query}>
        {version ? (
          <>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='min-w-0'>
                <h2 className='truncate text-xl font-semibold' title={version.costCenter.name}>
                  {version.costCenter.name}
                </h2>
                <p className='font-mono text-sm tabular-nums'>{version.costCenter.code}</p>
              </div>
              <ApprovalsStatus value={version.state} />
            </div>
            <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3'>
              {(['base', 'reserve', 'total'] as const).map((field) => (
                <div key={field}>
                  <dt className='text-sm text-muted-foreground'>{translate(field)}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>
                    {formatMoney(version[field], i18n.language)}
                  </dd>
                </div>
              ))}
              {(['year', 'number', 'highValuePercent'] as const).map((field) => (
                <div key={field}>
                  <dt className='text-sm text-muted-foreground'>{translate(field)}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>{version[field]}</dd>
                </div>
              ))}
              {version.highValueAmount && (
                <div>
                  <dt className='text-sm text-muted-foreground'>{translate('highValueAmount')}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>
                    {formatMoney(version.highValueAmount, i18n.language)}
                  </dd>
                </div>
              )}
              {version.previousTotal && (
                <div>
                  <dt className='text-sm text-muted-foreground'>{translate('previousTotal')}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>
                    {formatMoney(version.previousTotal, i18n.language)}
                  </dd>
                </div>
              )}
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('createdBy')}</dt>
                <dd className='mt-1 truncate' title={version.createdBy?.fullName}>
                  {version.createdBy?.fullName ?? translate('unavailable')}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('sentAt')}</dt>
                <dd className='mt-1 text-right font-mono tabular-nums'>
                  {version.sentAt ? formatDate(version.sentAt) : translate('unavailable')}
                </dd>
              </div>
            </dl>
            {quarters && (
              <dl className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter) => (
                  <div key={quarter}>
                    <dt className='text-sm text-muted-foreground'>{translate(quarter)}</dt>
                    <dd className='text-right font-mono tabular-nums'>
                      {formatMoney(quarters[quarter], i18n.language)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {version.reason && (
              <p className='break-words text-sm'>
                {translate('reason')}: {version.reason}
              </p>
            )}
            {version.decision && (
              <dl className='grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2'>
                <div>
                  <dt className='text-sm text-muted-foreground'>{translate('decision')}</dt>
                  <dd>
                    {translate(`status.${version.decision.decision}`, { defaultValue: translate('unavailable') })}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm text-muted-foreground'>{translate('decisionAt')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatDate(version.decision.at)}</dd>
                </div>
                <div>
                  <dt className='text-sm text-muted-foreground'>{translate('decisionBy')}</dt>
                  <dd className='truncate' title={version.decision.by?.fullName}>
                    {version.decision.by?.fullName ?? translate('unavailable')}
                  </dd>
                </div>
                {version.decision.reason && (
                  <div>
                    <dt className='text-sm text-muted-foreground'>{translate('reason')}</dt>
                    <dd className='break-words'>{version.decision.reason}</dd>
                  </div>
                )}
              </dl>
            )}
            {ownVersion && <p className='text-sm text-muted-foreground'>{translate('ownVersion')}</p>}
            <div className='flex flex-wrap gap-2'>
              <ApprovalsQueryState query={identity}>
                {canDecide && (
                  <ApprovalsButton variant='primary' onClick={() => setDecisionOpen(true)}>
                    {translate('reviewDecision')}
                  </ApprovalsButton>
                )}
              </ApprovalsQueryState>
              <ApprovalsButton aria-expanded={historyOpen} onClick={() => setHistoryOpen(!historyOpen)}>
                {translate('history')}
              </ApprovalsButton>
              {version.proposalId && (
                <ApprovalsButton onClick={() => onSelectTab('annual-budget', { id: `proposal:${version.proposalId}` })}>
                  {translate('relatedProposal')}
                </ApprovalsButton>
              )}
            </div>
            <ApprovalAnnualBudgetLines itemId={itemId} />
            {historyOpen && <ApprovalAnnualBudgetHistory itemId={itemId} />}
          </>
        ) : (
          <ApprovalsEmpty />
        )}
      </ApprovalsQueryState>
      {decisionOpen && (
        <ApprovalAnnualBudgetDecision itemId={itemId} disabled={!canDecide} onClose={() => setDecisionOpen(false)} />
      )}
    </ApprovalsPage>
  )
}
