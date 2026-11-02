import { useTranslation } from 'react-i18next'
import type { budgetCheckGet } from '~/shared/api/generated/operations/finance-reviews/budget-check-get'
import type { budgetCheckYearList } from '~/shared/api/generated/operations/finance-reviews/budget-check-year-list'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsStatus } from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'

type BudgetCheck = NonNullable<Awaited<ReturnType<typeof budgetCheckGet>>['data']>['budgetCheck']
type Year = NonNullable<Awaited<ReturnType<typeof budgetCheckYearList>>['data']>['items'][number]
export function SpendBudgetPanel({ check, years }: { check: BudgetCheck; years: Year[] }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('noBudget')
  return (
    <section className='space-y-4' aria-label={translate('budget')}>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold'>{translate('budget')}</h2>
        <ApprovalsStatus value={check.primaryCode} />
      </div>
      <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('bindingTotal')}</dt>
          <dd className='text-right font-mono tabular-nums'>{money(check.bindingTotal)}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('checkTime')}</dt>
          <dd className='text-right font-mono text-sm tabular-nums'>
            {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
              new Date(check.ranAt)
            )}
          </dd>
        </div>
      </dl>
      <ApprovalsTable
        items={years}
        rowKey={(year) => String(year.year)}
        columns={[
          { key: 'year', label: translate('year'), numeric: true, render: (year) => year.year },
          { key: 'cost', label: translate('cost'), numeric: true, render: (year) => money(year.cost) },
          { key: 'budget', label: translate('budgetAmount'), numeric: true, render: (year) => money(year.budget) },
          { key: 'held', label: translate('held'), numeric: true, render: (year) => money(year.held) },
          { key: 'spent', label: translate('spent'), numeric: true, render: (year) => money(year.spent) },
          { key: 'remaining', label: translate('remaining'), numeric: true, render: (year) => money(year.remaining) },
          { key: 'code', label: translate('check'), render: (year) => <ApprovalsStatus value={year.code} /> }
        ]}
      />
    </section>
  )
}
