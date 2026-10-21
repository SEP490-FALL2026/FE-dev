import { ChevronRight, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PageHeader, Panel, PanelTitle, Pill, useDashboardFormat } from '../../dashboard-ui'
import { useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import { checkResultTones } from './finance-budget-check-view'
import { FinanceBudgetExceptionDetail } from './finance-budget-exception-detail'
import {
  FinanceBudgetExceptionFilters,
  defaultBudgetExceptionFilters,
  matchesBudgetExceptionFilters,
  type BudgetExceptionFilters
} from './finance-budget-exceptions-filters'

/**
 * FIN-44: requests that failed the automatic budget check (FIN-08). The open list shows first; choosing an
 * exception opens its own detail screen (`id` search param) where Finance records how it is handled.
 */
export function FinanceBudgetExceptionsView({
  exceptionId,
  formatCurrency,
  onSelectTab
}: {
  exceptionId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const { exceptions } = useAnnualBudgetState()
  const [filters, setFilters] = useState<BudgetExceptionFilters>(defaultBudgetExceptionFilters)
  const selected = exceptions.find((item) => item.id === exceptionId)

  if (selected) {
    return (
      <FinanceBudgetExceptionDetail
        formatCurrency={formatCurrency}
        item={selected}
        key={selected.id}
        onBack={() => onSelectTab('budget-exceptions')}
      />
    )
  }

  const openCount = exceptions.filter((item) => !item.resolution).length
  const visible = exceptions.filter((item) => matchesBudgetExceptionFilters(item, filters))
  const onOpen = (id: string) => onSelectTab('budget-exceptions', { id })

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.exceptions.subtitle')} title={t('budgetPlan.exceptions.title')} />

      <Notice icon={ShieldAlert} tone='info'>
        {t('budgetPlan.exceptions.notice')}
      </Notice>

      <FinanceBudgetExceptionFilters applied={filters} exceptions={exceptions} onApply={setFilters} />

      <Panel>
        <PanelTitle
          hint={t('budgetPlan.filtersSpend.budgetExceptions.listHint', {
            open: openCount,
            resolved: exceptions.length - openCount,
            shown: visible.length
          })}
          title={t('budgetPlan.filtersSpend.budgetExceptions.listTitle')}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.exceptions.colRequest')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.exceptions.amount')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.exceptions.colKind')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.exceptions.colRaisedAt')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.exceptions.colManager')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.exceptions.colStatus')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('budgetPlan.exceptions.openDetail')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((item) => (
                <tr
                  className='cursor-pointer transition hover:bg-surface-subtle/60'
                  key={item.id}
                  onClick={() => onOpen(item.id)}
                >
                  <td className='py-3'>
                    <p className='font-mono font-bold text-primary'>{item.requestCode}</p>
                    <p className='mt-0.5 font-semibold text-foreground'>{item.software}</p>
                  </td>
                  <td className='py-3 font-mono'>{item.costCenter}</td>
                  <td className='py-3 text-right font-bold'>{formatCurrency(item.amount)}</td>
                  <td className='py-3 pl-6'>
                    <Pill tone={checkResultTones[item.kind]}>{t(`budgetPlan.check.result.${item.kind}`)}</Pill>
                  </td>
                  <td className='py-3 text-muted-foreground'>{formatDate(item.raisedAt)}</td>
                  <td className='py-3'>{item.manager}</td>
                  <td className='py-3'>
                    {item.resolution ? (
                      <>
                        <Pill tone='success'>{t('budgetPlan.exceptions.state.resolved')}</Pill>
                        <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                          {t(`budgetPlan.exceptions.action.${item.resolution.action}`)}
                        </p>
                      </>
                    ) : (
                      <Pill tone='warning'>{t('budgetPlan.exceptions.state.open')}</Pill>
                    )}
                  </td>
                  <td className='py-3 text-right'>
                    <button
                      aria-label={t('budgetPlan.exceptions.openDetailFor', { code: item.requestCode })}
                      className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpen(item.id)
                      }}
                      type='button'
                    >
                      {t('budgetPlan.exceptions.openDetail')}
                      <ChevronRight aria-hidden='true' className='size-3.5' />
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={8}>
                    {t('budgetPlan.exceptions.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
