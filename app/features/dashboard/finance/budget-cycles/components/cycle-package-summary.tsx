import { useTranslation } from 'react-i18next'
import type { PackageResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceStat, FinanceStatGrid, FinanceStatus } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'

type BudgetPackage = NonNullable<PackageResponseDtoData>

/** Company-wide view of the package: proposals and versions against what the ceiling leaves for departments. */
export function CyclePackageSummary({ budgetPackage }: { budgetPackage: BudgetPackage }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('none')
  return (
    <div className='space-y-4'>
      <FinanceStatGrid columns={4}>
        <FinanceStat label={translate('budgetCycle.available')} value={money(budgetPackage.available)} />
        <FinanceStat label={translate('budgetCycle.proposalsTotal')} value={money(budgetPackage.proposalsTotal)} />
        <FinanceStat label={translate('budgetCycle.versionsTotal')} value={money(budgetPackage.versionsTotal)} />
        <FinanceStat label={translate('budgetCycle.overBy')} value={money(budgetPackage.overBy)} emphasis />
      </FinanceStatGrid>
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
                {translate('budgetCycle.ceiling')}
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
                <td className='px-3 py-2 text-right font-mono tabular-nums'>{money(department.ceiling)}</td>
                <td className='px-3 py-2 text-right font-mono tabular-nums'>
                  {department.proposal ? money(department.proposal.total) : translate('budgetCycle.noProposal')}
                </td>
                <td className='px-3 py-2 text-right'>
                  {department.version ? (
                    <div className='flex items-center justify-end gap-2'>
                      <span className='font-mono tabular-nums'>{money(department.version.total)}</span>
                      <FinanceStatus value={department.version.state} />
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>
                      {department.baselineAllowed
                        ? translate('budgetCycle.baselineAllowed')
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
