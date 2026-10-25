import { CheckCircle2, PiggyBank, Sparkles, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFormatPeriod } from '../../../budget-figures'
import { PageHeader, Panel, StatTile } from '../../../dashboard-ui'
import { committedForecast, currentPeriod } from '../../finance-data'
import type { FinanceTabKey } from '../../finance-nav'
import { windowSaving } from '../../optimization-data'
import { useOptimizationOpportunities } from '../../optimization-store'
import {
  FinanceOptimizationFilters,
  defaultOptimizationFilters,
  matchesOptimizationFilters,
  type OptimizationFilters
} from '../components/finance-optimization-filters'
import { FinanceOptimizationDetail } from '../components/finance-optimization-detail'
import { OptimizationTable } from '../components/optimization-parts'

/**
 * FIN-35: proposals that lower next period's committed cost. The list opens first; choosing a proposal
 * opens its own detail screen (`id` search param).
 */
export function FinanceOptimizationView({
  formatCurrency,
  onSelectTab,
  opportunityId
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  opportunityId?: string
}) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const items = useOptimizationOpportunities()
  const [filters, setFilters] = useState<OptimizationFilters>(defaultOptimizationFilters)
  const selected = items.find((item) => item.id === opportunityId)

  if (selected) {
    return (
      <FinanceOptimizationDetail
        formatCurrency={formatCurrency}
        item={selected}
        key={selected.id}
        onBack={() => onSelectTab('cost-optimization')}
      />
    )
  }

  const forecast = committedForecast.reduce((sum, month) => sum + month.value, 0)
  const live = items.filter((item) => item.status !== 'REJECTED')
  const approved = items.filter((item) => item.status === 'APPROVED')
  const potential = live.reduce((sum, item) => sum + windowSaving(item), 0)
  const approvedSaving = approved.reduce((sum, item) => sum + windowSaving(item), 0)
  const visible = items.filter((item) => matchesOptimizationFilters(item, filters))
  const period = formatPeriod(currentPeriod)

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('finance.optimization.subtitle')} title={t('finance.optimization.title', { period })} />

      <section aria-label={t('finance.optimization.summaryLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('finance.optimization.forecastHint', { period })}
          icon={PiggyBank}
          label={t('finance.optimization.forecast')}
          value={formatCurrency(forecast)}
        />
        <StatTile
          hint={t('finance.optimization.potentialHint', { count: live.length })}
          icon={Sparkles}
          label={t('finance.optimization.potential')}
          tone='warning'
          value={formatCurrency(potential)}
        />
        <StatTile
          hint={t('finance.optimization.approvedHint', { count: approved.length })}
          icon={CheckCircle2}
          label={t('finance.optimization.approvedSaving')}
          tone='success'
          value={formatCurrency(approvedSaving)}
        />
        <StatTile
          hint={t('finance.optimization.afterHint')}
          icon={TrendingDown}
          label={t('finance.optimization.afterOptimization')}
          tone='info'
          value={formatCurrency(forecast - potential)}
        />
      </section>

      <FinanceOptimizationFilters applied={filters} items={items} onApply={setFilters} />

      <Panel>
        <OptimizationTable
          formatCurrency={formatCurrency}
          items={visible}
          onOpen={(id) => onSelectTab('cost-optimization', { id })}
        />
      </Panel>
    </div>
  )
}
