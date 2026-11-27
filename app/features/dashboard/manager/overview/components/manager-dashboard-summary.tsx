import { ArrowUpRight, BadgeCheck, Boxes, ClipboardCheck, Landmark, Send, UserX, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useManagerDashboardGet } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ManagerTabKey } from '../../enums'
import { ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { DASHBOARD_STATE } from '../enums/dashboard-state'

const cards = [
  { key: 'needApprovals', tab: 'team-requests', icon: ClipboardCheck },
  { key: 'departmentSoftware', tab: 'team-software', icon: Boxes },
  { key: 'spendQueue', tab: 'weekly-batch', icon: Send },
  { key: 'budgetProposals', tab: 'annual-budget', icon: Landmark },
  { key: 'approvedBudgetLines', tab: 'annual-budget', icon: BadgeCheck },
  { key: 'ghostSeats', icon: UserX },
  { key: 'spending', icon: Wallet }
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
  const renderCard = (card: (typeof cards)[number], secondary = false) => {
    if (!data) return null

    const section = data.sections[card.key]
    const counted =
      section.state === DASHBOARD_STATE.COUNTED &&
      typeof section.count === 'number' &&
      Number.isSafeInteger(section.count) &&
      section.count >= 0
    const content = (
      <>
        <span className='flex items-start justify-between gap-3'>
          <span className='text-sm text-muted-foreground'>{translate(`integration.metrics.${card.key}`)}</span>
          {!secondary && (
            <span className='kpi-chip hidden size-8 shrink-0 place-items-center rounded-md sm:grid'>
              <card.icon aria-hidden strokeWidth={1.5} className='size-4' />
            </span>
          )}
        </span>
        <span className={`${secondary ? '' : 'mt-3'} flex items-end justify-between gap-3`}>
          <span
            className={
              counted
                ? `font-mono ${secondary ? 'text-base' : 'text-2xl'} font-semibold tabular-nums`
                : 'text-sm text-muted-foreground'
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
    const classes = secondary
      ? 'flex items-center justify-between gap-3 px-1 py-2 text-left'
      : 'min-h-24 rounded-lg border border-border/60 bg-surface-subtle/40 p-3.5 text-left'
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
  }
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
        <div className='kpi-tone-grid space-y-3'>
          <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
            {cards.slice(0, 4).map((card) => renderCard(card))}
          </div>
          <div className='grid gap-x-5 gap-y-2 border-t border-border/50 pt-2 md:grid-cols-3'>
            {cards.slice(4).map((card) => renderCard(card, true))}
          </div>
        </div>
      )}
    </ManagerSection>
  )
}
