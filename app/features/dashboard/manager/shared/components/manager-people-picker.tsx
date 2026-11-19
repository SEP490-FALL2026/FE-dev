import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGroupRequestCandidateList } from '~/shared/api/generated/operations/group-requests/group-request-candidate-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { ManagerSelect } from './manager-select'
import type { ManagerChoice } from './manager-choice-select'

const PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

/**
 * Beneficiary picker fed by groupRequestCandidateList: the field is a combobox (type a name or email to search the
 * BE), each pick is added to the chip list below; chosen people stay selected across searches.
 */
export function ManagerPeoplePicker({
  value,
  onChange,
  disabled,
  limit,
  invalid,
  multiple
}: {
  value: ManagerChoice[]
  onChange: (value: ManagerChoice[]) => void
  disabled: boolean
  limit: number
  invalid?: boolean
  multiple: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const labelId = useId()
  const hintId = useId()
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const debounced = useDebouncedValue(search, 300)
  const query = useGroupRequestCandidateList(
    { page: 1, pageSize, ...(debounced ? { q: debounced } : {}) },
    { query: { enabled: !disabled } }
  )
  const people = !query.isError ? (query.data?.data?.items ?? []) : []
  const pagination = !query.isError ? query.data?.data?.pagination : undefined
  const full = value.length >= limit
  const chosen = new Set(value.map((person) => person.value))
  return (
    <div className='grid min-w-0 gap-2'>
      <p id={labelId} className='text-sm font-medium'>
        {translate('beneficiaries')}
        <span aria-hidden='true' className='ml-1 text-danger'>
          *
        </span>
      </p>
      <ManagerSelect
        aria-label={translate('beneficiaries')}
        aria-describedby={hintId}
        value=''
        disabled={disabled || (multiple && full)}
        invalid={invalid}
        placeholder={translate(full ? 'ui.placeholders.peopleFull' : 'ui.placeholders.people', { count: limit })}
        loading={query.isFetching}
        emptyText={query.isError ? translate('ui.loadFailed') : translate('noSearchResults')}
        onSearchChange={(next) => {
          setSearch(next)
          setPageSize(PAGE_SIZE)
        }}
        hasMore={!!pagination && pagination.totalPages > 1 && pageSize < MAX_PAGE_SIZE}
        onLoadMore={() => setPageSize((size) => Math.min(size + PAGE_SIZE, MAX_PAGE_SIZE))}
        options={people.map((person) => ({
          value: person.employeeId,
          label: person.fullName,
          description: person.workEmail,
          disabled: chosen.has(person.employeeId)
        }))}
        onChange={(next, option) => {
          if (!next || !option || chosen.has(next)) return
          const person = { value: option.value, label: option.label, description: option.description }
          onChange(multiple ? [...value, person] : [person])
        }}
      />
      <p id={hintId} className='text-xs leading-relaxed text-muted-foreground'>
        {translate('peoplePickerHint', { count: limit })}
      </p>
      {value.length > 0 && (
        <div className='soft-panel space-y-2 p-3'>
          <p className='text-xs font-medium text-muted-foreground'>
            {translate('selectedPeople', { count: value.length })}
          </p>
          <ul aria-label={translate('selectedParticipants')} className='flex flex-wrap gap-2'>
            {value.map((person) => (
              <li
                key={person.value}
                className='flex max-w-full items-center gap-1 rounded-md border border-border/70 bg-surface pl-3'
              >
                <span
                  className='truncate text-sm'
                  title={`${person.label}${person.description ? ` · ${person.description}` : ''}`}
                >
                  {person.label}
                </span>
                <button
                  type='button'
                  disabled={disabled}
                  aria-label={translate('removeParticipant', { name: person.label })}
                  className='grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:text-danger-ink disabled:opacity-50 md:size-8'
                  onClick={() => onChange(value.filter((item) => item.value !== person.value))}
                >
                  <X aria-hidden strokeWidth={1.5} className='size-4' />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
