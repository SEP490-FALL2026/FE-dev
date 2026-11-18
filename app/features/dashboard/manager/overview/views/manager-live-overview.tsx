import { Building2, Hash, LayoutDashboard, UsersRound, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import type { ManagerTabKey } from '../../enums'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerOverviewBudget } from '../components/manager-overview-budget'
import { ManagerOverviewWork } from '../components/manager-overview-work'
import { ManagerDashboardSummary } from '../components/manager-dashboard-summary'

type SelectTab = (tab: ManagerTabKey, params?: Record<string, string>) => void

/*
 * The header already greets the manager by name, so the hero band carries the department facts instead. Navigation
 * shortcuts that only repeated sidebar entries (annual budget, department personnel) were removed.
 */
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
      <ManagerPageHeader title={translate('overview')} icon={LayoutDashboard} />
      <section className='manager-overview-hero rounded-xl px-5 py-6 sm:px-7 sm:py-7'>
        {departmentId ? <DepartmentHero id={departmentId} /> : <HeroTitle title={name} />}
      </section>
      <ManagerDashboardSummary onSelectTab={onSelectTab} />
      <ManagerOverviewBudget />
      <ManagerOverviewWork onSelectTab={onSelectTab} />
    </div>
  )
}

function HeroTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='min-w-0 max-w-2xl'>
      {kicker && (
        <p className='mb-2 flex items-center gap-2 text-xs font-medium tracking-widest uppercase opacity-75'>
          <Building2 aria-hidden strokeWidth={1.5} className='size-4' />
          {kicker}
        </p>
      )}
      <h2 className='text-xl font-semibold tracking-tight [overflow-wrap:anywhere] text-balance sm:text-2xl'>
        {title}
      </h2>
      <p className='mt-3 text-sm leading-relaxed text-pretty opacity-75'>{translate('overviewHint')}</p>
    </div>
  )
}

function DepartmentHero({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const query = useDepartmentGet(id)
  const department = query.isError ? null : query.data?.data
  const facts = department
    ? [
        { key: 'members', icon: UsersRound, label: translate('team'), value: String(department.memberCount) },
        { key: 'code', icon: Hash, label: translate('code'), value: department.code },
        {
          key: 'costCenter',
          icon: Wallet,
          label: translate('costCenter'),
          value: department.costCenter?.name ?? translate('notReported')
        }
      ]
    : []
  return (
    <div className='flex flex-wrap items-end justify-between gap-5'>
      {query.isPending ? (
        <div role='status' aria-label={translate('departmentSummary')} className='w-full max-w-md space-y-3'>
          <span className='block h-7 w-2/3 animate-pulse rounded-md bg-white/20' />
          <span className='block h-4 w-full animate-pulse rounded-md bg-white/15' />
        </div>
      ) : (
        <HeroTitle kicker={translate('departmentSummary')} title={department?.name ?? translate('notReported')} />
      )}
      {facts.length > 0 && (
        <dl className='grid w-full grid-cols-1 gap-2.5 sm:w-auto sm:grid-cols-3'>
          {facts.map(({ key, icon: Icon, label, value }) => (
            <div key={key} className='hero-stat flex min-w-0 items-center gap-3 rounded-lg px-3.5 py-2.5 sm:min-w-36'>
              <span className='grid size-9 shrink-0 place-items-center rounded-md bg-white/15'>
                <Icon aria-hidden strokeWidth={1.5} className='size-4.5' />
              </span>
              <div className='min-w-0'>
                <dt className='text-xs opacity-80'>{label}</dt>
                <dd
                  className='max-w-40 truncate font-mono text-base leading-tight font-semibold tabular-nums'
                  title={value}
                >
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
