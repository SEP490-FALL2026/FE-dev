import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BarChart3,
  Download,
  FileSpreadsheet,
  Filter,
  PieChart,
  RotateCcw,
  Sparkles,
  Wallet
} from 'lucide-react'

export function ApproverReportsPage() {
  const { t } = useTranslation(['approvals', 'finance', 'common'])
  const [activeTab, setActiveTab] = useState<
    'budgetUtilization' | 'vendorBreakdown' | 'wasteOptimization' | 'commitmentsForecast'
  >('budgetUtilization')

  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL')
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  // Cost Center data
  const costCenterReports = [
    {
      id: 'CC-ENG-02',
      code: 'CC-ENG-02',
      name: 'Engineering & Core Backend',
      period: 'Q1-2026',
      budget: 250000000,
      spent: 185000000,
      commitments: 35000000,
      status: 'WARNING'
    },
    {
      id: 'CC-DESIGN-01',
      code: 'CC-DESIGN-01',
      name: 'Product Design & UX',
      period: 'Q1-2026',
      budget: 120000000,
      spent: 82000000,
      commitments: 13500000,
      status: 'NORMAL'
    },
    {
      id: 'CC-OPS-03',
      code: 'CC-OPS-03',
      name: 'Operations & IT Infrastructure',
      period: 'Q1-2026',
      budget: 80000000,
      spent: 45000000,
      commitments: 10000000,
      status: 'NORMAL'
    },
    {
      id: 'CC-MKT-04',
      code: 'CC-MKT-04',
      name: 'Marketing & Growth Tech',
      period: 'Q2-2026',
      budget: 150000000,
      spent: 138000000,
      commitments: 18000000,
      status: 'DANGER'
    }
  ]

  // Software vendor spend & waste data
  const softwareVendorReports = [
    {
      id: 'SW-01',
      name: 'GitHub Enterprise & Copilot',
      category: 'DEV_TOOLS',
      totalSeats: 150,
      assignedSeats: 142,
      activeUsers: 138,
      inactiveUsers: 4,
      unassignedSeats: 8,
      arrSpend: 180000000,
      estimatedWaste: 9600000,
      status: 'HIGH_WASTE'
    },
    {
      id: 'SW-02',
      name: 'Salesforce Slack Grid',
      category: 'COLLABORATION',
      totalSeats: 200,
      assignedSeats: 195,
      activeUsers: 190,
      inactiveUsers: 5,
      unassignedSeats: 5,
      arrSpend: 144000000,
      estimatedWaste: 3600000,
      status: 'OPTIMIZED'
    },
    {
      id: 'SW-03',
      name: 'Atlassian Jira & Confluence',
      category: 'COLLABORATION',
      totalSeats: 120,
      assignedSeats: 110,
      activeUsers: 105,
      inactiveUsers: 5,
      unassignedSeats: 10,
      arrSpend: 120000000,
      estimatedWaste: 10000000,
      status: 'HIGH_WASTE'
    },
    {
      id: 'SW-04',
      name: 'Figma Enterprise Workspace',
      category: 'DESIGN',
      totalSeats: 45,
      assignedSeats: 40,
      activeUsers: 38,
      inactiveUsers: 2,
      unassignedSeats: 5,
      arrSpend: 96000000,
      estimatedWaste: 10600000,
      status: 'HIGH_WASTE'
    },
    {
      id: 'SW-05',
      name: 'Datadog APM Infrastructure',
      category: 'SECURITY',
      totalSeats: 20,
      assignedSeats: 20,
      activeUsers: 20,
      inactiveUsers: 0,
      unassignedSeats: 0,
      arrSpend: 97500000,
      estimatedWaste: 0,
      status: 'OPTIMIZED'
    }
  ]

  // Filtered cost centers
  const filteredCostCenters = costCenterReports.filter((item) => {
    const periodMatch = selectedPeriod === 'ALL' || item.period === selectedPeriod
    const costCenterMatch = selectedCostCenter === 'ALL' || item.code === selectedCostCenter
    return periodMatch && costCenterMatch
  })

  // Filtered software vendors
  const filteredVendors = softwareVendorReports.filter((sw) => {
    const categoryMatch = selectedCategory === 'ALL' || sw.category === selectedCategory
    const statusMatch = selectedStatus === 'ALL' || sw.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const handleResetFilters = () => {
    setSelectedPeriod('ALL')
    setSelectedCostCenter('ALL')
    setSelectedCategory('ALL')
    setSelectedStatus('ALL')
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals:reportsPage.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('approvals:reportsPage.subtitle')}</p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => alert('Exporting PDF...')}
            className='inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted'
          >
            <Download className='h-4 w-4 text-muted-foreground' />
            <span>{t('approvals:reportsPage.exportPdf')}</span>
          </button>
          <button
            onClick={() => alert('Exporting Excel/CSV...')}
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90'
          >
            <FileSpreadsheet className='h-4 w-4' />
            <span>{t('approvals:reportsPage.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Finance Filter Bar */}
      <div className='rounded-xl border border-border bg-surface p-5 shadow-xs'>
        <div className='flex items-center justify-between pb-4 border-b border-border mb-4'>
          <div className='flex items-center gap-2 font-semibold text-foreground'>
            <Filter className='h-4 w-4 text-primary' />
            <span>{t('approvals:dashboard.filters.title')}</span>
          </div>
          {(selectedPeriod !== 'ALL' ||
            selectedCostCenter !== 'ALL' ||
            selectedCategory !== 'ALL' ||
            selectedStatus !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className='inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline'
            >
              <RotateCcw className='h-3.5 w-3.5' />
              <span>{t('approvals:dashboard.reports.filterReset')}</span>
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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

          <div>
            <label className='block text-xs font-medium text-muted-foreground mb-1.5'>
              {t('approvals:reportsPage.filters.categoryLabel')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary'
            >
              <option value='ALL'>{t('approvals:reportsPage.filters.allCategories')}</option>
              <option value='DEV_TOOLS'>{t('approvals:reportsPage.filters.devTools')}</option>
              <option value='COLLABORATION'>{t('approvals:reportsPage.filters.collaboration')}</option>
              <option value='DESIGN'>{t('approvals:reportsPage.filters.design')}</option>
              <option value='SECURITY'>{t('approvals:reportsPage.filters.security')}</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-medium text-muted-foreground mb-1.5'>
              {t('approvals:reportsPage.filters.statusLabel')}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary'
            >
              <option value='ALL'>{t('approvals:reportsPage.filters.allStatuses')}</option>
              <option value='HIGH_WASTE'>{t('approvals:reportsPage.filters.highWaste')}</option>
              <option value='OPTIMIZED'>{t('approvals:reportsPage.filters.optimized')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className='flex items-center gap-2 border-b border-border overflow-x-auto pb-1'>
        <button
          onClick={() => setActiveTab('budgetUtilization')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'budgetUtilization'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className='h-4 w-4' />
          <span>{t('approvals:reportsPage.tabs.budgetUtilization')}</span>
        </button>

        <button
          onClick={() => setActiveTab('vendorBreakdown')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'vendorBreakdown'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <PieChart className='h-4 w-4' />
          <span>{t('approvals:reportsPage.tabs.vendorBreakdown')}</span>
        </button>

        <button
          onClick={() => setActiveTab('wasteOptimization')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'wasteOptimization'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className='h-4 w-4' />
          <span>{t('approvals:reportsPage.tabs.wasteOptimization')}</span>
        </button>

        <button
          onClick={() => setActiveTab('commitmentsForecast')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'commitmentsForecast'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wallet className='h-4 w-4' />
          <span>{t('approvals:reportsPage.tabs.commitmentsForecast')}</span>
        </button>
      </div>

      {/* Tab 1: Budget Utilization */}
      {activeTab === 'budgetUtilization' && (
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-foreground text-base'>
              {t('approvals:dashboard.reports.budgetUtilizationTitle')}
            </h3>
            <span className='text-xs font-mono text-muted-foreground'>
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
                          <div className='h-2 w-28 overflow-hidden rounded-full bg-muted'>
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
      )}

      {/* Tab 2: Vendor Breakdown */}
      {activeTab === 'vendorBreakdown' && (
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-foreground text-base'>{t('approvals:dashboard.reports.vendorSpendTitle')}</h3>
            <span className='text-xs font-mono text-muted-foreground'>
              {t('approvals:reportsPage.softwareCount', { count: filteredVendors.length })}
            </span>
          </div>

          <div className='overflow-x-auto rounded-lg border border-border'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border'>
                <tr>
                  <th className='px-4 py-3'>{t('approvals:reportsPage.tables.softwareName')}</th>
                  <th className='px-4 py-3'>{t('approvals:reportsPage.tables.category')}</th>
                  <th className='px-4 py-3 text-center'>{t('approvals:reportsPage.tables.seatsCount')}</th>
                  <th className='px-4 py-3 text-right'>{t('approvals:reportsPage.tables.arrSpend')}</th>
                  <th className='px-4 py-3 text-right'>{t('approvals:reportsPage.tables.wasteRisk')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border bg-surface'>
                {filteredVendors.map((sw) => (
                  <tr key={sw.id} className='hover:bg-muted/20 transition-colors'>
                    <td className='px-4 py-3.5'>
                      <div className='font-semibold text-foreground'>{sw.name}</div>
                      <div className='text-xs text-muted-foreground font-mono'>{sw.id}</div>
                    </td>
                    <td className='px-4 py-3.5 text-xs text-muted-foreground font-medium'>{sw.category}</td>
                    <td className='px-4 py-3.5 text-center font-mono text-xs'>
                      <span className='font-bold text-foreground'>{sw.assignedSeats}</span> / {sw.totalSeats}
                    </td>
                    <td className='px-4 py-3.5 text-right font-bold text-foreground'>{formatCurrency(sw.arrSpend)}</td>
                    <td className='px-4 py-3.5 text-right font-bold text-danger'>
                      {sw.estimatedWaste > 0 ? formatCurrency(sw.estimatedWaste) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Waste & Optimization */}
      {activeTab === 'wasteOptimization' && (
        <div className='space-y-6'>
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

          <div className='rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
            <h3 className='font-bold text-foreground text-base flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-warning' />
              <span>{t('approvals:reportsPage.highWasteTitle')}</span>
            </h3>

            <div className='overflow-x-auto rounded-lg border border-border'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border'>
                  <tr>
                    <th className='px-4 py-3'>{t('approvals:reportsPage.tables.softwareName')}</th>
                    <th className='px-4 py-3 text-center'>{t('approvals:reportsPage.tableHeaders.unassignedSeats')}</th>
                    <th className='px-4 py-3 text-center'>{t('approvals:reportsPage.tableHeaders.inactiveUsers')}</th>
                    <th className='px-4 py-3 text-right'>{t('approvals:reportsPage.tableHeaders.annualWaste')}</th>
                    <th className='px-4 py-3 text-center'>{t('approvals:reportsPage.tableHeaders.status')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border bg-surface'>
                  {softwareVendorReports
                    .filter((sw) => sw.estimatedWaste > 0)
                    .map((sw) => (
                      <tr key={sw.id} className='hover:bg-muted/20 transition-colors'>
                        <td className='px-4 py-3.5'>
                          <div className='font-semibold text-foreground'>{sw.name}</div>
                          <div className='text-xs text-muted-foreground font-mono'>{sw.id}</div>
                        </td>
                        <td className='px-4 py-3.5 text-center font-bold text-warning'>
                          {t('approvals:reportsPage.seatsFormat', { count: sw.unassignedSeats })}
                        </td>
                        <td className='px-4 py-3.5 text-center font-bold text-danger'>
                          {t('approvals:reportsPage.usersFormat', { count: sw.inactiveUsers })}
                        </td>
                        <td className='px-4 py-3.5 text-right font-extrabold text-danger'>
                          {formatCurrency(sw.estimatedWaste)}
                        </td>
                        <td className='px-4 py-3.5 text-center'>
                          <span className='rounded bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning'>
                            {t('approvals:reportsPage.filters.highWaste')}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Commitments & Forecast */}
      {activeTab === 'commitmentsForecast' && (
        <div className='space-y-6'>
          <div className='rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4'>
            <h3 className='font-bold text-foreground text-base flex items-center gap-2'>
              <Wallet className='h-5 w-5 text-primary' />
              <span>{t('approvals:reportsPage.forecast.title')}</span>
            </h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg border border-border bg-background p-4'>
                <span className='text-xs font-medium text-muted-foreground block mb-1'>
                  {t('approvals:reportsPage.forecast.nextMonth')}
                </span>
                <span className='text-xl font-bold text-foreground'>{formatCurrency(85000000)}</span>
                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {t('approvals:reportsPage.forecastNotes.nextMonth')}
                </p>
              </div>

              <div className='rounded-lg border border-border bg-background p-4'>
                <span className='text-xs font-medium text-muted-foreground block mb-1'>
                  {t('approvals:reportsPage.forecast.followingMonth')}
                </span>
                <span className='text-xl font-bold text-foreground'>{formatCurrency(120000000)}</span>
                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {t('approvals:reportsPage.forecastNotes.followingMonth')}
                </p>
              </div>

              <div className='rounded-lg border border-border bg-background p-4'>
                <span className='text-xs font-medium text-muted-foreground block mb-1'>
                  {t('approvals:reportsPage.forecast.thirdMonth')}
                </span>
                <span className='text-xl font-bold text-foreground'>{formatCurrency(64000000)}</span>
                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {t('approvals:reportsPage.forecastNotes.thirdMonth')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
