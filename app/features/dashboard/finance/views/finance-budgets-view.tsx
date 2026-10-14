import {
  Archive,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Link2,
  Lock,
  Pencil,
  PiggyBank,
  Plus,
  TriangleAlert,
  Wallet
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining } from '../../budget-figures'
import {
  Modal,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  dangerButtonClassName,
  compactSelectClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { ChartLegend, type ChartSeries } from '../finance-charts'
import { budgetPeriodType, commitmentsToRecord, costCenters, type CostCenter } from '../finance-data'
import { currentQuarter, getQuarterToDateFigures, periodOptions, type PeriodLine } from '../finance-period-figures'

type Dialog =
  | { costCenter: string; mode: 'create' | 'edit'; type: 'budget' }
  | { code: string; type: 'retire' }
  | { type: 'center' }
  | null

type Result = { backfilled: number; costCenter: string; mode: 'create' | 'edit'; negative: boolean } | null

const emptyCenter = { code: '', department: '', kind: 'UNIT' as CostCenter['kind'], name: '' }

export function FinanceBudgetsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatMonthYear, formatPercent, formatPeriod } = useDashboardFormat()
  const [month, setMonth] = useState(periodOptions.month[periodOptions.month.length - 1])
  const [budgetOverrides, setBudgetOverrides] = useState<Record<string, number>>({})
  const [centers, setCenters] = useState(costCenters)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [newCenter, setNewCenter] = useState(emptyCenter)
  const [showErrors, setShowErrors] = useState(false)
  const [result, setResult] = useState<Result>(null)

  const { lines: monthLines, quarter: quarterCode } = getQuarterToDateFigures(month)
  const quarter = formatPeriod(quarterCode)
  const editable = quarterCode === currentQuarter
  const lines: PeriodLine[] = monthLines.map((line) =>
    editable && line.costCenter && budgetOverrides[line.costCenter] !== undefined
      ? { ...line, budget: budgetOverrides[line.costCenter] }
      : line
  )

  const budgeted = lines.filter((line) => line.budget !== null)
  const totalBudget = budgeted.reduce((sum, line) => sum + (line.budget ?? 0), 0)
  const totalUsed = budgeted.reduce((sum, line) => sum + line.actual + line.held, 0)
  const unbudgeted = lines.filter((line) => line.budget === null)

  const series: ChartSeries[] = [
    { color: 'var(--chart-1)', key: 'actual', label: t('budget.actual') },
    { color: 'var(--chart-2)', key: 'held', label: t('budget.held') },
    { color: 'var(--chart-track)', key: 'remaining', label: t('budget.remaining') }
  ]

  // ---- Budget dialog
  const budgetDialog = dialog?.type === 'budget' ? dialog : null
  const editingLine = budgetDialog ? lines.find((line) => line.costCenter === budgetDialog.costCenter) : undefined
  const parsedAmount = Number(amount.replace(/\D/g, ''))
  const unattached = budgetDialog
    ? commitmentsToRecord.filter((item) => item.costCenter === budgetDialog.costCenter && !item.budgetAttached)
    : []
  const previewRemaining =
    editingLine && parsedAmount > 0 ? getRemaining({ ...editingLine, budget: parsedAmount }) : null

  const closeDialog = () => {
    setDialog(null)
    setShowErrors(false)
  }

  const openBudget = (costCenter: string, mode: 'create' | 'edit') => {
    setAmount('')
    setReason('')
    setShowErrors(false)
    setDialog({ costCenter, mode, type: 'budget' })
  }

  const saveBudget = () => {
    if (!budgetDialog) return
    if (parsedAmount <= 0 || (budgetDialog.mode === 'edit' && reason.trim().length === 0)) {
      setShowErrors(true)
      return
    }
    setBudgetOverrides((current) => ({ ...current, [budgetDialog.costCenter]: parsedAmount }))
    setResult({
      backfilled: budgetDialog.mode === 'create' ? unattached.length : 0,
      costCenter: budgetDialog.costCenter,
      mode: budgetDialog.mode,
      negative: (previewRemaining ?? 0) < 0
    })
    closeDialog()
  }

  const addCenter = () => {
    if (!newCenter.code.trim() || !newCenter.name.trim()) {
      setShowErrors(true)
      return
    }
    setCenters((current) => [
      ...current,
      {
        code: newCenter.code.trim().toUpperCase(),
        department: newCenter.department.trim() || undefined,
        kind: newCenter.kind,
        name: newCenter.name.trim(),
        status: 'ACTIVE'
      }
    ])
    setNewCenter(emptyCenter)
    closeDialog()
  }

  const retireCenter = (code: string) => {
    setCenters((current) => current.map((cc) => (cc.code === code ? { ...cc, status: 'RETIRED' } : cc)))
    closeDialog()
  }

  const centerName = (code: string | null) => centers.find((cc) => cc.code === code)?.name ?? ''

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <span className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground'>
            <CalendarRange aria-hidden='true' className='size-4 text-primary' />
            {t('finance.budgets.periodType', { type: t(`finance.budgets.periodTypes.${budgetPeriodType}`) })}
          </span>
        }
        code='UF-11 · FIN-22 → FIN-06'
        subtitle={t('finance.budgets.subtitle')}
        title={t('finance.budgets.title')}
      />

      {result && (
        <Notice icon={result.negative ? TriangleAlert : CheckCircle2} tone={result.negative ? 'danger' : 'success'}>
          <p>
            {result.mode === 'create'
              ? t('finance.budgets.createdResult', { costCenter: result.costCenter, count: result.backfilled })
              : t('finance.budgets.editedResult', { costCenter: result.costCenter })}
          </p>
          {result.negative && <p className='mt-1'>{t('finance.budgets.negativeResult')}</p>}
        </Notice>
      )}

      <section aria-label={t('finance.budgets.summaryLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('finance.budgets.summary.totalHint', { count: budgeted.length })}
          icon={Wallet}
          label={t('finance.budgets.summary.total', { quarter })}
          value={formatCompactCurrency(totalBudget)}
        />
        <StatTile
          hint={formatCompactCurrency(totalUsed)}
          icon={CircleDollarSign}
          label={t('finance.budgets.summary.used')}
          tone={totalBudget > 0 && totalUsed / totalBudget > 0.85 ? 'warning' : 'info'}
          value={totalBudget > 0 ? formatPercent(totalUsed / totalBudget) : '—'}
        />
        <StatTile
          icon={PiggyBank}
          label={t('budget.remaining')}
          tone='success'
          value={formatCompactCurrency(totalBudget - totalUsed)}
        />
        <StatTile
          hint={unbudgeted.map((line) => line.costCenter).join(', ') || undefined}
          icon={TriangleAlert}
          label={t('finance.overview.withoutBudget')}
          tone={unbudgeted.length > 0 ? 'warning' : 'neutral'}
          value={String(unbudgeted.length)}
        />
      </section>

      <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm'>
        <label className='flex items-center gap-2 text-xs font-bold text-foreground' htmlFor='budget-month'>
          <CalendarRange aria-hidden='true' className='size-4 text-primary' />
          {t('finance.budgets.monthLabel')}
        </label>
        <select
          className={compactSelectClassName}
          id='budget-month'
          onChange={(event) => setMonth(event.target.value)}
          value={month}
        >
          {periodOptions.month.map((option) => (
            <option key={option} value={option}>
              {formatMonthYear(`${option}-01`)}
            </option>
          ))}
        </select>
        <span className='text-xs text-muted-foreground'>
          {t('finance.budgets.periodInfo', { month: formatMonthYear(`${month}-01`), quarter })}
        </span>
        {!editable && (
          <Pill>
            <Lock aria-hidden='true' className='size-3' />
            {t('finance.budgets.readOnly')}
          </Pill>
        )}
      </div>

      <Panel>
        <PanelTitle
          action={<ChartLegend series={series} />}
          hint={t('finance.budgets.budgetsHint')}
          title={t('finance.budgets.budgetsTitle', { period: quarter })}
        />

        <ul className='mt-4 divide-y divide-border'>
          {lines.map((line) => {
            const code = line.costCenter ?? ''
            const remaining = getRemaining(line)
            const budget = line.budget ?? 0
            const ratio = budget > 0 ? (line.actual + line.held) / budget : 0
            const isOver = remaining !== null && remaining < 0
            const width = (value: number) => `${budget > 0 ? Math.min(100, (value / budget) * 100) : 0}%`

            return (
              <li
                className='grid items-center gap-x-6 gap-y-3 py-4 md:grid-cols-[10rem_minmax(0,1fr)_9rem_8.5rem]'
                key={code}
              >
                <div className='min-w-0'>
                  <p className='font-mono text-sm font-bold text-foreground'>{code}</p>
                  <p className='truncate text-xs text-muted-foreground'>{centerName(line.costCenter)}</p>
                </div>

                {line.budget === null ? (
                  <div className='flex flex-wrap items-center gap-2 text-xs'>
                    <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                    <span className='text-muted-foreground'>
                      {t('finance.budgets.unbudgetedExposure', {
                        amount: formatCompactCurrency(line.actual + line.held)
                      })}
                    </span>
                  </div>
                ) : (
                  <div className='min-w-0'>
                    <div className='flex items-baseline justify-between gap-2 text-xs'>
                      <span className={`font-bold ${isOver ? 'text-danger' : 'text-foreground'}`}>
                        {t('finance.budgets.usedPercent', { percent: formatPercent(ratio) })}
                      </span>
                      <span className='text-muted-foreground'>
                        {t('finance.budgets.ofBudget', { budget: formatCompactCurrency(budget) })}
                      </span>
                    </div>
                    <div
                      aria-label={t('finance.budgets.usedPercent', { percent: formatPercent(ratio) })}
                      className='mt-1.5 flex h-2.5 gap-0.5 overflow-hidden rounded-full'
                      role='img'
                      style={{ backgroundColor: 'var(--chart-track)' }}
                    >
                      {isOver ? (
                        <div className='h-full w-full bg-danger' />
                      ) : (
                        <>
                          <div
                            className='h-full'
                            style={{ backgroundColor: 'var(--chart-1)', width: width(line.actual) }}
                          />
                          <div
                            className='h-full'
                            style={{ backgroundColor: 'var(--chart-2)', width: width(line.held) }}
                          />
                        </>
                      )}
                    </div>
                    <p className='mt-1.5 text-[0.7rem] text-muted-foreground'>
                      {t('finance.budgets.breakdown', {
                        actual: formatCompactCurrency(line.actual),
                        held: formatCompactCurrency(line.held)
                      })}
                    </p>
                  </div>
                )}

                <div className='md:text-right'>
                  <p className='text-[0.7rem] font-semibold text-muted-foreground'>{t('budget.remaining')}</p>
                  <div className='text-sm' title={remaining === null ? undefined : formatCurrency(remaining)}>
                    {remaining === null ? (
                      <span className='text-muted-foreground'>—</span>
                    ) : (
                      <RemainingValue formatCurrency={formatCompactCurrency} remaining={remaining} />
                    )}
                  </div>
                </div>

                <div className='md:text-right'>
                  {!editable ? null : line.budget === null ? (
                    <button className={primaryButtonClassName} onClick={() => openBudget(code, 'create')} type='button'>
                      <Plus aria-hidden='true' className='size-3.5' />
                      {t('finance.budgets.create')}
                    </button>
                  ) : (
                    <button className={secondaryButtonClassName} onClick={() => openBudget(code, 'edit')} type='button'>
                      <Pencil aria-hidden='true' className='size-3.5' />
                      {t('finance.budgets.edit')}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel>
        <PanelTitle
          action={
            <button
              className={secondaryButtonClassName}
              onClick={() => {
                setNewCenter(emptyCenter)
                setShowErrors(false)
                setDialog({ type: 'center' })
              }}
              type='button'
            >
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
                    <span className='ml-2'>{cc.name}</span>
                  </td>
                  <td className='py-3'>
                    <Pill tone={cc.kind === 'COMPANY' ? 'info' : 'primary'}>
                      {t(`finance.budgets.kind.${cc.kind}`)}
                    </Pill>
                  </td>
                  <td className='py-3'>{cc.department ?? '—'}</td>
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
                        onClick={() => setDialog({ code: cc.code, type: 'retire' })}
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

      {/* ---- Create / edit budget */}
      <Modal
        closeLabel={t('ui.close')}
        description={budgetDialog?.mode === 'edit' ? t('finance.budgets.editHint') : t('finance.budgets.createHint')}
        onClose={closeDialog}
        open={Boolean(budgetDialog && editingLine)}
        size='lg'
        title={
          budgetDialog?.mode === 'edit'
            ? t('finance.budgets.editTitle', { costCenter: budgetDialog.costCenter, period: quarter })
            : t('finance.budgets.createTitle', { costCenter: budgetDialog?.costCenter ?? '', period: quarter })
        }
      >
        <form
          className='grid gap-5 md:grid-cols-2'
          onSubmit={(event) => {
            event.preventDefault()
            saveBudget()
          }}
        >
          <div className='space-y-4'>
            {budgetDialog?.mode === 'edit' && editingLine?.budget !== null && editingLine && (
              <p className='text-xs text-muted-foreground'>
                {t('finance.budgets.currentBudget', { budget: formatCurrency(editingLine.budget ?? 0) })}
              </p>
            )}
            <div>
              <label className='text-xs font-bold text-foreground' htmlFor='budget-amount'>
                {t('finance.budgets.amountLabel')}
              </label>
              <input
                className={`${inputClassName} mt-2`}
                id='budget-amount'
                inputMode='numeric'
                onChange={(event) => setAmount(event.target.value)}
                placeholder={t('finance.budgets.amountPlaceholder')}
                value={amount}
              />
              {parsedAmount > 0 && (
                <p className='mt-1 text-[0.7rem] text-muted-foreground'>{formatCurrency(parsedAmount)}</p>
              )}
              {showErrors && parsedAmount <= 0 && (
                <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                  {t('finance.budgets.amountRequired')}
                </p>
              )}
            </div>

            {budgetDialog?.mode === 'edit' && (
              <div>
                <label className='text-xs font-bold text-foreground' htmlFor='budget-reason'>
                  {t('finance.budgets.reasonLabel')}
                </label>
                <textarea
                  className={`${inputClassName} mt-2 min-h-20`}
                  id='budget-reason'
                  onChange={(event) => setReason(event.target.value)}
                  value={reason}
                />
                {showErrors && reason.trim().length === 0 && (
                  <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                    {t('finance.budgets.reasonRequired')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className='space-y-3 rounded-xl border border-border bg-background p-4 text-xs'>
            {budgetDialog?.mode === 'create' && (
              <div>
                <p className='flex items-center gap-1.5 font-bold text-foreground'>
                  <Link2 aria-hidden='true' className='size-3.5 text-primary' />
                  {t('finance.budgets.backfillTitle', { count: unattached.length })}
                </p>
                <ul className='mt-2 space-y-1 text-muted-foreground'>
                  {unattached.map((item) => (
                    <li key={item.id}>
                      {item.code} · {item.software}
                    </li>
                  ))}
                </ul>
                <p className='mt-2 text-[0.7rem] text-muted-foreground'>{t('finance.budgets.backfillNote')}</p>
              </div>
            )}
            <div className='flex items-center justify-between border-t border-border pt-3'>
              <span className='font-semibold text-muted-foreground'>{t('finance.budgets.previewRemaining')}</span>
              {previewRemaining === null ? (
                <span className='text-muted-foreground'>—</span>
              ) : (
                <RemainingValue formatCurrency={formatCurrency} remaining={previewRemaining} />
              )}
            </div>
            {previewRemaining !== null && previewRemaining < 0 && (
              <p className='text-[0.7rem] font-semibold text-danger'>{t('finance.budgets.negativeExplain')}</p>
            )}
            {budgetDialog?.mode === 'edit' && (
              <p className='text-[0.7rem] text-muted-foreground'>{t('finance.budgets.editNote')}</p>
            )}
          </div>

          <div className='flex justify-end gap-2 md:col-span-2'>
            <button className={secondaryButtonClassName} onClick={closeDialog} type='button'>
              {t('ui.cancel')}
            </button>
            <button className={primaryButtonClassName} type='submit'>
              <CheckCircle2 aria-hidden='true' className='size-3.5' />
              {budgetDialog?.mode === 'edit' ? t('finance.budgets.submitEdit') : t('finance.budgets.submitCreate')}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---- Add Cost Center */}
      <Modal
        closeLabel={t('ui.close')}
        description={t('finance.budgets.catalogHint')}
        onClose={closeDialog}
        open={dialog?.type === 'center'}
        title={t('finance.budgets.addCenter')}
      >
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            addCenter()
          }}
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='text-xs font-bold' htmlFor='center-code'>
                {t('finance.budgets.newCode')}
              </label>
              <input
                className={`${inputClassName} mt-2`}
                id='center-code'
                onChange={(event) => setNewCenter((current) => ({ ...current, code: event.target.value }))}
                placeholder={t('finance.budgets.newCodePlaceholder')}
                value={newCenter.code}
              />
            </div>
            <div>
              <label className='text-xs font-bold' htmlFor='center-name'>
                {t('finance.budgets.newName')}
              </label>
              <input
                className={`${inputClassName} mt-2`}
                id='center-name'
                onChange={(event) => setNewCenter((current) => ({ ...current, name: event.target.value }))}
                value={newCenter.name}
              />
            </div>
            <div>
              <label className='text-xs font-bold' htmlFor='center-kind'>
                {t('finance.budgets.colKind')}
              </label>
              <select
                className={`${inputClassName} mt-2`}
                id='center-kind'
                onChange={(event) =>
                  setNewCenter((current) => ({ ...current, kind: event.target.value as CostCenter['kind'] }))
                }
                value={newCenter.kind}
              >
                <option value='UNIT'>{t('finance.budgets.kind.UNIT')}</option>
                <option value='COMPANY'>{t('finance.budgets.kind.COMPANY')}</option>
              </select>
            </div>
            {newCenter.kind === 'UNIT' && (
              <div>
                <label className='text-xs font-bold' htmlFor='center-department'>
                  {t('finance.budgets.colDepartment')}
                </label>
                <input
                  className={`${inputClassName} mt-2`}
                  id='center-department'
                  onChange={(event) => setNewCenter((current) => ({ ...current, department: event.target.value }))}
                  value={newCenter.department}
                />
              </div>
            )}
          </div>
          {showErrors && (!newCenter.code.trim() || !newCenter.name.trim()) && (
            <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
              {t('finance.budgets.centerRequired')}
            </p>
          )}
          <p className='text-[0.7rem] text-muted-foreground'>{t('finance.budgets.catalogNote')}</p>
          <div className='flex justify-end gap-2'>
            <button className={secondaryButtonClassName} onClick={closeDialog} type='button'>
              {t('ui.cancel')}
            </button>
            <button className={primaryButtonClassName} type='submit'>
              {t('ui.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---- Retire Cost Center */}
      <Modal
        closeLabel={t('ui.close')}
        onClose={closeDialog}
        open={dialog?.type === 'retire'}
        title={t('finance.budgets.retireTitle', { code: dialog?.type === 'retire' ? dialog.code : '' })}
      >
        <p className='text-sm text-foreground'>{t('finance.budgets.retireBody')}</p>
        <div className='mt-5 flex justify-end gap-2'>
          <button className={secondaryButtonClassName} onClick={closeDialog} type='button'>
            {t('ui.cancel')}
          </button>
          <button
            className={dangerButtonClassName}
            onClick={() => dialog?.type === 'retire' && retireCenter(dialog.code)}
            type='button'
          >
            <Archive aria-hidden='true' className='size-3.5' />
            {t('finance.budgets.retire')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
