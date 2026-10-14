import { BellRing, ChevronRight, CircleDollarSign, FileWarning, RefreshCw, Sparkles, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, PanelTitle, Pill, StatTile, useDashboardFormat } from '../../dashboard-ui'
import { approvalQueue, approverAlerts, approverReport, renewalDetails } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge, getSlaHoursLeft, tabForKind } from './approval-queue-view'

interface ApprovalsOverviewViewProps {
  displayName: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalsOverviewView({ displayName, formatCurrency, onSelectTab }: ApprovalsOverviewViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatDate } = useDashboardFormat()

  const requests = approvalQueue.filter((item) => item.kind === 'SPEND_STEP' || item.kind === 'NEED_STEP')
  const renewals = approvalQueue.filter((item) => item.kind === 'RENEWAL')
  const charges = approvalQueue.filter((item) => item.kind === 'CHARGE' || item.kind === 'FINDING')
  const overdue = approvalQueue.filter((item) => getSlaHoursLeft(item) < 0)
  const nearestDeadline = [...renewalDetails].sort((a, b) =>
    a.cancellationDeadline.localeCompare(b.cancellationDeadline)
  )[0]
  const mostUrgent = [...approvalQueue].sort((a, b) => a.slaDueAt.localeCompare(b.slaDueAt)).slice(0, 4)

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('approvals.overview.subtitle')}
        title={t('approvals.overview.title', { name: displayName })}
      />

      <div className='grid gap-4 xl:grid-cols-2'>
        <section aria-label={t('approvals.overview.workRegion')} className='grid gap-4 sm:grid-cols-3'>
          <StatTile
            hint={t('approvals.overview.overdueHint', { count: overdue.length })}
            icon={Wallet}
            label={t('approvals.overview.requests')}
            onClick={() => onSelectTab('queue')}
            tone={overdue.length > 0 ? 'danger' : 'primary'}
            value={String(requests.length)}
          />
          <StatTile
            hint={t('approvals.overview.nearestDeadline', {
              name: approvalQueue.find((item) => item.id === nearestDeadline.id)?.software ?? nearestDeadline.vendor,
              date: formatDate(nearestDeadline.cancellationDeadline)
            })}
            icon={RefreshCw}
            label={t('approvals.overview.renewals')}
            onClick={() => onSelectTab('queue')}
            tone='warning'
            value={String(renewals.length)}
          />
          <StatTile
            hint={t('approvals.overview.chargesHint')}
            icon={FileWarning}
            label={t('approvals.overview.charges')}
            onClick={() => onSelectTab('queue')}
            tone='info'
            value={String(charges.length)}
          />
        </section>

        <section aria-label={t('approvals.overview.spendRegion')} className='grid gap-4 sm:grid-cols-3'>
          <StatTile
            hint={t('finance.report.ofBudget', { budget: formatCompactCurrency(approverReport.totalBudget) })}
            icon={CircleDollarSign}
            label={t('approvals.overview.totalSpend', { period: approverReport.period })}
            onClick={() => onSelectTab('reports')}
            tone='primary'
            value={formatCompactCurrency(approverReport.totalSpend)}
          />
          <StatTile
            icon={Sparkles}
            label={t('finance.report.savingsImmediate')}
            onClick={() => onSelectTab('reports')}
            tone='success'
            value={formatCompactCurrency(approverReport.savings.immediate)}
          />
          <StatTile
            hint={t('finance.report.savingsSeparate')}
            icon={Sparkles}
            label={t('finance.report.savingsNextRenewal')}
            onClick={() => onSelectTab('reports')}
            tone='info'
            value={formatCompactCurrency(approverReport.savings.nextRenewal)}
          />
        </section>
      </div>

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
