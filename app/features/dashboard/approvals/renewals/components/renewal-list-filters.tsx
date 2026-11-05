import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsNativeSelect,
  ApprovalsToolbar
} from '../../shared/components/approvals-ui'
import { RENEWAL_LATE_FILTER, type RenewalLateFilter } from '../enums/renewal-late-filter'
import { RENEWAL_STATE } from '../enums/renewal-state'
import { ALL_STATES, type RenewalFilters, type RenewalStateFilter } from '../hooks/use-renewal-filters'

const stateOptions: RenewalStateFilter[] = [
  RENEWAL_STATE.PROPOSED,
  RENEWAL_STATE.DECIDED,
  RENEWAL_STATE.OUTCOME_RECORDED,
  ALL_STATES
]

export function RenewalListFilters({
  filters,
  onChange
}: {
  filters: RenewalFilters
  onChange: (next: RenewalFilters) => void
}) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const stateLabelId = useId()
  return (
    <ApprovalsToolbar>
      <div className='min-w-0 space-y-1.5'>
        <span id={stateLabelId} className='block text-sm font-medium'>
          {translate('filters.state')}
        </span>
        <div role='group' aria-labelledby={stateLabelId} className='flex flex-wrap gap-2'>
          {stateOptions.map((state) => (
            <ApprovalsButton
              key={state}
              aria-pressed={filters.state === state}
              onClick={() => onChange({ ...filters, state, page: 1 })}
            >
              {state === ALL_STATES ? translate('filters.allStates') : translate(`values.state.${state}`)}
            </ApprovalsButton>
          ))}
        </div>
      </div>
      <div className='sm:w-64'>
        <ApprovalsField label={translate('filters.late')}>
          <ApprovalsNativeSelect
            value={filters.late ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                late: (event.target.value || undefined) as RenewalLateFilter | undefined,
                page: 1
              })
            }
          >
            <option value=''>{translate('filters.lateAll')}</option>
            <option value={RENEWAL_LATE_FILTER.true}>{translate('filters.lateTrue')}</option>
            <option value={RENEWAL_LATE_FILTER.false}>{translate('filters.lateFalse')}</option>
          </ApprovalsNativeSelect>
        </ApprovalsField>
      </div>
    </ApprovalsToolbar>
  )
}
