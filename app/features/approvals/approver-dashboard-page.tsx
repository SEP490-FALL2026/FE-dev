import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Filter,
  PieChart,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react'

export function ApproverDashboardPage() {
  const { t } = useTranslation(['approvals', 'finance', 'common'])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL')
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const metrics = {
    pendingValue: 142500000,
    urgentCount: 2,
    totalArr: 680000000,
    realizedSavings: 112000000
  }

  const costCenterReports = [
    {
      id: 'CC-ENG-02',
      code: 'CC-ENG-02',
      name: 'Engineering & Core Backend',
      period: 'Q1-2026',
      budget: 250000000,
      spent: 185000000,
      commitments: 35000000,
      status: 'WARNING' // Near limit (88%)
    },
    {
      id: 'CC-DESIGN-01',
      code: 'CC-DESIGN-01',
      name: 'Product Design & UX',
      period: 'Q1-2026',
      budget: 120000000,
      spent: 82000000,
      commitments: 13500000,
      status: 'NORMAL' // 79%
    },
    {
      id: 'CC-OPS-03',
      code: 'CC-OPS-03',
      name: 'Operations & IT Infrastructure',
      period: 'Q1-2026',
      budget: 80000000,
      spent: 45000000,
      commitments: 10000000,
      status: 'NORMAL' // 68%
    },
    {
      id: 'CC-MKT-04',
      code: 'CC-MKT-04',
      name: 'Marketing & Growth Tech',
      period: 'Q2-2026',
      budget: 150000000,
      spent: 138000000,
      commitments: 18000000,
      status: 'DANGER' // 104% Exceeded
    }
  ]

  const topVendors = [
    { name: 'GitHub Enterprise & Copilot', spend: 180000000, percentage: 26, category: 'Dev Tools' },
    { name: 'Salesforce Slack Grid', spend: 144000000, percentage: 21, category: 'Collaboration' },
    { name: 'Atlassian Jira & Confluence', spend: 120000000, percentage: 18, category: 'Management' },
    { name: 'Figma Enterprise', spend: 96000000, percentage: 14, category: 'Design' },
    { name: 'Notion AI Workspace', spend: 60000000, percentage: 9, category: 'Productivity' }
  ]

  const urgentPendingItems = [
    {
      id: 'EXP-2026-089',
      type: 'EXPENSE',
      title: 'Nâng cấp 15 Figma Enterprise seats',
      requester: 'Lê Minh Tuấn (Design Lead)',
      costCenter: 'CC-DESIGN-01',
      amount: 45000000,
      slaHours: 4,
      urgency: 'HIGH',
      link: '/approvals/expense/EXP-2026-089'
    },
    {
      id: 'REN-2026-014',
      type: 'RENEWAL',
      title: 'Gia hạn Datadog APM Enterprise (100 Hosts)',
      requester: 'Nguyễn Văn Hải (DevOps Lead)',
      costCenter: 'CC-ENG-02',
      amount: 97500000,
      slaHours: 12,
      urgency: 'HIGH',
      link: '/approvals/renewal/REN-2026-014'
    }
  ]

  // Filtered reports logic
  const filteredCostCenters = costCenterReports.filter((item) => {
    const periodMatch = selectedPeriod === 'ALL' || item.period === selectedPeriod
    const costCenterMatch = selectedCostCenter === 'ALL' || item.code === selectedCostCenter
    return periodMatch && costCenterMatch
  })

  const handleResetFilters = () => {
    setSelectedPeriod('ALL')
    setSelectedCostCenter('ALL')
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals:dashboard.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('approvals:dashboard.subtitle')}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Link
            to='/approvals/queue'
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90'
          >
            <Clock className='h-4 w-4' />
            <span>{t('approvals:dashboard.reports.viewQueueBtn')}</span>
            <span className='rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-bold text-white'>{4}</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Executive Metric Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:dashboard.metrics.pendingValue')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Wallet className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(metrics.pendingValue)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:queue.stats.pending')}</p>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:dashboard.metrics.urgentSla')}
            </span>
            <div className='rounded-lg bg-danger/10 p-2 text-danger'>
              <Clock className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{metrics.urgentCount}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-danger font-medium'>
            <AlertTriangle className='h-3.5 w-3.5' />
            <span>{t('approvals:dashboard.reports.urgentItemsCount', { count: metrics.urgentCount })}</span>
          </div>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:dashboard.metrics.totalArr')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <DollarSign className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(metrics.totalArr)}</p>
          <div className='mt-1 flex items-center gap-1 text-xs text-success'>
            <TrendingUp className='h-3.5 w-3.5' />
            <span>{t('approvals:dashboard.metrics.yoyComparison')}</span>
          </div>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:dashboard.metrics.realizedSavings')}
            </span>
            <div className='rounded-lg bg-success/10 p-2 text-success'>
              <TrendingDown className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-success'>{formatCurrency(metrics.realizedSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:dashboard.metrics.savingsNote')}</p>
        </div>
      </div>

      {/* Financial Reports Filter Bar */}
      <div className='rounded-xl border border-border bg-surface p-5 shadow-xs'>
        <div className='flex items-center justify-between pb-4 border-b border-border mb-4'>
          <div className='flex items-center gap-2 font-semibold text-foreground'>
            <Filter className='h-4 w-4 text-primary' />
            <span>{t('approvals:dashboard.filters.title')}</span>
          </div>
          {(selectedPeriod !== 'ALL' || selectedCostCenter !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className='inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline'
            >
              <RotateCcw className='h-3.5 w-3.5' />
              <span>{t('approvals:dashboard.reports.filterReset')}</span>
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-xs font-medium text-muted-foreground mb-1.5'>
              {t('approvals:dashboard.filters.periodLabel')}
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary'
            >
              <option value='ALL'>{t('approvals:dashboard.filters.allPeriods')}</option>
              <option value='Q1-2026'>{t('approvals:dashboard.filters.periodQ1')}</option>
              <option value='Q2-2026'>{t('approvals:dashboard.filters.periodQ2')}</option>
              <option value='Q3-2026'>{t('approvals:dashboard.filters.periodQ3')}</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-medium text-muted-foreground mb-1.5'>
              {t('approvals:dashboard.filters.costCenterLabel')}
            </label>
            <select
              value={selectedCostCenter}
              onChange={(e) => setSelectedCostCenter(e.target.value)}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary'
            >
              <option value='ALL'>{t('approvals:dashboard.filters.allCostCenters')}</option>
              <option value='CC-ENG-02'>{t('approvals:dashboard.filters.ccEngineering')}</option>
              <option value='CC-DESIGN-01'>{t('approvals:dashboard.filters.ccDesign')}</option>
              <option value='CC-OPS-03'>{t('approvals:dashboard.filters.ccOps')}</option>
              <option value='CC-MKT-04'>{t('approvals:dashboard.filters.ccMkt')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Waste Highlight Banner */}
      <div className='relative overflow-hidden rounded-xl border border-warning/30 bg-warning/5 p-5'>
        <div className='flex items-start gap-4'>
          <div className='rounded-lg bg-warning/10 p-2.5 text-warning shrink-0'>
            <Sparkles className='h-6 w-6' />
          </div>
          <div className='space-y-1'>
            <h3 className='font-bold text-foreground text-base'>
              {t('approvals:dashboard.reports.financialSummaryTitle')}
            </h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('approvals:dashboard.reports.wasteHighlight')}
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Pending Approvals Queue Snapshot */}
      <div className='rounded-xl border border-border bg-surface p-5 shadow-xs'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2 font-bold text-foreground text-lg'>
            <ShieldAlert className='h-5 w-5 text-danger' />
            <span>{t('approvals:dashboard.reports.pendingQueueTitle')}</span>
          </div>
          <Link
            to='/approvals/queue'
            className='inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline'
          >
            <span>{t('approvals:dashboard.reports.viewAllQueue')}</span>
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {urgentPendingItems.map((item) => (
            <div
              key={item.id}
              className='flex flex-col justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/40'
            >
              <div>
                <div className='flex items-center justify-between gap-2 mb-2'>
                  <span className='rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger'>
                    {t('approvals:dashboard.reports.urgentSlaFormat', { hours: item.slaHours })}
                  </span>
                  <span className='font-mono text-xs text-muted-foreground'>{item.id}</span>
                </div>
                <h4 className='font-semibold text-foreground text-sm leading-snug'>{item.title}</h4>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {item.requester} · <span className='font-mono text-foreground/80'>{item.costCenter}</span>
                </p>
              </div>

              <div className='mt-4 flex items-center justify-between pt-3 border-t border-border/60'>
                <div>
                  <span className='text-[10px] uppercase tracking-wider text-muted-foreground block'>
                    {t('approvals:dashboard.reports.requestedAmountLabel')}
                  </span>
                  <span className='font-bold text-foreground text-sm'>{formatCurrency(item.amount)}</span>
                </div>
                <Link
                  to={item.link}
                  className='inline-flex items-center gap-1 rounded-md bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground'
                >
                  <span>{t('approvals:dashboard.reports.viewDetails')}</span>
                  <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Reports Tables & Visual Breakdowns */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Cost Center Budget Utilization Table (2 columns wide) */}
        <div className='lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-foreground text-base flex items-center gap-2'>
              <BarChart3 className='h-5 w-5 text-primary' />
              <span>{t('approvals:dashboard.reports.budgetUtilizationTitle')}</span>
            </h3>
            <span className='text-xs text-muted-foreground font-mono'>
              {t('approvals:dashboard.reports.countUnits', { count: filteredCostCenters.length })}
            </span>
          </div>

          <div className='overflow-x-auto rounded-lg border border-border'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border'>
                <tr>
                  <th className='px-4 py-3'>{t('approvals:dashboard.reports.tableCostCenter')}</th>
                  <th className='px-4 py-3 text-right'>{t('approvals:dashboard.reports.tableBudget')}</th>
                  <th className='px-4 py-3 text-right'>{t('approvals:dashboard.reports.tableSpent')}</th>
                  <th className='px-4 py-3 text-right'>{t('approvals:dashboard.reports.tableRemaining')}</th>
                  <th className='px-4 py-3 text-center'>{t('approvals:dashboard.reports.tableUtilization')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border bg-surface'>
                {filteredCostCenters.map((cc) => {
                  const totalUsed = cc.spent + cc.commitments
                  const remaining = cc.budget - totalUsed
                  const percent = Math.min(100, Math.round((totalUsed / cc.budget) * 100))

                  return (
                    <tr key={cc.id} className='hover:bg-muted/20 transition-colors'>
                      <td className='px-4 py-3.5'>
                        <div className='font-semibold text-foreground'>{cc.name}</div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground font-mono'>
                          <span>{cc.code}</span>
                          <span>·</span>
                          <span className='rounded bg-muted px-1.5 py-0.2 text-[10px]'>{cc.period}</span>
                        </div>
                      </td>
                      <td className='px-4 py-3.5 text-right font-medium text-foreground'>
                        {formatCurrency(cc.budget)}
                      </td>
                      <td className='px-4 py-3.5 text-right font-medium text-foreground'>
                        {formatCurrency(totalUsed)}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-semibold ${remaining < 0 ? 'text-danger' : 'text-foreground'}`}
                      >
                        {formatCurrency(remaining)}
                      </td>
                      <td className='px-4 py-3.5 text-center'>
                        <div className='flex flex-col items-center gap-1'>
                          <div className='flex items-center gap-1 text-xs font-bold'>
                            <span>{percent}%</span>
                            {cc.status === 'DANGER' && (
                              <span className='rounded bg-danger/10 px-1.5 py-0.5 text-[10px] text-danger'>
                                {t('approvals:dashboard.reports.statusDanger')}
                              </span>
                            )}
                            {cc.status === 'WARNING' && (
                              <span className='rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning'>
                                {t('approvals:dashboard.reports.statusWarning')}
                              </span>
                            )}
                          </div>
                          <div className='h-2 w-24 overflow-hidden rounded-full bg-muted'>
                            <div
                              className={`h-full rounded-full transition-all ${
                                percent > 100 ? 'bg-danger' : percent > 85 ? 'bg-warning' : 'bg-primary'
                              }`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendor SaaS Spend Breakdown (1 column wide) */}
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
          <h3 className='font-bold text-foreground text-base flex items-center gap-2'>
            <PieChart className='h-5 w-5 text-primary' />
            <span>{t('approvals:dashboard.reports.vendorSpendTitle')}</span>
          </h3>

          <div className='space-y-4 pt-1'>
            {topVendors.map((vendor) => (
              <div key={vendor.name} className='space-y-1.5'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-foreground truncate max-w-[170px]'>{vendor.name}</span>
                  <span className='font-mono font-bold text-foreground'>{formatCurrency(vendor.spend)}</span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{vendor.category}</span>
                  <span>{t('approvals:dashboard.reports.arrPercentage', { percent: vendor.percentage })}</span>
                </div>
                <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-primary transition-all'
                    style={{ width: `${vendor.percentage * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
