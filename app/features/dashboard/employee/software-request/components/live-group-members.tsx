import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGroupRequestCandidateList } from '~/shared/api/generated/operations/group-requests/group-request-candidate-list'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import {
  EmployeeField,
  EmployeeInput,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeButton
} from '../../shared/components/employee-api-ui'
import type { GroupSelection } from '../hooks/use-live-request-form'

export function LiveGroupMembers({
  members,
  onChange,
  disabled
}: {
  members: GroupSelection[]
  onChange: (members: GroupSelection[]) => void
  disabled: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { page, pageSize, onPage } = useEmployeePage('membersPage')
  const [draftSearch, setDraftSearch] = useState('')
  const [search, setSearch] = useState('')
  const query = useGroupRequestCandidateList({ page, pageSize, ...(search ? { q: search } : {}) })
  return (
    <section className='space-y-4 border-t border-border/60 pt-5'>
      <h3 className='font-semibold'>{translate('members')}</h3>
      <p className='text-sm text-muted-foreground'>{translate('groupHint')}</p>
      <div className='flex flex-wrap items-end gap-2'>
        <EmployeeField label={translate('memberSearch')}>
          <EmployeeInput value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} maxLength={100} />
        </EmployeeField>
        <EmployeeButton
          type='button'
          disabled={disabled}
          onClick={() => {
            setSearch(draftSearch.trim())
            onPage(1)
          }}
        >
          {translate('lookup')}
        </EmployeeButton>
      </div>
      <p className='text-right font-mono text-sm tabular-nums'>{translate('selected', { count: members.length })}</p>
      <EmployeeQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError && (
        <div className='grid gap-2 sm:grid-cols-2'>
          {query.data?.data?.items.map((candidate) => {
            const selected = members.some((member) => member.employeeId === candidate.employeeId)
            return (
              <label
                key={candidate.employeeId}
                className='flex min-h-11 min-w-0 items-center gap-3 rounded-md border border-border/60 px-3 py-2'
              >
                <input
                  type='checkbox'
                  checked={selected}
                  disabled={disabled || (!selected && members.length >= 10)}
                  onChange={() =>
                    onChange(
                      selected
                        ? members.filter((member) => member.employeeId !== candidate.employeeId)
                        : [
                            ...members,
                            { employeeId: candidate.employeeId, fullName: candidate.fullName, expectedEndDate: '' }
                          ]
                    )
                  }
                />
                <span className='truncate text-sm' title={candidate.fullName}>
                  {candidate.fullName}
                </span>
              </label>
            )
          })}
        </div>
      )}
      <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      {members.map((member) => (
        <div key={member.employeeId} className='grid gap-2 sm:grid-cols-2'>
          <p className='self-center truncate text-sm' title={member.fullName}>
            {member.fullName}
          </p>
          <EmployeeField label={translate('memberEndDate')}>
            <EmployeeInput
              type='date'
              value={member.expectedEndDate}
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  members.map((current) =>
                    current.employeeId === member.employeeId
                      ? { ...current, expectedEndDate: event.target.value }
                      : current
                  )
                )
              }
            />
          </EmployeeField>
        </div>
      ))}
    </section>
  )
}
