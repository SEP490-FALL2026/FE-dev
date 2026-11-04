import { useTranslation } from 'react-i18next'
import {
  ArrowUpRight,
  CalendarClock,
  FileCheck2,
  KeyRound,
  Laptop,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserMinus
} from 'lucide-react'
import { useItAdminDashboardGet } from '~/shared/api/generated/operations/dashboards/it-admin-dashboard-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ItAdminTabKey } from '../../enums'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'

const metrics = [
  { key: 'grantTasks', icon: PackageCheck, tab: 'provisioning', params: { scope: 'MINE' } },
  { key: 'revocationTasks', icon: ShieldCheck, tab: 'provisioning', params: { scope: 'MINE' } },
  { key: 'saasIssues', icon: MessageSquare, tab: 'saas-issues', params: { scope: 'assigned' } },
  { key: 'offboardingHandovers', icon: UserMinus, tab: 'offboarding', params: { state: 'HANDING_OVER' } },
  { key: 'licenseKeys', icon: KeyRound, tab: 'dept-catalog', params: {} },
  { key: 'termsToReview', icon: FileCheck2, tab: 'dept-catalog', params: { view: 'terms' } },
  { key: 'cancellationDeadlines', icon: CalendarClock, tab: 'renewals', params: { view: 'subscriptions' } },
  { key: 'discrepancies', icon: Scale, tab: 'reconciliation', params: {} },
  { key: 'unconfirmedDevices', icon: Laptop, tab: 'device-collectors', params: {} }
] as const

export function ItOperationsOverview({
  onSelectTab
}: {
  onSelectTab: (tab: ItAdminTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const { formatNumber, formatDate } = useDashboardFormat()
  const query = useItAdminDashboardGet()
  const data = query.data?.data
  return (
    <section className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='it-eyebrow'>{translate('overview.workspace')}</p>
          <h1 className='mt-1 text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
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
            <div className='flex items-center justify-between gap-3 border-b border-border/60 pb-3'>
              <h2 className='text-sm font-semibold'>{translate('overview.workload')}</h2>
              <span className='text-xs text-muted-foreground'>{translate('overview.serverScope')}</span>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {metrics.map(({ key, icon: Icon, tab, params }) => {
                const metric = data.sections[key]
                const counted = metric.state === 'COUNTED' && metric.count !== null
                const available = metric.state === 'COUNTED' || metric.state === 'AT_SOURCE'
                return (
                  <button
                    key={key}
                    type='button'
                    className='it-metric group flex min-h-40 flex-col items-stretch rounded-lg border border-border/70 bg-surface p-5 text-left disabled:cursor-default'
                    disabled={!available}
                    onClick={() => onSelectTab(tab, { ...params })}
                  >
                    <span className='flex items-start justify-between gap-3'>
                      <span
                        className={`grid size-9 place-items-center rounded-md ${available ? 'bg-primary-soft text-primary-ink' : 'bg-surface-subtle text-muted-foreground'}`}
                      >
                        <Icon aria-hidden strokeWidth={1.5} className='size-4.5' />
                      </span>
                      {available && (
                        <ArrowUpRight
                          aria-hidden
                          strokeWidth={1.5}
                          className='size-4 text-muted-foreground group-hover:text-primary'
                        />
                      )}
                    </span>
                    <span className='mt-4 text-sm font-medium'>{translate(`overview.metrics.${key}`)}</span>
                    <span
                      className={`mt-2 ${counted ? 'text-right font-mono text-3xl font-semibold tabular-nums tracking-tight' : 'text-sm text-muted-foreground'}`}
                    >
                      {counted && metric.count !== null
                        ? formatNumber(metric.count)
                        : translate(metric.state === 'AT_SOURCE' ? 'overview.atSource' : 'overview.notAvailable')}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
