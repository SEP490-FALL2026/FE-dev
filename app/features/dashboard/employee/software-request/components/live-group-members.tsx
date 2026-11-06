import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGroupRequestCandidateList } from '~/shared/api/generated/operations/group-requests/group-request-candidate-list'
import { EmployeeChoiceSelect } from '../../shared/components/employee-choice-select'
import { EmployeePagination, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import type { GroupSelection } from '../hooks/use-live-request-form'

export function LiveGroupMembers({
  members,
  onChange,
  disabled,
  invalid
}: {
  members: GroupSelection[]
  onChange: (members: GroupSelection[]) => void
  disabled: boolean
  invalid?: boolean
}) {
  const { t: translate } = useTranslation('employee')
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
  const candidates = current ? (query.data?.data?.items ?? []) : []
  return (
    <section aria-label={translate('members')} className='space-y-4 border-t border-border/60 pt-5'>
      <EmployeeChoiceSelect
        label={translate('members')}
        placeholder={translate('groupPicker.choosePeople')}
        multiple
        limit={10}
        disabled={disabled}
        invalid={invalid}
        selected={members.map((member) => ({
          value: member.employeeId,
          label: member.fullName,
          description: member.workEmail
        }))}
        onChange={(choices) =>
          onChange(
            choices.map(
              (choice) =>
                members.find((member) => member.employeeId === choice.value) ?? {
                  employeeId: choice.value,
                  fullName: choice.label,
                  workEmail: choice.description
                }
            )
          )
        }
        onOpenChange={setOpen}
        hint={translate('groupHint')}
        search={{
          label: translate('memberSearch'),
          placeholder: translate('groupPicker.searchPeoplePlaceholder'),
          value: draft,
          onChange: setDraft
        }}
        options={candidates.map((candidate) => ({
          value: candidate.employeeId,
          label: candidate.fullName,
          description: candidate.workEmail
        }))}
        state={
          draft.trim() === search ? (
            <EmployeeQueryState
              query={query}
              empty={!candidates.length}
              emptyTitle={translate('groupPicker.noMatches')}
            />
          ) : (
            <p role='status' className='py-4 text-sm text-muted-foreground'>
              {translate('loading')}
            </p>
          )
        }
        footer={
          current && (
            <EmployeePagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
          )
        }
      />
      {members.map((member) => (
        <div
          role='group'
          aria-label={translate('groupPicker.memberDetails', { name: member.fullName, email: member.workEmail ?? '' })}
          key={member.employeeId}
          className='grid items-center gap-3 border-b border-border/40 pb-2 sm:grid-cols-2'
        >
          <div className='min-w-0 text-sm'>
            <p className='truncate font-medium' title={member.fullName}>
              {member.fullName}
            </p>
            {member.workEmail && (
              <p className='truncate text-xs text-muted-foreground' title={member.workEmail}>
                {member.workEmail}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
