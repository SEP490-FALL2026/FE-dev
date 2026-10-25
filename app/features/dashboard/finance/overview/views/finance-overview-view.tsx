import { BookCheck, ClipboardList, Clock, MessageSquareText, TriangleAlert, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining, useFormatPeriod } from '../../../budget-figures'
import { PageHeader, Panel, PanelTitle, Pill, StatTile, useDashboardFormat } from '../../../dashboard-ui'
import {
  budgetQuestions,
  chargeExceptions,
  closingPeriod,
  commitmentsToRecord,
  costCenters,
  currentBudgetLines,
  currentPeriod,
  financeDataAsOf,
  heldRemainders,
  monthlyBudgetLines
} from '../../finance-data'
import { sumPeriod } from '../../budget-periods'
import { financeCostCenterName } from '../../finance-demo-labels'
import type { FinanceTabKey } from '../../finance-nav'
import { AnnualBudgetOverview } from '../../annual-budget/components/annual-budget-overview'
import { BudgetPeriodFilter, useBudgetPeriod } from '../../shared/components/budget-period-filter'
import { BudgetUsageBarChart, SpendShareDonut, type CostCenterPeriodRow } from '../components/finance-overview-charts'

interface FinanceOverviewViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceOverviewView({ formatCurrency, onSelectTab }: FinanceOverviewViewProps) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatDate } = useDashboardFormat()

  const openQuestions = budgetQuestions.filter((question) => question.status === 'OPEN')
  const overdueRecordings = commitmentsToRecord.filter((item) => item.recordingDueAt <= financeDataAsOf)
  const withoutBudget = currentBudgetLines.filter((line) => line.budget === null)
  const openExceptions = chargeExceptions.filter((item) => item.status === 'CHECKING')
  const remaindersToReview = heldRemainders.filter((item) => !item.moreInvoicesExpected)

  const totals = currentBudgetLines.reduce(
    (sum, line) => ({
      actual: sum.actual + line.actual,
      budget: sum.budget + (line.budget ?? 0),
      held: sum.held + line.held
    }),
    { actual: 0, budget: 0, held: 0 }
  )

  const costCenterName = (code: string) =>
    financeCostCenterName(code, costCenters.find((cc) => cc.code === code)?.name ?? code)

  const periodState = useBudgetPeriod()
  const chartPeriodLabel = periodState.periodLabel(periodState.period)
  const chartRows: CostCenterPeriodRow[] = currentBudgetLines.map(({ costCenter }) => ({
    code: costCenter,
    name: costCenterName(costCenter),
    ...sumPeriod(monthlyBudgetLines, costCenter, periodState.period.months)
  }))

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('finance.overview.subtitle', { period: formatPeriod(currentPeriod) })}
        title={t('finance.overview.title')}
      />

      <section aria-label={t('finance.overview.workRegion')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        <StatTile
          hint={t('finance.overview.questionsHint')}
          icon={MessageSquareText}
          label={t('finance.overview.openQuestions')}
          onClick={() => onSelectTab('budget-questions')}
          tone='info'
          value={String(openQuestions.length)}
        />
        <StatTile
          hint={t('finance.overview.recordingHint', { count: overdueRecordings.length })}
          icon={BookCheck}
          label={t('finance.overview.commitmentsToRecord')}
          onClick={() => onSelectTab('commitments')}
          tone={overdueRecordings.length > 0 ? 'warning' : 'primary'}
          value={String(commitmentsToRecord.length)}
        />
        <StatTile
          hint={withoutBudget.map((line) => line.costCenter).join(', ')}
          icon={Wallet}
          label={t('finance.overview.withoutBudget')}
          onClick={() => onSelectTab('budgets')}
          tone='warning'
          value={String(withoutBudget.length)}
        />
        <StatTile
          hint={t('finance.overview.exceptionsHint')}
          icon={TriangleAlert}
          label={t('finance.overview.openExceptions')}
          onClick={() => onSelectTab('charge-exceptions')}
          tone='danger'
          value={String(openExceptions.length)}
        />
        <StatTile
          hint={t('finance.overview.closeHint', { count: remaindersToReview.length })}
          icon={ClipboardList}
          label={t('finance.overview.periodClose', { period: formatPeriod(closingPeriod) })}
          onClick={() => onSelectTab('period-close')}
          tone='neutral'
          value={t('finance.overview.closeStatus')}
        />
      </section>

      <BudgetPeriodFilter {...periodState} />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
        <BudgetUsageBarChart formatCurrency={formatCurrency} periodLabel={chartPeriodLabel} rows={chartRows} />
        <SpendShareDonut formatCurrency={formatCurrency} periodLabel={chartPeriodLabel} rows={chartRows} />
      </div>

      <AnnualBudgetOverview formatCurrency={formatCurrency} onSelectTab={onSelectTab} />

      <Panel>
        <PanelTitle
          action={
            <span className='flex items-center gap-1.5 text-[0.7rem] text-muted-foreground'>
              <Clock aria-hidden='true' className='size-3.5' />
              {t('budget.asOf', { time: formatDate(financeDataAsOf) })}
            </span>
          }
          hint={t('finance.overview.budgetTableHint')}
          title={t('finance.overview.budgetTableTitle', { period: formatPeriod(currentPeriod) })}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.budget')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.actual')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.held')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.remaining')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.deductibleVat')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {currentBudgetLines.map((line) => (
                <tr className='transition hover:bg-surface-subtle/50' key={line.costCenter}>
                  <td className='py-3'>
                    <span className='font-mono font-bold text-foreground'>{line.costCenter}</span>
                    <span className='ml-2 text-muted-foreground'>{costCenterName(line.costCenter)}</span>
                  </td>
                  <td className='py-3 text-right'>
                    {line.budget === null ? (
                      <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                    ) : (
                      formatCurrency(line.budget)
                    )}
                  </td>
                  <td className='py-3 text-right font-semibold'>{formatCurrency(line.actual)}</td>
                  <td className='py-3 text-right text-warning'>{formatCurrency(line.held)}</td>
                  <td className='py-3 text-right'>
                    <RemainingValue formatCurrency={formatCurrency} remaining={getRemaining(line)} />
                  </td>
                  <td className='py-3 text-right text-muted-foreground'>{formatCurrency(line.deductibleVat)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className='border-t-2 border-border font-bold'>
                <td className='py-3'>{t('finance.overview.totalWithBudget')}</td>
                <td className='py-3 text-right'>{formatCurrency(totals.budget)}</td>
                <td className='py-3 text-right'>{formatCurrency(totals.actual)}</td>
                <td className='py-3 text-right text-warning'>{formatCurrency(totals.held)}</td>
                <td className='py-3 text-right' colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.overview.formulaNote')}</p>
      </Panel>
    </div>
  )
}
