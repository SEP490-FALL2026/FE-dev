import { ArrowUpRight, FileText, Laptop, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestDraftList } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useHandoverDutyList } from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { EmployeeButton, EmployeeSection, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeLiveOverview({
  name,
  selfServiceOnly,
  onSelectTab
}: {
  name: string
  selfServiceOnly: boolean
  onSelectTab: (tab: EmployeeTabKey) => void
}) {
  const { t: translate, i18n } = useTranslation('employee')
  const drafts = useAccessRequestDraftList({ page: 1, pageSize: 1 }, { query: { enabled: !selfServiceOnly } })
  const duties = useHandoverDutyList({ scope: 'mine', status: 'OPEN', page: 1, pageSize: 1 })
  const formatCount = (value?: number) =>
    value === undefined ? translate('noValue') : new Intl.NumberFormat(i18n.language).format(value)
  const cards: {
    key: 'handovers' | 'drafts'
    icon: typeof ShieldCheck
    query: typeof duties | typeof drafts
    count: number | undefined
  }[] = [
    {
      key: 'handovers',
      icon: ShieldCheck,
      query: duties,
      count: !duties.isError ? duties.data?.data?.pagination.totalItems : undefined
    },
    ...(!selfServiceOnly
      ? [
          {
            key: 'drafts' as const,
            icon: FileText,
            query: drafts,
            count: !drafts.isError ? drafts.data?.data?.pagination.totalItems : undefined
          }
        ]
      : [])
  ]
  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='mb-2 text-sm text-muted-foreground'>{translate('workspace')}</p>
          <h1 className='truncate text-2xl font-semibold sm:text-3xl' title={name}>
            {name}
          </h1>
        </div>
        {!selfServiceOnly && (
          <EmployeeButton primary onClick={() => onSelectTab('create-request')}>
            {translate('create')}
          </EmployeeButton>
        )}
      </header>
      <div className={`grid gap-4 ${!selfServiceOnly ? 'md:grid-cols-2' : ''}`}>
        {cards.map(({ key, icon: Icon, query, count }) => (
          <section key={key} className='rounded-lg border border-border/60 bg-surface p-5'>
            <div className='flex items-center justify-between'>
              <Icon className='size-5 text-muted-foreground' strokeWidth={1.5} />
              <p className='text-right font-mono text-3xl tabular-nums'>{formatCount(count)}</p>
            </div>
            <p className='mt-4 text-sm'>{translate(key)}</p>
            <EmployeeQueryState query={query} />
          </section>
        ))}
      </div>
      <EmployeeSection title={translate('overview')}>
        <div className='divide-y divide-border/50'>
          {[
            { tab: 'handovers', label: 'handovers', icon: ShieldCheck },
            ...(!selfServiceOnly
              ? [
                  { tab: 'my-requests', label: 'myRequests', icon: FileText },
                  { tab: 'my-software', label: 'mySoftware', icon: Laptop },
                  { tab: 'issues', label: 'issues', icon: Laptop }
                ]
              : [])
          ].map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              type='button'
              onClick={() => onSelectTab(tab as EmployeeTabKey)}
              className='flex min-h-16 w-full items-center gap-4 py-4 text-left transition-colors hover:bg-surface-subtle'
            >
              <Icon className='size-5 text-muted-foreground' strokeWidth={1.5} />
              <span className='flex-1 text-sm font-medium'>{translate(label as 'handovers')}</span>
              <ArrowUpRight className='size-4' strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </EmployeeSection>
    </div>
  )
}
