import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining, useFormatPeriod } from '../../../budget-figures'
import { FilterChips, PageHeader, Panel, PanelTitle, Pill, primaryButtonClassName } from '../../../dashboard-ui'
import {
  allocationLines,
  budgetVsActual,
  closingPeriod,
  priorPeriodAdjustment,
  unallocatedOpenExceptions
} from '../../finance-data'
import type { FinanceTabKey } from '../../finance-nav'
import { allocationTotal } from '../../period-close-data'

type Basis = 'cash' | 'period'

interface FinanceCostAnalysisViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}

export function FinanceCostAnalysisView({ formatCurrency, onSelectTab }: FinanceCostAnalysisViewProps) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const [basis, setBasis] = useState<Basis>('period')

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

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={primaryButtonClassName} onClick={() => onSelectTab('period-report')} type='button'>
            {t('finance.analysis.toReport')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        }
        subtitle={t('finance.analysis.subtitle', { period: formatPeriod(closingPeriod) })}
        title={t('finance.analysis.title', { period: formatPeriod(closingPeriod) })}
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
                    {t('finance.analysis.priorAdjustment', { period: formatPeriod(priorPeriodAdjustment.period) })}
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
    </div>
  )
}
