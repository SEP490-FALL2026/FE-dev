import { ArrowRight, Building2, FileText, Laptop, LayoutDashboard, MessageSquare, Plus, UserRound } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { EmployeeButton, EmployeeSection } from '../../shared/components/employee-api-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeOverviewWork } from '../components/employee-overview-work'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeLiveOverview({
  name,
  departmentName,
  jobTitle,
  selfServiceOnly,
  onSelectTab
}: {
  name: string
  departmentName?: string
  jobTitle?: string | null
  selfServiceOnly: boolean
  onSelectTab: (tab: EmployeeTabKey) => void
}) {
  const { t: translate } = useTranslation('employee')
  const actionId = useId()
  const actions = [
    { tab: 'my-requests', label: 'quickRequests', hint: 'quickRequestsHint', icon: FileText },
    { tab: 'my-software', label: 'quickAccess', hint: 'quickAccessHint', icon: Laptop },
    { tab: 'issues', label: 'quickIssues', hint: 'quickIssuesHint', icon: MessageSquare }
  ] as const
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('overview')}
        icon={LayoutDashboard}
        actions={
          !selfServiceOnly && (
            <EmployeeButton primary onClick={() => onSelectTab('create-request')}>
              <Plus aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('create')}
            </EmployeeButton>
          )
        }
      />
      <section className='workspace-overview-hero rounded-lg px-5 py-6 sm:px-7 sm:py-7'>
        <div className='flex flex-wrap items-center justify-between gap-5'>
          <div className='min-w-0'>
            {departmentName && (
              <p className='mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-75'>
                <Building2 aria-hidden strokeWidth={1.5} className='size-4' />
                {departmentName}
              </p>
            )}
            <h2 className='text-xl font-semibold tracking-tight [overflow-wrap:anywhere] [text-wrap:balance] sm:text-2xl'>
              {name}
            </h2>
            <p className='mt-3 max-w-xl text-sm leading-relaxed opacity-75'>
              {translate(selfServiceOnly ? 'handoverHint' : 'redesign.overviewHint')}
            </p>
          </div>
          <button
            type='button'
            className='inline-flex min-h-11 items-center gap-2 rounded-md border border-current/25 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10'
            onClick={() => onSelectTab('profile')}
          >
            <UserRound aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('redesign.account')}
            <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
          </button>
        </div>
      </section>
      <EmployeeOverviewWork selfServiceOnly={selfServiceOnly} onSelectTab={onSelectTab} />
      <div
        className={`grid items-start gap-5 ${selfServiceOnly ? '' : 'xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]'}`}
      >
        {!selfServiceOnly && (
          <EmployeeSection title={translate('redesign.quickActions')}>
            <div className='divide-y divide-border/50'>
              {actions.map(({ tab, label, hint, icon: Icon }) => (
                <button
                  key={tab}
                  type='button'
                  aria-label={translate(`redesign.${label}`)}
                  aria-describedby={`${actionId}-${tab}`}
                  className='group flex min-h-16 w-full items-start gap-3 rounded-md px-2 py-4 text-left transition-colors hover:bg-surface-subtle'
                  onClick={() => onSelectTab(tab)}
                >
                  <Icon aria-hidden strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-primary-ink' />
                  <span className='min-w-0 flex-1'>
                    <span className='block text-sm font-medium'>{translate(`redesign.${label}`)}</span>
                    <span
                      id={`${actionId}-${tab}`}
                      className='mt-1.5 block text-sm leading-relaxed text-muted-foreground'
                    >
                      {translate(`redesign.${hint}`)}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className='mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary-ink'
                  />
                </button>
              ))}
            </div>
          </EmployeeSection>
        )}
        <EmployeeSection title={translate('redesign.account')}>
          <dl className='divide-y divide-border/50 text-sm'>
            <div className='flex flex-wrap justify-between gap-2 py-3'>
              <dt className='text-muted-foreground'>{translate('department')}</dt>
              <dd className='min-w-0 max-w-56 truncate' title={departmentName}>
                {departmentName ?? translate('noValue')}
              </dd>
            </div>
            <div className='flex flex-wrap justify-between gap-2 py-3'>
              <dt className='text-muted-foreground'>{translate('jobTitle')}</dt>
              <dd className='min-w-0 max-w-56 truncate' title={jobTitle ?? undefined}>
                {jobTitle ?? translate('noValue')}
              </dd>
            </div>
          </dl>
        </EmployeeSection>
      </div>
    </div>
  )
}
