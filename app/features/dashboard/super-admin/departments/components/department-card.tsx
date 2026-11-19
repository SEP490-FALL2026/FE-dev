import { ArrowUpRight, Building2, UserRound, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DepartmentPageResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { DepartmentStatus } from '../enums/department-status'

const cardTones = [
  { wash: 'bg-primary/10', shape: 'border-primary/20 bg-primary/10', icon: 'text-primary-ink' },
  { wash: 'bg-info/10', shape: 'border-info/20 bg-info/10', icon: 'text-info-ink' },
  { wash: 'bg-success/10', shape: 'border-success/20 bg-success/10', icon: 'text-success-ink' },
  { wash: 'bg-warning/10', shape: 'border-warning/20 bg-warning/10', icon: 'text-warning-ink' }
] as const

export function DepartmentCard({
  department,
  position,
  onOpen
}: {
  department: DepartmentPageResponseDtoDataItemsItem
  position: number
  onOpen: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatNumber } = useDashboardFormat()
  const knownStatus = Object.values(DepartmentStatus).includes(department.status)
  const active = department.status === DepartmentStatus.ACTIVE
  const tone = cardTones[position % cardTones.length]
  return (
    <article
      aria-labelledby={`department-${department.id}`}
      className='relative isolate flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/35'
    >
      <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden'>
        <div className={`absolute inset-0 ${tone.wash}`} />
        <div className={`absolute -top-16 right-4 size-40 rounded-full border ${tone.shape}`} />
        <div className={`absolute -top-6 -right-12 size-32 rounded-full border ${tone.shape}`} />
        <div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent' />
      </div>
      <div className='relative flex min-w-0 flex-1 flex-col'>
        <div className='flex items-start justify-between gap-3'>
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-md border border-border/70 bg-surface ${tone.icon}`}
          >
            <Building2 aria-hidden className='size-5' strokeWidth={1.5} />
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-surface/80 px-2 py-1 text-xs font-medium'>
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${!knownStatus ? 'bg-warning' : active ? 'bg-success' : 'bg-muted-foreground'}`}
            />
            {knownStatus ? translate(`departmentStatus.${department.status}`) : translate('unknown')}
          </span>
        </div>
        <p className='mt-5 truncate font-mono text-xs text-muted-foreground' title={department.code}>
          {department.code}
        </p>
        <h2
          id={`department-${department.id}`}
          className='mt-1 min-h-14 line-clamp-2 text-xl leading-7 font-semibold tracking-tight [text-wrap:balance]'
          title={department.name}
        >
          {department.name}
        </h2>
        <div className='my-5 flex min-w-0 items-center gap-2.5'>
          <UserRound aria-hidden className='size-4 shrink-0 text-muted-foreground' strokeWidth={1.5} />
          <div className='min-w-0'>
            <p className='text-xs text-muted-foreground'>{translate('head')}</p>
            <p
              className='mt-0.5 truncate text-sm font-medium'
              title={department.head?.fullName ?? translate('unassigned')}
            >
              {department.head?.fullName ?? translate('unassigned')}
            </p>
          </div>
        </div>
        <div className='mt-auto flex items-end justify-between gap-3 border-t border-border/80 pt-4'>
          <button
            type='button'
            aria-label={translate('viewDepartment', { name: department.name })}
            className='inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold transition-colors hover:bg-surface/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:min-h-9'
            onClick={onOpen}
          >
            {translate('viewDetails')}
            <ArrowUpRight aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
          <div className='text-right'>
            <p className='font-mono text-2xl leading-none font-semibold tabular-nums'>
              {formatNumber(department.memberCount)}
            </p>
            <p className='mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
              <UsersRound aria-hidden className='size-3.5' strokeWidth={1.5} />
              {translate('members')}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
