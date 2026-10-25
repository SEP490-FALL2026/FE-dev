import { Archive, CheckCircle2, Lock, Pencil, PiggyBank, Plus, Receipt, TriangleAlert, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining } from '../../../budget-figures'
import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import { sumPeriod, yearMonths } from '../../budget-periods'
import { financeCostCenterName, financeDepartmentName } from '../../finance-demo-labels'
import {
  commitmentsToRecord,
  costCenters,
  currentMonth,
  monthlyBudgetLines,
  splitEvenly,
  type CostCenter,
  type MonthlyBudgetLine
} from '../../finance-data'
import { BudgetPeriodFilter, useBudgetPeriod } from '../../shared/components/budget-period-filter'
import { DepartmentAnnualBudgetsPanel } from '../components/department-annual-budgets-panel'
import { BudgetEditorDialog, NewCostCenterDialog } from '../components/finance-budget-dialogs'

type Editor = { costCenter: string; mode: 'create' | 'edit' } | null
type Result = {
  backfilled: number
  costCenter: string
  mode: 'create' | 'edit'
  negative: boolean
  periodLabel: string
} | null

export function FinanceBudgetsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatPercent } = useDashboardFormat()
  const [centers, setCenters] = useState(costCenters)
  const [lines, setLines] = useState<MonthlyBudgetLine[]>(monthlyBudgetLines)
  const periodState = useBudgetPeriod()
  const { period, periodLabel } = periodState
  const [editor, setEditor] = useState<Editor>(null)
  const [result, setResult] = useState<Result>(null)
  const [showNewCenter, setShowNewCenter] = useState(false)

  const budgetCenters = [...new Set(lines.map((line) => line.costCenter))]
  const rows = budgetCenters.map((costCenter) => ({
    center: centers.find((cc) => cc.code === costCenter),
    costCenter,
    ...sumPeriod(lines, costCenter, period.months)
  }))
  const budgetedRows = rows.filter((row) => row.budget !== null)
  const totals = {
    actual: rows.reduce((sum, row) => sum + row.actual, 0),
    budget: budgetedRows.reduce((sum, row) => sum + (row.budget ?? 0), 0),
    held: rows.reduce((sum, row) => sum + row.held, 0),
    remaining: budgetedRows.reduce((sum, row) => sum + (getRemaining(row) ?? 0), 0)
  }

  const editingRow = editor ? rows.find((row) => row.costCenter === editor.costCenter) : undefined
  const unattached =
    editor?.mode === 'create' && period.months.includes(currentMonth)
      ? commitmentsToRecord.filter((item) => item.costCenter === editor.costCenter && !item.budgetAttached)
      : []

  const saveBudget = (amount: number, previewRemaining: number) => {
    if (!editor) return
    const shares = splitEvenly(amount, period.months.length)
    setLines((current) =>
      current.map((line) =>
        line.costCenter === editor.costCenter && period.months.includes(line.month)
          ? { ...line, budget: shares[period.months.indexOf(line.month)] }
          : line
      )
    )
    setResult({
      backfilled: unattached.length,
      costCenter: editor.costCenter,
      mode: editor.mode,
      negative: previewRemaining < 0,
      periodLabel: periodLabel(period)
    })
    setEditor(null)
  }

  const addCenter = (center: Pick<CostCenter, 'code' | 'kind' | 'name'>) => {
    setCenters((current) => [...current, { ...center, status: 'ACTIVE' }])
    setLines((current) => [
      ...current,
      ...yearMonths.map((month) => ({ actual: 0, budget: null, costCenter: center.code, held: 0, month }))
    ])
    setShowNewCenter(false)
  }

  const retireCenter = (code: string) =>
    setCenters((current) => current.map((cc) => (cc.code === code ? { ...cc, status: 'RETIRED' } : cc)))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('finance.budgets.subtitle')} title={t('finance.budgets.title')} />

      {result && (
        <Notice icon={result.negative ? TriangleAlert : CheckCircle2} tone={result.negative ? 'danger' : 'success'}>
          <p>
            {result.mode === 'create'
              ? t('finance.budgets.createdResult', {
                  costCenter: result.costCenter,
                  count: result.backfilled,
                  period: result.periodLabel
                })
              : t('finance.budgets.editedResult', { costCenter: result.costCenter, period: result.periodLabel })}
          </p>
          {result.negative && <p className='mt-1'>{t('finance.budgets.negativeResult')}</p>}
        </Notice>
      )}

      <section aria-label={t('finance.budgets.summaryRegion')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('finance.budgets.tileBudgetHint', { count: budgetedRows.length, total: rows.length })}
          icon={Wallet}
          label={t('finance.budgets.tileBudget')}
          value={formatCompactCurrency(totals.budget)}
        />
        <StatTile
          hint={t('finance.budgets.tileActualHint')}
          icon={Receipt}
          label={t('budget.actual')}
          tone='info'
          value={formatCompactCurrency(totals.actual)}
        />
        <StatTile
          hint={t('finance.budgets.tileHeldHint')}
          icon={Lock}
          label={t('budget.held')}
          tone='warning'
          value={formatCompactCurrency(totals.held)}
        />
        <StatTile
          hint={t('finance.budgets.tileRemainingHint')}
          icon={PiggyBank}
          label={t('budget.remaining')}
          tone={totals.remaining < 0 ? 'danger' : 'success'}
          value={formatCompactCurrency(totals.remaining)}
        />
      </section>

      <BudgetPeriodFilter {...periodState} />

      <Panel>
        <PanelTitle
          hint={t('finance.budgets.budgetsHint')}
          title={t('finance.budgets.budgetsTitle', { period: periodLabel(period) })}
        />
        <div className='mt-3 flex flex-wrap items-center gap-4 text-[0.7rem] text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <span aria-hidden='true' className='size-2.5 rounded-sm bg-primary' />
            {t('budget.actual')}
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <span aria-hidden='true' className='size-2.5 rounded-sm bg-warning' />
            {t('budget.held')}
          </span>
          <span>{t('finance.budgets.compactNote')}</span>
        </div>

        <div className='mt-3 overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='w-[32%] py-2.5 pl-4 font-semibold'>{t('finance.budgets.colUsage')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.budget')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.actual')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.held')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.remaining')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.budgets.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {rows.map((row) => {
                const remaining = getRemaining(row)
                const used = row.budget ? (row.actual + row.held) / row.budget : null
                const scale = Math.max(row.budget ?? 0, row.actual + row.held) || 1

                return (
                  <tr key={row.costCenter}>
                    <td className='py-3'>
                      <p className='font-mono font-bold'>{row.costCenter}</p>
                      {row.center && (
                        <p className='text-[0.7rem] text-muted-foreground'>
                          {financeCostCenterName(row.center.code, row.center.name)}
                        </p>
                      )}
                    </td>
                    <td className='py-3 pl-4'>
                      {used === null ? (
                        <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                      ) : (
                        <div className='flex items-center gap-3'>
                          <div
                            aria-label={t('finance.budgets.usageAria', { percent: formatPercent(used) })}
                            className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-subtle'
                            role='img'
                          >
                            <div
                              className='absolute inset-y-0 left-0 bg-primary'
                              style={{ width: `${(row.actual / scale) * 100}%` }}
                            />
                            <div
                              className='absolute inset-y-0 bg-warning'
                              style={{ left: `${(row.actual / scale) * 100}%`, width: `${(row.held / scale) * 100}%` }}
                            />
                          </div>
                          <span
                            className={`w-10 text-right font-bold tabular-nums ${
                              used > 1 ? 'text-danger' : used > 0.85 ? 'text-warning' : 'text-foreground'
                            }`}
                          >
                            {formatPercent(used)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td
                      className='py-3 text-right tabular-nums'
                      title={row.budget === null ? undefined : formatCurrency(row.budget)}
                    >
                      {row.budget === null ? '—' : formatCompactCurrency(row.budget)}
                    </td>
                    <td className='py-3 text-right tabular-nums' title={formatCurrency(row.actual)}>
                      {formatCompactCurrency(row.actual)}
                    </td>
                    <td className='py-3 text-right text-warning tabular-nums' title={formatCurrency(row.held)}>
                      {formatCompactCurrency(row.held)}
                    </td>
                    <td
                      className='py-3 text-right tabular-nums'
                      title={remaining === null ? undefined : formatCurrency(remaining)}
                    >
                      {remaining === null ? (
                        '—'
                      ) : (
                        <RemainingValue formatCurrency={formatCompactCurrency} remaining={remaining} />
                      )}
                    </td>
                    <td className='py-3 text-right'>
                      {row.budget === null ? (
                        <button
                          className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                          onClick={() => setEditor({ costCenter: row.costCenter, mode: 'create' })}
                          type='button'
                        >
                          <Plus aria-hidden='true' className='size-3.5' />
                          {t('finance.budgets.create')}
                        </button>
                      ) : (
                        <button
                          className='inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-primary'
                          onClick={() => setEditor({ costCenter: row.costCenter, mode: 'edit' })}
                          type='button'
                        >
                          <Pencil aria-hidden='true' className='size-3.5' />
                          {t('finance.budgets.edit')}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <PanelTitle
          action={
            <button className={secondaryButtonClassName} onClick={() => setShowNewCenter(true)} type='button'>
              <Plus aria-hidden='true' className='size-3.5' />
              {t('finance.budgets.addCenter')}
            </button>
          }
          hint={t('finance.budgets.catalogHint')}
          title={t('finance.budgets.catalogTitle')}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-160 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.budgets.colKind')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.budgets.colDepartment')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.budgets.colStatus')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.budgets.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {centers.map((cc) => (
                <tr className={cc.status === 'RETIRED' ? 'text-muted-foreground' : ''} key={cc.code}>
                  <td className='py-3'>
                    <span className='font-mono font-bold'>{cc.code}</span>
                    <span className='ml-2'>{financeCostCenterName(cc.code, cc.name)}</span>
                  </td>
                  <td className='py-3'>
                    <Pill tone={cc.kind === 'COMPANY' ? 'info' : 'primary'}>
                      {t(`finance.budgets.kind.${cc.kind}`)}
                    </Pill>
                  </td>
                  <td className='py-3'>{cc.department ? financeDepartmentName(cc.code, cc.department) : '—'}</td>
                  <td className='py-3'>
                    {cc.status === 'ACTIVE' ? (
                      <Pill tone='success'>{t('finance.budgets.status.ACTIVE')}</Pill>
                    ) : (
                      <span className='flex flex-wrap items-center gap-1.5'>
                        <Pill>{t('finance.budgets.status.RETIRED')}</Pill>
                        {cc.replacedBy && (
                          <span className='text-[0.7rem]'>
                            {t('finance.budgets.replacedBy', { code: cc.replacedBy })}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className='py-3 text-right'>
                    {cc.status === 'ACTIVE' && (
                      <button
                        className='inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-danger'
                        onClick={() => retireCenter(cc.code)}
                        type='button'
                      >
                        <Archive aria-hidden='true' className='size-3.5' />
                        {t('finance.budgets.retire')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.budgets.catalogNote')}</p>
      </Panel>

      <DepartmentAnnualBudgetsPanel formatCurrency={formatCurrency} />

      {editor && editingRow && (
        <BudgetEditorDialog
          costCenter={editor.costCenter}
          figures={editingRow}
          formatCurrency={formatCurrency}
          key={`${editor.costCenter}-${period.key}`}
          mode={editor.mode}
          onClose={() => setEditor(null)}
          onSave={saveBudget}
          periodLabel={periodLabel(period)}
          unattached={unattached}
        />
      )}

      {showNewCenter && (
        <NewCostCenterDialog
          existingCodes={centers.map((cc) => cc.code)}
          onClose={() => setShowNewCenter(false)}
          onSave={addCenter}
        />
      )}
    </div>
  )
}
