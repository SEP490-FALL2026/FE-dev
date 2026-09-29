import { Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MemberAvatar } from '~/entities/user/member-avatar'
import { managerEmployeePreview } from '~/entities/user/manager-employee-preview'
import { teamMembers } from '~/entities/user/team-members-demo'
import type { TeamMember } from '~/entities/user/team-member.types'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
}

export function EmployeePicker({
  selected,
  invalid,
  onSelect
}: {
  selected?: TeamMember
  invalid: boolean
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const results = teamMembers.filter((member) =>
    normalize(
      `${member.name} ${member.email} ${member.id === managerEmployeePreview.id ? managerEmployeePreview.code : ''}`
    ).includes(normalize(search))
  )
  return (
    <div className='space-y-5'>
      <label className='block text-sm font-medium'>
        <span>{t('createEmployee.search')}</span>
        <div className='relative mt-2'>
          <Search size={18} aria-hidden='true' className='absolute top-3 left-3 text-neutral-500' />
          <input
            ref={input}
            type='search'
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpen(true)
            }}
            aria-controls={open ? 'employee-search-results' : undefined}
            placeholder={t('createEmployee.searchHint')}
            className='w-full rounded-lg border border-neutral-200 bg-brand-bg py-3 pr-3 pl-10 text-sm outline-brand-500'
          />
        </div>
      </label>
      {open && (
        <fieldset
          id='employee-search-results'
          className='max-h-64 space-y-1 overflow-y-auto rounded-lg border border-neutral-200 p-3'
        >
          <legend className='px-1 text-xs text-neutral-500'>{t('createEmployee.results')}</legend>
          {results.length ? (
            results.map((member) => (
              <label
                key={member.id}
                className='flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-brand-100'
              >
                <input
                  type='radio'
                  name='employee'
                  checked={selected?.id === member.id}
                  onChange={() => {
                    onSelect(member.id)
                    setOpen(false)
                    setSearch('')
                  }}
                  className='accent-brand-500'
                  aria-label={t('createEmployee.selectEmployee', { name: member.name, email: member.email })}
                />
                <MemberAvatar member={member} />
                <span>
                  <span className='block text-sm font-medium'>{member.name}</span>
                  <span className='block text-xs text-neutral-500'>{member.email}</span>
                </span>
                <span className='ml-auto text-xs text-neutral-500'>{t(`managerTeam.${member.status}`)}</span>
              </label>
            ))
          ) : (
            <p role='status' className='p-3 text-sm text-neutral-500'>
              {t('createEmployee.noResults')}
            </p>
          )}
        </fieldset>
      )}
      {invalid && (
        <p role='alert' className='text-sm text-danger'>
          {t('createEmployee.invalidEmployee')}
        </p>
      )}
      {selected ? (
        <section
          aria-label={t('createEmployee.selected')}
          className='relative flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 bg-brand-bg p-5 pr-12'
        >
          <MemberAvatar key={selected.id} member={selected} />
          <div className='min-w-0 flex-1'>
            <h3 className='font-bold'>{selected.name}</h3>
            <p className='mt-1 text-sm text-neutral-500'>
              {selected.id === managerEmployeePreview.id ? managerEmployeePreview.jobTitle : selected.department}
            </p>
            <p className='mt-1 text-xs break-all text-neutral-500'>{selected.email}</p>
          </div>
          <dl className='flex flex-wrap gap-6 text-sm'>
            <div>
              <dt className='text-xs text-neutral-500'>{t('createEmployee.employeeId')}</dt>
              <dd className='mt-1 font-medium'>
                {selected.id === managerEmployeePreview.id
                  ? managerEmployeePreview.code
                  : t('createEmployee.notProvided')}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-neutral-500'>{t('managerTeam.team')}</dt>
              <dd className='mt-1 font-medium'>{selected.team}</dd>
            </div>
          </dl>
          <button
            type='button'
            onClick={() => {
              onSelect('')
              input.current?.focus()
            }}
            aria-label={t('createEmployee.remove')}
            className='absolute top-3 right-3 rounded p-1 text-neutral-500 hover:bg-brand-100'
          >
            <X size={18} aria-hidden='true' />
          </button>
        </section>
      ) : (
        <p className='text-sm text-neutral-500'>{t('createEmployee.noSelection')}</p>
      )}
    </div>
  )
}
