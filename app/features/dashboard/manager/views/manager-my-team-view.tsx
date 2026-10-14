import { Plus, Search, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS } from '../manager-data'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'
import { ManagerSummaryStrip } from '../manager-summary-strip'

interface ManagerMyTeamViewProps {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerMyTeamView({ onSelectTab }: ManagerMyTeamViewProps) {
  const { i18n, t } = useTranslation('dashboard')
  const formatCount = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'vi').format
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ON_LEAVE' | 'OFFBOARDING'>('ALL')

  const filteredMembers = MOCK_TEAM_MEMBERS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const activeCount = MOCK_TEAM_MEMBERS.filter((member) => member.status === 'ACTIVE').length
  const pendingCount = MOCK_TEAM_MEMBERS.reduce((count, member) => count + member.pendingRequestsCount, 0)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('manager.team.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.team.subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => onSelectTab('create-employee-request')}
            type='button'
          >
            <Plus className='size-4' />
            <span>{t('manager.team.assignSoftwareBtn')}</span>
          </button>
        </div>
      </div>

      <ManagerSummaryStrip
        metrics={[
          { label: t('manager.team.metricMembers'), value: formatCount(MOCK_TEAM_MEMBERS.length) },
          { label: t('manager.team.metricActive'), value: formatCount(activeCount) },
          { label: t('manager.team.metricPending'), value: formatCount(pendingCount) }
        ]}
      />

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        {/* Search & Filters */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              aria-label={t('manager.team.searchPlaceholder')}
              className='h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('manager.team.searchPlaceholder')}
              type='search'
              value={searchTerm}
            />
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {[
              { id: 'ALL' as const, label: t('manager.team.filterAll') },
              { id: 'ACTIVE' as const, label: t('manager.team.filterActive') },
              { id: 'ON_LEAVE' as const, label: t('manager.team.filterOnLeave') },
              { id: 'OFFBOARDING' as const, label: t('manager.team.filterOffboarding') }
            ].map((opt) => (
              <button
                aria-pressed={statusFilter === opt.id}
                key={opt.id}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === opt.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                onClick={() => setStatusFilter(opt.id)}
                type='button'
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <caption className='sr-only'>{t('manager.team.title')}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.team.colMember')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.team.colRole')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.team.colLicenses')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.team.colPendingReqs')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.team.colStatus')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.team.colLastActive')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.team.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    <UsersRound className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('manager.team.empty')}</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-3'>
                        <ManagerIdentityMark name={member.name} person />
                        <div>
                          <p className='font-bold text-foreground'>{member.name}</p>
                          <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
                            <span className='font-mono font-semibold'>{member.code}</span>
                            <span>·</span>
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <p className='font-semibold text-foreground'>{member.jobTitle}</p>
                      <p className='text-[11px] text-muted-foreground'>{member.team}</p>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <span className='inline-flex items-center rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary'>
                        {member.activeLicensesCount}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      {member.pendingRequestsCount > 0 ? (
                        <span className='inline-flex items-center rounded-lg bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning'>
                          {member.pendingRequestsCount}
                        </span>
                      ) : (
                        <span className='text-muted-foreground font-mono'>{0}</span>
                      )}
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          member.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : member.status === 'ON_LEAVE'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {member.status === 'ACTIVE'
                          ? t('manager.team.statusActive')
                          : member.status === 'ON_LEAVE'
                            ? t('manager.team.statusOnLeave')
                            : t('manager.team.statusOffboarding')}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 text-right font-mono text-muted-foreground'>{member.lastActive}</td>

                    <td className='py-3.5 px-4 text-right'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button
                          className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
                          onClick={() => onSelectTab('employee-detail', { id: member.id })}
                          type='button'
                        >
                          {t('manager.team.viewDetailBtn')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
