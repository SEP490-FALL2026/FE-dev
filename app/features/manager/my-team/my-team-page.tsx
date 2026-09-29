import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { TeamFilters } from './components/team-filters'
import { TeamPagination } from './components/team-pagination'
import { TeamSummary } from './components/team-summary'
import { TeamTable } from './components/team-table'
import { buildTeamCsv } from './export-team'
import { useTeamFilters } from './hooks/use-team-filters'
import type { TeamMember } from '~/entities/user/team-member.types'

export function MyTeamPage() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('managerTeam.documentTitle'))
  const { filters, filtered, visible, page, pageCount, pageSize, update, clear } = useTeamFilters()
  const navigate = useNavigate()
  const location = useLocation()
  const viewMember = (member: TeamMember) => navigate(`/manager/my-team/${member.id}${location.search}`)
  const [exported, setExported] = useState<number | null>(null)
  const exportMembers = () => {
    const relative = new Intl.RelativeTimeFormat(i18n.resolvedLanguage, { style: 'short' })
    const csv = buildTeamCsv(
      filtered,
      (
        [
          'employee',
          'email',
          'department',
          'team',
          'costCenter',
          'activeLicenses',
          'pendingRequests',
          'status',
          'lastActive'
        ] as const
      ).map((key) => t(`managerTeam.${key}`)),
      (member) => t(`managerTeam.${member.status}`),
      (member) => relative.format(member.lastActive.value, member.lastActive.unit)
    )
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'manager-team.csv'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setExported(filtered.length)
  }
  return (
    <>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='mb-1 text-2xl font-bold'>{t('managerTeam.title')}</h1>
          <p className='text-sm text-neutral-500'>{t('managerTeam.subtitle')}</p>
        </div>
        <Link
          to='/manager/create-request?employee='
          className='flex self-start items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-brand-600 sm:self-auto'
        >
          {t('managerTeam.createRequest')}
          <Plus size={16} aria-hidden='true' />
        </Link>
      </div>
      <TeamSummary />
      <section
        className='min-w-0 rounded-xl border border-neutral-200 bg-white shadow-xs'
        aria-label={t('managerTeam.title')}
      >
        <TeamFilters filters={filters} onChange={update} onExport={exportMembers} empty={filtered.length === 0} />
        <TeamTable members={visible} onView={viewMember} onClear={clear} />
        <TeamPagination
          page={page}
          pageSize={pageSize}
          pageCount={pageCount}
          total={filtered.length}
          onPage={(n) => update('page', String(n))}
          onSize={(n) => update('size', String(n))}
        />
      </section>
      <p className='text-xs text-neutral-500'>{t('managerTeam.demo')}</p>
      {exported !== null && (
        <p role='status' className='text-xs text-neutral-500'>
          {t('managerTeam.exportSuccess', { count: exported })}
        </p>
      )}
    </>
  )
}
