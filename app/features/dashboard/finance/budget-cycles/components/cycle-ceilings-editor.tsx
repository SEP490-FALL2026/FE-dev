import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CycleResponseDtoData, PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceButton, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'

type CycleData = NonNullable<CycleResponseDtoData>
type PackageDepartment = NonNullable<PackageResponseDtoData>['departments'][number]
type CeilingField = 'signedCommitments' | 'plannedSeats' | 'priority'
type CeilingDraft = Record<CeilingField, string> & { explanation: string }

const CEILING_FIELDS: readonly CeilingField[] = ['signedCommitments', 'plannedSeats', 'priority']

function draftOf(cycle: CycleData, departmentId: string): CeilingDraft {
  const saved = cycle.ceilings[departmentId]
  return {
    signedCommitments: saved?.signedCommitments.amount ?? '0',
    plannedSeats: saved?.plannedSeats.amount ?? '0',
    priority: saved?.priority.amount ?? '0',
    explanation: saved?.explanation ?? ''
  }
}

export function CycleCeilingsEditor({
  cycle,
  departments
}: {
  cycle: CycleData
  departments: readonly PackageDepartment[]
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
    isDecimal(reserve) &&
    departments.every((department) =>
      CEILING_FIELDS.every((field) => isDecimal(draftFor(department.departmentId)[field]))
    )

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
              signedCommitments: { amount: draft.signedCommitments },
              plannedSeats: { amount: draft.plannedSeats },
              priority: { amount: draft.priority },
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
    <input
      inputMode='decimal'
      aria-label={label}
      aria-invalid={!isDecimal(value)}
      className={`${financeInputClass} min-w-28 text-right font-mono tabular-nums`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )

  return (
    <div className='space-y-4'>
      <label className='block max-w-xs space-y-1.5 text-sm font-medium'>
        {translate('budgetCycle.sharedPoolReserve')}
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
              {CEILING_FIELDS.map((field) => (
                <th key={field} scope='col' className='px-3 py-2 text-right'>
                  {translate(`budgetCycle.ceilingField.${field}`)}
                </th>
              ))}
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.explanation')}
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
                  {CEILING_FIELDS.map((field) => (
                    <td key={field} className='px-3 py-2'>
                      {amountInput(
                        draft[field],
                        `${department.departmentName} — ${translate(`budgetCycle.ceilingField.${field}`)}`,
                        (next) => changeDraft(department.departmentId, { [field]: next })
                      )}
                    </td>
                  ))}
                  <td className='px-3 py-2'>
                    <input
                      maxLength={2000}
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
    </div>
  )
}
