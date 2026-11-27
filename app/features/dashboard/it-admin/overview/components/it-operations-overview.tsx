import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  CalendarClock,
  FileCheck2,
  KeyRound,
  Laptop,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  UserMinus
} from 'lucide-react'
import { useItAdminDashboardGet } from '~/shared/api/generated/operations/dashboards/it-admin-dashboard-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ItAdminTabKey } from '../../enums'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { ItUsageChart } from './it-usage-chart'
import '~/shared/ui/workspace.css'

const metrics = [
  { key: 'grantTasks', icon: PackageCheck, tab: 'provisioning', params: { scope: 'MINE', queue: 'tasks' } },
  { key: 'revocationTasks', icon: ShieldCheck, tab: 'provisioning', params: { scope: 'MINE', queue: 'tasks' } },
  { key: 'saasIssues', icon: MessageSquare, tab: 'saas-issues', params: { scope: 'assigned' } },
  { key: 'offboardingHandovers', icon: UserMinus, tab: 'offboarding', params: { state: 'HANDING_OVER' } },
  { key: 'licenseKeys', icon: KeyRound, tab: 'shared-stock', params: {} },
  { key: 'termsToReview', icon: FileCheck2, tab: 'dept-catalog', params: { view: 'terms' } },
  { key: 'cancellationDeadlines', icon: CalendarClock, tab: 'renewals', params: { view: 'subscriptions' } },
  { key: 'unconfirmedDevices', icon: Laptop, tab: 'device-collectors', params: {} },
  { key: 'missingInvoicePeriods', icon: FileCheck2, tab: 'purchase-invoices', params: { view: 'missing' } }
] as const

export function ItOperationsOverview({
  onSelectTab
}: {
  onSelectTab: (tab: ItAdminTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const pageRef = useRef<HTMLElement>(null)
  useEffect(() => {
    pageRef.current?.focus()
  }, [])
  const { formatNumber, formatDate } = useDashboardFormat()
  const query = useItAdminDashboardGet()
  const data = query.data?.data
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-6 outline-none'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0 flex-1 basis-64'>
          <h1 className='text-xl font-semibold tracking-tight [text-wrap:balance] sm:text-2xl'>{translate('title')}</h1>
          {data && (
            <p className='mt-2 text-sm text-muted-foreground'>
              <span>{translate('overview.scope', { count: data.scope.departments })}</span>
              <span aria-hidden className='mx-2'>
                ·
              </span>
              {translate('overview.asOf', { date: formatDate(data.asOf) })}
            </p>
          )}
        </div>
        <button
          type='button'
          className={itButtonClass}
          disabled={query.isFetching}
          aria-busy={query.isFetching}
          onClick={() => void query.refetch()}
        >
          <RefreshCw aria-hidden strokeWidth={1.5} className={`size-4 ${query.isFetching ? 'animate-spin' : ''}`} />
          {translate('overview.refresh')}
        </button>
      </header>
      <ItQueryState query={query}>
        {data ? (
          <>
            <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3'>
              <h2 className='text-sm font-semibold'>{translate('overview.workload')}</h2>
              <span className='text-xs text-muted-foreground'>{translate('overview.serverScope')}</span>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
              {metrics.map(({ key, icon: Icon, tab, params }) => {
                const metric = data.sections[key]
                if (!metric) return null
                const counted =
                  metric.state === 'COUNTED' &&
                  typeof metric.count === 'number' &&
                  Number.isSafeInteger(metric.count) &&
                  metric.count >= 0
                const available = counted || metric.state === 'AT_SOURCE'
                return (
                  <button
                    key={key}
                    type='button'
                    className='it-metric group flex min-w-0 items-start gap-3 rounded-lg border border-border/70 bg-surface p-4 text-left focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default'
                    disabled={!available}
                    onClick={() => onSelectTab(tab, { ...params })}
                  >
                    <Icon
                      aria-hidden
                      strokeWidth={1.5}
                      className={`mt-0.5 size-5 shrink-0 ${available ? 'text-primary-ink' : 'text-muted-foreground'}`}
                    />
                    <span className='min-w-0 flex-1 space-y-2'>
                      <span className='block text-sm font-medium'>{translate(`overview.metrics.${key}`)}</span>
                      <span
                        className={`block ${counted ? 'text-right font-mono text-2xl font-semibold tabular-nums tracking-tight' : 'text-sm text-muted-foreground'}`}
                      >
                        {counted && metric.count !== null
                          ? formatNumber(metric.count)
                          : translate(metric.state === 'AT_SOURCE' ? 'overview.atSource' : 'overview.notAvailable')}
                      </span>
                    </span>
                    {available && (
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.5}
                        className='size-4 shrink-0 text-muted-foreground group-hover:text-primary-ink'
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItUsageChart />
    </section>
  )
}
