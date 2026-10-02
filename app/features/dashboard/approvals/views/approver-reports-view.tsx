import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Download, Filter, PieChart, Sparkles, Wallet } from 'lucide-react'

import { costCenterReports, topVendors } from '../approvals-data'

interface ApproverReportsViewProps {
  formatCurrency: (value: number) => string
}

export function ApproverReportsView({ formatCurrency }: ApproverReportsViewProps) {
  const { t } = useTranslation('dashboard')
  const [activeTab, setActiveTab] = useState<
    'budgetUtilization' | 'vendorBreakdown' | 'wasteOptimization' | 'commitmentsForecast'
  >('budgetUtilization')

  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL')
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL')

  const filteredCostCenters = costCenterReports.filter((item) => {
    const periodMatch = selectedPeriod === 'ALL' || item.period === selectedPeriod
    const costCenterMatch = selectedCostCenter === 'ALL' || item.code === selectedCostCenter
    return periodMatch && costCenterMatch
  })

  return (
    <div className='space-y-6'>
      {/* Header & Controls */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals.reports.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('approvals.reports.subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
            type='button'
          >
            <Download className='size-3.5' />
            <span>{t('approvals.reports.exportBtn')}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className='flex border-b border-border'>
        {[
          { id: 'budgetUtilization' as const, label: t('approvals.reports.tabBudget'), icon: Wallet },
          { id: 'vendorBreakdown' as const, label: t('approvals.reports.tabVendors'), icon: PieChart },
          { id: 'wasteOptimization' as const, label: t('approvals.reports.tabWaste'), icon: Sparkles },
          { id: 'commitmentsForecast' as const, label: t('approvals.reports.tabForecast'), icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab.id)}
              type='button'
            >
              <Icon className='size-4' />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-xs shadow-sm'>
        <div className='flex items-center gap-1.5 font-bold text-muted-foreground'>
          <Filter className='size-3.5' />
          <span>{t('approvals.reports.filterPeriod')}:</span>
        </div>

        <select
          className='rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          onChange={(e) => setSelectedPeriod(e.target.value)}
          value={selectedPeriod}
        >
          <option value='ALL'>{t('approvals.reports.optAll')}</option>
          {['Q1-2026', 'Q2-2026'].map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>

        <div className='flex items-center gap-1.5 font-bold text-muted-foreground ml-2'>
          <span>{t('approvals.reports.filterCostCenter')}:</span>
        </div>

        <select
          className='rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
          onChange={(e) => setSelectedCostCenter(e.target.value)}
          value={selectedCostCenter}
        >
          <option value='ALL'>{t('approvals.reports.optAll')}</option>
          {costCenterReports.map((cc) => (
            <option key={cc.id} value={cc.code}>
              {cc.code} - {cc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'budgetUtilization' && (
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
          <h2 className='text-sm font-bold text-foreground'>{t('approvals.dashboard.costCenters.title')}</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className='py-3 px-4 font-semibold'>{t('approvals.dashboard.costCenters.colCode')}</th>
                  <th className='py-3 px-4 font-semibold'>{t('approvals.dashboard.costCenters.colName')}</th>
                  <th className='py-3 px-4 text-right font-semibold'>
                    {t('approvals.dashboard.costCenters.colBudget')}
                  </th>
                  <th className='py-3 px-4 text-right font-semibold'>
                    {t('approvals.dashboard.costCenters.colSpent')}
                  </th>
                  <th className='py-3 px-4 text-right font-semibold'>
                    {t('approvals.dashboard.costCenters.colCommitments')}
                  </th>
                  <th className='py-3 px-4 text-right font-semibold'>
                    {t('approvals.dashboard.costCenters.colRemaining')}
                  </th>
                  <th className='py-3 px-4 text-center font-semibold'>{t('approvals.reports.filterStatus')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {filteredCostCenters.map((item) => {
                  const remaining = item.budget - (item.spent + item.commitments)
                  return (
                    <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                      <td className='py-3 px-4 font-mono font-bold text-foreground'>{item.code}</td>
                      <td className='py-3 px-4 font-medium text-foreground'>{item.name}</td>
                      <td className='py-3 px-4 text-right text-muted-foreground'>{formatCurrency(item.budget)}</td>
                      <td className='py-3 px-4 text-right font-bold text-foreground'>{formatCurrency(item.spent)}</td>
                      <td className='py-3 px-4 text-right font-medium text-warning'>
                        {formatCurrency(item.commitments)}
                      </td>
                      <td className='py-3 px-4 text-right font-bold text-success'>{formatCurrency(remaining)}</td>
                      <td className='py-3 px-4 text-center'>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            item.status === 'DANGER'
                              ? 'bg-danger/10 text-danger'
                              : item.status === 'WARNING'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                          }`}
                        >
                          {item.status === 'DANGER'
                            ? t('approvals.dashboard.costCenters.statusDanger')
                            : item.status === 'WARNING'
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
      )}

      {activeTab === 'vendorBreakdown' && (
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
          <h2 className='text-sm font-bold text-foreground'>{t('approvals.dashboard.topVendors.title')}</h2>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {topVendors.map((vendor) => (
              <div key={vendor.name} className='rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary'>
                    {vendor.category}
                  </span>
                  <span className='font-mono font-bold text-xs text-foreground'>{vendor.percentage}%</span>
                </div>
                <h3 className='font-bold text-xs text-foreground'>{vendor.name}</h3>
                <p className='text-lg font-extrabold text-foreground'>{formatCurrency(vendor.spend)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'wasteOptimization' || activeTab === 'commitmentsForecast') && (
        <div className='rounded-2xl border border-border bg-surface p-8 shadow-sm text-center space-y-3'>
          <Sparkles className='mx-auto size-10 text-primary' />
          <h3 className='text-base font-bold text-foreground'>
            {activeTab === 'wasteOptimization' ? t('approvals.reports.tabWaste') : t('approvals.reports.tabForecast')}
          </h3>
          <p className='max-w-md mx-auto text-xs text-muted-foreground'>{t('approvals.dashboard.subtitle')}</p>
        </div>
      )}
    </div>
  )
}
