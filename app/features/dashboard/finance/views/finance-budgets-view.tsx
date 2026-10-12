import { Archive, CalendarRange, CheckCircle2, Link2, Pencil, Plus, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining, type BudgetSnapshot } from '../../budget-figures'
import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName
} from '../../dashboard-ui'
import {
  budgetPeriodType,
  commitmentsToRecord,
  costCenters,
  currentBudgetLines,
  currentPeriod,
  type CostCenter
} from '../finance-data'

type Editor = { costCenter: string; mode: 'create' | 'edit' } | null
type Result = { backfilled: number; costCenter: string; mode: 'create' | 'edit'; negative: boolean } | null

export function FinanceBudgetsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const [centers, setCenters] = useState(costCenters)
  const [lines, setLines] = useState<BudgetSnapshot[]>(currentBudgetLines)
  const [editor, setEditor] = useState<Editor>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [showNewCenter, setShowNewCenter] = useState(false)
  const [newCenter, setNewCenter] = useState({ code: '', kind: 'UNIT' as CostCenter['kind'], name: '' })

  const editingLine = editor ? lines.find((line) => line.costCenter === editor.costCenter) : undefined
  const parsedAmount = Number(amount.replace(/\D/g, ''))
  const unattached = editor
    ? commitmentsToRecord.filter((item) => item.costCenter === editor.costCenter && !item.budgetAttached)
    : []
  const previewRemaining =
    editingLine && parsedAmount > 0 ? getRemaining({ ...editingLine, budget: parsedAmount }) : null

  const openEditor = (costCenter: string, mode: 'create' | 'edit') => {
    setEditor({ costCenter, mode })
    setAmount('')
    setReason('')
    setShowErrors(false)
    setResult(null)
  }

  const saveBudget = () => {
    if (!editor || !editingLine) return
    if (parsedAmount <= 0 || (editor.mode === 'edit' && reason.trim().length === 0)) {
      setShowErrors(true)
      return
    }
    setLines((current) =>
      current.map((line) => (line.costCenter === editor.costCenter ? { ...line, budget: parsedAmount } : line))
    )
    setResult({
      backfilled: editor.mode === 'create' ? unattached.length : 0,
      costCenter: editor.costCenter,
      mode: editor.mode,
      negative: (previewRemaining ?? 0) < 0
    })
    setEditor(null)
  }

  const addCenter = () => {
    if (!newCenter.code.trim() || !newCenter.name.trim()) return
    setCenters((current) => [
      ...current,
      { code: newCenter.code.trim().toUpperCase(), kind: newCenter.kind, name: newCenter.name.trim(), status: 'ACTIVE' }
    ])
    setNewCenter({ code: '', kind: 'UNIT', name: '' })
    setShowNewCenter(false)
  }

  const retireCenter = (code: string) =>
    setCenters((current) => current.map((cc) => (cc.code === code ? { ...cc, status: 'RETIRED' } : cc)))

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

      <Panel>
        <PanelTitle
          hint={t('finance.budgets.budgetsHint')}
          title={t('finance.budgets.budgetsTitle', { period: currentPeriod })}
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
                <th className='py-2.5 text-right font-semibold'>{t('finance.budgets.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {lines.map((line) => (
                <tr key={line.costCenter}>
                  <td className='py-3 font-mono font-bold'>{line.costCenter}</td>
                  <td className='py-3 text-right'>
                    {line.budget === null ? (
                      <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                    ) : (
                      formatCurrency(line.budget)
                    )}
                  </td>
                  <td className='py-3 text-right'>{formatCurrency(line.actual)}</td>
                  <td className='py-3 text-right text-warning'>{formatCurrency(line.held)}</td>
                  <td className='py-3 text-right'>
                    <RemainingValue formatCurrency={formatCurrency} remaining={getRemaining(line)} />
                  </td>
                  <td className='py-3 text-right'>
                    {line.budget === null ? (
                      <button
                        className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                        onClick={() => openEditor(line.costCenter, 'create')}
                        type='button'
                      >
                        <Plus aria-hidden='true' className='size-3.5' />
                        {t('finance.budgets.create')}
                      </button>
                    ) : (
                      <button
                        className='inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-primary'
                        onClick={() => openEditor(line.costCenter, 'edit')}
                        type='button'
                      >
                        <Pencil aria-hidden='true' className='size-3.5' />
                        {t('finance.budgets.edit')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {editor && editingLine && (
        <Panel className='border-primary/40'>
          <PanelTitle
            action={
              <button
                aria-label={t('ui.close')}
                className='grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-subtle'
                onClick={() => setEditor(null)}
                type='button'
              >
                <X aria-hidden='true' className='size-4' />
              </button>
            }
            hint={editor.mode === 'create' ? t('finance.budgets.createHint') : t('finance.budgets.editHint')}
            title={
              editor.mode === 'create'
                ? t('finance.budgets.createTitle', { costCenter: editor.costCenter, period: currentPeriod })
                : t('finance.budgets.editTitle', { costCenter: editor.costCenter, period: currentPeriod })
            }
          />

          <form
            className='mt-4 grid gap-5 lg:grid-cols-2'
            onSubmit={(event) => {
              event.preventDefault()
              saveBudget()
            }}
          >
            <div className='space-y-4'>
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
                {showErrors && parsedAmount <= 0 && (
                  <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                    {t('finance.budgets.amountRequired')}
                  </p>
                )}
              </div>

              {editor.mode === 'edit' && (
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

              <button className={primaryButtonClassName} type='submit'>
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {editor.mode === 'create' ? t('finance.budgets.submitCreate') : t('finance.budgets.submitEdit')}
              </button>
            </div>

            <div className='space-y-3 rounded-xl border border-border bg-background p-4 text-xs'>
              {editor.mode === 'create' && (
                <div>
                  <p className='flex items-center gap-1.5 font-bold text-foreground'>
                    <Link2 aria-hidden='true' className='size-3.5 text-primary' />
                    {t('finance.budgets.backfillTitle', { count: unattached.length })}
                  </p>
                  <ul className='mt-2 space-y-1 text-muted-foreground'>
                    {unattached.map((item) => (
                      <li className='flex justify-between gap-2' key={item.id}>
                        <span>
                          {item.code} · {item.software}
                        </span>
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
              {editor.mode === 'edit' && (
                <p className='text-[0.7rem] text-muted-foreground'>{t('finance.budgets.editNote')}</p>
              )}
            </div>
          </form>
        </Panel>
      )}

      <Panel>
        <PanelTitle
          action={
            <button
              className={secondaryButtonClassName}
              onClick={() => setShowNewCenter((open) => !open)}
              type='button'
            >
              <Plus aria-hidden='true' className='size-3.5' />
              {t('finance.budgets.addCenter')}
            </button>
          }
          hint={t('finance.budgets.catalogHint')}
          title={t('finance.budgets.catalogTitle')}
        />

        {showNewCenter && (
          <form
            className='mt-4 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-[1fr_1.5fr_1fr_auto]'
            onSubmit={(event) => {
              event.preventDefault()
              addCenter()
            }}
          >
            <input
              aria-label={t('finance.budgets.newCode')}
              className={inputClassName}
              onChange={(event) => setNewCenter((current) => ({ ...current, code: event.target.value }))}
              placeholder={t('finance.budgets.newCode')}
              value={newCenter.code}
            />
            <input
              aria-label={t('finance.budgets.newName')}
              className={inputClassName}
              onChange={(event) => setNewCenter((current) => ({ ...current, name: event.target.value }))}
              placeholder={t('finance.budgets.newName')}
              value={newCenter.name}
            />
            <select
              aria-label={t('finance.budgets.colKind')}
              className={inputClassName}
              onChange={(event) =>
                setNewCenter((current) => ({ ...current, kind: event.target.value as CostCenter['kind'] }))
              }
              value={newCenter.kind}
            >
              <option value='UNIT'>{t('finance.budgets.kind.UNIT')}</option>
              <option value='COMPANY'>{t('finance.budgets.kind.COMPANY')}</option>
            </select>
            <button className={primaryButtonClassName} type='submit'>
              {t('ui.save')}
            </button>
          </form>
        )}

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
    </div>
  )
}
