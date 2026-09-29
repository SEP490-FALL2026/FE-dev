import { useTranslation } from 'react-i18next'
import { DollarSign, Layers, PieChart, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

export function FinanceDashboardPage() {
  const { t } = useTranslation(['finance', 'common'])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const metrics = {
    arr: 680000000,
    mrr: 56600000,
    activeSubscriptions: 24,
    realizedSavings: 112000000
  }

  const costCenters = [
    {
      code: 'CC-ENG-02',
      name: 'Engineering & Core Backend',
      allocatedBudget: 250000000,
      spent: 185000000,
      commitments: 35000000
    },
    {
      code: 'CC-DESIGN-01',
      name: 'Product Design & UX',
      allocatedBudget: 120000000,
      spent: 82000000,
      commitments: 13500000
    },
    {
      code: 'CC-OPS-03',
      name: 'Operations & IT Infrastructure',
      allocatedBudget: 80000000,
      spent: 45000000,
      commitments: 10000000
    }
  ]

  const topVendors = [
    { name: 'GitHub Enterprise & Copilot', spend: 180000000, percentage: 26, logo: '🐙' },
    { name: 'Salesforce Slack Grid', spend: 144000000, percentage: 21, logo: '💬' },
    { name: 'Atlassian Jira & Confluence', spend: 120000000, percentage: 18, logo: '📊' },
    { name: 'Figma Enterprise', spend: 96000000, percentage: 14, logo: '🎨' },
    { name: 'Notion AI Workspace', spend: 60000000, percentage: 9, logo: '📝' }
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('finance:dashboard.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:dashboard.subtitle')}</p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance:dashboard.metrics.arr')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <DollarSign className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(metrics.arr)}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-success'>
            <TrendingUp className='h-3.5 w-3.5' />
            <span>{t('finance:dashboard.yoyComparison')}</span>
          </div>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance:dashboard.metrics.mrr')}
            </span>
            <div className='rounded-lg bg-info/10 p-2 text-info'>
              <Wallet className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(metrics.mrr)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('finance:dashboard.mrrNote')}</p>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance:dashboard.metrics.activeSubscriptions')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Layers className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{metrics.activeSubscriptions}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('finance:dashboard.activeSubNote')}</p>
        </div>

        <div className='rounded-xl border border-success/40 bg-surface p-5 shadow-xs transition-all hover:border-success'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-success'>
              {t('finance:dashboard.metrics.realizedSavings')}
            </span>
            <div className='rounded-lg bg-success/10 p-2 text-success'>
              <TrendingDown className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-success'>{formatCurrency(metrics.realizedSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('finance:dashboard.savingsNote')}</p>
        </div>
      </div>

      {/* Main Grid: Cost Center Breakdown & Top Vendors */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left 2 Columns: Cost Center Breakdown */}
        <div className='lg:col-span-2 rounded-xl border border-border bg-surface p-6 shadow-xs space-y-5'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <h2 className='text-base font-bold text-foreground'>{t('finance:dashboard.costCenterChartTitle')}</h2>
            <span className='text-xs font-medium text-muted-foreground'>{t('finance:dashboard.currentQuarter')}</span>
          </div>

          <div className='space-y-4'>
            {costCenters.map((cc) => {
              const totalUsed = cc.spent + cc.commitments
              const percentage = Math.round((totalUsed / cc.allocatedBudget) * 100)

              return (
                <div key={cc.code} className='space-y-2 rounded-xl border border-border bg-background p-4 shadow-xs'>
                  <div className='flex items-center justify-between text-xs'>
                    <div>
                      <span className='font-mono font-bold text-primary'>{cc.code}</span>
                      <p className='font-semibold text-foreground text-sm'>{cc.name}</p>
                    </div>
                    <div className='text-right'>
                      <span className='font-extrabold text-foreground text-sm'>{formatCurrency(totalUsed)}</span>
                      <span className='text-muted-foreground'> / {formatCurrency(cc.allocatedBudget)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='space-y-1'>
                    <div className='flex justify-between text-[11px] text-muted-foreground'>
                      <span>
                        {t('finance:dashboard.actualSpendLabel')}: {formatCurrency(totalUsed)}
                      </span>
                      <span className='font-bold text-foreground'>
                        {t('finance:dashboard.budgetPercentLabel', { percent: percentage })}
                      </span>
                    </div>
                    <div className='h-2.5 w-full rounded-full bg-surface-subtle overflow-hidden flex'>
                      <div
                        className='bg-primary h-full'
                        style={{
                          width: `${(cc.spent / cc.allocatedBudget) * 100}%`
                        }}
                      />
                      <div
                        className='bg-warning h-full'
                        style={{
                          width: `${(cc.commitments / cc.allocatedBudget) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Top Vendors */}
        <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-4'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <h2 className='text-base font-bold text-foreground'>{t('finance:dashboard.vendorBreakdownTitle')}</h2>
            <PieChart className='h-4 w-4 text-primary' />
          </div>

          <div className='space-y-3.5'>
            {topVendors.map((vendor) => (
              <div key={vendor.name} className='flex items-center justify-between text-xs'>
                <div className='flex items-center gap-2.5 min-w-0'>
                  <span className='text-lg'>{vendor.logo}</span>
                  <span className='font-semibold text-foreground truncate'>{vendor.name}</span>
                </div>
                <div className='text-right shrink-0'>
                  <p className='font-bold text-foreground'>{formatCurrency(vendor.spend)}</p>
                  <p className='text-[11px] text-muted-foreground'>
                    {t('finance:dashboard.spendPercentLabel', { percent: vendor.percentage })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
