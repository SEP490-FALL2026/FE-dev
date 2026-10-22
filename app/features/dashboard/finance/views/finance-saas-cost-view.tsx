import { Ban, BookCheck, SearchCheck, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  useDashboardFormat,
  type Tone
} from '../../dashboard-ui'
import { activeFiscalYear, saasItems, type CatalogStatus } from '../annual-budget-data'
import { useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import {
  FinanceSaasCostFilters,
  defaultSaasCostFilters,
  groupBudgetOf,
  matchesSaasCostFilters,
  type SaasCostFilters
} from './finance-saas-cost-filters'

const statusTones: Record<CatalogStatus, Tone> = {
  IN_CATALOG: 'success',
  NEW_UNDER_REVIEW: 'warning',
  NOT_ALLOWED: 'danger'
}

/** FIN-46: each SaaS with its catalog status, the Cost Center that bears it and the group budget it draws on. */
export function FinanceSaasCostView({
  formatCurrency,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatNumber, formatPercent } = useDashboardFormat()
  const { allocations } = useAnnualBudgetState()
  const [filters, setFilters] = useState<SaasCostFilters>(defaultSaasCostFilters)

  const countOf = (value: CatalogStatus) => saasItems.filter((item) => item.catalogStatus === value).length
  const newItems = saasItems.filter((item) => item.catalogStatus === 'NEW_UNDER_REVIEW')
  const newCost = newItems.reduce((sum, item) => sum + item.annualCost, 0)
  const visible = saasItems.filter((item) => matchesSaasCostFilters(item, filters, allocations))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.saas.subtitle')} title={t('budgetPlan.saas.title')} />

      <section aria-label={t('budgetPlan.saas.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('budgetPlan.saas.inCatalogHint')}
          icon={BookCheck}
          label={t('budgetPlan.saas.inCatalogCount')}
          tone='success'
          value={String(countOf('IN_CATALOG'))}
        />
        <StatTile
          hint={t('budgetPlan.saas.newHint', { amount: formatCurrency(newCost) })}
          icon={SearchCheck}
          label={t('budgetPlan.saas.newCount')}
          tone='warning'
          value={String(newItems.length)}
        />
        <StatTile
          hint={t('budgetPlan.saas.notAllowedHint')}
          icon={Ban}
          label={t('budgetPlan.saas.notAllowedCount')}
          tone='danger'
          value={String(countOf('NOT_ALLOWED'))}
        />
      </section>

      {newItems.length > 0 && (
        <Notice icon={ShieldAlert} tone='warning'>
          <p>{t('budgetPlan.saas.reviewNotice')}</p>
          <button
            className='mt-1.5 font-bold text-primary hover:underline'
            onClick={() => onSelectTab('budget-exceptions')}
            type='button'
          >
            {t('budgetPlan.saas.toExceptions')}
          </button>
        </Notice>
      )}

      <FinanceSaasCostFilters applied={filters} items={saasItems} onApply={setFilters} />

      <Panel>
        <PanelTitle
          hint={t('budgetPlan.saas.listHint', { year: activeFiscalYear })}
          title={t('budgetPlan.saas.listTitle')}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-208 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.saas.colSaas')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.saas.colStatus')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.saas.colCostCenter')}</th>
                <th className='py-2.5 font-semibold'>{t('budgetPlan.saas.colGroup')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.saas.colSeats')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.saas.colAnnualCost')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.saas.colBudget')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((item) => {
                const { groupBudget, share } = groupBudgetOf(item, allocations)
                return (
                  <tr key={item.id}>
                    <td className='py-3'>
                      <p className='font-semibold text-foreground'>{item.name}</p>
                      <p className='mt-0.5 text-muted-foreground'>{item.vendor}</p>
                    </td>
                    <td className='py-3'>
                      <Pill tone={statusTones[item.catalogStatus]}>
                        {t(`budgetPlan.saas.status.${item.catalogStatus}`)}
                      </Pill>
                      {item.catalogStatus === 'NEW_UNDER_REVIEW' && (
                        <p className='mt-1 max-w-44 text-[0.7rem] text-warning'>{t('budgetPlan.saas.needsReview')}</p>
                      )}
                    </td>
                    <td className='py-3 font-mono font-bold text-primary'>{item.costCenter}</td>
                    <td className='py-3'>{t(`budgetPlan.group.${item.group}`)}</td>
                    <td className='py-3 text-right'>{formatNumber(item.seats)}</td>
                    <td className='py-3 text-right font-semibold'>{formatCurrency(item.annualCost)}</td>
                    <td className='py-3 pl-6'>
                      {share === null ? (
                        <span className='font-semibold text-warning'>{t('budgetPlan.saas.notAllocated')}</span>
                      ) : (
                        <>
                          <p className='font-semibold text-foreground'>{formatCurrency(groupBudget)}</p>
                          <p className={`mt-0.5 ${share > 1 ? 'font-bold text-danger' : 'text-muted-foreground'}`}>
                            {t('budgetPlan.saas.shareOf', { percent: formatPercent(share) })}
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className='py-6 text-center text-xs text-muted-foreground'>{t('budgetPlan.saas.empty')}</p>
          )}
        </div>
      </Panel>
    </div>
  )
}
