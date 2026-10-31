import { ArrowRight, Building2, FilePlus2, Landmark, LayoutDashboard, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useId } from 'react'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import type { ManagerTabKey } from '../../enums'
import { ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDepartmentContext } from '../../shared/components/manager-department-context'
import { ManagerOverviewWork } from '../components/manager-overview-work'

type SelectTab = (tab: ManagerTabKey, params?: Record<string, string>) => void
export function ManagerLiveOverview({
  departmentId,
  departmentName,
  name,
  onSelectTab
}: {
  departmentId?: string
  departmentName?: string
  name: string
  onSelectTab: SelectTab
}) {
  const { t: translate } = useTranslation('manager')
  const actionId = useId()
  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('overview')} icon={LayoutDashboard} />
      <section className='manager-overview-hero rounded-lg px-5 py-6 sm:px-7 sm:py-7'>
        <div className='flex flex-wrap items-center justify-between gap-5'>
          <div className='min-w-0'>
            {departmentName && (
              <p className='mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-75'>
                <Building2 aria-hidden strokeWidth={1.5} className='size-4' />
                {departmentName}
              </p>
            )}
            <h2 className='text-xl font-semibold tracking-tight [text-wrap:balance] sm:text-2xl'>
              {translate('greeting', { name })}
            </h2>
            <p className='mt-3 max-w-xl text-sm leading-relaxed opacity-75'>{translate('overviewHint')}</p>
          </div>
          <button
            type='button'
            className='inline-flex min-h-11 items-center gap-2 rounded-md border border-current/25 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10'
            onClick={() => onSelectTab('create-employee-request', { scope: 'individual' })}
          >
            <FilePlus2 aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('create')}
          </button>
        </div>
      </section>
      <ManagerOverviewWork onSelectTab={onSelectTab} />
      <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]'>
        <ManagerSection title={translate('quickActions')}>
          <div className='divide-y divide-border/50'>
            {(
              [
                {
                  key: 'create',
                  title: 'quickCreate',
                  hint: 'quickCreateHint',
                  icon: FilePlus2,
                  tab: 'create-employee-request',
                  params: { scope: 'individual' }
                },
                { key: 'budget', title: 'quickBudget', hint: 'quickBudgetHint', icon: Landmark, tab: 'annual-budget' },
                { key: 'team', title: 'quickPersonnel', hint: 'quickPersonnelHint', icon: UsersRound, tab: 'my-team' }
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type='button'
                aria-label={translate(item.title)}
                aria-describedby={`${actionId}-${item.key}`}
                className='group flex w-full items-start gap-3 rounded-md px-2 py-4 text-left transition-colors hover:bg-surface-subtle'
                onClick={() => onSelectTab(item.tab, 'params' in item ? item.params : undefined)}
              >
                <item.icon aria-hidden strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-primary-ink' />
                <span className='min-w-0 flex-1'>
                  <span className='block text-sm font-medium'>{translate(item.title)}</span>
                  <span
                    id={`${actionId}-${item.key}`}
                    className='mt-1.5 block text-sm leading-relaxed text-muted-foreground'
                  >
                    {translate(item.hint)}
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
        </ManagerSection>
        <div className='space-y-4'>
          {departmentId && <DepartmentOverview id={departmentId} />}
          <ManagerDepartmentContext name={departmentName} />
        </div>
      </div>
    </div>
  )
}
function DepartmentOverview({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const query = useDepartmentGet(id)
  const department = !query.isError ? query.data?.data : null
  return (
    <ManagerSection title={translate('departmentSummary')}>
      <ManagerQueryState query={query} empty={!department} />
      {department && (
        <>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2 className='min-w-0 truncate font-semibold' title={department.name}>
              {department.name}
            </h2>
            <ManagerStatus value={department.status} />
          </div>
          <dl className='divide-y divide-border/50 text-sm'>
            <div className='flex items-center justify-between gap-4 py-3'>
              <dt className='text-muted-foreground'>{translate('team')}</dt>
              <dd className='text-right font-mono text-xl font-semibold tabular-nums'>{department.memberCount}</dd>
            </div>
            <div className='flex items-center justify-between gap-4 py-3'>
              <dt className='text-muted-foreground'>{translate('code')}</dt>
              <dd className='text-right font-mono'>{department.code}</dd>
            </div>
            <div className='flex items-start justify-between gap-4 pt-3'>
              <dt className='text-muted-foreground'>{translate('costCenter')}</dt>
              <dd className='min-w-0 max-w-48 truncate text-right' title={department.costCenter?.name}>
                {department.costCenter?.name ?? translate('notReported')}
              </dd>
            </div>
          </dl>
        </>
      )}
    </ManagerSection>
  )
}
