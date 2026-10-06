import { AlertTriangle, ArrowRight, Boxes, Clock, DollarSign, Plus, Sparkles, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ManagerIdentityMark } from '../manager-identity-mark'

import { MOCK_GHOST_SEATS, MOCK_TEAM_REQUESTS, MOCK_TEAM_SOFTWARE, managerMetrics } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerOverviewViewProps {
  displayName?: string
  formatCurrency: (value: number) => string
  formatNumber?: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerOverviewView({
  displayName,
  formatCurrency,
  formatNumber = (val) => String(val),
  onSelectTab
}: ManagerOverviewViewProps) {
  const { t } = useTranslation('dashboard')

  const pendingRequests = MOCK_TEAM_REQUESTS.filter((r) => r.status === 'PENDING')
  const flaggedGhostSeats = MOCK_GHOST_SEATS.filter((g) => g.status === 'FLAGGED')

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-md bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary'>
              {t('manager.overview.badge')}
            </span>
            <span className='text-xs text-muted-foreground'>
              {displayName ? t('manager.overview.welcome', { name: displayName }) : ''}
            </span>
          </div>
          <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.dashboard.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.dashboard.subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => onSelectTab('create-employee-request')}
            type='button'
          >
            <Plus className='size-4' />
            <span>{t('manager.overview.quickCreateBtn')}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Executive Metric Cards */}
      <section aria-label={t('metrics.regionLabel')} className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('manager.metrics.teamMembers')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <UsersRound className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatNumber(managerMetrics.teamMembers)}</p>
          <div className='mt-1 text-xs text-muted-foreground'>
            <span>{t('manager.metrics.teamMembersSub')}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('manager.metrics.activeSoftware')}
            </span>
            <div className='rounded-lg bg-info/10 p-2 text-info'>
              <Boxes className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatNumber(managerMetrics.activeSoftware)}</p>
          <div className='mt-1 text-xs text-muted-foreground'>
            <span>{t('manager.metrics.activeSoftwareSub')}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('manager.metrics.monthlySpend')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>{formatCurrency(managerMetrics.monthlySpend)}</p>
          <div className='mt-1 text-xs text-muted-foreground'>
            <span>{t('manager.metrics.monthlySpendSub')}</span>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('manager.metrics.ghostSeats')}
            </span>
            <div className='rounded-lg bg-danger/10 p-2 text-danger'>
              <Sparkles className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-danger'>{formatNumber(managerMetrics.ghostSeats)}</p>
          <div className='mt-1 text-xs font-medium text-success'>
            <span>
              {t('manager.metrics.potentialSavings', { amount: formatCurrency(managerMetrics.potentialSavings) })}
            </span>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Pending Requests & Ghost Seats */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Pending Requests Card */}
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div className='flex items-center gap-2'>
              <Clock className='size-4 text-primary' />
              <h2 className='text-sm font-bold text-foreground'>{t('manager.overview.pendingRequestsTitle')}</h2>
              <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary'>
                {pendingRequests.length}
              </span>
            </div>
            <button
              className='text-xs font-semibold text-primary transition hover:underline'
              onClick={() => onSelectTab('team-requests')}
              type='button'
            >
              {t('manager.overview.viewAll')}
            </button>
          </div>

          <div className='divide-y divide-border'>
            {pendingRequests.map((req) => (
              <div key={req.id} className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-3 min-w-0 flex-1 pr-2'>
                  <ManagerIdentityMark name={req.saasName} />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='truncate font-bold text-xs text-foreground'>{req.requesterName}</p>
                      <span className='rounded px-1.5 py-0.2 bg-surface-subtle text-[10px] font-mono text-muted-foreground'>
                        {req.code}
                      </span>
                    </div>
                    <p className='truncate text-[11px] text-muted-foreground'>
                      {req.saasName} · {req.plan}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    className='rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground'
                    onClick={() => onSelectTab('request-approval', { id: req.id })}
                    type='button'
                  >
                    {t('manager.overview.reviewBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ghost Seats Card */}
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='size-4 text-warning' />
              <h2 className='text-sm font-bold text-foreground'>{t('manager.overview.ghostSeatsTitle')}</h2>
              <span className='rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger'>
                {flaggedGhostSeats.length}
              </span>
            </div>
            <button
              className='text-xs font-semibold text-primary transition hover:underline'
              onClick={() => onSelectTab('ghost-seat-review')}
              type='button'
            >
              {t('manager.overview.viewAll')}
            </button>
          </div>

          <div className='divide-y divide-border'>
            {flaggedGhostSeats.map((ghost) => (
              <div key={ghost.id} className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-3 min-w-0 flex-1 pr-2'>
                  <ManagerIdentityMark name={ghost.softwareName} />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-bold text-xs text-foreground'>{ghost.employeeName}</p>
                    <p className='truncate text-[11px] text-muted-foreground'>
                      {ghost.softwareName} · {t('manager.overview.inactiveDaysLabel', { days: ghost.inactiveDays })}
                    </p>
                  </div>
                </div>

                <div className='text-right'>
                  <p className='font-bold text-xs text-danger'>
                    {t('manager.overview.costPerMonth', { amount: formatCurrency(ghost.monthlyCost) })}
                  </p>
                  <button
                    className='text-[11px] font-semibold text-primary transition hover:underline'
                    onClick={() => onSelectTab('ghost-seat-detail', { id: ghost.id })}
                    type='button'
                  >
                    {t('manager.overview.handleBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Software Utilization Table */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-bold text-foreground'>{t('manager.overview.teamSoftwareTitle')}</h2>
            <p className='text-xs text-muted-foreground'>{t('manager.overview.teamSoftwareSub')}</p>
          </div>
          <button
            className='inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline'
            onClick={() => onSelectTab('team-software')}
            type='button'
          >
            <span>{t('manager.overview.viewAll')}</span>
            <ArrowRight className='size-3.5' />
          </button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {MOCK_TEAM_SOFTWARE.slice(0, 6).map((app) => (
            <div key={app.id} className='rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 min-w-0'>
                  <ManagerIdentityMark className='size-8 rounded-lg' name={app.name} />
                  <div className='min-w-0'>
                    <h3 className='truncate font-bold text-xs text-foreground'>{app.name}</h3>
                    <p className='truncate text-[10px] text-muted-foreground'>{app.category}</p>
                  </div>
                </div>
                <span className='font-mono font-bold text-xs text-foreground'>{app.activeRate}%</span>
              </div>

              <div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground mb-1'>
                  <span>{t('manager.overview.seatsInUse', { inUse: app.inUseSeats, total: app.totalSeats })}</span>
                  <span>{formatCurrency(app.monthlyCost)}</span>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-border'>
                  <div
                    className={`h-full rounded-full ${
                      app.activeRate >= 80 ? 'bg-success' : app.activeRate >= 50 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${app.activeRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
