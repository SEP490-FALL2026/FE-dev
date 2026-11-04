import { ArrowUpRight, BellRing, FileText, Laptop, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEmployeeDashboardGet } from '~/shared/api/generated/operations/dashboards/employee-dashboard-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'
import { DASHBOARD_SECTION_STATE } from '../enums/dashboard-section-state'

const cards = [
  { key: 'softwareRights', icon: Laptop, tab: 'my-software' },
  { key: 'expiringRights', icon: BellRing, tab: 'my-software' },
  { key: 'requests', icon: FileText, tab: 'my-requests' },
  { key: 'saasIssues', icon: MessageSquare, tab: 'issues' }
] as const

export function EmployeeDashboardSummary({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate, formatNumber } = useDashboardFormat()
  const query = useEmployeeDashboardGet()
  const overview = !query.isError ? query.data?.data : null
  return (
    <EmployeeSection
      title={translate('dashboardSummary.title')}
      action={
        overview && (
          <span className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
            {translate('dashboardSummary.asOf', { date: formatDate(overview.asOf) })}
          </span>
        )
      }
    >
      <EmployeeQueryState query={query} empty={!overview} emptyTitle={translate('dashboardSummary.empty')} />
      {overview && (
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {cards.map(({ key, icon: Icon, tab }) => {
            const section = overview.sections[key]
            const counted =
              section.state === DASHBOARD_SECTION_STATE.COUNTED &&
              typeof section.count === 'number' &&
              Number.isSafeInteger(section.count) &&
              section.count >= 0
            const availableAtSource = section.state === DASHBOARD_SECTION_STATE.AT_SOURCE
            const known = Object.values(DASHBOARD_SECTION_STATE).some((state) => state === section.state)
            return (
              <button
                key={key}
                type='button'
                aria-label={translate(`dashboardSummary.cards.${key}`)}
                className='group flex min-h-36 flex-col justify-between rounded-lg border border-border/60 bg-surface-subtle/40 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary-soft/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                onClick={() => onSelectTab(tab, key === 'expiringRights' ? { accessList: 'expiry' } : undefined)}
              >
                <span className='flex items-start justify-between gap-3'>
                  <span className='text-sm text-muted-foreground'>{translate(`dashboardSummary.cards.${key}`)}</span>
                  <Icon aria-hidden strokeWidth={1.5} className='size-4 shrink-0 text-primary-ink' />
                </span>
                <span className='mt-4 flex items-end justify-between gap-2'>
                  <span
                    className={
                      counted
                        ? 'font-mono text-3xl font-semibold tabular-nums'
                        : 'text-sm font-medium text-muted-foreground'
                    }
                  >
                    {counted && section.count !== null
                      ? formatNumber(section.count)
                      : translate(
                          !known
                            ? 'unknownStatus'
                            : availableAtSource
                              ? 'dashboardSummary.atSource'
                              : 'dashboardSummary.unavailable'
                        )}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className='size-4 shrink-0 text-muted-foreground group-hover:text-primary-ink'
                  />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </EmployeeSection>
  )
}
