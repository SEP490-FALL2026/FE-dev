import { useTranslation } from 'react-i18next'
import type { budgetCheckGet } from '~/shared/api/generated/operations/budget-checks/budget-check-get'
import type { budgetCheckYearList } from '~/shared/api/generated/operations/budget-checks/budget-check-year-list'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsSection, ApprovalsStat, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '../../shared/approvals-money'
import { BUDGET_CHECK_OUTCOME } from '../enums/budget-check-outcome'

type BudgetCheck = NonNullable<Awaited<ReturnType<typeof budgetCheckGet>>['data']>['budgetCheck']
type Year = NonNullable<Awaited<ReturnType<typeof budgetCheckYearList>>['data']>['items'][number]

/** The three-outcome budget check of MF-1 step 1.5: within base, uses the reserve, or blocked. */
export function SpendBudgetPanel({ check, years }: { check: BudgetCheck; years: Year[] }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const { formatDateTime } = useDashboardFormat()
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('noBudget')
  return (
    <ApprovalsSection title={translate('budget')} actions={<ApprovalsStatus value={check.outcome} />}>
      <dl className='grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4'>
        <ApprovalsStat label={translate('bindingTotal')} value={money(check.bindingTotal)} emphasis />
        <ApprovalsStat label={translate('overBaseBy')} value={money(check.overBaseBy)} />
        <ApprovalsStat label={translate('overBy')} value={money(check.overBy)} />
        <ApprovalsStat label={translate('checkTime')} value={formatDateTime(check.ranAt)} />
      </dl>
      {check.outcome === BUDGET_CHECK_OUTCOME.USES_RESERVE && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('usesReserveNotice')}
        </p>
      )}
      {check.outcome === BUDGET_CHECK_OUTCOME.BLOCKED && (
        <ul className='list-inside list-disc text-sm text-danger'>
          {check.blockedReasons.map((reason) => (
            <li key={reason}>{translate(`blockedReason.${reason}`, { defaultValue: translate('unavailable') })}</li>
          ))}
        </ul>
      )}
      <ApprovalsTable
        items={years}
        rowKey={(year) => String(year.year)}
        columns={[
          { key: 'year', label: translate('year'), numeric: true, render: (year) => year.year },
          { key: 'cost', label: translate('cost'), numeric: true, render: (year) => money(year.cost) },
          { key: 'base', label: translate('baseAmount'), numeric: true, render: (year) => money(year.base) },
          { key: 'reserve', label: translate('reserveAmount'), numeric: true, render: (year) => money(year.reserve) },
          { key: 'held', label: translate('held'), numeric: true, render: (year) => money(year.held) },
          { key: 'spent', label: translate('spent'), numeric: true, render: (year) => money(year.spent) },
          {
            key: 'remainingBase',
            label: translate('remainingBase'),
            numeric: true,
            render: (year) => money(year.remainingBase)
          },
          {
            key: 'remainingWithReserve',
            label: translate('remainingWithReserve'),
            numeric: true,
            render: (year) => money(year.remainingWithReserve)
          },
          { key: 'code', label: translate('check'), render: (year) => <ApprovalsStatus value={year.code} /> }
        ]}
      />
    </ApprovalsSection>
  )
}
