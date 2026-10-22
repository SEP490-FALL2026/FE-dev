import { ChevronRight, ClipboardCheck, Forward, ShieldAlert, ShieldCheck, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PageHeader, Panel, Pill, StatTile, useDashboardFormat, type Tone } from '../../dashboard-ui'
import { budgetChecks, type BudgetCheckResult } from '../annual-budget-data'
import { useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import {
  FinanceBudgetCheckFilters,
  defaultBudgetCheckFilters,
  matchesBudgetCheckFilters,
  type BudgetCheckFilters
} from './finance-budget-check-filters'

export const checkResultTones: Record<BudgetCheckResult, Tone> = {
  CC_EXPIRED: 'warning',
  INSUFFICIENT: 'danger',
  OUT_OF_CATALOG: 'info',
  PASSED: 'success'
}

/**
 * FIN-08: every request is checked automatically before the Spending Approver. Requests within budget are
 * forwarded without Finance; the rest become budget exceptions (FIN-44) that Finance handles.
 */
export function FinanceBudgetCheckView({
  formatCurrency,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const { exceptions } = useAnnualBudgetState()
  const [filters, setFilters] = useState<BudgetCheckFilters>(defaultBudgetCheckFilters)

  const checks = [...budgetChecks].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt))
  const passed = checks.filter((check) => check.result === 'PASSED')
  const failed = checks.filter((check) => check.result !== 'PASSED')
  const openExceptions = exceptions.filter((item) => !item.resolution)
  const visible = checks.filter((check) => matchesBudgetCheckFilters(check, filters, exceptions))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.check.subtitle')} title={t('budgetPlan.check.title')} />

      <Notice icon={ShieldCheck} tone='info'>
        {t('budgetPlan.check.ruleNotice')}
      </Notice>

      <section aria-label={t('budgetPlan.check.summaryLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('budgetPlan.check.checkedHint')}
          icon={ClipboardCheck}
          label={t('budgetPlan.check.checked')}
          value={String(checks.length)}
        />
        <StatTile
          hint={t('budgetPlan.check.passedHint')}
          icon={Forward}
          label={t('budgetPlan.check.passed')}
          tone='success'
          value={String(passed.length)}
        />
        <StatTile
          hint={t('budgetPlan.check.exceptionsHint', { count: failed.length })}
          icon={ShieldAlert}
          label={t('budgetPlan.check.exceptions')}
          tone='warning'
          value={String(openExceptions.length)}
        />
        <StatTile
          hint={t('budgetPlan.check.forwardedAmountHint')}
          icon={Wallet}
          label={t('budgetPlan.check.forwardedAmount')}
          tone='info'
          value={formatCurrency(passed.reduce((sum, check) => sum + check.amount, 0))}
        />
      </section>

      <FinanceBudgetCheckFilters applied={filters} checks={checks} onApply={setFilters} />

      <Panel>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.check.colRequest')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.check.colRequester')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.check.colAmount')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.check.colRemainingBefore')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.check.colResult')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.check.colCheckedAt')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.check.colNext')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((check) => {
                const exception = exceptions.find((item) => item.checkId === check.id)

                return (
                  <tr key={check.id}>
                    <td className='py-3'>
                      <p className='font-mono font-bold text-primary'>{check.requestCode}</p>
                      <p className='mt-0.5 font-semibold text-foreground'>{check.software}</p>
                    </td>
                    <td className='py-3'>{check.requester}</td>
                    <td className='py-3 font-mono'>{check.costCenter}</td>
                    <td className='py-3 text-right font-bold'>{formatCurrency(check.amount)}</td>
                    <td className='py-3 text-right'>
                      {check.remainingBefore === null ? '—' : formatCurrency(check.remainingBefore)}
                    </td>
                    <td className='py-3 pl-6'>
                      <Pill tone={checkResultTones[check.result]}>{t(`budgetPlan.check.result.${check.result}`)}</Pill>
                    </td>
                    <td className='py-3 text-muted-foreground'>{formatDate(check.checkedAt)}</td>
                    <td className='py-3 text-right'>
                      {check.result === 'PASSED' ? (
                        <Pill tone='success'>{t('budgetPlan.check.forwarded')}</Pill>
                      ) : (
                        exception && (
                          <button
                            aria-label={t(
                              exception.resolution
                                ? 'budgetPlan.check.viewResolutionFor'
                                : 'budgetPlan.check.handleFor',
                              { code: check.requestCode }
                            )}
                            className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                            onClick={() => onSelectTab('budget-exceptions', { id: exception.id })}
                            type='button'
                          >
                            {t(exception.resolution ? 'budgetPlan.check.viewResolution' : 'budgetPlan.check.handle')}
                            <ChevronRight aria-hidden='true' className='size-3.5' />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={8}>
                    {t('budgetPlan.check.empty')}
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
