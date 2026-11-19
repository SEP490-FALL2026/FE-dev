import { AlertTriangle, ArrowRight, Boxes, Clock, DollarSign, Plus, Sparkles, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ManagerIdentityMark } from '../../shared/components/manager-identity-mark'

import { MOCK_GHOST_SEATS, MOCK_TEAM_REQUESTS, MOCK_TEAM_SOFTWARE, managerMetrics } from '../../manager-data'
import type { ManagerTabKey } from '../../manager-nav'

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
  const { i18n, t } = useTranslation('dashboard')

  const pendingRequests = MOCK_TEAM_REQUESTS.filter((r) => r.status === 'PENDING')
  const flaggedGhostSeats = MOCK_GHOST_SEATS.filter((g) => g.status === 'FLAGGED')
  const sampleSpend = MOCK_TEAM_SOFTWARE.reduce((sum, app) => sum + app.monthlyCost, 0)
  const assignedSeats = MOCK_TEAM_SOFTWARE.reduce((sum, app) => sum + app.inUseSeats, 0)
  const totalSeats = MOCK_TEAM_SOFTWARE.reduce((sum, app) => sum + app.totalSeats, 0)
  const chartColors = [
    'var(--theme-primary)',
    'var(--theme-info)',
    'var(--theme-warning)',
    'var(--theme-success)',
    'var(--theme-danger)',
    'var(--theme-muted-foreground)'
  ]
  const costGradient = `conic-gradient(${MOCK_TEAM_SOFTWARE.map((app, index) => {
    const previousCost = MOCK_TEAM_SOFTWARE.slice(0, index).reduce((sum, item) => sum + item.monthlyCost, 0)
    const start = (previousCost / sampleSpend) * 100
    const end = ((previousCost + app.monthlyCost) / sampleSpend) * 100
    return `${chartColors[index]} ${start}% ${end}%`
  }).join(', ')})`
  const formatPercent = (value: number) =>
    new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN', {
      maximumFractionDigits: 0,
      style: 'percent'
    }).format(value)

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

      <section aria-label={t('manager.overview.chartsRegion')} className='space-y-4'>
        <p className='rounded-xl border border-primary/20 bg-primary-soft/30 px-4 py-3 text-sm text-primary-ink'>
          {t('manager.overview.chartSampleNote', {
            count: MOCK_TEAM_SOFTWARE.length,
            total: managerMetrics.activeSoftware
          })}
        </p>

        <div className='grid gap-5 xl:grid-cols-2'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div>
                <h2 className='text-lg font-bold text-foreground'>{t('manager.overview.seatAllocationTitle')}</h2>
                <p className='mt-1 text-sm text-muted-foreground'>{t('manager.overview.seatAllocationSubtitle')}</p>
              </div>
              <button
                className='inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                onClick={() => onSelectTab('team-software')}
                type='button'
              >
                {t('manager.overview.viewAll')}
                <ArrowRight aria-hidden='true' className='size-4' />
              </button>
            </div>

            <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground'>
              <span className='inline-flex items-center gap-2'>
                <span aria-hidden='true' className='size-2.5 rounded-full bg-primary' />
                {t('manager.overview.assignedSeats')}
              </span>
              <span className='inline-flex items-center gap-2'>
                <span aria-hidden='true' className='size-2.5 rounded-full bg-border' />
                {t('manager.overview.availableSeats')}
              </span>
              <span className='font-semibold text-foreground'>
                {t('manager.overview.sampleSeats', {
                  assigned: formatNumber(assignedSeats),
                  total: formatNumber(totalSeats)
                })}
              </span>
            </div>

            <div className='mt-5 space-y-4'>
              {MOCK_TEAM_SOFTWARE.map((app) => (
                <div key={app.id}>
                  <div className='mb-1.5 flex items-center justify-between gap-3 text-sm'>
                    <span className='min-w-0 truncate font-semibold text-foreground'>{app.name}</span>
                    <span className='shrink-0 tabular-nums text-muted-foreground'>
                      {formatNumber(app.inUseSeats)} / {formatNumber(app.totalSeats)}
                    </span>
                  </div>
                  <div
                    aria-label={t('manager.overview.seatChartRowLabel', {
                      name: app.name,
                      used: formatNumber(app.inUseSeats),
                      total: formatNumber(app.totalSeats)
                    })}
                    className='flex h-3 overflow-hidden rounded-full bg-border'
                    role='img'
                  >
                    <span
                      aria-hidden='true'
                      className='h-full rounded-full bg-primary'
                      style={{ width: `${(app.inUseSeats / app.totalSeats) * 100}%` }}
                    />
                  </div>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {t('manager.overview.activityRate', { rate: formatPercent(app.activeRate / 100) })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
            <div>
              <h2 className='text-lg font-bold text-foreground'>{t('manager.overview.costDistributionTitle')}</h2>
              <p className='mt-1 text-sm text-muted-foreground'>{t('manager.overview.costDistributionSubtitle')}</p>
            </div>

            <div className='mt-6 flex flex-col items-center gap-6 sm:flex-row'>
              <div
                aria-label={t('manager.overview.costChartLabel', { amount: formatCurrency(sampleSpend) })}
                className='relative grid size-48 shrink-0 place-items-center rounded-full'
                role='img'
                style={{ background: costGradient }}
              >
                <div
                  aria-hidden='true'
                  className='grid size-32 place-content-center rounded-full bg-surface text-center'
                >
                  <span className='text-xs text-muted-foreground'>{t('manager.overview.costSampleTotal')}</span>
                  <strong className='mt-1 text-base text-foreground'>{formatCurrency(sampleSpend)}</strong>
                </div>
              </div>
              <ul className='grid w-full gap-2.5'>
                {MOCK_TEAM_SOFTWARE.map((app, index) => (
                  <li className='flex items-center justify-between gap-3 text-sm' key={app.id}>
                    <span className='flex min-w-0 items-center gap-2.5'>
                      <span
                        aria-hidden='true'
                        className='size-2.5 shrink-0 rounded-full'
                        style={{ backgroundColor: chartColors[index] }}
                      />
                      <span className='truncate text-foreground'>{app.name}</span>
                    </span>
                    <span className='flex shrink-0 flex-col items-end tabular-nums'>
                      <span className='font-semibold text-foreground'>
                        {formatPercent(app.monthlyCost / sampleSpend)}
                      </span>
                      <span className='text-xs text-muted-foreground'>{formatCurrency(app.monthlyCost)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
    </div>
  )
}
