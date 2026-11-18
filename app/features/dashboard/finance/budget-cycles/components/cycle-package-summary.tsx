import { useTranslation } from 'react-i18next'
import type { PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceButton, FinanceStat, FinanceStatGrid, FinanceStatus } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'

type BudgetPackage = NonNullable<PackageResponseDtoData>
type Department = BudgetPackage['departments'][number]

const isPositive = (value: { amount: string } | null | undefined) => Number(value?.amount ?? 0) > 0

/**
 * Company-wide view of the package: proposals and versions against what the ceiling leaves for departments.
 * `baselineAllowed` decides whether a department row offers "Build from baseline"; `baselineRefusal` says why not.
 */
export function CyclePackageSummary({
  budgetPackage,
  onBuildFromBaseline,
  buildingDepartmentId
}: {
  budgetPackage: BudgetPackage
  /** Returns nothing to hide the button when the department has no Cost Center in the baseline. */
  onBuildFromBaseline?: (departmentId: string) => void
  buildingDepartmentId?: string
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('none')
  const proposalCell = (department: Department) =>
    department.proposal ? (
      <div className='flex items-center justify-end gap-2'>
        <span className='font-mono tabular-nums'>{money(department.proposal.total)}</span>
        <FinanceStatus value={department.proposal.state} />
      </div>
    ) : (
      <span className='text-muted-foreground'>{translate('budgetCycle.noProposal')}</span>
    )
  const versionCell = (department: Department) => {
    if (department.version)
      return (
        <div className='flex items-center justify-end gap-2'>
          <span className='font-mono tabular-nums'>{money(department.version.total)}</span>
          <FinanceStatus value={department.version.state} />
        </div>
      )
    if (department.baselineAllowed)
      return (
        <div className='flex flex-wrap items-center justify-end gap-2'>
          <span className='text-muted-foreground'>{translate('budgetCycle.baselineAllowed')}</span>
          {onBuildFromBaseline && (
            <FinanceButton
              pending={buildingDepartmentId === department.departmentId}
              onClick={() => onBuildFromBaseline(department.departmentId)}
            >
              {translate('budgetCycle.buildFromBaseline')}
            </FinanceButton>
          )}
        </div>
      )
    return (
      <span className='text-muted-foreground'>
        {department.baselineRefusal
          ? translate(`budgetCycle.baselineRefusal.${department.baselineRefusal}`, {
              defaultValue: translate('budgetCycle.noVersion')
            })
          : translate('budgetCycle.noVersion')}
      </span>
    )
  }
  const headStatus = (department: Department) =>
    translate(`budgetCycle.headStatus.${department.headStatus}`, { defaultValue: translate('unknown') })
  return (
    <div className='space-y-4'>
      <FinanceStatGrid columns={3}>
        <FinanceStat label={translate('budgetCycle.proposalsTotal')} value={money(budgetPackage.proposalsTotal)} />
        <FinanceStat label={translate('budgetCycle.versionsTotal')} value={money(budgetPackage.versionsTotal)} />
        <FinanceStat label={translate('budgetCycle.unallocated')} value={money(budgetPackage.unallocated)} emphasis />
      </FinanceStatGrid>
      {isPositive(budgetPackage.overBy) && (
        <p role='alert' className='text-sm text-danger'>
          {translate('budgetCycle.overByWarning', { amount: money(budgetPackage.overBy) })}
        </p>
      )}
      {isPositive(budgetPackage.versionsAdjustment) && (
        <p className='text-sm text-muted-foreground'>
          {translate('budgetCycle.versionsAdjustmentNote', { amount: money(budgetPackage.versionsAdjustment) })}
        </p>
      )}
      {isPositive(budgetPackage.versionsOutsideListed) && (
        <p className='text-sm text-muted-foreground'>
          {translate('budgetCycle.versionsOutsideListedNote', { amount: money(budgetPackage.versionsOutsideListed) })}
        </p>
      )}
      {budgetPackage.versionsInOtherCurrency > 0 && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('budgetCycle.versionsInOtherCurrencyNote', { count: budgetPackage.versionsInOtherCurrency })}
        </p>
      )}
      {budgetPackage.proposalsOverAvailable && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('budgetCycle.proposalsOverAvailable')}
        </p>
      )}
      <div className='space-y-3 md:hidden'>
        {budgetPackage.departments.map((department) => (
          <article
            key={department.departmentId}
            className='space-y-3 rounded-xl border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
          >
            <div className='min-w-0'>
              <div className='truncate font-medium' title={department.departmentName}>
                {department.departmentName}
              </div>
              <div className='font-mono text-[11px] text-muted-foreground'>{department.departmentCode}</div>
            </div>
            <dl className='space-y-2 text-sm'>
              <div className='flex items-start justify-between gap-4'>
                <dt className='text-muted-foreground'>{translate('budgetCycle.proposal')}</dt>
                <dd className='min-w-0 text-right'>{proposalCell(department)}</dd>
              </div>
              <div className='flex items-start justify-between gap-4'>
                <dt className='text-muted-foreground'>{translate('budgetCycle.version')}</dt>
                <dd className='min-w-0 text-right'>{versionCell(department)}</dd>
              </div>
              <div className='flex items-start justify-between gap-4'>
                <dt className='text-muted-foreground'>{translate('budgetCycle.headStatus.title')}</dt>
                <dd className='min-w-0 text-right'>{headStatus(department)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className='hidden overflow-x-auto rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] md:block'>
        <table className='w-full text-sm'>
          <thead className='border-b border-border/70 bg-surface-subtle/60 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>
            <tr>
              <th scope='col' className='px-4 py-2.5 text-left'>
                {translate('budgetCycle.department')}
              </th>
              <th scope='col' className='px-4 py-2.5 text-right'>
                {translate('budgetCycle.proposal')}
              </th>
              <th scope='col' className='px-4 py-2.5 text-right'>
                {translate('budgetCycle.version')}
              </th>
              <th scope='col' className='px-4 py-2.5 text-left'>
                {translate('budgetCycle.headStatus.title')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {budgetPackage.departments.map((department) => (
              <tr key={department.departmentId} className='transition-colors duration-150 hover:bg-surface-subtle/60'>
                <td className='max-w-56 px-4 py-3'>
                  <div className='truncate font-medium' title={department.departmentName}>
                    {department.departmentName}
                  </div>
                  <div className='font-mono text-[11px] text-muted-foreground'>{department.departmentCode}</div>
                </td>
                <td className='px-4 py-3 text-right'>{proposalCell(department)}</td>
                <td className='px-4 py-3 text-right'>{versionCell(department)}</td>
                <td className='px-4 py-3 text-muted-foreground'>{headStatus(department)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
