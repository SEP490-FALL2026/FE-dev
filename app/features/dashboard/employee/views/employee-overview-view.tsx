import {
  ArrowRight,
  ArrowRightLeft,
  CalendarPlus,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Clock,
  Laptop,
  Lightbulb,
  Plus,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { catalogSoftwareList, employeeSoftwareItems, employeeSummaryCards } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeOverviewViewProps {
  displayName: string
  formatCurrency: (value: number) => string
  formatNumber: (value: number) => string
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

const ASSIGNED_SOFTWARE_PAGE_SIZE = 4

export function EmployeeOverviewView({ displayName, onSelectTab }: EmployeeOverviewViewProps) {
  const { t } = useTranslation('dashboard')
  const [softwarePage, setSoftwarePage] = useState(1)
  const softwarePageCount = Math.ceil(employeeSoftwareItems.length / ASSIGNED_SOFTWARE_PAGE_SIZE)
  const visibleSoftware = employeeSoftwareItems.slice(
    (softwarePage - 1) * ASSIGNED_SOFTWARE_PAGE_SIZE,
    softwarePage * ASSIGNED_SOFTWARE_PAGE_SIZE
  )

  const cardIcons = {
    0: Laptop,
    1: Clock,
    2: CalendarX,
    3: Sparkles
  }

  const upcomingExpiring = employeeSoftwareItems.filter((item) => item.status === 'expiringSoon')

  const cardContent = [
    {
      subtitle: t('employee.overview.cards.mySoftware.subtitle'),
      title: t('employee.overview.cards.mySoftware.title')
    },
    {
      subtitle: t('employee.overview.cards.pendingRequests.subtitle'),
      title: t('employee.overview.cards.pendingRequests.title')
    },
    {
      subtitle: t('employee.overview.cards.expiringSoon.subtitle'),
      title: t('employee.overview.cards.expiringSoon.title')
    },
    {
      subtitle: t('employee.overview.cards.totalRequests.subtitle'),
      title: t('employee.overview.cards.totalRequests.title')
    }
  ]

  return (
    <div className='space-y-8'>
      {/* Header Greeting Banner */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            {t('employee.overview.badge')}
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>
            {t('employee.overview.greeting', { name: displayName })}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.overview.subtitle')}</p>
        </div>

        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <Plus aria-hidden='true' className='size-4' />
          {t('employee.overview.quickActions.requestSoftware')}
        </button>
      </div>

      {/* Metric / Summary Cards */}
      <section aria-label={t('metrics.regionLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {employeeSummaryCards.map((card, idx) => {
          const Icon = cardIcons[idx as keyof typeof cardIcons] ?? Laptop
          const content = cardContent[idx]
          const toneClass =
            card.accent === 'primary'
              ? 'border-primary/20 bg-primary-soft/50 text-primary'
              : card.accent === 'warning'
                ? 'border-warning/25 bg-warning/10 text-warning'
                : card.accent === 'danger'
                  ? 'border-danger/25 bg-danger/10 text-danger'
                  : 'border-info/25 bg-info/10 text-info'

          return (
            <div
              className='relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md'
              key={card.titleKey}
            >
              <div className='flex items-center justify-between'>
                <span className={`grid size-11 place-items-center rounded-xl border ${toneClass}`}>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
                {card.change !== undefined && card.change > 0 && (
                  <span className='rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success'>
                    +{card.change}
                  </span>
                )}
              </div>
              <p className='mt-4 text-xs font-semibold text-muted-foreground'>{content?.title}</p>
              <p className='mt-1 text-2xl font-bold text-foreground'>{card.value}</p>
              <p className='mt-1 text-xs text-muted-foreground'>{content?.subtitle}</p>
            </div>
          )
        })}
      </section>

      {/* Main Grid: Left (8 cols) & Right (4 cols) */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column */}
        <div className='space-y-6 lg:col-span-8'>
          {/* Recent Software Table */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='flex items-center justify-between border-b border-border pb-4'>
              <div>
                <h2 className='text-base font-bold text-foreground'>{t('employee.overview.recentSoftware.title')}</h2>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  {t('employee.overview.recentSoftware.viewAll', { count: employeeSoftwareItems.length })}
                </p>
              </div>
              <button
                className='inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-primary-ink transition hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                onClick={() => onSelectTab('my-software')}
                type='button'
              >
                <span>{t('employee.mySoftware.filterAll')}</span>
                <ChevronRight aria-hidden='true' className='size-4' />
              </button>
            </div>

            <div className='divide-y divide-border xl:hidden'>
              {visibleSoftware.map((item) => (
                <article
                  className='flex flex-wrap items-center gap-3 border-b border-border py-4 last:border-0'
                  key={item.id}
                >
                  <img
                    alt=''
                    className='size-10 shrink-0 rounded-lg border border-border bg-surface object-contain p-1'
                    src={item.logoUrl}
                  />
                  <div className='min-w-0 flex-1'>
                    <h3 className='truncate text-sm font-bold text-foreground'>{item.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {item.plan} · {item.usage}%
                    </p>
                    <p className='text-sm text-foreground'>
                      {item.status === 'active'
                        ? t('employee.mySoftware.statusActive')
                        : t('employee.mySoftware.statusExpiring')}
                    </p>
                  </div>
                  <button
                    className='inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto'
                    onClick={() => onSelectTab('software-detail', { id: item.id })}
                    type='button'
                  >
                    {t('employee.mySoftware.actViewDetails')}
                  </button>
                </article>
              ))}
            </div>
            <div className='hidden divide-y divide-border overflow-x-auto xl:block'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='text-muted-foreground'>
                    <th className='py-3 pr-4 font-semibold'>{t('employee.overview.recentSoftware.colSoftware')}</th>
                    <th className='py-3 px-4 font-semibold'>{t('employee.overview.recentSoftware.colPlan')}</th>
                    <th className='py-3 px-4 font-semibold'>{t('employee.overview.recentSoftware.colStatus')}</th>
                    <th className='py-3 px-4 font-semibold'>{t('employee.overview.recentSoftware.colUsage')}</th>
                    <th className='py-3 pl-4 text-right font-semibold'>
                      {t('employee.overview.recentSoftware.colActions')}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/60'>
                  {visibleSoftware.map((item) => (
                    <tr className='group transition hover:bg-surface-subtle/50' key={item.id}>
                      <td className='py-3 pr-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            alt={item.name}
                            className='size-8 rounded-lg border border-border bg-surface object-contain p-1'
                            src={item.logoUrl}
                          />
                          <div>
                            <p className='font-bold text-foreground'>{item.name}</p>
                            <p className='text-[0.7rem] text-muted-foreground'>{item.vendor}</p>
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-muted-foreground'>{item.plan}</td>
                      <td className='py-3 px-4'>
                        {item.status === 'active' ? (
                          <span className='inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-[0.7rem] font-semibold text-success'>
                            <span className='size-1.5 rounded-full bg-success' />
                            {t('employee.mySoftware.statusActive')}
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 rounded-md border border-warning/25 bg-warning/10 px-2 py-0.5 text-[0.7rem] font-semibold text-warning'>
                            <span className='size-1.5 rounded-full bg-warning' />
                            {t('employee.mySoftware.statusExpiring')}
                          </span>
                        )}
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex items-center gap-2'>
                          <div className='h-1.5 w-16 overflow-hidden rounded-full bg-border'>
                            <div className='h-full bg-primary' style={{ width: `${item.usage}%` }} />
                          </div>
                          <span className='text-[0.7rem] font-medium text-muted-foreground'>{item.usage}%</span>
                        </div>
                      </td>
                      <td className='py-3 pl-4 text-right'>
                        <button
                          className='min-h-10 rounded-lg border border-border px-3 py-1 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          onClick={() => onSelectTab('software-detail', { id: item.id })}
                          type='button'
                        >
                          {t('employee.mySoftware.actViewDetails')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {softwarePageCount > 1 && (
              <nav
                aria-label={t('employee.overview.recentSoftware.paginationLabel')}
                className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4'
              >
                <span className='text-xs text-muted-foreground'>
                  {t('employee.overview.recentSoftware.pageStatus', {
                    page: softwarePage,
                    total: softwarePageCount
                  })}
                </span>
                <div className='flex items-center gap-2'>
                  <button
                    className='inline-flex min-h-11 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-40'
                    disabled={softwarePage === 1}
                    onClick={() => setSoftwarePage((page) => page - 1)}
                    type='button'
                  >
                    <ChevronLeft aria-hidden='true' className='size-3.5' />
                    {t('employee.overview.recentSoftware.previousPage')}
                  </button>
                  <button
                    className='inline-flex min-h-11 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-40'
                    disabled={softwarePage === softwarePageCount}
                    onClick={() => setSoftwarePage((page) => page + 1)}
                    type='button'
                  >
                    {t('employee.overview.recentSoftware.nextPage')}
                    <ChevronRight aria-hidden='true' className='size-3.5' />
                  </button>
                </div>
              </nav>
            )}
          </div>

          {/* Recommended Software Catalog */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='mb-4'>
              <h2 className='text-base font-bold text-foreground'>{t('employee.overview.recommended.title')}</h2>
              <p className='mt-0.5 text-xs text-muted-foreground'>{t('employee.overview.recommended.subtitle')}</p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              {catalogSoftwareList.slice(0, 4).map((sw) => (
                <div
                  className='flex items-start justify-between rounded-xl border border-border bg-surface-subtle/40 p-3.5 transition hover:border-primary/40 hover:bg-surface'
                  key={sw.id}
                >
                  <div className='flex items-start gap-3'>
                    <img
                      alt={sw.name}
                      className='size-9 rounded-lg border border-border bg-surface object-contain p-1'
                      src={sw.logoUrl}
                    />
                    <div>
                      <p className='text-xs font-bold text-foreground'>{sw.name}</p>
                      <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{sw.category}</p>
                      {sw.popularBadge && (
                        <span className='mt-1 inline-block rounded bg-primary-soft px-1.5 py-0.5 text-[0.65rem] font-bold text-primary'>
                          {sw.popularBadge}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className='min-h-11 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                    onClick={() => onSelectTab('request-new-software', { softwareId: sw.id })}
                    type='button'
                  >
                    {t('employee.mySoftware.actRequestNew')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6 lg:col-span-4'>
          {/* Quick Actions Card */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2 text-foreground'>
              <Zap aria-hidden='true' className='size-4 text-primary' />
              <h2 className='text-sm font-bold'>{t('employee.overview.quickActions.title')}</h2>
            </div>
            <div className='space-y-2'>
              <button
                className='flex min-h-11 w-full items-center justify-between rounded-xl bg-primary-action px-3.5 py-2.5 text-left text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                onClick={() => onSelectTab('request-new-software')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <Plus aria-hidden='true' className='size-4' />
                  <span>{t('employee.overview.quickActions.requestSoftware')}</span>
                </div>
                <ChevronRight aria-hidden='true' className='size-3.5 opacity-80' />
              </button>

              <button
                className='flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                onClick={() => onSelectTab('create-request')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <ArrowRightLeft aria-hidden='true' className='size-4 text-primary' />
                  <span>{t('employee.overview.quickActions.changePlan')}</span>
                </div>
                <ChevronRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
              </button>

              <button
                className='flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                onClick={() => onSelectTab('temporary-renewal')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <CalendarPlus aria-hidden='true' className='size-4 text-warning' />
                  <span>{t('employee.overview.quickActions.renewLicense')}</span>
                </div>
                <ChevronRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
              </button>

              <button
                className='flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                onClick={() => onSelectTab('return-license')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <RotateCcw aria-hidden='true' className='size-4 text-danger' />
                  <span>{t('employee.overview.quickActions.returnLicense')}</span>
                </div>
                <ChevronRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          {upcomingExpiring.length > 0 && (
            <div className='rounded-2xl border border-warning/25 bg-warning/5 p-5 shadow-sm'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Clock aria-hidden='true' className='size-4 text-warning' />
                  <h2 className='text-xs font-bold text-foreground'>{t('employee.overview.deadlines.title')}</h2>
                </div>
              </div>
              {upcomingExpiring.map((exp) => (
                <div
                  className='flex items-center justify-between rounded-xl border border-warning/20 bg-surface p-3'
                  key={exp.id}
                >
                  <div className='flex items-center gap-3'>
                    <img
                      alt={exp.name}
                      className='size-8 rounded-lg border border-border object-contain p-1'
                      src={exp.logoUrl}
                    />
                    <div>
                      <p className='text-xs font-bold text-foreground'>{exp.name}</p>
                      <p className='text-[0.7rem] font-semibold text-warning'>
                        {t('employee.overview.deadlines.daysLeft', { days: exp.daysLeft ?? 14 })}
                      </p>
                    </div>
                  </div>
                  <button
                    className='min-h-11 rounded-lg bg-warning/15 px-3 text-sm font-bold text-warning-ink transition hover:bg-warning/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning-ink'
                    onClick={() => onSelectTab('temporary-renewal', { softwareId: exp.id })}
                    type='button'
                  >
                    {t('employee.overview.deadlines.renewAction')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Utilization Summary */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <h2 className='text-xs font-bold text-foreground'>{t('employee.overview.usageSummary.title')}</h2>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('employee.overview.usageSummary.average', { percent: 78 })}
            </p>
            <div className='mt-3 flex h-2.5 overflow-hidden rounded-full bg-border'>
              <div className='bg-primary' style={{ width: '67%' }} />
              <div className='bg-warning' style={{ width: '17%' }} />
              <div className='bg-muted-foreground/30' style={{ width: '16%' }} />
            </div>
            <div className='mt-3 space-y-1.5 text-[0.7rem] text-muted-foreground'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-2 rounded-full bg-primary' />
                  <span>{t('employee.overview.usageSummary.activelyUsedCount', { count: 4 })}</span>
                </div>
                <span className='font-semibold'>
                  {t('employee.overview.usageSummary.percentFormat', { value: 67 })}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-2 rounded-full bg-warning' />
                  <span>{t('employee.overview.usageSummary.lowUsageCount', { count: 1 })}</span>
                </div>
                <span className='font-semibold'>
                  {t('employee.overview.usageSummary.percentFormat', { value: 17 })}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-2 rounded-full bg-muted-foreground/40' />
                  <span>{t('employee.overview.usageSummary.notUsedCount', { count: 1 })}</span>
                </div>
                <span className='font-semibold'>
                  {t('employee.overview.usageSummary.percentFormat', { value: 16 })}
                </span>
              </div>
            </div>
          </div>

          {/* Productivity Tip Card */}
          <div className='rounded-2xl border border-primary/20 bg-primary-soft/40 p-4'>
            <div className='flex gap-3'>
              <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground'>
                <Lightbulb aria-hidden='true' className='size-4' />
              </span>
              <div>
                <p className='text-xs font-bold text-foreground'>{t('employee.overview.tips.title')}</p>
                <p className='mt-1 text-[0.72rem] text-muted-foreground'>{t('employee.overview.tips.description')}</p>
                <button
                  className='mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-ink transition hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                  onClick={() => onSelectTab('return-license')}
                  type='button'
                >
                  <span>{t('employee.overview.tips.action')}</span>
                  <ArrowRight aria-hidden='true' className='size-3' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
