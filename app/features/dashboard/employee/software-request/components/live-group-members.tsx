import { useId, useState } from 'react'
import { UserRound, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getGroupRequestCandidateListQueryOptions } from '~/shared/api/generated/operations/group-requests/group-request-candidate-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeSelect } from '../../shared/components/employee-select'
import { usePagedOptions } from '../hooks/use-paged-options'
import type { GroupSelection } from '../hooks/use-live-request-form'

const MEMBER_LIMIT = 10

/** Beneficiary picker: search colleagues by name or email, each pick is added to the list below (2-10 people). */
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
  const fieldId = useId()
  const [draft, setDraft] = useState('')
  const search = useDebouncedValue(draft, 300)
  const full = members.length >= MEMBER_LIMIT
  const candidates = usePagedOptions(search, (page) =>
    getGroupRequestCandidateListQueryOptions(
      { page, pageSize: 20, ...(search ? { q: search } : {}) },
      { query: { enabled: !disabled } }
    )
  )
  const chosen = new Set(members.map((member) => member.employeeId))
  return (
    <section aria-label={translate('members')} className='space-y-3'>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <label htmlFor={fieldId} className='text-sm font-medium'>
          {translate('members')}
          <span aria-hidden='true' className='ml-1 text-danger'>
            *
          </span>
        </label>
        <span className='font-mono text-xs text-muted-foreground tabular-nums'>
          {translate('ui.create.memberCount', { count: members.length })}
        </span>
      </div>
      <EmployeeSelect
        id={fieldId}
        value=''
        placeholder={translate(full ? 'ui.placeholders.membersFull' : 'ui.placeholders.members')}
        disabled={disabled || full}
        invalid={invalid}
        loading={candidates.loading}
        onSearchChange={setDraft}
        hasMore={candidates.hasMore}
        onLoadMore={candidates.loadMore}
        emptyText={translate('groupPicker.noMatches')}
        aria-describedby={`${fieldId}-hint`}
        options={candidates.items.map((candidate) => ({
          value: candidate.employeeId,
          label: candidate.fullName,
          description: candidate.workEmail ?? undefined,
          disabled: chosen.has(candidate.employeeId)
        }))}
        onChange={(employeeId, option) => {
          if (!option || chosen.has(employeeId) || full) return
          onChange([...members, { employeeId, fullName: option.label, workEmail: option.description }])
        }}
      />
      <p id={`${fieldId}-hint`} className='text-xs leading-relaxed text-muted-foreground'>
        {translate('groupHint')}
      </p>
      {candidates.query?.isError && <EmployeeQueryState query={candidates.query} />}
      {members.length > 0 && (
        <ul aria-label={translate('selectedMembers')} className='grid gap-2 sm:grid-cols-2'>
          {members.map((member) => (
            <li
              key={member.employeeId}
              aria-label={translate('groupPicker.memberDetails', {
                name: member.fullName,
                email: member.workEmail ?? ''
              })}
              className='flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-surface py-1 pr-1 pl-3'
            >
              <span
                aria-hidden='true'
                className='grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-ink'
              >
                <UserRound strokeWidth={1.5} className='size-4' />
              </span>
              <span className='min-w-0 flex-1 text-sm'>
                <span className='block truncate font-medium' title={member.fullName}>
                  {member.fullName}
                </span>
                {member.workEmail && (
                  <span className='block truncate text-xs text-muted-foreground' title={member.workEmail}>
                    {member.workEmail}
                  </span>
                )}
              </span>
              <button
                type='button'
                disabled={disabled}
                aria-label={translate('ui.create.removeMember', { name: member.fullName })}
                className='grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger-ink focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50'
                onClick={() => onChange(members.filter((item) => item.employeeId !== member.employeeId))}
              >
                <X aria-hidden strokeWidth={1.5} className='size-4' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
