import { useTranslation } from 'react-i18next'
import type { budgetCheckGet } from '~/shared/api/generated/operations/budget-checks/budget-check-get'
import type { budgetCheckYearList } from '~/shared/api/generated/operations/budget-checks/budget-check-year-list'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsSection, ApprovalsStat, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '../../shared/approvals-money'

type BudgetCheck = NonNullable<Awaited<ReturnType<typeof budgetCheckGet>>['data']>['budgetCheck']
type Year = NonNullable<Awaited<ReturnType<typeof budgetCheckYearList>>['data']>['items'][number]
export function SpendBudgetPanel({ check, years }: { check: BudgetCheck; years: Year[] }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const { t: flow } = useTranslation('requestFlow')
  const { formatDateTime } = useDashboardFormat()
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('noBudget')
  return (
    <ApprovalsSection
      title={translate('budget')}
      actions={<span className='text-sm font-medium'>{flow(check.outcome, { defaultValue: flow('unknown') })}</span>}
    >
      {check.blockedReasons.map((reason) => (
        <p key={reason} className='text-sm text-warning'>
          {flow(reason, { defaultValue: flow('unknown') })}
        </p>
      ))}
      <dl className='grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2'>
        <ApprovalsStat label={translate('bindingTotal')} value={money(check.bindingTotal)} emphasis />
        <ApprovalsStat label={translate('checkTime')} value={formatDateTime(check.ranAt)} />
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
    </ApprovalsSection>
  )
}
