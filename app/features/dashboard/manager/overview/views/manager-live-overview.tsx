import { Building2, LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import type { ManagerTabKey } from '../../enums'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerOverviewBudget } from '../components/manager-overview-budget'
import { ManagerOverviewWork } from '../components/manager-overview-work'
import { ManagerDashboardSummary } from '../components/manager-dashboard-summary'

type SelectTab = (tab: ManagerTabKey, params?: Record<string, string>) => void

export function ManagerLiveOverview({
  departmentId,
  name,
  onSelectTab
}: {
  departmentId?: string
  name: string
  onSelectTab: SelectTab
}) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='space-y-6'>
      {departmentId ? (
        <DepartmentHeader id={departmentId} />
      ) : (
        <ManagerPageHeader title={translate('overview')} description={name} icon={LayoutDashboard} />
      )}
      <ManagerDashboardSummary onSelectTab={onSelectTab} />
      <ManagerOverviewWork onSelectTab={onSelectTab} />
      <ManagerOverviewBudget />
    </div>
  )
}

function DepartmentHeader({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const query = useDepartmentGet(id)
  const department = query.isError ? null : query.data?.data
  const facts = department
    ? [
        { key: 'members', label: translate('team'), value: String(department.memberCount) },
        { key: 'code', label: translate('code'), value: department.code },
        {
          key: 'costCenter',
          label: translate('costCenter'),
          value: department.costCenter?.name ?? translate('notReported')
        }
      ]
    : []
  return (
    <ManagerPageHeader
      title={department?.name ?? translate('overview')}
      description={translate('overviewHint')}
      icon={Building2}
      actions={
        query.isPending ? (
          <div
            role='status'
            aria-label={translate('departmentSummary')}
            className='h-8 w-48 animate-pulse rounded-md bg-surface-subtle'
          />
        ) : facts.length > 0 ? (
          <dl className='flex flex-wrap gap-x-5 gap-y-2'>
            {facts.map(({ key, label, value }) => (
              <div key={key} className='min-w-0'>
                <dt className='text-xs text-muted-foreground'>{label}</dt>
                <dd className='mt-1 max-w-48 truncate text-sm font-medium' title={value}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <span className='text-sm text-muted-foreground'>{translate('notReported')}</span>
        )
      }
    />
  )
}
