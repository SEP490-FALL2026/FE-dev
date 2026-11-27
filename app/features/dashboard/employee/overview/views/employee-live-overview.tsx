import { ArrowRight, LayoutDashboard, Plus, UserRound } from 'lucide-react'
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
        title={selfServiceOnly ? name : translate('overview')}
        description={
          selfServiceOnly ? translate('handoverHint') : [departmentName, jobTitle].filter(Boolean).join(' · ')
        }
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
      {!selfServiceOnly && <EmployeeDashboardSummary onSelectTab={onSelectTab} />}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <EmployeeOverviewWork selfServiceOnly={selfServiceOnly} onSelectTab={onSelectTab} />
        <button
          type='button'
          className='group inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary-ink transition-colors hover:bg-primary-soft'
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
  )
}
