import { useTranslation } from 'react-i18next'
import { ApprovalsSelect, ApprovalsToolbar } from '../../shared/components/approvals-ui'
import { useBudgetYearOptions } from '../../shared/hooks/use-budget-year-options'

/** State and year of the version/proposal lists; both are picked from lists and apply at once. */
export function ApprovalAnnualBudgetFilters({
  states,
  state,
  year,
  onApply
}: {
  states: string[]
  state?: string
  year?: number
  onApply: (filters: { state?: string; year?: number }) => void
}) {
  const { t: translate } = useTranslation('approvalsBudget')
  const years = useBudgetYearOptions()
  return (
    <ApprovalsToolbar>
      <div className='w-full sm:w-64'>
        <ApprovalsSelect
          label={translate('state')}
          value={state ?? ''}
          onChange={(value) => onApply({ state: value || undefined, year })}
          options={[
            { value: '', label: translate('all') },
            ...states.map((value) => ({
              value,
              label: translate(`status.${value}`, { defaultValue: translate('unavailable') })
            }))
          ]}
        />
      </div>
      <div className='w-full sm:w-48'>
        <ApprovalsSelect
          label={translate('year')}
          value={year?.toString() ?? ''}
          placeholder={translate('layout.yearPlaceholder')}
          onChange={(value) => onApply({ state, year: value ? Number(value) : undefined })}
          options={[{ value: '', label: translate('inYear.allYears') }, ...years.options]}
        />
      </div>
    </ApprovalsToolbar>
  )
}
