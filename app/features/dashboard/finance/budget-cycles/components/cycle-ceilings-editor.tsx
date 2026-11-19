import { useState } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import type { CycleResponseDtoData, PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceButton, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { addAmounts } from '../../shared/finance-validation'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'

type CycleData = NonNullable<CycleResponseDtoData>
type PackageDepartment = NonNullable<PackageResponseDtoData>['departments'][number]
type CeilingDraft = { ceiling: string; explanation: string }

/** The API keeps the ceiling of a department in three parts; the screen works with their sum as one figure. */
function draftOf(cycle: CycleData, departmentId: string): CeilingDraft {
  const saved = cycle.ceilings[departmentId]
  return {
    ceiling: saved
      ? addAmounts([saved.signedCommitments.amount, saved.plannedSeats.amount, saved.priority.amount])
      : '0',
    explanation: saved?.explanation ?? ''
  }
}

export function CycleCeilingsEditor({
  cycle,
  departments,
  readOnly = false
}: {
  cycle: CycleData
  departments: readonly PackageDepartment[]
  /** A published cycle shows its division of the ceiling without letting it be changed. */
  readOnly?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const { setCeilings } = useBudgetCycleActions(cycle.year)
  const [drafts, setDrafts] = useState<Record<string, CeilingDraft>>({})
  const [reserveDraft, setReserveDraft] = useState<string>()
  const reserve = reserveDraft ?? cycle.sharedPoolReserve?.amount ?? '0'
  const draftFor = (departmentId: string) => drafts[departmentId] ?? draftOf(cycle, departmentId)

  const changeDraft = (departmentId: string, patch: Partial<CeilingDraft>) =>
    setDrafts((current) => ({ ...current, [departmentId]: { ...draftFor(departmentId), ...patch } }))

  const amountsValid =
    isDecimal(reserve) && departments.every((department) => isDecimal(draftFor(department.departmentId).ceiling))

  const explanationMissing = departments.filter(
    (department) => !draftFor(department.departmentId).explanation.trim()
  ).length

  const save = () =>
    setCeilings.mutate(
      {
        year: cycle.year,
        data: {
          sharedPoolReserve: { amount: reserve },
          departments: departments.map((department) => {
            const draft = draftFor(department.departmentId)
            return {
              departmentId: department.departmentId,
              signedCommitments: { amount: '0' },
              plannedSeats: { amount: '0' },
              priority: { amount: draft.ceiling },
              ...(draft.explanation.trim() ? { explanation: draft.explanation.trim() } : {})
            }
          })
        }
      },
      {
        onSuccess: () => {
          setDrafts({})
          setReserveDraft(undefined)
        }
      }
    )

  const amountInput = (value: string, label: string, onChange: (next: string) => void) => (
    <MoneyInput
      disabled={readOnly}
      aria-label={label}
      aria-invalid={!isDecimal(value)}
      className={`${financeInputClass} min-w-28 text-right font-mono tabular-nums`}
      value={value}
      onValueChange={onChange}
    />
  )

  return (
    <div className='space-y-4'>
      <label className='block max-w-xs space-y-1.5 text-sm font-medium'>
        <span className='flex items-center gap-1'>
          {translate('budgetCycle.sharedPoolReserve')}
          {!readOnly && (
            <span aria-hidden className='text-danger'>
              *
            </span>
          )}
        </span>
        {amountInput(reserve, translate('budgetCycle.sharedPoolReserve'), setReserveDraft)}
        <span className='block text-xs font-normal text-muted-foreground'>
          {translate('budgetCycle.sharedPoolHint')}
        </span>
      </label>

      <div className='overflow-x-auto rounded-lg border border-border/70'>
        <table className='w-full text-sm'>
          <thead className='bg-surface-subtle text-xs tracking-wider text-muted-foreground uppercase'>
            <tr>
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.department')}
              </th>
              <th scope='col' className='px-3 py-2 text-right'>
                {translate('budgetCycle.ceiling')}
                {!readOnly && (
                  <span aria-hidden className='ml-1 text-danger'>
                    *
                  </span>
                )}
              </th>
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.explanation')}
                {!readOnly && (
                  <span aria-hidden className='ml-1 text-danger'>
                    *
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {departments.map((department) => {
              const draft = draftFor(department.departmentId)
              return (
                <tr key={department.departmentId}>
                  <td className='max-w-56 px-3 py-2'>
                    <div className='truncate font-medium' title={department.departmentName}>
                      {department.departmentName}
                    </div>
                    <div className='font-mono text-[11px] text-muted-foreground'>{department.departmentCode}</div>
                  </td>
                  <td className='px-3 py-2'>
                    {amountInput(
                      draft.ceiling,
                      `${department.departmentName} — ${translate('budgetCycle.ceiling')}`,
                      (next) => changeDraft(department.departmentId, { ceiling: next })
                    )}
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      maxLength={2000}
                      disabled={readOnly}
                      aria-required={!readOnly}
                      aria-invalid={!readOnly && !draft.explanation.trim()}
                      aria-label={`${department.departmentName} — ${translate('budgetCycle.explanation')}`}
                      className={`${financeInputClass} min-w-48`}
                      value={draft.explanation}
                      onChange={(event) => changeDraft(department.departmentId, { explanation: event.target.value })}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!readOnly && explanationMissing > 0 && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('budgetCycle.explanationMissing', { count: explanationMissing })}
        </p>
      )}
      {!readOnly && (
        <div className='flex justify-end'>
          <FinanceButton
            variant='secondary'
            pending={setCeilings.isPending}
            disabled={!amountsValid || departments.length === 0}
            onClick={save}
          >
            {translate('budgetCycle.saveCeilings')}
          </FinanceButton>
        </div>
      )}
    </div>
  )
}
