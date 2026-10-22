import { BarChart3, BellRing, CalendarClock, ChevronRight, Landmark, ShieldQuestion, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { actionsNeedingApproval, proposalTotals } from '../../finance/annual-budget-data'
import { useAnnualBudgetState } from '../../finance/annual-budget-store'
import { approvalQueue, approverAlerts, renewalDetails } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge, getSlaHoursLeft, tabForKind } from './approval-queue-view'

interface ApprovalsOverviewViewProps {
  displayName: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

/**
 * The approver's home: one row of what waits for a decision (each tile opens its screen), then the most urgent
 * items and the alerts. Spend and savings figures live on the Reports screen.
 */
export function ApprovalsOverviewView({ displayName, formatCurrency, onSelectTab }: ApprovalsOverviewViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatDate } = useDashboardFormat()
  const { adjustments, exceptions, proposals } = useAnnualBudgetState()

  const overdue = approvalQueue.filter((item) => getSlaHoursLeft(item) < 0)
  const sentBudgets = proposals.filter((proposal) => proposal.stage === 'SENT')
  const pendingExceptions = exceptions.filter(
    (item) => item.resolution && actionsNeedingApproval.includes(item.resolution.action) && !item.approval
  ).length
  const pendingAdjustments = adjustments.filter((item) => !item.approval).length
  const nearestDeadline = [...renewalDetails].sort((a, b) =>
    a.cancellationDeadline.localeCompare(b.cancellationDeadline)
  )[0]
  const mostUrgent = [...approvalQueue].sort((a, b) => a.slaDueAt.localeCompare(b.slaDueAt)).slice(0, 4)

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={secondaryButtonClassName} onClick={() => onSelectTab('reports')} type='button'>
            <BarChart3 aria-hidden='true' className='size-3.5' />
            {t('budgetPlan.approverSpend.overview.toReports')}
          </button>
        }
        subtitle={t('approvals.overview.subtitle')}
        title={t('approvals.overview.title', { name: displayName })}
      />

      <section
        aria-label={t('budgetPlan.approverSpend.overview.region')}
        className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
      >
        <StatTile
          hint={t('budgetPlan.approverSpend.overview.spendPendingHint', { count: overdue.length })}
          icon={Wallet}
          label={t('budgetPlan.approverSpend.overview.spendPending')}
          onClick={() => onSelectTab('queue')}
          tone={overdue.length > 0 ? 'danger' : 'primary'}
          value={String(approvalQueue.length)}
        />
        <StatTile
          hint={t('budgetPlan.approverSpend.overview.annualPendingHint', {
            amount: formatCompactCurrency(sentBudgets.reduce((sum, item) => sum + proposalTotals(item).total, 0))
          })}
          icon={Landmark}
          label={t('budgetPlan.approverSpend.overview.annualPending')}
          onClick={() => onSelectTab('annual-budget')}
          tone='info'
          value={String(sentBudgets.length)}
        />
        <StatTile
          hint={t('budgetPlan.approverSpend.overview.exceptionsHint', {
            adjustments: pendingAdjustments,
            exceptions: pendingExceptions
          })}
          icon={ShieldQuestion}
          label={t('budgetPlan.approverSpend.overview.exceptions')}
          onClick={() => onSelectTab('exception-approval')}
          tone='warning'
          value={String(pendingExceptions + pendingAdjustments)}
        />
        <StatTile
          hint={approvalQueue.find((item) => item.id === nearestDeadline.id)?.software ?? nearestDeadline.vendor}
          icon={CalendarClock}
          label={t('budgetPlan.approverSpend.overview.deadline')}
          onClick={() => onSelectTab('renewal', { id: nearestDeadline.id })}
          tone='neutral'
          value={formatDate(nearestDeadline.cancellationDeadline)}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle hint={t('approvals.overview.urgentHint')} title={t('approvals.overview.urgentTitle')} />
          <ul className='mt-3 divide-y divide-border'>
            {mostUrgent.map((item) => (
              <li key={item.id}>
                <button
                  aria-label={t('approvals.queue.openItem', { reference: item.reference })}
                  className='-mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-surface-subtle/70'
                  onClick={() => onSelectTab(tabForKind(item.kind), { id: item.id })}
                  type='button'
                >
                  <span className='min-w-0'>
                    <span className='block text-[0.7rem] font-bold text-muted-foreground'>
                      {t(`approvals.kind.${item.kind}`)} · <span className='font-mono'>{item.reference}</span>
                    </span>
                    <span className='block truncate text-sm font-bold'>{item.software}</span>
                    <span className='block text-xs text-muted-foreground'>{formatCurrency(item.amount)}</span>
                  </span>
                  <span className='flex shrink-0 items-center gap-2'>
                    <SlaBadge item={item} />
                    <ChevronRight aria-hidden='true' className='size-4 text-muted-foreground' />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelTitle title={t('approvals.overview.alertsTitle')} />
          <ul className='mt-4 space-y-3'>
            {approverAlerts.map((alert) => (
              <li className='flex items-start gap-3' key={alert.key}>
                <span className='mt-0.5'>
                  <Pill tone={alert.tone}>
                    <BellRing aria-hidden='true' className='size-3' />
                  </Pill>
                </span>
                <div className='min-w-0 text-xs'>
                  <p className='font-bold text-foreground'>{t(`approvals.alerts.${alert.key}`)}</p>
                  <p className='text-muted-foreground'>{alert.reference}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
