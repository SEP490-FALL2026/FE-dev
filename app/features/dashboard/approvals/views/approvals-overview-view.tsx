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
  const { formatDate, formatPeriod } = useDashboardFormat()

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
        code='UF-15 · FR-5.14'
        subtitle={t('approvals.overview.subtitle')}
        title={t('approvals.overview.title', { name: displayName })}
      />

      <section aria-label={t('approvals.overview.workRegion')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
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
          hint={t('finance.report.ofBudget', { budget: formatCurrency(approverReport.totalBudget) })}
          icon={CircleDollarSign}
          label={t('approvals.overview.totalSpend', { period: formatPeriod(approverReport.period) })}
          onClick={() => onSelectTab('reports')}
          tone='primary'
          value={formatCurrency(approverReport.totalSpend)}
        />
        <StatTile
          icon={Sparkles}
          label={t('finance.report.savingsImmediate')}
          onClick={() => onSelectTab('reports')}
          tone='success'
          value={formatCurrency(approverReport.savings.immediate)}
        />
        <StatTile
          hint={t('finance.report.savingsSeparate')}
          icon={Sparkles}
          label={t('finance.report.savingsNextRenewal')}
          onClick={() => onSelectTab('reports')}
          tone='info'
          value={formatCurrency(approverReport.savings.nextRenewal)}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle hint={t('approvals.overview.urgentHint')} title={t('approvals.overview.urgentTitle')} />
          <ul className='mt-4 divide-y divide-border'>
            {mostUrgent.map((item) => (
              <li className='flex flex-wrap items-center justify-between gap-3 py-3' key={item.id}>
                <div className='min-w-0'>
                  <p className='text-[0.7rem] font-bold text-muted-foreground'>
                    {t(`approvals.kind.${item.kind}`)} · <span className='font-mono'>{item.reference}</span>
                  </p>
                  <p className='truncate text-sm font-bold'>{item.software}</p>
                  <p className='text-xs text-muted-foreground'>{formatCurrency(item.amount)}</p>
                </div>
                <div className='flex items-center gap-3'>
                  <SlaBadge item={item} />
                  <button
                    aria-label={t('approvals.queue.openItem', { reference: item.reference })}
                    className='grid size-8 place-items-center rounded-lg border border-border text-primary transition hover:border-primary'
                    onClick={() => onSelectTab(tabForKind(item.kind), { id: item.id })}
                    type='button'
                  >
                    <ChevronRight aria-hidden='true' className='size-4' />
                  </button>
                </div>
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
