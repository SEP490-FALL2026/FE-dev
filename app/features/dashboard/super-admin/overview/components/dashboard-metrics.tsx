import { ArrowUpRight, Building2, FileClock, Users, Activity, ShieldCheck, UserCheck, Server } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SuperAdminDashboardResponseDtoDataSections } from '~/shared/api/generated/model/dashboards'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { SuperAdminSelectTab, SuperAdminTabKey } from '../../super-admin-nav'

const metrics = [
  { key: 'departmentsWithoutHead', icon: Building2 },
  { key: 'departmentsWithoutItAdmin', icon: ShieldCheck },
  { key: 'personnelNotices', icon: FileClock },
  { key: 'accountCandidates', icon: UserCheck },
  { key: 'congestion', icon: Activity },
  { key: 'approverConfiguration', icon: Users },
  { key: 'superAdminRole', icon: ShieldCheck },
  { key: 'backgroundJobs', icon: Server }
] as const

function sourceTarget(
  operation: string | null
): { tab: SuperAdminTabKey; parameters?: Record<string, string> } | undefined {
  switch (operation) {
    case 'departmentList':
    case 'departmentWarningList':
      return { tab: 'departments' }
    case 'personnelNoticeList':
      return { tab: 'personnel', parameters: { section: 'notices' } }
    case 'accountCandidatesList':
      return { tab: 'accounts', parameters: { action: 'invite' } }
    case 'appUserList':
      return { tab: 'accounts', parameters: { section: 'responsibilities' } }
    case 'stepCongestionList':
      return { tab: 'operations' }
    default:
      return undefined
  }
}

export function DashboardMetrics({
  sections,
  asOf,
  onSelectTab
}: {
  sections: SuperAdminDashboardResponseDtoDataSections
  asOf: string
  onSelectTab: SuperAdminSelectTab
}) {
  const { t: translate } = useTranslation('admin')
  const { formatNumber, formatDate } = useDashboardFormat()
  return (
    <section aria-label={translate('overview.metrics.title')} className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='text-base font-semibold'>{translate('overview.metrics.title')}</h2>
        <p className='text-xs text-muted-foreground'>
          {translate('overview.metrics.asOf', { date: formatDate(asOf) })}
        </p>
      </div>
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {metrics.map(({ key, icon: Icon }) => {
          const section = sections[key]
          if (!section) return null
          const count = section.count
          const counted =
            section.state === 'COUNTED' && typeof count === 'number' && Number.isSafeInteger(count) && count >= 0
          const available = section.state === 'AT_SOURCE' || counted
          const target = available ? sourceTarget(section.sourceOperationId) : undefined
          const watchSource = available && section.sourceOperationId === 'superAdminWatchGet'
          const name = translate(`overview.metrics.sections.${key}`)
          return (
            <article key={key} className='admin-overview-surface flex min-w-0 flex-col rounded-lg p-4'>
              <div className='flex items-start justify-between gap-3'>
                <h3 className='text-sm font-medium leading-relaxed text-muted-foreground first-letter:uppercase'>
                  {name}
                </h3>
                <Icon aria-hidden strokeWidth={1.5} className='mt-0.5 size-4 shrink-0 text-primary-ink' />
              </div>
              <p
                className={`mt-4 ${counted ? 'text-right font-mono text-3xl font-semibold tabular-nums' : 'text-sm font-medium text-muted-foreground'}`}
              >
                {counted && typeof count === 'number'
                  ? formatNumber(count)
                  : translate(
                      section.state === 'AT_SOURCE' ? 'overview.metrics.atSource' : 'overview.metrics.noSource'
                    )}
              </p>
              {(target || watchSource) && (
                <button
                  type='button'
                  onClick={() => {
                    if (target) onSelectTab(target.tab, target.parameters)
                    else {
                      const health = document.getElementById('admin-role-health')
                      health?.scrollIntoView?.({
                        block: 'center',
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
                      })
                      health?.focus({ preventScroll: true })
                    }
                  }}
                  aria-label={translate('overview.metrics.review', { name })}
                  className='mt-4 inline-flex min-h-11 items-center justify-between gap-2 rounded-md text-left text-xs font-medium text-primary-ink transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary md:min-h-8'
                >
                  {translate('details')}
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className='size-4' />
                </button>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
