import { ChevronLeft, ChevronRight, Landmark, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerButton, ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { budgetViews, resetBudgetDetails, type BudgetView } from '../budget-navigation'
import { ManagerBudgetScope } from './manager-budget-scope'

export function ManagerBudgetNavigation({
  year,
  view,
  canPropose
}: {
  year: number
  view: BudgetView
  canPropose: boolean
}) {
  const { t } = useTranslation('manager')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const changeYear = (value: number) => {
    if (!Number.isInteger(value) || value < 2000 || value > 2200) return
    setParams((previous) => {
      const next = resetBudgetDetails(new URLSearchParams(previous))
      next.set('year', String(value))
      return next
    })
  }
  return (
    <>
      <ManagerPageHeader
        title={t('budget')}
        icon={Landmark}
        actions={
          view === 'annual' && (
            <ManagerButton
              primary
              disabled={!canPropose}
              onClick={() =>
                void navigate({ pathname: '/dashboard/manager/annual-budget/new', search: params.toString() })
              }
            >
              <Plus aria-hidden strokeWidth={1.5} className='size-4' />
              {t('newProposal')}
            </ManagerButton>
          )
        }
      />
      <div className='flex flex-wrap items-start gap-4'>
        <ManagerBudgetScope />
        <ManagerField label={t('year')}>
          <div className='flex items-center gap-2'>
            <ManagerButton aria-label={t('previous')} disabled={year <= 2000} onClick={() => changeYear(year - 1)}>
              <ChevronLeft aria-hidden strokeWidth={1.5} className='size-4' />
            </ManagerButton>
            <input
              className={`${managerInputClass} w-28 text-right font-mono tabular-nums`}
              type='number'
              min={2000}
              max={2200}
              step={1}
              placeholder={t('ui.placeholders.year')}
              aria-label={t('year')}
              value={year}
              onChange={(event) => changeYear(Number(event.target.value))}
            />
            <ManagerButton aria-label={t('next')} disabled={year >= 2200} onClick={() => changeYear(year + 1)}>
              <ChevronRight aria-hidden strokeWidth={1.5} className='size-4' />
            </ManagerButton>
          </div>
        </ManagerField>
      </div>
      <nav
        aria-label={t('budgetWorkspace.navigation')}
        className='flex gap-1 overflow-x-auto border-b border-border/60 pb-3'
      >
        {budgetViews.map((item) => (
          <button
            key={item}
            type='button'
            aria-pressed={view === item}
            className='min-h-11 shrink-0 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-primary-soft aria-pressed:text-primary-ink'
            onClick={() =>
              setParams((previous) => {
                const next = resetBudgetDetails(new URLSearchParams(previous))
                next.set('budgetView', item)
                return next
              })
            }
          >
            {t(`budgetWorkspace.views.${item}`)}
          </button>
        ))}
      </nav>
    </>
  )
}
