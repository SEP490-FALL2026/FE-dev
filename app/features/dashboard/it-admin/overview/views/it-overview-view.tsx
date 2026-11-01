import { useTranslation } from 'react-i18next'
import { PackageCheck, MessageSquare, UserMinus } from 'lucide-react'
import { useProvisioningTaskList } from '~/shared/api/generated/operations/provisioning-tasks/provisioning-task-list'
import { useSaasIssueList } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useOffboardingCaseList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ItAdminTabKey } from '../../enums'
import { ItQueryState } from '../../shared/components/it-query-state'

export function ItOverviewView({ onSelectTab }: { onSelectTab: (tab: ItAdminTabKey) => void }) {
  const { t: translate } = useTranslation('itAdmin')
  const { formatNumber } = useDashboardFormat()
  const tasks = useProvisioningTaskList({ scope: 'ALL', page: 1, pageSize: 1 })
  const issues = useSaasIssueList({ scope: 'all', page: 1, pageSize: 1 })
  const departures = useOffboardingCaseList({ page: 1, pageSize: 1 })
  const cards = [
    { key: 'queue', tab: 'provisioning', query: tasks, icon: PackageCheck },
    { key: 'issues', tab: 'saas-issues', query: issues, icon: MessageSquare },
    { key: 'offboarding', tab: 'offboarding', query: departures, icon: UserMinus }
  ] as const
  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      <div className='grid gap-4 md:grid-cols-3'>
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.key} className='rounded-lg border border-border bg-surface p-5 shadow-sm'>
              <ItQueryState query={card.query}>
                <button
                  type='button'
                  className='w-full space-y-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  onClick={() => onSelectTab(card.tab)}
                >
                  <span className='flex items-start justify-between gap-3 font-medium'>
                    {translate(card.key)}
                    <Icon aria-hidden strokeWidth={1.5} className='size-5 shrink-0 text-primary' />
                  </span>
                  <span className='block text-right font-mono text-3xl tabular-nums'>
                    {card.query.data?.data
                      ? formatNumber(card.query.data.data.pagination.totalItems)
                      : translate('unknown')}
                  </span>
                  <span className='block text-xs text-muted-foreground'>{translate('totalHint')}</span>
                </button>
              </ItQueryState>
            </article>
          )
        })}
      </div>
    </section>
  )
}
