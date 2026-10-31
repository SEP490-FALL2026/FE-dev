import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGroupRequestCandidateList } from '~/shared/api/generated/operations/group-requests/group-request-candidate-list'
import { ManagerPagination, ManagerQueryState } from './manager-api-ui'
import { ManagerChoiceSelect, type ManagerChoice } from './manager-choice-select'

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
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  useEffect(() => {
    if (draft.trim() === search) return
    const timer = setTimeout(() => {
      setSearch(draft.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [draft, search])
  const query = useGroupRequestCandidateList(
    { page, pageSize: 20, ...(search ? { q: search } : {}) },
    { query: { enabled: open && !disabled } }
  )
  const current = draft.trim() === search && !query.isError
  const people = current ? (query.data?.data?.items ?? []) : []
  return (
    <ManagerChoiceSelect
      label={translate('beneficiaries')}
      placeholder={translate('choosePeople')}
      multiple={multiple}
      limit={limit}
      disabled={disabled}
      invalid={invalid}
      selected={value}
      onChange={onChange}
      onOpenChange={setOpen}
      hint={translate('peoplePickerHint', { count: limit })}
      search={{
        label: translate('searchPeople'),
        placeholder: translate('searchPeoplePlaceholder'),
        value: draft,
        onChange: setDraft
      }}
      options={people.map((person) => ({
        value: person.employeeId,
        label: person.fullName,
        description: person.workEmail
      }))}
      state={
        draft.trim() === search ? (
          <ManagerQueryState query={query} empty={!people.length} emptyTitle={translate('noSearchResults')} />
        ) : (
          <p role='status' className='py-4 text-sm text-muted-foreground'>
            {translate('loading')}
          </p>
        )
      }
      footer={
        current && (
          <ManagerPagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
        )
      }
    />
  )
}
