import { useTranslation } from 'react-i18next'
import type { PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceButton, FinanceStat, FinanceStatGrid, FinanceStatus } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'

type BudgetPackage = NonNullable<PackageResponseDtoData>

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
      <div className='overflow-x-auto rounded-lg border border-border/70'>
        <table className='w-full text-sm'>
          <thead className='bg-surface-subtle text-xs tracking-wider text-muted-foreground uppercase'>
            <tr>
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.department')}
              </th>
              <th scope='col' className='px-3 py-2 text-right'>
                {translate('budgetCycle.proposal')}
              </th>
              <th scope='col' className='px-3 py-2 text-right'>
                {translate('budgetCycle.version')}
              </th>
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.headStatus.title')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {budgetPackage.departments.map((department) => (
              <tr key={department.departmentId}>
                <td className='max-w-56 px-3 py-2'>
                  <div className='truncate font-medium' title={department.departmentName}>
                    {department.departmentName}
                  </div>
                  <div className='font-mono text-[11px] text-muted-foreground'>{department.departmentCode}</div>
                </td>
                <td className='px-3 py-2 text-right'>
                  {department.proposal ? (
                    <div className='flex items-center justify-end gap-2'>
                      <span className='font-mono tabular-nums'>{money(department.proposal.total)}</span>
                      <FinanceStatus value={department.proposal.state} />
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>{translate('budgetCycle.noProposal')}</span>
                  )}
                </td>
                <td className='px-3 py-2 text-right'>
                  {department.version ? (
                    <div className='flex items-center justify-end gap-2'>
                      <span className='font-mono tabular-nums'>{money(department.version.total)}</span>
                      <FinanceStatus value={department.version.state} />
                    </div>
                  ) : department.baselineAllowed ? (
                    <div className='flex items-center justify-end gap-2'>
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
                  ) : (
                    <span className='text-muted-foreground'>
                      {department.baselineRefusal
                        ? translate(`budgetCycle.baselineRefusal.${department.baselineRefusal}`, {
                            defaultValue: translate('budgetCycle.noVersion')
                          })
                        : translate('budgetCycle.noVersion')}
                    </span>
                  )}
                </td>
                <td className='px-3 py-2 text-muted-foreground'>
                  {translate(`budgetCycle.headStatus.${department.headStatus}`, {
                    defaultValue: translate('unknown')
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
