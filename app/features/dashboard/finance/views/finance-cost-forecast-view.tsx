import { ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFormatPeriod } from '../../budget-figures'
import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { committedForecast, currentPeriod, scenarioDefaults, upcomingRenewals } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'
import { windowSaving, type OptimizationKind } from '../optimization-data'
import { useOptimizationOpportunities } from '../optimization-store'
import { ColumnChartPanel, DonutChartPanel } from './finance-chart-panels'

const optimizationKinds: readonly OptimizationKind[] = ['GHOST_SEAT', 'DOWNGRADE', 'CANCEL']

interface FinanceCostForecastViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}

/** FIN-33: L1 committed forecast and L3 scenarios for the next period, with the effect of optimization. */
export function FinanceCostForecastView({ formatCurrency, onSelectTab }: FinanceCostForecastViewProps) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatDate, formatMonthYear } = useDashboardFormat()
  const [assumptions, setAssumptions] = useState(scenarioDefaults)
  const opportunities = useOptimizationOpportunities()

  const l1Total = committedForecast.reduce((sum, month) => sum + month.value, 0)
  const variable = assumptions.newHires * assumptions.costPerHire + assumptions.newProjects
  const scenarios = [
    { key: 'low', value: l1Total + variable * 0.5 },
    { key: 'base', value: l1Total + variable },
    { key: 'high', value: l1Total + variable * 1.5 }
  ] as const
  const sumSaving = (approved: boolean) =>
    opportunities
      .filter((item) => (approved ? item.status === 'APPROVED' : item.status === 'DRAFT' || item.status === 'SENT'))
      .reduce((sum, item) => sum + windowSaving(item), 0)
  const approvedSaving = sumSaving(true)
  const pendingSaving = sumSaving(false)
  const base = l1Total + variable
  const hiresCost = assumptions.newHires * assumptions.costPerHire
  const liveOpportunities = opportunities.filter((item) => item.status !== 'REJECTED')

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={primaryButtonClassName} onClick={() => onSelectTab('cost-optimization')} type='button'>
            {t('finance.forecast.toOptimization')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        }
        subtitle={t('finance.forecast.subtitle')}
        title={t('finance.forecast.title', { period: formatPeriod(currentPeriod) })}
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        <Panel>
          <PanelTitle hint={t('finance.analysis.l1Hint')} title={t('finance.analysis.l1Title')} />
          <ul className='mt-4 divide-y divide-border text-xs'>
            {committedForecast.map((month) => (
              <li className='flex justify-between py-2' key={month.month}>
                <span className='text-muted-foreground'>{formatMonthYear(month.month)}</span>
                <span className='font-bold'>{formatCurrency(month.value)}</span>
              </li>
            ))}
            <li className='flex justify-between py-2 font-bold'>
              <span>{t('finance.analysis.l1Total')}</span>
              <span className='text-primary'>{formatCurrency(l1Total)}</span>
            </li>
          </ul>
          <p className='mt-4 text-xs font-bold'>{t('finance.analysis.upcomingRenewals')}</p>
          <ul className='mt-2 space-y-1.5 text-xs'>
            {upcomingRenewals.map((renewal) => (
              <li className='flex justify-between gap-2' key={renewal.name}>
                <span className='text-muted-foreground'>
                  {renewal.name} · {formatDate(renewal.date)}
                </span>
                <span className='font-semibold'>{formatCurrency(renewal.cost)}</span>
              </li>
            ))}
          </ul>
          <div className='mt-4'>
            <Notice icon={Info} tone='neutral'>
              {t('finance.analysis.l2Deferred')}
            </Notice>
          </div>
        </Panel>

        <Panel>
          <PanelTitle hint={t('finance.analysis.l3Hint')} title={t('finance.analysis.l3Title')} />
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {(
              [
                ['newHires', 'finance.analysis.assumption.newHires'],
                ['costPerHire', 'finance.analysis.assumption.costPerHire'],
                ['newProjects', 'finance.analysis.assumption.newProjects']
              ] as const
            ).map(([key, labelKey]) => (
              <div key={key}>
                <label className='text-[0.7rem] font-bold text-muted-foreground' htmlFor={`assumption-${key}`}>
                  {t(labelKey)}
                </label>
                <input
                  className={`${inputClassName} mt-1`}
                  id={`assumption-${key}`}
                  inputMode='numeric'
                  onChange={(event) =>
                    setAssumptions((current) => ({ ...current, [key]: Number(event.target.value.replace(/\D/g, '')) }))
                  }
                  value={String(assumptions[key])}
                />
              </div>
            ))}
          </div>
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {scenarios.map((scenario) => (
              <div
                className={`rounded-xl border p-3 ${scenario.key === 'base' ? 'border-primary bg-primary-soft/30' : 'border-border'}`}
                key={scenario.key}
              >
                <p className='text-[0.7rem] font-bold text-muted-foreground'>
                  {t(`finance.analysis.scenario.${scenario.key}`)}
                </p>
                <p className='mt-1 text-base font-extrabold'>{formatCurrency(scenario.value)}</p>
              </div>
            ))}
          </div>
          <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.analysis.l3Note')}</p>

          <div className='mt-4 border-t border-border pt-4'>
            <p className='text-xs font-bold'>{t('finance.forecast.optimizedTitle')}</p>
            <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('finance.forecast.optimizedHint')}</p>
            <ul className='mt-2 divide-y divide-border text-xs'>
              <li className='flex justify-between py-2'>
                <span className='text-muted-foreground'>{t('finance.forecast.approvedLine')}</span>
                <span className='font-semibold text-success'>− {formatCurrency(approvedSaving)}</span>
              </li>
              <li className='flex justify-between py-2'>
                <span className='text-muted-foreground'>{t('finance.forecast.pendingLine')}</span>
                <span className='font-semibold text-warning'>− {formatCurrency(pendingSaving)}</span>
              </li>
              <li className='flex justify-between py-2 font-bold'>
                <span>{t('finance.forecast.baseAfterApproved')}</span>
                <span className='text-primary'>{formatCurrency(base - approvedSaving)}</span>
              </li>
              <li className='flex justify-between py-2 font-bold'>
                <span>{t('finance.forecast.baseAfterAll')}</span>
                <span>{formatCurrency(base - approvedSaving - pendingSaving)}</span>
              </li>
            </ul>
          </div>
        </Panel>
      </div>

      <div className='grid gap-6 xl:grid-cols-2'>
        <ColumnChartPanel
          data={committedForecast.map((month) => ({
            key: month.month,
            label: formatMonthYear(month.month),
            value: month.value
          }))}
          formatCurrency={formatCurrency}
          hint={t('budgetPlan.forecastCharts.monthlyHint')}
          title={t('budgetPlan.forecastCharts.monthlyTitle', { period: formatPeriod(currentPeriod) })}
        />
        <DonutChartPanel
          centerLabel={t('finance.analysis.scenario.base')}
          data={[
            { key: 'committed', label: t('budgetPlan.forecastCharts.part.committed'), value: l1Total },
            { key: 'hires', label: t('budgetPlan.forecastCharts.part.hires'), value: hiresCost },
            { key: 'projects', label: t('budgetPlan.forecastCharts.part.projects'), value: assumptions.newProjects }
          ]}
          formatCurrency={formatCurrency}
          hint={t('budgetPlan.forecastCharts.compositionHint')}
          title={t('budgetPlan.forecastCharts.compositionTitle')}
        />
        <ColumnChartPanel
          data={[
            ...scenarios.map((scenario) => ({
              highlight: scenario.key === 'base',
              key: scenario.key,
              label: t(`finance.analysis.scenario.${scenario.key}`),
              value: scenario.value
            })),
            {
              highlight: false,
              key: 'afterApproved',
              label: t('budgetPlan.forecastCharts.afterApproved'),
              value: base - approvedSaving
            },
            {
              highlight: false,
              key: 'afterAll',
              label: t('budgetPlan.forecastCharts.afterAll'),
              value: base - approvedSaving - pendingSaving
            }
          ]}
          formatCurrency={formatCurrency}
          hint={t('budgetPlan.forecastCharts.scenarioHint')}
          title={t('budgetPlan.forecastCharts.scenarioTitle')}
        />
        <DonutChartPanel
          centerLabel={t('budgetPlan.forecastCharts.savingsCenter')}
          data={optimizationKinds.map((kind) => ({
            key: kind,
            label: t(`finance.optimization.kind.${kind}`),
            value: liveOpportunities
              .filter((item) => item.kind === kind)
              .reduce((sum, item) => sum + windowSaving(item), 0)
          }))}
          formatCurrency={formatCurrency}
          hint={t('budgetPlan.forecastCharts.savingsHint')}
          title={t('budgetPlan.forecastCharts.savingsTitle')}
        />
      </div>
    </div>
  )
}
