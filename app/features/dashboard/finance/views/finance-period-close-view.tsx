import { ArrowRight, Building2, CheckCircle2, ChevronRight, TriangleAlert, Unlock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFormatPeriod } from '../../budget-figures'
import { PageHeader, Panel, PanelTitle, Pill, StatTile, primaryButtonClassName, type Tone } from '../../dashboard-ui'
import {
  allocationLines,
  closingPeriod,
  internalCosts,
  periodCloseSummary,
  unallocatedOpenExceptions,
  type InternalCost
} from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'
import {
  allocationTotal,
  closeableCostCenters,
  initialClosures,
  summarizeCostCenterClose,
  type CloseStatus,
  type CostCenterClosure
} from '../period-close-data'
import { FinancePeriodCloseDetail } from './finance-period-close-detail'
import {
  FinancePeriodCloseFilters,
  defaultPeriodCloseFilters,
  matchesPeriodCloseFilters,
  type PeriodCloseFilters
} from './finance-period-close-filters'

const statusTones: Record<CloseStatus, Tone> = { BLOCKED: 'warning', CLOSED: 'success', READY: 'info' }

/**
 * FIN-30: the period is closed one Cost Center at a time. The list opens first; choosing a Cost Center
 * opens its close screen (`id` search param). Releases, internal costs and closures live here so they
 * survive the round trip between the two screens.
 */
export function FinancePeriodCloseView({
  costCenterId,
  formatCurrency,
  onSelectTab
}: {
  costCenterId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const [released, setReleased] = useState<Record<string, string>>({})
  const [costs, setCosts] = useState<InternalCost[]>(internalCosts)
  const [closures, setClosures] = useState<Record<string, CostCenterClosure>>(initialClosures)
  const [filters, setFilters] = useState<PeriodCloseFilters>(defaultPeriodCloseFilters)
  const selected = closeableCostCenters.find((cc) => cc.code === costCenterId)

  if (selected) {
    return (
      <FinancePeriodCloseDetail
        closures={closures}
        costCenter={selected}
        costs={costs}
        formatCurrency={formatCurrency}
        key={selected.code}
        onAddCost={(cost) => setCosts((current) => [...current, { ...cost, id: `int-${current.length + 1}` }])}
        onBack={() => onSelectTab('period-close')}
        onClose={(closure) => setClosures((current) => ({ ...current, [selected.code]: closure }))}
        onRelease={(id, reason) => setReleased((current) => ({ ...current, [id]: reason }))}
        released={released}
      />
    )
  }

  const rows = closeableCostCenters.map((cc) => ({
    cc,
    summary: summarizeCostCenterClose(cc.code, released, costs, closures)
  }))
  const visible = rows.filter((row) => matchesPeriodCloseFilters(row, filters))
  const closedCount = rows.filter((row) => row.summary.status === 'CLOSED').length
  const toRelease = rows.reduce((sum, row) => sum + row.summary.toRelease.length, 0)
  const unallocated = allocationLines.find((line) => line.costCenter === null)
  const period = formatPeriod(closingPeriod)

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={primaryButtonClassName} onClick={() => onSelectTab('cost-analysis')} type='button'>
            {t('finance.close.toAllocation')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        }
        subtitle={t('finance.close.subtitle', { period })}
        title={t('finance.close.title', { period })}
      />

      <section aria-label={t('finance.close.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('finance.close.closedHint')}
          icon={CheckCircle2}
          label={t('finance.close.closedCount')}
          tone='success'
          value={`${closedCount}/${rows.length}`}
        />
        <StatTile
          hint={t('finance.close.convertedHint')}
          icon={Building2}
          label={t('finance.close.convertedToCost')}
          tone='primary'
          value={formatCurrency(periodCloseSummary.convertedToCost)}
        />
        <StatTile icon={Unlock} label={t('finance.close.toReleaseCount')} tone='warning' value={String(toRelease)} />
      </section>

      <FinancePeriodCloseFilters applied={filters} onApply={setFilters} />

      <Panel>
        <PanelTitle hint={t('finance.close.listHint')} title={t('finance.close.listTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.periodCost')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.heldRemainder')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.internalTitle')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('finance.close.colStatus')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('finance.close.open')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map(({ cc, summary }) => (
                <tr
                  className='cursor-pointer transition hover:bg-surface-subtle/60'
                  key={cc.code}
                  onClick={() => onSelectTab('period-close', { id: cc.code })}
                >
                  <td className='py-3'>
                    <p className='font-mono font-bold text-primary'>{cc.code}</p>
                    <p className='mt-0.5 font-semibold text-foreground'>{cc.name}</p>
                  </td>
                  <td className='py-3 text-right font-semibold'>{formatCurrency(summary.periodCost)}</td>
                  <td className='py-3 text-right'>
                    {summary.heldAmount > 0 ? (
                      <span className='font-bold text-warning'>{formatCurrency(summary.heldAmount)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className='py-3 text-right'>
                    {summary.internalTotal > 0 ? formatCurrency(summary.internalTotal) : '—'}
                  </td>
                  <td className='py-3 pl-6'>
                    <Pill tone={statusTones[summary.status]}>{t(`finance.close.status.${summary.status}`)}</Pill>
                  </td>
                  <td className='py-3 text-right'>
                    <button
                      aria-label={t('finance.close.openFor', { code: cc.code })}
                      className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                      onClick={(event) => {
                        event.stopPropagation()
                        onSelectTab('period-close', { id: cc.code })
                      }}
                      type='button'
                    >
                      {t('finance.close.open')}
                      <ChevronRight aria-hidden='true' className='size-3.5' />
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                    {t('budgetPlan.filtersPlanning.periodClose.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {unallocated && (
          <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-warning/50 bg-warning/5 p-3 text-xs'>
            <span className='flex items-center gap-2 font-bold text-warning'>
              <TriangleAlert aria-hidden='true' className='size-4' />
              {t('finance.close.unallocatedRow', {
                amount: formatCurrency(allocationTotal(unallocated)),
                count: unallocatedOpenExceptions
              })}
            </span>
            <button
              className='font-bold text-primary hover:underline'
              onClick={() => onSelectTab('charge-exceptions')}
              type='button'
            >
              {t('finance.close.toExceptions')}
            </button>
          </div>
        )}
      </Panel>
    </div>
  )
}
