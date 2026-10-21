import { CheckCircle2, Save } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PanelTitle, inputClassName } from '../../dashboard-ui'
import { saasGroups, type SaasGroup } from '../annual-budget-data'
import { setGroupAllocation } from '../annual-budget-store'

type GroupAmounts = Partial<Record<SaasGroup, number>>

export const allocatedSum = (amounts: GroupAmounts | undefined) =>
  Object.values(amounts ?? {}).reduce((sum, amount) => sum + (amount ?? 0), 0)

const parseAmount = (value: string) => (/\d/.test(value) ? Number(value.replace(/\D/g, '')) : Number.NaN)

/** FIN-45: one Cost Center's approved total split into SaaS cost groups; the sum never exceeds the approved total. */
export function FinanceAllocationEditor({
  approvedTotal,
  costCenter,
  formatCurrency,
  groupAmounts
}: {
  approvedTotal: number
  costCenter: string
  formatCurrency: (value: number) => string
  groupAmounts: GroupAmounts
}) {
  const { t } = useTranslation('dashboard')
  const [drafts, setDrafts] = useState<Partial<Record<SaasGroup, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [savedGroup, setSavedGroup] = useState<SaasGroup | null>(null)

  const allocated = allocatedSum(groupAmounts)
  const unallocated = approvedTotal - allocated

  const save = (group: SaasGroup) => {
    const amount = parseAmount(drafts[group] ?? String(groupAmounts[group] ?? 0))
    setSavedGroup(null)
    if (!Number.isFinite(amount) || amount < 0) {
      setError(t('budgetPlan.allocation.invalidAmount'))
      return
    }
    const nextAllocated = allocated - (groupAmounts[group] ?? 0) + amount
    if (nextAllocated > approvedTotal) {
      setError(
        t('budgetPlan.allocation.overApproved', {
          allocated: formatCurrency(nextAllocated),
          approved: formatCurrency(approvedTotal)
        })
      )
      return
    }
    setError(null)
    setGroupAllocation(costCenter, group, amount)
    setDrafts((current) => ({ ...current, [group]: undefined }))
    setSavedGroup(group)
  }

  return (
    <div className='mt-4 min-w-0'>
      <PanelTitle
        action={
          <section
            aria-label={t('budgetPlan.allocation.summaryLabel', { costCenter })}
            className='flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs'
          >
            <span className='text-muted-foreground'>
              {t('budgetPlan.allocation.approved')} <b className='text-foreground'>{formatCurrency(approvedTotal)}</b>
            </span>
            <span className='text-muted-foreground'>
              {t('budgetPlan.allocation.allocated')} <b className='text-foreground'>{formatCurrency(allocated)}</b>
            </span>
            <span className='text-muted-foreground'>
              {t('budgetPlan.allocation.unallocated')}{' '}
              <b className={unallocated > 0 ? 'text-warning' : 'text-foreground'}>{formatCurrency(unallocated)}</b>
            </span>
          </section>
        }
        hint={t('budgetPlan.allocation.editorHint')}
        title={t('budgetPlan.allocation.editorTitle', { costCenter })}
      />
      <div className='mt-3 overflow-x-auto'>
        <table className='w-full min-w-120 text-left text-xs'>
          <thead>
            <tr className='border-b border-border text-muted-foreground'>
              <th className='py-2 font-semibold'>{t('budgetPlan.allocation.colGroup')}</th>
              <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colCurrent')}</th>
              <th className='py-2 pl-6 font-semibold'>{t('budgetPlan.allocation.colNew')}</th>
              <th className='py-2'>
                <span className='sr-only'>{t('ui.save')}</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {saasGroups.map((group) => {
              const groupName = t(`budgetPlan.group.${group}`)
              const current = groupAmounts[group] ?? 0
              return (
                <tr key={group}>
                  <td className='py-1.5 font-semibold text-foreground'>{groupName}</td>
                  <td className='py-1.5 text-right'>{current > 0 ? formatCurrency(current) : '—'}</td>
                  <td className='py-1.5 pl-6'>
                    <input
                      aria-label={t('budgetPlan.allocation.amountFor', { group: groupName })}
                      className={`${inputClassName} h-8 max-w-40 py-0 text-right text-xs`}
                      inputMode='numeric'
                      onChange={(event) => setDrafts((items) => ({ ...items, [group]: event.target.value }))}
                      value={drafts[group] ?? String(current)}
                    />
                  </td>
                  <td className='py-1.5 text-right'>
                    <button
                      aria-label={t('budgetPlan.allocation.saveFor', { group: groupName })}
                      className='inline-grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground'
                      disabled={drafts[group] === undefined}
                      onClick={() => save(group)}
                      type='button'
                    >
                      <Save aria-hidden='true' className='size-3.5' />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {error && (
        <p className='mt-3 text-[0.7rem] font-semibold text-danger' role='alert'>
          {error}
        </p>
      )}
      {savedGroup && (
        <div className='mt-3'>
          <Notice icon={CheckCircle2} tone='success'>
            {t('budgetPlan.allocation.saved', { group: t(`budgetPlan.group.${savedGroup}`) })}
          </Notice>
        </div>
      )}
    </div>
  )
}
