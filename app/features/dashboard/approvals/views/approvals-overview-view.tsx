import { AlertTriangle, ArrowRight, Clock, DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { approverMetrics, costCenterReports, topVendors, urgentPendingItems } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'

interface ApprovalsOverviewViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalsOverviewView({ formatCurrency, onSelectTab }: ApprovalsOverviewViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals.dashboard.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('approvals.dashboard.subtitle')}</p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => onSelectTab('queue')}
            type='button'
          >
            <Clock className='size-4' />
            <span>{t('approvals.dashboard.reports.viewQueueBtn')}</span>
            <span className='rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white'>{4}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Executive Metric Cards */}
      <section aria-label={t('metrics.regionLabel')} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals.dashboard.metrics.pendingValue')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Wallet className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(approverMetrics.pendingValue)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals.queue.stats.pending')}</p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals.dashboard.metrics.urgentSla')}
            </span>
            <div className='rounded-lg bg-danger/10 p-2 text-danger'>
              <Clock className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{approverMetrics.urgentCount}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-danger font-medium'>
            <AlertTriangle className='size-3.5' />
            <span>{t('approvals.dashboard.reports.urgentItemsCount', { count: approverMetrics.urgentCount })}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals.dashboard.metrics.totalArr')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(approverMetrics.totalArr)}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-success'>
            <TrendingUp className='size-3.5' />
            <span>{t('approvals.dashboard.metrics.yoyComparison')}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals.dashboard.metrics.realizedSavings')}
            </span>
            <div className='rounded-lg bg-success/10 p-2 text-success'>
              <TrendingDown className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>
            {formatCurrency(approverMetrics.realizedSavings)}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals.dashboard.metrics.savingsNote')}</p>
        </div>
      </section>

      {/* Urgent Items Section */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-bold text-foreground'>{t('approvals.dashboard.urgentSection.title')}</h2>
            <p className='text-xs text-muted-foreground'>{t('approvals.dashboard.urgentSection.subtitle')}</p>
          </div>
          <button
            className='inline-flex items-center gap-1 text-xs font-bold text-primary transition hover:underline'
            onClick={() => onSelectTab('queue')}
            type='button'
          >
            <span>{t('approvals.dashboard.reports.viewQueueBtn')}</span>
            <ArrowRight className='size-3.5' />
          </button>
        </div>

        <div className='mt-4 divide-y divide-border'>
          {urgentPendingItems.map((item) => (
            <div key={item.id} className='flex flex-wrap items-center justify-between gap-4 py-3 text-xs'>
              <div className='min-w-0'>
                <div className='flex items-center gap-2'>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      item.type === 'EXPENSE' ? 'bg-primary-soft text-primary' : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {item.type === 'EXPENSE' ? t('approvals.queue.types.EXPENSE') : t('approvals.queue.types.RENEWAL')}
                  </span>
                  <p className='font-bold text-foreground'>{item.title}</p>
                </div>
                <p className='mt-0.5 text-muted-foreground'>
                  {item.requester} · {item.costCenter}
                </p>
              </div>

              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <p className='font-bold text-foreground'>{formatCurrency(item.amount)}</p>
                  <p className='text-danger font-medium'>
                    {t('approvals.dashboard.urgentSection.slaRemaining', { hours: item.slaHours })}
                  </p>
                </div>
                <button
                  className='rounded-xl border border-border bg-surface px-3 py-1.5 font-semibold text-foreground transition hover:bg-surface-subtle'
                  onClick={() =>
                    onSelectTab(item.type === 'EXPENSE' ? 'expense-approval' : 'renewal-decision', {
                      id: item.id
                    })
                  }
                  type='button'
                >
                  {t('approvals.dashboard.urgentSection.reviewBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Cost Centers & Top Vendors */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left: Cost Centers Report Table */}
        <div className='space-y-4 lg:col-span-8'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('approvals.dashboard.costCenters.title')}</h2>
            <p className='text-xs text-muted-foreground'>{t('approvals.dashboard.costCenters.subtitle')}</p>

            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='border-b border-border text-muted-foreground'>
                    <th className='py-2.5 font-semibold'>{t('approvals.dashboard.costCenters.colCode')}</th>
                    <th className='py-2.5 font-semibold'>{t('approvals.dashboard.costCenters.colName')}</th>
                    <th className='py-2.5 text-right font-semibold'>
                      {t('approvals.dashboard.costCenters.colBudget')}
                    </th>
                    <th className='py-2.5 text-right font-semibold'>{t('approvals.dashboard.costCenters.colSpent')}</th>
                    <th className='py-2.5 text-right font-semibold'>
                      {t('approvals.dashboard.costCenters.colUtilization')}
                    </th>
                    <th className='py-2.5 text-center font-semibold'>{t('approvals.reports.filterStatus')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {costCenterReports.map((cc) => {
                    const pct = Math.round(((cc.spent + cc.commitments) / cc.budget) * 100)
                    return (
                      <tr key={cc.id} className='transition hover:bg-surface-subtle/50'>
                        <td className='py-3 font-mono font-bold text-foreground'>{cc.code}</td>
                        <td className='py-3 font-medium text-foreground'>{cc.name}</td>
                        <td className='py-3 text-right text-muted-foreground'>{formatCurrency(cc.budget)}</td>
                        <td className='py-3 text-right font-bold text-foreground'>{formatCurrency(cc.spent)}</td>
                        <td className='py-3 text-right font-bold'>
                          <span className={pct > 100 ? 'text-danger' : pct > 80 ? 'text-warning' : 'text-success'}>
                            {pct}%
                          </span>
                        </td>
                        <td className='py-3 text-center'>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                              cc.status === 'DANGER'
                                ? 'bg-danger/10 text-danger'
                                : cc.status === 'WARNING'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-success/10 text-success'
                            }`}
                          >
                            {cc.status === 'DANGER'
                              ? t('approvals.dashboard.costCenters.statusDanger')
                              : cc.status === 'WARNING'
                                ? t('approvals.dashboard.costCenters.statusWarning')
                                : t('approvals.dashboard.costCenters.statusNormal')}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top Vendors */}
        <div className='space-y-4 lg:col-span-4'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('approvals.dashboard.topVendors.title')}</h2>
            <p className='text-xs text-muted-foreground'>{t('approvals.dashboard.topVendors.subtitle')}</p>

            <div className='mt-4 divide-y divide-border text-xs'>
              {topVendors.map((vendor) => (
                <div key={vendor.name} className='flex items-center justify-between py-2.5'>
                  <div className='min-w-0 flex-1 pr-2'>
                    <p className='truncate font-bold text-foreground'>{vendor.name}</p>
                    <p className='text-[11px] text-muted-foreground'>{vendor.category}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-foreground'>{formatCurrency(vendor.spend)}</p>
                    <p className='text-[11px] text-muted-foreground'>{vendor.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
