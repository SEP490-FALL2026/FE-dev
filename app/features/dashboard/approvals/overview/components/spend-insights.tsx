import { useTranslation } from 'react-i18next'
import { formatMoney } from '~/shared/lib/money'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsEmpty, ApprovalsStat, ApprovalsStatGrid } from '../../shared/components/approvals-ui'
import {
  DUE_SOON_DAYS,
  amountRows,
  checkCodeCounts,
  dueBuckets,
  localToday,
  soonestDue,
  totalsByCurrency
} from '../approvals-insights'
import { useAllSpendApprovals } from '../hooks/use-approvals-insights'
import { AmountBarChart, AmountTable } from './amount-bar-chart'
import { BudgetCheckBreakdown } from './budget-check-breakdown'
import { DueSoonList } from './due-soon-list'
import { InsightCard } from './insight-card'

/** Figures and charts over every spend step waiting for me, built from the full list rather than one page. */
export function SpendInsights({ onOpen }: { onOpen: (requestId: string, batchId: string | null) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const query = useAllSpendApprovals()
  const items = query.data?.items ?? []
  const today = localToday()
  const totals = totalsByCurrency(items.map((item) => item.amount))
  const mainCurrency = totals[0]?.currency
  const due = dueBuckets(items, today)
  const rows = mainCurrency
    ? amountRows(
        items.map((item) => ({ key: item.costCenter.id, label: item.costCenter.code, money: item.amount })),
        mainCurrency,
        translate('insights.other')
      )
    : []
  const partial =
    query.data && !query.data.complete
      ? translate('insights.partial', { loaded: items.length, total: query.data.totalItems })
      : undefined
  return (
    <ApprovalsQueryState query={query}>
      {items.length === 0 ? (
        <ApprovalsEmpty message={translate('insights.nothingWaiting')} />
      ) : (
        <div className='space-y-4'>
          <ApprovalsStatGrid>
            <ApprovalsStat
              label={translate('insights.waiting')}
              emphasis
              value={
                totals.length ? (
                  <span className='flex flex-col'>
                    {totals.map((total) => (
                      <span key={total.currency} className='truncate'>
                        {formatMoney(total, i18n.language)}
                      </span>
                    ))}
                  </span>
                ) : (
                  translate('unknown')
                )
              }
            />
            <ApprovalsStat label={translate('insights.overdue')} value={due.overdue} />
            <ApprovalsStat label={translate('insights.dueSoon', { days: DUE_SOON_DAYS })} value={due.dueSoon} />
          </ApprovalsStatGrid>
          {partial && (
            <p role='status' className='text-xs text-warning-ink'>
              {partial}
            </p>
          )}
          <div className='grid gap-4 lg:grid-cols-5'>
            {mainCurrency && rows.length > 0 && (
              <InsightCard
                className='lg:col-span-3'
                title={translate('insights.byCostCenter')}
                scope={translate('insights.byCostCenterScope', { currency: mainCurrency })}
                footer={totals.length > 1 ? translate('insights.otherCurrencies') : undefined}
                chart={
                  <AmountBarChart rows={rows} currency={mainCurrency} label={translate('insights.byCostCenter')} />
                }
                table={
                  <AmountTable
                    rows={rows}
                    currency={mainCurrency}
                    firstColumn={translate('insights.columns.costCenter')}
                  />
                }
              />
            )}
            <InsightCard
              className='lg:col-span-2'
              title={translate('insights.checks')}
              scope={translate('insights.checksScope')}
            >
              <BudgetCheckBreakdown breakdown={checkCodeCounts(items)} />
            </InsightCard>
          </div>
          <InsightCard title={translate('insights.dueSoonTitle')} scope={translate('insights.dueSoonScope')}>
            <DueSoonList
              items={soonestDue(items)}
              today={today}
              onOpen={(item) => onOpen(item.requestId, item.batchId)}
            />
          </InsightCard>
        </div>
      )}
    </ApprovalsQueryState>
  )
}
