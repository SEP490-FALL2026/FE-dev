import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetReviewPeriodList } from '~/shared/api/generated/operations/budget-review-periods'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { ReviewCloseDialog } from '../components/review-close-dialog'
import { ReviewPeriodDetail } from '../components/review-period-detail'

const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2100

export function FinanceReviewPeriodsView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeReview')
  const { page, pageSize, setPage, year, setYear } = useFinanceList()
  const [closing, setClosing] = useState(false)
  const query = useBudgetReviewPeriodList({ page, pageSize, ...(validYear(year) ? { year: Number(year) } : {}) })
  const result = query.data?.data

  if (itemId) return <ReviewPeriodDetail id={itemId} onBack={() => onSelectTab?.('period-close')} />

  return (
    <FinancePage
      title={translate('periods.title')}
      description={translate('periods.description')}
      actions={
        <FinanceButton variant='primary' onClick={() => setClosing(true)}>
          {translate('periods.close')}
        </FinanceButton>
      }
    >
      <FinanceToolbar>
        <div className='sm:w-40'>
          <FinanceField
            label={translate('year')}
            floatingError
            error={year !== '' && !validYear(year) ? translate('yearInvalid') : null}
          >
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2100}
              placeholder={String(new Date().getFullYear())}
              aria-invalid={(year !== '' && !validYear(year)) || undefined}
              className={`${financeInputClass} font-mono tabular-nums`}
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(period) => period.id}
          onOpen={(period) => onSelectTab?.('period-close', { id: period.id })}
          columns={[
            {
              key: 'period',
              label: translate('periods.period'),
              render: (period) => (
                <span>
                  {translate('periods.periodLabel', { month: period.month, year: period.year })} ·{' '}
                  {translate(`periods.kind.${period.kind}`)}
                </span>
              )
            },
            {
              key: 'state',
              label: translate('state'),
              render: (period) => (
                <FinanceStatus value={period.state} label={translate(`periods.state.${period.state}`)} />
              )
            },
            {
              key: 'spent',
              label: translate('periods.spent'),
              numeric: true,
              render: (period) => (period.company ? formatMoney(period.company.spent, i18n.language) : '—')
            },
            {
              key: 'closedBy',
              label: translate('periods.closedBy'),
              render: (period) =>
                period.closedBy
                  ? translate('periods.closedByAt', {
                      name: period.closedBy.fullName,
                      date: period.closedAt.slice(0, 10)
                    })
                  : period.closedAt.slice(0, 10)
            },
            {
              key: 'signedBy',
              label: translate('periods.signedBy'),
              render: (period) =>
                period.signedBy && period.signedAt
                  ? translate('periods.closedByAt', {
                      name: period.signedBy.fullName,
                      date: period.signedAt.slice(0, 10)
                    })
                  : translate('periods.notSigned')
            },
            {
              key: 'dueOn',
              label: translate('periods.dueOn'),
              numeric: true,
              align: 'center',
              render: (period) => period.explanationsDueOn ?? '—'
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {closing && (
        <ReviewCloseDialog
          onClose={() => setClosing(false)}
          onClosed={(periodId) => onSelectTab?.('period-close', { id: periodId })}
        />
      )}
    </FinancePage>
  )
}
