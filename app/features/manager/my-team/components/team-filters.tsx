import { Download, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { teamMembers } from '~/entities/user/team-members-demo'
import type { TeamFilter } from '../my-team.types'

export function TeamFilters({
  filters,
  onChange,
  onExport,
  empty
}: {
  filters: Record<TeamFilter, string>
  onChange: (key: TeamFilter, value: string) => void
  onExport: () => void
  empty: boolean
}) {
  const { t } = useTranslation()
  const choices = [
    { key: 'status', all: 'allStatus', options: ['active', 'inactive'] },
    { key: 'department', all: 'allDepartments', options: [...new Set(teamMembers.map((m) => m.department))] },
    { key: 'team', all: 'allTeams', options: [...new Set(teamMembers.map((m) => m.team))] },
    { key: 'costCenter', all: 'allCosts', options: [...new Set(teamMembers.map((m) => m.costCenter))] }
  ] as const
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 p-4'>
      <div className='flex min-w-0 flex-1 flex-wrap items-center gap-3'>
        <div className='relative w-full sm:w-72'>
          <Search
            size={16}
            aria-hidden='true'
            className='pointer-events-none absolute top-2.5 left-3 text-neutral-500'
          />
          <input
            type='search'
            aria-label={t('managerTeam.search')}
            placeholder={t('managerTeam.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            className='w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-sm outline-brand-500 placeholder:text-neutral-500/60'
          />
        </div>
        {choices.map(({ key, all, options }) => (
          <select
            key={key}
            aria-label={t(`managerTeam.${key}`)}
            value={filters[key]}
            onChange={(e) => onChange(key, e.target.value)}
            className='max-w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500 outline-brand-500'
          >
            <option value=''>{t(`managerTeam.${all}`)}</option>
            {options.map((value) => (
              <option key={value} value={value}>
                {key === 'status' ? t(`managerTeam.${value}`) : value}
              </option>
            ))}
          </select>
        ))}
      </div>
      <button
        type='button'
        onClick={onExport}
        disabled={empty}
        className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <Download size={16} aria-hidden='true' className='text-brand-500' />
        {t('managerTeam.export')}
      </button>
    </div>
  )
}
