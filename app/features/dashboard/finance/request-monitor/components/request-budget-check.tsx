import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useBudgetCheckGet } from '~/shared/api/generated/operations/budget-checks/budget-check-get'
import { useBudgetCheckYearList } from '~/shared/api/generated/operations/budget-checks/budget-check-year-list'
import {
  FinanceEmpty,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'

/** BE answers 404 SPEND.REVIEW_NOT_FOUND when the Request has no budget check the caller may read (not batched yet). */
function isReviewNotFound(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 404) return false
  const body = error.response.data as { error?: { code?: string } } | undefined
  return body?.error?.code === 'SPEND.REVIEW_NOT_FOUND'
}

/** The budget check of a Request: outcome, why it was blocked, and the figures of each year it spans. */
export function RequestBudgetCheck({ requestId }: { requestId: string }) {
  const { t: translate, i18n } = useTranslation('financeRequests')
  const checkQuery = useBudgetCheckGet(requestId)
  // The years only exist once the check is readable; asking first would repeat the same 404 SPEND.REVIEW_NOT_FOUND.
  const yearsQuery = useBudgetCheckYearList(
    requestId,
    { page: 1, pageSize: 20 },
    { query: { enabled: checkQuery.isSuccess } }
  )
  const check = checkQuery.data?.data?.budgetCheck
  const notReviewed = isReviewNotFound(checkQuery.error)
  const money = (value: { amount: string; currency: string } | null | undefined) =>
    value ? formatMoney(value, i18n.language) : translate('none')
  if (notReviewed)
    return (
      <FinanceSection title={translate('check.title')}>
        <FinanceEmpty message={translate('check.notReviewed')} />
      </FinanceSection>
    )
  return (
    <FinanceSection title={translate('check.title')}>
      <FinanceQueryState query={checkQuery} skeleton='detail'>
        {check ? (
          <div className='space-y-4'>
            <FinanceStatGrid>
              <FinanceStat
                label={translate('check.outcome')}
                value={
                  <FinanceStatus
                    value={check.outcome}
                    label={translate(`check.outcomes.${check.outcome}`, { defaultValue: check.outcome })}
                  />
                }
              />
              <FinanceStat label={translate('check.bindingTotal')} value={money(check.bindingTotal)} />
              <FinanceStat
                emphasis={Boolean(check.overBy)}
                label={translate('check.overBy')}
                value={check.overBy ? money(check.overBy) : translate('check.notOver')}
              />
            </FinanceStatGrid>
            {check.blockedReasons.length > 0 && (
              <ul className='list-inside list-disc space-y-1 rounded-xl border border-danger/25 bg-danger/5 p-4 text-sm text-danger-ink'>
                {check.blockedReasons.map((reason) => (
                  <li key={reason}>{translate(`check.reasons.${reason}`, { defaultValue: reason })}</li>
                ))}
              </ul>
            )}
            {check.nextYearBudget && (
              <p role='status' className={check.nextYearBudget.warning ? 'text-sm text-warning-ink' : 'text-sm'}>
                {translate('check.nextYear', {
                  year: check.nextYearBudget.year,
                  remaining: money(check.nextYearBudget.remaining),
                  after: money(check.nextYearBudget.remainingAfter)
                })}
              </p>
            )}
          </div>
        ) : (
          <FinanceEmpty message={translate('check.none')} />
        )}
      </FinanceQueryState>
      {checkQuery.isSuccess && (
        <FinanceQueryState query={yearsQuery}>
          <FinanceTable
            items={yearsQuery.data?.data?.items ?? []}
            rowKey={(item) => String(item.year)}
            columns={[
              {
                key: 'year',
                label: translate('check.year'),
                numeric: true,
                align: 'center',
                render: (item) => item.year
              },
              { key: 'cost', label: translate('check.cost'), numeric: true, render: (item) => money(item.cost) },
              {
                key: 'budget',
                label: translate('check.effectiveBudget'),
                numeric: true,
                render: (item) => money(item.effectiveBudget?.total)
              },
              { key: 'held', label: translate('check.held'), numeric: true, render: (item) => money(item.held) },
              {
                key: 'remaining',
                label: translate('check.remaining'),
                numeric: true,
                render: (item) => money(item.remaining)
              },
              {
                key: 'code',
                label: translate('check.code'),
                render: (item) =>
                  item.code ? translate(`check.codes.${item.code}`, { defaultValue: item.code }) : translate('none')
              }
            ]}
          />
        </FinanceQueryState>
      )}
    </FinanceSection>
  )
}
