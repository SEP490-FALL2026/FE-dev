import { ArrowRight, CheckCircle2, Pencil, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PageHeader, Panel, PanelTitle, Pill, useDashboardFormat } from '../../dashboard-ui'
import { activeFiscalYear } from '../annual-budget-data'
import { updateFiscalPeriod, useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import { BudgetStatusPill } from './budget-plan-parts'
import { FinanceBudgetPeriodDialog } from './finance-budget-period-dialog'

/**
 * FIN-43: annual budget periods with their validity dates and approved totals. Finance edits the dates of
 * periods that have not expired, and sees requests that still point at an expired budget.
 */
export function FinanceBudgetPeriodsView({
  formatCurrency,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const { exceptions, periods } = useAnnualBudgetState()
  const [editingYear, setEditingYear] = useState<number | null>(null)
  const [savedYear, setSavedYear] = useState<number | null>(null)
  const editing = periods.find((period) => period.year === editingYear)
  const expiredInUse = exceptions.filter((item) => item.kind === 'CC_EXPIRED' && !item.resolution)
  const approvedOf = (year: number) => periods.find((period) => period.year === year)?.approvedTotal ?? null

  const money = (value: number | null) => (value === null ? t('budgetPlan.periods.notApproved') : formatCurrency(value))
  const cell = 'py-3 pr-3'

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.periods.subtitle')} title={t('budgetPlan.periods.title')} />

      {savedYear !== null && (
        <Notice icon={CheckCircle2} tone='success'>
          {t('budgetPlan.periods.saved', { year: savedYear })}
        </Notice>
      )}

      <Panel>
        <PanelTitle title={t('budgetPlan.periods.tableTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.periods.colYear')}</th>
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.periods.colStart')}</th>
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.periods.colEnd')}</th>
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.periods.colStatus')}</th>
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.periods.colPlanning')}</th>
                <th className='py-2.5 pr-3 text-right font-semibold'>{t('budgetPlan.periods.colApproved')}</th>
                <th className='py-2.5 pr-3 text-right font-semibold'>{t('budgetPlan.periods.colPrevious')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('budgetPlan.periods.edit')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {periods.map((period) => {
                const isActive = period.year === activeFiscalYear

                return (
                  <tr className={isActive ? 'bg-primary-soft/40' : undefined} key={period.year}>
                    <td className={`${cell} pl-2`}>
                      <p className='font-bold text-foreground'>{period.year}</p>
                      {isActive && (
                        <span className='mt-1 inline-flex'>
                          <Pill tone='primary'>{t('budgetPlan.periods.active')}</Pill>
                        </span>
                      )}
                    </td>
                    <td className={cell}>{formatDate(period.start)}</td>
                    <td className={cell}>{formatDate(period.end)}</td>
                    <td className={cell}>
                      <BudgetStatusPill status={period.status} />
                    </td>
                    <td className={cell}>{formatDate(period.planningOpensAt)}</td>
                    <td className={`${cell} text-right font-bold text-foreground`}>{money(period.approvedTotal)}</td>
                    <td className={`${cell} text-right text-muted-foreground`}>{money(approvedOf(period.year - 1))}</td>
                    <td className='py-3 text-right'>
                      {period.status !== 'EXPIRED' && (
                        <button
                          aria-label={t('budgetPlan.periods.editFor', { year: period.year })}
                          className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                          onClick={() => {
                            setSavedYear(null)
                            setEditingYear(period.year)
                          }}
                          type='button'
                        >
                          <Pencil aria-hidden='true' className='size-3' />
                          {t('budgetPlan.periods.edit')}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <PanelTitle hint={t('budgetPlan.periods.expiredHint')} title={t('budgetPlan.periods.expiredTitle')} />
        <div className='mt-4 space-y-3'>
          <Notice icon={ShieldAlert} tone='warning'>
            {t('budgetPlan.periods.rule')}
          </Notice>
          {expiredInUse.length === 0 ? (
            <p className='text-xs text-muted-foreground'>{t('budgetPlan.periods.expiredEmpty')}</p>
          ) : (
            <ul className='divide-y divide-border text-xs'>
              {expiredInUse.map((item) => (
                <li className='flex flex-wrap items-start justify-between gap-3 py-3' key={item.id}>
                  <div className='min-w-0'>
                    <p className='font-mono font-bold text-primary'>
                      {item.requestCode} · {item.costCenter}
                    </p>
                    <p className='mt-0.5 font-semibold text-foreground'>
                      {item.software} · {formatCurrency(item.amount)}
                    </p>
                    <p className='mt-0.5 text-muted-foreground'>{item.detail}</p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      {item.manager} · {formatDate(item.raisedAt)}
                    </p>
                  </div>
                  <button
                    aria-label={t('budgetPlan.periods.openExceptionFor', { code: item.requestCode })}
                    className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                    onClick={() => onSelectTab('budget-exceptions', { id: item.id })}
                    type='button'
                  >
                    {t('budgetPlan.periods.openException')}
                    <ArrowRight aria-hidden='true' className='size-3' />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>

      {editing && (
        <FinanceBudgetPeriodDialog
          key={editing.year}
          onClose={() => setEditingYear(null)}
          onSave={(dates) => {
            updateFiscalPeriod(editing.year, dates)
            setSavedYear(editing.year)
            setEditingYear(null)
          }}
          period={editing}
        />
      )}
    </div>
  )
}
