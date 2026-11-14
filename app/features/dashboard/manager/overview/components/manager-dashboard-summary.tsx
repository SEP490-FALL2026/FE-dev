import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useManagerDashboardGet } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ManagerTabKey } from '../../enums'
import { ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { DASHBOARD_STATE } from '../enums/dashboard-state'

const cards = [
  { key: 'needApprovals', tab: 'team-requests' },
  { key: 'departmentSoftware', tab: 'team-software' },
  { key: 'spendQueue', tab: 'weekly-batch' },
  { key: 'budgetProposals', tab: 'annual-budget' },
  { key: 'approvedBudgetLines', tab: 'annual-budget' },
  { key: 'ghostSeats' },
  { key: 'spending' }
] as const
export function ManagerDashboardSummary({
  onSelectTab
}: {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const { formatDate, formatNumber } = useDashboardFormat()
  const query = useManagerDashboardGet()
  const data = !query.isError ? query.data?.data : null
  return (
    <ManagerSection
      title={translate('integration.overview')}
      action={
        data && (
          <span className='text-right font-mono text-xs tabular-nums'>
            {translate('integration.asOf', { date: formatDate(data.asOf) })}
          </span>
        )
      }
    >
      <ManagerQueryState query={query} empty={!data} />
      {data && (
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {cards.map((card) => {
            const section = data.sections[card.key]
            const counted =
              section.state === DASHBOARD_STATE.COUNTED &&
              typeof section.count === 'number' &&
              Number.isSafeInteger(section.count) &&
              section.count >= 0
            const content = (
              <>
                <span className='block text-sm text-muted-foreground'>
                  {translate(`integration.metrics.${card.key}`)}
                </span>
                <span className='mt-4 flex items-end justify-between gap-3'>
                  <span
                    className={
                      counted ? 'font-mono text-2xl font-semibold tabular-nums' : 'text-sm text-muted-foreground'
                    }
                  >
                    {counted && section.count !== null
                      ? formatNumber(section.count)
                      : translate(
                          section.state === DASHBOARD_STATE.AT_SOURCE
                            ? 'integration.seeList'
                            : Object.values(DASHBOARD_STATE).includes(section.state)
                              ? 'notReported'
                              : 'unknownStatus'
                        )}
                  </span>
                  {'tab' in card && <ArrowUpRight aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />}
                </span>
              </>
            )
            const classes = 'min-h-32 rounded-lg border border-border/60 bg-surface-subtle/40 p-4 text-left'
            return 'tab' in card ? (
              <button
                key={card.key}
                type='button'
                aria-label={translate(`integration.metrics.${card.key}`)}
                className={`${classes} transition-colors hover:border-primary/30 hover:bg-primary-soft/20 focus-visible:outline-2 focus-visible:outline-primary`}
                onClick={() => onSelectTab(card.tab, { departmentId: data.department.id })}
              >
                {content}
              </button>
            ) : (
              <div key={card.key} className={classes}>
                {content}
              </div>
            )
          })}
        </div>
      )}
    </ManagerSection>
  )
}
