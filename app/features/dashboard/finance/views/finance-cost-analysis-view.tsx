import { ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining } from '../../budget-figures'
import {
  FilterChips,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import {
  allocationLines,
  budgetVsActual,
  closingPeriod,
  committedForecast,
  priorPeriodAdjustment,
  scenarioDefaults,
  unallocatedOpenExceptions,
  upcomingRenewals,
  type AllocationLine
} from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

type Basis = 'cash' | 'period'

interface FinanceCostAnalysisViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}

const allocationTotal = (line: AllocationLine) =>
  line.sharedByRatio + line.personalSeats + line.sharedAccounts + line.internal

export function FinanceCostAnalysisView({ formatCurrency, onSelectTab }: FinanceCostAnalysisViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate, formatMonthYear } = useDashboardFormat()
  const [basis, setBasis] = useState<Basis>('period')
  const [assumptions, setAssumptions] = useState(scenarioDefaults)

  const allocated = allocationLines.filter((line) => line.costCenter !== null)
  const unallocated = allocationLines.find((line) => line.costCenter === null)
  const bvaTotals = budgetVsActual.reduce(
    (sum, line) => ({
      actual: sum.actual + (basis === 'cash' ? line.cashActual : line.periodActual),
      budget: sum.budget + (line.budget ?? 0),
      held: sum.held + line.held,
      vat: sum.vat + line.deductibleVat
    }),
    { actual: 0, budget: 0, held: 0, vat: 0 }
  )

  const l1Total = committedForecast.reduce((sum, month) => sum + month.value, 0)
  const variable = assumptions.newHires * assumptions.costPerHire + assumptions.newProjects
  const scenarios = [
    { key: 'low', value: l1Total + variable * 0.5 },
    { key: 'base', value: l1Total + variable },
    { key: 'high', value: l1Total + variable * 1.5 }
  ] as const

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={primaryButtonClassName} onClick={() => onSelectTab('period-report')} type='button'>
            {t('finance.analysis.toReport')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        }
        code='UF-19 · FIN-32 → FIN-33'
        subtitle={t('finance.analysis.subtitle', { period: closingPeriod })}
        title={t('finance.analysis.title', { period: closingPeriod })}
      />

      <Panel>
        <PanelTitle hint={t('finance.analysis.allocationHint')} title={t('finance.analysis.allocationTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.analysis.sharedByRatio')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.analysis.personalSeats')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.analysis.sharedAccounts')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.analysis.internal')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.analysis.total')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {allocated.map((line) => (
                <tr key={line.costCenter}>
                  <td className='py-3 font-mono font-bold'>{line.costCenter}</td>
                  <td className='py-3 text-right'>{formatCurrency(line.sharedByRatio)}</td>
                  <td className='py-3 text-right'>{formatCurrency(line.personalSeats)}</td>
                  <td className='py-3 text-right'>{formatCurrency(line.sharedAccounts)}</td>
                  <td className='py-3 text-right'>{formatCurrency(line.internal)}</td>
                  <td className='py-3 text-right font-bold'>{formatCurrency(allocationTotal(line))}</td>
                </tr>
              ))}
            </tbody>
            {unallocated && (
              <tfoot>
                <tr className='border-t-2 border-dashed border-warning/50 bg-warning/5'>
                  <td className='py-3'>
                    <span className='flex flex-wrap items-center gap-2 font-bold text-warning'>
                      {t('finance.analysis.unallocated')}
                      <Pill tone='warning'>
                        {t('finance.analysis.openExceptions', { count: unallocatedOpenExceptions })}
                      </Pill>
                    </span>
                  </td>
                  <td className='py-3 text-right'>{formatCurrency(unallocated.sharedByRatio)}</td>
                  <td className='py-3 text-right'>{formatCurrency(unallocated.personalSeats)}</td>
                  <td className='py-3 text-right'>—</td>
                  <td className='py-3 text-right'>—</td>
                  <td className='py-3 text-right font-bold text-warning'>
                    {formatCurrency(allocationTotal(unallocated))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.analysis.unallocatedNote')}</p>
      </Panel>

      <Panel>
        <PanelTitle
          action={
            <FilterChips<Basis>
              label={t('finance.analysis.basisLabel')}
              onChange={setBasis}
              options={[
                { label: t('finance.analysis.basis.period'), value: 'period' },
                { label: t('finance.analysis.basis.cash'), value: 'cash' }
              ]}
              value={basis}
            />
          }
          hint={t(`finance.analysis.basisHint.${basis}`)}
          title={t('finance.analysis.bvaTitle')}
        />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.budget')}</th>
                <th className='py-2.5 text-right font-semibold'>
                  {t('budget.actual')} · {t(`finance.analysis.basis.${basis}`)}
                </th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.held')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.remaining')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.deductibleVat')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {budgetVsActual.map((line) => {
                const actual = basis === 'cash' ? line.cashActual : line.periodActual

                return (
                  <tr className={line.costCenter === null ? 'bg-warning/5' : ''} key={line.costCenter ?? 'unallocated'}>
                    <td className='py-3 font-mono font-bold'>
                      {line.costCenter ?? (
                        <span className='font-sans text-warning'>{t('finance.analysis.unallocated')}</span>
                      )}
                    </td>
                    <td className='py-3 text-right'>
                      {line.costCenter === null ? (
                        '—'
                      ) : line.budget === null ? (
                        <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                      ) : (
                        formatCurrency(line.budget)
                      )}
                    </td>
                    <td className='py-3 text-right font-semibold'>{formatCurrency(actual)}</td>
                    <td className='py-3 text-right text-warning'>{formatCurrency(line.held)}</td>
                    <td className='py-3 text-right'>
                      {line.costCenter === null ? (
                        '—'
                      ) : (
                        <RemainingValue
                          formatCurrency={formatCurrency}
                          remaining={getRemaining({ actual, budget: line.budget, held: line.held })}
                        />
                      )}
                    </td>
                    <td className='py-3 text-right text-muted-foreground'>{formatCurrency(line.deductibleVat)}</td>
                  </tr>
                )
              })}
              <tr className='text-muted-foreground'>
                <td className='py-3' colSpan={2}>
                  <Pill tone='info'>
                    {t('finance.analysis.priorAdjustment', { period: priorPeriodAdjustment.period })}
                  </Pill>
                </td>
                <td className='py-3 text-right'>{formatCurrency(priorPeriodAdjustment.amount)}</td>
                <td colSpan={3} />
              </tr>
            </tbody>
            <tfoot>
              <tr className='border-t-2 border-border font-bold'>
                <td className='py-3'>{t('finance.analysis.total')}</td>
                <td className='py-3 text-right'>{formatCurrency(bvaTotals.budget)}</td>
                <td className='py-3 text-right'>{formatCurrency(bvaTotals.actual)}</td>
                <td className='py-3 text-right text-warning'>{formatCurrency(bvaTotals.held)}</td>
                <td className='py-3 text-right'>
                  <RemainingValue
                    formatCurrency={formatCurrency}
                    remaining={bvaTotals.budget - bvaTotals.actual - bvaTotals.held}
                  />
                </td>
                <td className='py-3 text-right text-muted-foreground'>{formatCurrency(bvaTotals.vat)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('budget.borneCostNote')}</p>
      </Panel>

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
        </Panel>
      </div>
    </div>
  )
}
