import { useTranslation } from 'react-i18next'
import { FinanceButton } from '../../shared/components/finance-ui'
import { useFinanceDepartments } from '../hooks/use-finance-departments'

const NAMES_SHOWN = 3

/** A department Super Admin has just created has no Cost Center yet; Finance sees it here and can add one at once. */
export function MissingCostCentersNotice({ onAdd }: { onAdd: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const { departments } = useFinanceDepartments()
  if (departments.length === 0) return null
  const shown = departments.slice(0, NAMES_SHOWN).map((department) => department.departmentName)
  const names = departments.length > NAMES_SHOWN ? `${shown.join(', ')}…` : shown.join(', ')
  return (
    <div
      role='status'
      className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle p-3 text-sm'
    >
      <p className='min-w-0 text-warning-ink'>
        {translate('costCenterActions.missingNotice', { count: departments.length, names })}
      </p>
      <FinanceButton variant='ghost' onClick={onAdd}>
        {translate('costCenterActions.missingAction')}
      </FinanceButton>
    </div>
  )
}
