import { useTranslation } from 'react-i18next'
import { AccessRequestHistoryPageResponseDtoDataItemsItemState as RequestState } from '~/shared/api/generated/model/access-requests'
import { AccessRequestListType } from '~/shared/api/generated/model/access-requests'
import { useBudgetCycleList } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-list'
import { useBudgetCyclePackage } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-package'
import { ApprovalsField, approvalsInputClass } from '../../shared/components/approvals-ui'
import { ApprovalsSelect } from '../../shared/components/approvals-select'

/** The flags the oversight list can narrow to (BE `dev` 94a8ee84). */
export const MONITOR_FLAGS = ['ONE_STEP', 'RESERVE_USED'] as const
export type MonitorFlag = (typeof MONITOR_FLAGS)[number]

export interface MonitorFilters {
  states: string[]
  type: AccessRequestListType | ''
  from: string
  to: string
  departmentId: string
  flag: MonitorFlag | ''
}

export const emptyMonitorFilters: MonitorFilters = {
  states: [],
  type: '',
  from: '',
  to: '',
  departmentId: '',
  flag: ''
}

const parseType = (value: string) => Object.values(AccessRequestListType).find((type) => type === value)
const parseFlag = (value: string) => MONITOR_FLAGS.find((flag) => flag === value)

/** A date typed in the picker becomes the start or the end of that day, as the list takes date-times. */
export function dayStart(value: string) {
  return value ? new Date(`${value}T00:00:00`).toISOString() : undefined
}
export function dayEnd(value: string) {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined
}

/** Departments for the filter: the Approver cannot list departments, but the latest cycle's package names them all. */
function useDepartmentOptions() {
  const cycles = useBudgetCycleList({ page: 1, pageSize: 20 })
  const years = (cycles.data?.data?.items ?? []).map((cycle) => cycle.year).filter(Number.isFinite)
  const year = years.length ? Math.max(...years) : undefined
  const budgetPackage = useBudgetCyclePackage(year ?? 0, { query: { enabled: year !== undefined } })
  return (budgetPackage.data?.data?.departments ?? []).map((department) => ({
    value: department.departmentId,
    label: `${department.departmentName} (${department.departmentCode})`
  }))
}

export function ApprovalMonitorFilters({
  filters,
  onChange
}: {
  filters: MonitorFilters
  onChange: (next: MonitorFilters) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateStatus } = useTranslation('approvals')
  const departments = useDepartmentOptions()
  const toggleState = (state: string) =>
    onChange({
      ...filters,
      states: filters.states.includes(state)
        ? filters.states.filter((item) => item !== state)
        : [...filters.states, state]
    })
  const active =
    filters.states.length > 0 ||
    Boolean(filters.type || filters.from || filters.to || filters.departmentId || filters.flag)
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <ApprovalsSelect
          label={translate('monitor.type')}
          value={filters.type}
          options={[
            { value: '', label: translate('monitor.allTypes') },
            ...Object.values(AccessRequestListType).map((value) => ({
              value,
              label: translate(`monitor.types.${value}`)
            }))
          ]}
          onChange={(value) => onChange({ ...filters, type: parseType(value) ?? '' })}
        />
        <ApprovalsSelect
          label={translate('monitor.department')}
          value={filters.departmentId}
          options={[{ value: '', label: translate('monitor.allDepartments') }, ...departments]}
          onChange={(value) => onChange({ ...filters, departmentId: value })}
        />
        <ApprovalsSelect
          label={translate('monitor.flag')}
          value={filters.flag}
          options={[
            { value: '', label: translate('monitor.allFlags') },
            ...MONITOR_FLAGS.map((value) => ({ value, label: translate(`monitor.flags.${value}`) }))
          ]}
          onChange={(value) => onChange({ ...filters, flag: parseFlag(value) ?? '' })}
        />
        <ApprovalsField label={translate('monitor.from')}>
          <input
            type='date'
            className={approvalsInputClass}
            value={filters.from}
            max={filters.to || undefined}
            onChange={(event) => onChange({ ...filters, from: event.target.value })}
          />
        </ApprovalsField>
        <ApprovalsField label={translate('monitor.to')}>
          <input
            type='date'
            className={approvalsInputClass}
            value={filters.to}
            min={filters.from || undefined}
            onChange={(event) => onChange({ ...filters, to: event.target.value })}
          />
        </ApprovalsField>
      </div>
      <fieldset className='space-y-2'>
        <legend className='text-sm font-medium text-foreground'>{translate('monitor.states')}</legend>
        <div className='flex flex-wrap gap-2'>
          {Object.values(RequestState).map((state) => {
            const checked = filters.states.includes(state)
            return (
              <label
                key={state}
                className={`inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm ring-1 ring-inset ${
                  checked ? 'bg-primary-soft text-primary-ink ring-primary/40' : 'text-muted-foreground ring-border/70'
                }`}
              >
                <input type='checkbox' className='size-4' checked={checked} onChange={() => toggleState(state)} />
                {translateStatus(`status.${state}`, { defaultValue: state })}
              </label>
            )
          })}
        </div>
      </fieldset>
      {active && (
        <button
          type='button'
          className='cursor-pointer text-sm font-medium text-primary underline-offset-2 hover:underline'
          onClick={() => onChange(emptyMonitorFilters)}
        >
          {translate('monitor.clearFilters')}
        </button>
      )}
    </div>
  )
}
