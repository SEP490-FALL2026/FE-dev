import { Clock, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_REQUESTS } from '../manager-data'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'
import { ManagerSummaryStrip } from '../manager-summary-strip'

interface ManagerTeamRequestsViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerTeamRequestsView({ formatCurrency, onSelectTab }: ManagerTeamRequestsViewProps) {
  const { i18n, t } = useTranslation('dashboard')
  const formatCount = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'vi').format
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')

  const filtered = MOCK_TEAM_REQUESTS.filter((req) => {
    const matchesSearch =
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.saasName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = MOCK_TEAM_REQUESTS.filter((request) => request.status === 'PENDING').length
  const urgentCount = MOCK_TEAM_REQUESTS.filter((request) => request.urgency === 'HIGH').length

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.requests.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.requests.subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => onSelectTab('create-employee-request')}
            type='button'
          >
            <Plus className='size-4' />
            <span>{t('manager.requests.createForEmployeeBtn')}</span>
          </button>
        </div>
      </div>

      <ManagerSummaryStrip
        metrics={[
          { label: t('manager.requests.metricTotal'), value: formatCount(MOCK_TEAM_REQUESTS.length) },
          { label: t('manager.requests.metricPending'), value: formatCount(pendingCount) },
          { label: t('manager.requests.metricUrgent'), value: formatCount(urgentCount) }
        ]}
      />

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        {/* Controls */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              aria-label={t('manager.requests.searchPlaceholder')}
              className='h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('manager.requests.searchPlaceholder')}
              type='search'
              value={searchTerm}
            />
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            {[
              { id: 'ALL' as const, label: t('manager.requests.filterAll') },
              { id: 'PENDING' as const, label: t('manager.requests.filterPending') },
              { id: 'APPROVED' as const, label: t('manager.requests.filterApproved') },
              { id: 'REJECTED' as const, label: t('manager.requests.filterRejected') }
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

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <caption className='sr-only'>{t('manager.requests.title')}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.requests.colRequest')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.requests.colRequester')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.requests.colType')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.requests.colUrgency')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.requests.colEstimatedCost')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.requests.colStatus')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.requests.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    <Clock className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('manager.requests.empty')}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-3'>
                        <ManagerIdentityMark name={item.saasName} />
                        <div>
                          <p className='font-bold text-foreground'>{item.saasName}</p>
                          <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
                            <span className='font-mono font-bold'>{item.code}</span>
                            <span>·</span>
                            <span>{item.plan}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <p className='font-bold text-foreground'>{item.requesterName}</p>
                      <p className='text-[11px] text-muted-foreground'>{item.requesterJob}</p>
                    </td>

                    <td className='py-3.5 px-4 font-medium text-foreground'>
                      {item.type === 'NEW_ACCESS'
                        ? t('manager.requests.typeNewAccess')
                        : item.type === 'CHANGE_PLAN'
                          ? t('manager.requests.typeChangePlan')
                          : t('manager.requests.typeRenewal')}
                    </td>

                    <td className='py-3.5 px-4'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.urgency === 'HIGH'
                            ? 'bg-danger/10 text-danger'
                            : item.urgency === 'MEDIUM'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-surface-subtle text-muted-foreground'
                        }`}
                      >
                        {item.urgency === 'HIGH'
                          ? t('manager.requests.urgencyHigh')
                          : item.urgency === 'MEDIUM'
                            ? t('manager.requests.urgencyMedium')
                            : t('manager.requests.urgencyLow')}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 text-right font-bold text-foreground'>
                      {formatCurrency(item.estimatedMonthlyCost)}
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.status === 'PENDING'
                            ? 'bg-warning/10 text-warning'
                            : item.status === 'APPROVED'
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {item.status === 'PENDING'
                          ? t('manager.requests.statusPending')
                          : item.status === 'APPROVED'
                            ? t('manager.requests.statusApproved')
                            : t('manager.requests.statusRejected')}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 text-right'>
                      <button
                        className='rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground'
                        onClick={() => onSelectTab('request-approval', { id: item.id })}
                        type='button'
                      >
                        {t('manager.requests.actReview')}
                      </button>
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
