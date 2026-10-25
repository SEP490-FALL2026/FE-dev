import { CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, StatTile } from '../../../dashboard-ui'
import { annualSaving, windowSaving } from '../../../finance/optimization-data'
import { useOptimizationOpportunities } from '../../../finance/optimization-store'
import { OptimizationTable } from '../../../finance/cost-optimization/components/optimization-parts'
import type { ApprovalTabKey } from '../../approvals-nav'
import { ApprovalOptimizationDetail } from '../components/approval-optimization-detail'
import {
  ApprovalOptimizationFiltersPanel,
  defaultApprovalOptimizationFilters,
  matchesApprovalOptimizationFilters
} from '../components/approval-optimization-filters'

/**
 * APV-04: cost optimization proposals Finance sent. The list opens first; choosing one opens its
 * decision screen (`id` search param). Finance drafts are not shown.
 */
export function ApprovalOptimizationView({
  formatCurrency,
  itemId,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const items = useOptimizationOpportunities().filter((item) => item.status !== 'DRAFT')
  const [filters, setFilters] = useState(defaultApprovalOptimizationFilters)
  const selected = items.find((item) => item.id === itemId)

  if (selected) {
    return (
      <ApprovalOptimizationDetail
        formatCurrency={formatCurrency}
        item={selected}
        onBack={() => onSelectTab('optimization')}
      />
    )
  }

  const pending = items.filter((item) => item.status === 'SENT')
  const approved = items.filter((item) => item.status === 'APPROVED')
  const visible = items.filter((item) => matchesApprovalOptimizationFilters(item, filters))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('approvals.optimization.subtitle')} title={t('approvals.optimization.title')} />

      <section aria-label={t('approvals.optimization.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('approvals.optimization.pendingHint', {
            amount: formatCurrency(pending.reduce((sum, item) => sum + windowSaving(item), 0))
          })}
          icon={Clock}
          label={t('approvals.optimization.pending')}
          tone='primary'
          value={String(pending.length)}
        />
        <StatTile
          icon={Sparkles}
          label={t('approvals.optimization.annualPending')}
          tone='warning'
          value={formatCurrency(pending.reduce((sum, item) => sum + annualSaving(item), 0))}
        />
        <StatTile
          icon={CheckCircle2}
          label={t('approvals.optimization.approvedSaving')}
          tone='success'
          value={formatCurrency(approved.reduce((sum, item) => sum + windowSaving(item), 0))}
        />
      </section>

      <ApprovalOptimizationFiltersPanel applied={filters} items={items} onApply={setFilters} />

      <Panel>
        <OptimizationTable
          formatCurrency={formatCurrency}
          items={visible}
          onOpen={(id: string) => onSelectTab('optimization', { id })}
        />
      </Panel>
    </div>
  )
}
