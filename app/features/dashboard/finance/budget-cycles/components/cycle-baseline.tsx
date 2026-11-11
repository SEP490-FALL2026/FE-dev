import { ChevronDown, ChevronRight } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BaselineResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { FinanceStat, FinanceStatGrid } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'

type Baseline = NonNullable<BaselineResponseDtoData>
type Money = { amount: string; currency: string } | null | undefined

const cell = 'px-3 py-2 text-right font-mono tabular-nums'
const head = 'px-3 py-2 text-right'

/** MF-4 B1: running rights and subscriptions × monthly price per department, plus the idle shared-pool line. */
export function CycleBaseline({ baseline }: { baseline: Baseline }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const [open, setOpen] = useState<string>()
  const money = (value: Money) => (value ? formatMoney(value, i18n.language) : translate('none'))
  const pool = baseline.sharedPoolUnallocated
  return (
    <div className='space-y-4'>
      <p className='text-xs text-muted-foreground'>
        {translate('budgetCycle.baseline.computedAt', {
          time: new Date(baseline.computedAt).toLocaleString(i18n.language)
        })}
      </p>
      {pool && (
        <FinanceStatGrid columns={3}>
          <FinanceStat
            label={translate('budgetCycle.baseline.poolCost')}
            value={money(pool.estimatedAnnualCost)}
            emphasis
          />
          <FinanceStat label={translate('budgetCycle.baseline.poolIdle')} value={String(pool.seatsIdle)} />
          <FinanceStat label={translate('budgetCycle.baseline.poolSoftware')} value={String(pool.softwareTotal)} />
        </FinanceStatGrid>
      )}
      {pool?.hasUnknownCost && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('budgetCycle.baseline.unknownCost')}
        </p>
      )}
      <div className='overflow-x-auto rounded-lg border border-border/70'>
        <table className='w-full text-sm'>
          <thead className='bg-surface-subtle text-xs tracking-wider text-muted-foreground uppercase'>
            <tr>
              <th scope='col' className='px-3 py-2 text-left'>
                {translate('budgetCycle.department')}
              </th>
              <th scope='col' className={head}>
                {translate('budgetCycle.baseline.seats')}
              </th>
              <th scope='col' className={head}>
                {translate('budgetCycle.baseline.estimated')}
              </th>
              <th scope='col' className={head}>
                {translate('budgetCycle.baseline.spent')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {baseline.departments.map((department) => {
              const expanded = open === department.departmentId
              const Icon = expanded ? ChevronDown : ChevronRight
              return (
                <Fragment key={department.departmentId}>
                  <tr>
                    <td className='px-3 py-2'>
                      <button
                        type='button'
                        aria-expanded={expanded}
                        className='flex items-center gap-2 text-left'
                        onClick={() => setOpen(expanded ? undefined : department.departmentId)}
                      >
                        <Icon aria-hidden className='size-4' strokeWidth={1.5} />
                        <span className='font-medium'>{department.departmentName}</span>
                        <span className='font-mono text-[11px] text-muted-foreground'>{department.departmentCode}</span>
                      </button>
                      {department.hasUnknownCost && (
                        <span className='ml-6 block text-xs text-warning-ink'>
                          {translate('budgetCycle.baseline.unknownCost')}
                        </span>
                      )}
                    </td>
                    <td className={cell}>{department.seatsAssigned}</td>
                    <td className={cell}>{money(department.estimatedAnnualCost)}</td>
                    <td className={cell}>{money(department.spentThisYear)}</td>
                  </tr>
                  {expanded && (
                    <tr>
                      <td colSpan={4} className='bg-surface-subtle/50 px-3 py-2'>
                        <table className='w-full text-xs'>
                          <thead className='text-muted-foreground'>
                            <tr>
                              <th scope='col' className='py-1 text-left'>
                                {translate('budgetCycle.baseline.software')}
                              </th>
                              <th scope='col' className={head}>
                                {translate('budgetCycle.baseline.seats')}
                              </th>
                              <th scope='col' className={head}>
                                {translate('budgetCycle.baseline.unitPrice')}
                              </th>
                              <th scope='col' className={head}>
                                {translate('budgetCycle.baseline.months')}
                              </th>
                              <th scope='col' className={head}>
                                {translate('budgetCycle.baseline.estimated')}
                              </th>
                              <th scope='col' className={head}>
                                {translate('budgetCycle.baseline.kpi3')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {department.software.map((item) => (
                              <tr key={item.subscriptionId}>
                                <td className='py-1'>
                                  {item.application} · {item.plan}
                                  {item.suggestRenewal && (
                                    <span className='ml-2 text-primary-ink'>
                                      {translate('budgetCycle.baseline.renew')}
                                    </span>
                                  )}
                                </td>
                                <td className={cell}>
                                  {item.seatsAssigned}
                                  {item.seatsPurchased !== null && ` / ${item.seatsPurchased}`}
                                </td>
                                <td className={cell}>{money(item.monthlyUnitPrice)}</td>
                                <td className={cell}>{item.monthsRunning}</td>
                                <td className={cell}>{money(item.estimatedAnnualCost)}</td>
                                <td className={cell}>{item.kpi3 === null ? '—' : `${item.kpi3}%`}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {department.softwareTotal > department.software.length && (
                          <p className='pt-1 text-xs text-muted-foreground'>
                            {translate('budgetCycle.baseline.truncated', {
                              shown: department.software.length,
                              total: department.softwareTotal
                            })}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
