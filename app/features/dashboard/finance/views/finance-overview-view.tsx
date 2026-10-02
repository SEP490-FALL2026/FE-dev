import { DollarSign, Layers, TrendingUp, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { financeCostCenters, financeMetrics, financeTopVendors } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceOverviewViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceOverviewView({ formatCurrency, onSelectTab }: FinanceOverviewViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('finance.dashboard.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance.dashboard.subtitle')}</p>
      </div>

      {/* Top 4 Executive Metric Cards */}
      <section aria-label={t('metrics.regionLabel')} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.dashboard.metrics.arr')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(financeMetrics.arr)}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-success font-medium'>
            <TrendingUp className='size-3.5' />
            <span>{t('finance.dashboard.yoyComparison')}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.dashboard.metrics.mrr')}
            </span>
            <div className='rounded-lg bg-info/10 p-2 text-info'>
              <Wallet className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(financeMetrics.mrr)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('finance.dashboard.mrrNote')}</p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.dashboard.metrics.activeSubscriptions')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Layers className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{financeMetrics.activeSubscriptions}</p>
          <button
            className='mt-1 text-xs font-bold text-primary hover:underline'
            onClick={() => onSelectTab('software-directory')}
            type='button'
          >
            {t('finance.nav.softwareDirectory')}
          </button>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.dashboard.metrics.realizedSavings')}
            </span>
            <div className='rounded-lg bg-success/10 p-2 text-success'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>
            {formatCurrency(financeMetrics.realizedSavings)}
          </p>
          <button
            className='mt-1 text-xs font-bold text-success hover:underline'
            onClick={() => onSelectTab('renewal-schedule')}
            type='button'
          >
            {t('finance.nav.renewalSchedule')}
          </button>
        </div>
      </section>

      {/* Grid: Cost Centers Budget & Top Vendors */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left: Cost Center Budget Health */}
        <div className='space-y-4 lg:col-span-8'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-bold text-foreground'>{t('finance.dashboard.costCentersTitle')}</h2>
                <p className='text-xs text-muted-foreground'>{t('approvals.dashboard.costCenters.subtitle')}</p>
              </div>
              <button
                className='text-xs font-bold text-primary hover:underline'
                onClick={() => onSelectTab('budget-snapshot')}
                type='button'
              >
                {t('finance.nav.budgetSnapshot')}
              </button>
            </div>

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
                      {t('approvals.dashboard.costCenters.colCommitments')}
                    </th>
                    <th className='py-2.5 text-right font-semibold'>
                      {t('approvals.dashboard.costCenters.colRemaining')}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {financeCostCenters.map((cc) => {
                    const remaining = cc.allocatedBudget - (cc.spent + cc.commitments)
                    return (
                      <tr key={cc.code} className='transition hover:bg-surface-subtle/50'>
                        <td className='py-3 font-mono font-bold text-foreground'>{cc.code}</td>
                        <td className='py-3 font-medium text-foreground'>{cc.name}</td>
                        <td className='py-3 text-right text-muted-foreground'>{formatCurrency(cc.allocatedBudget)}</td>
                        <td className='py-3 text-right font-bold text-foreground'>{formatCurrency(cc.spent)}</td>
                        <td className='py-3 text-right font-medium text-warning'>{formatCurrency(cc.commitments)}</td>
                        <td className='py-3 text-right font-bold text-success'>{formatCurrency(remaining)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top SaaS Vendors */}
        <div className='space-y-4 lg:col-span-4'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('finance.dashboard.topVendorsTitle')}</h2>
            <p className='text-xs text-muted-foreground'>{t('approvals.dashboard.topVendors.subtitle')}</p>

            <div className='mt-4 divide-y divide-border text-xs'>
              {financeTopVendors.map((vendor) => (
                <div key={vendor.name} className='flex items-center justify-between py-2.5'>
                  <div className='flex items-center gap-2.5 min-w-0 flex-1 pr-2'>
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-base'>
                      {vendor.logo}
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-bold text-foreground'>{vendor.name}</p>
                      <p className='text-[11px] text-muted-foreground'>
                        {t('finance.dashboard.percentTotalSpend', { percent: vendor.percentage })}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-foreground'>{formatCurrency(vendor.spend)}</p>
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
