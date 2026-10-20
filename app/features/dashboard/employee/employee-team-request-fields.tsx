import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { roleProfiles } from '../dashboard-data'
import { employeeProfileData } from './employee-data'
import { eligibleTeamMembers } from './employee-team-request-draft'

interface EmployeeTeamRequestFieldsProps {
  selectedMemberIds: string[]
  onChange: (memberIds: string[]) => void
}

export function EmployeeTeamRequestFields({ selectedMemberIds, onChange }: EmployeeTeamRequestFieldsProps) {
  const { t } = useTranslation('dashboard')
  const availableMembers = eligibleTeamMembers.filter((member) => !selectedMemberIds.includes(member.id))
  const selectedMembers = eligibleTeamMembers.filter((member) => selectedMemberIds.includes(member.id))

  return (
    <section className='space-y-4 rounded-2xl border border-primary/25 bg-primary-soft/20 p-4 sm:p-5'>
      <div>
        <h2 className='text-base font-bold text-foreground'>{t('employee.requestNewSoftware.teamSectionTitle')}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('employee.requestNewSoftware.teamSectionDescription', {
            department: employeeProfileData.personal.department
          })}
        </p>
      </div>

      <div className='rounded-xl border border-border bg-surface p-3 text-sm'>
        <p className='font-semibold text-foreground'>{t('employee.requestNewSoftware.teamRepresentative')}</p>
        <p className='mt-1 text-foreground'>{roleProfiles.employee.displayName}</p>
        <p className='text-muted-foreground'>{t('employee.requestNewSoftware.teamRepresentativeHint')}</p>
      </div>

      <div>
        <div className='mb-2 flex flex-wrap items-end justify-between gap-2'>
          <label className='text-sm font-semibold text-foreground' htmlFor='employee-team-member-select'>
            {t('employee.requestNewSoftware.teamMembers')}
          </label>
          <span className='text-xs text-muted-foreground'>
            {t('employee.requestNewSoftware.teamSeatCount', { count: selectedMemberIds.length + 1 })}
          </span>
        </div>
        <select
          className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:opacity-60 sm:text-sm'
          disabled={availableMembers.length === 0}
          id='employee-team-member-select'
          onChange={(event) => {
            if (event.target.value) onChange([...selectedMemberIds, event.target.value])
          }}
          value=''
        >
          <option value=''>
            {t(
              availableMembers.length > 0
                ? 'employee.requestNewSoftware.selectTeamMember'
                : 'employee.requestNewSoftware.allTeamMembersSelected'
            )}
          </option>
          {availableMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} · {member.email}
            </option>
          ))}
        </select>
        <p className='mt-2 text-xs text-muted-foreground'>
          {t('employee.requestNewSoftware.teamMaximum', { count: eligibleTeamMembers.length + 1 })}
        </p>
      </div>

      {selectedMembers.length > 0 && (
        <ul className='space-y-2'>
          {selectedMembers.map((member) => (
            <li
              className='flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3'
              key={member.id}
            >
              <span className='min-w-0 text-sm'>
                <span className='block font-semibold text-foreground'>{member.name}</span>
                <span className='block truncate text-muted-foreground'>{member.email}</span>
              </span>
              <button
                aria-label={t('employee.requestNewSoftware.removeTeamMember', { name: member.name })}
                className='grid min-h-11 min-w-11 place-items-center rounded-lg border border-border text-muted-foreground hover:text-danger-ink'
                onClick={() => onChange(selectedMemberIds.filter((id) => id !== member.id))}
                type='button'
              >
                <Trash2 aria-hidden='true' className='size-4' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
