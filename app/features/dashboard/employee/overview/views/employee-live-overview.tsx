import { ArrowRight, BriefcaseBusiness, Building2, LayoutDashboard, Plus, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeeButton } from '../../shared/components/employee-api-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeOverviewWork } from '../components/employee-overview-work'
import { EmployeeDashboardSummary } from '../components/employee-dashboard-summary'
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
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
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
      <section className='workspace-overview-hero rounded-xl px-5 py-6 sm:px-7 sm:py-7'>
        <div className='flex flex-wrap items-end justify-between gap-5'>
          <div className='min-w-0 max-w-2xl'>
            <h2 className='text-xl font-semibold tracking-tight [overflow-wrap:anywhere] text-balance sm:text-2xl'>
              {name}
            </h2>
            {(departmentName || jobTitle) && (
              <p className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm opacity-85'>
                {departmentName && (
                  <span className='inline-flex min-w-0 items-center gap-1.5'>
                    <Building2 aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                    <span className='truncate' title={departmentName}>
                      {departmentName}
                    </span>
                  </span>
                )}
                {jobTitle && (
                  <span className='inline-flex min-w-0 items-center gap-1.5'>
                    <BriefcaseBusiness aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                    <span className='truncate' title={jobTitle}>
                      {jobTitle}
                    </span>
                  </span>
                )}
              </p>
            )}
            <p className='mt-3 text-sm leading-relaxed text-pretty opacity-75'>
              {translate(selfServiceOnly ? 'handoverHint' : 'redesign.overviewHint')}
            </p>
          </div>
          <div className='flex flex-wrap items-stretch gap-3'>
            <EmployeeOverviewWork selfServiceOnly={selfServiceOnly} onSelectTab={onSelectTab} />
            <button
              type='button'
              className='hero-stat group inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors'
              onClick={() => onSelectTab('profile')}
            >
              <UserRound aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('redesign.account')}
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className='size-4 opacity-70 transition-transform group-hover:translate-x-0.5'
              />
            </button>
          </div>
        </div>
      </section>
      {!selfServiceOnly && <EmployeeDashboardSummary onSelectTab={onSelectTab} />}
    </div>
  )
}
