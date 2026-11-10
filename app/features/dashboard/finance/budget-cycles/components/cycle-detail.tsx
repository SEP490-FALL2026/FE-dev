import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBudgetCycleGet, useBudgetCyclePackage } from '~/shared/api/generated/operations/budget-cycles'
import {
  FinanceButton,
  FinanceDetailPage,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { CYCLE_STATUS, canPublishCycle, isCycleStatus } from '../enums/cycle-status'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'
import { CycleCeilingsEditor } from './cycle-ceilings-editor'
import { CyclePackageSummary } from './cycle-package-summary'

export function CycleDetail({ year, onBack }: { year: number; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const cycleQuery = useBudgetCycleGet(year)
  const packageQuery = useBudgetCyclePackage(year)
  const { publish } = useBudgetCycleActions(year)
  const cycle = cycleQuery.data?.data
  const budgetPackage = packageQuery.data?.data
  const publishable = Boolean(cycle && isCycleStatus(cycle.status) && canPublishCycle(cycle.status))

  return (
    <FinanceDetailPage>
      <FinancePage
        title={translate('budgetCycle.detailTitle', { year })}
        actions={
          <>
            <FinanceButton variant='ghost' onClick={onBack}>
              <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('back')}
            </FinanceButton>
            <FinanceButton
              variant='primary'
              pending={publish.isPending}
              disabled={!publishable}
              onClick={() => publish.mutate({ year })}
            >
              {translate('budgetCycle.publish')}
            </FinanceButton>
          </>
        }
      >
        <FinanceQueryState query={cycleQuery}>
          {cycle && (
            <>
              <FinanceStatGrid columns={4}>
                <FinanceStat
                  label={translate('budgetCycle.annualCeiling')}
                  value={formatMoney(cycle.annualCeiling, i18n.language)}
                  emphasis
                />
                <FinanceStat
                  label={translate('budgetCycle.sharedPoolReserve')}
                  value={
                    cycle.sharedPoolReserve ? formatMoney(cycle.sharedPoolReserve, i18n.language) : translate('none')
                  }
                />
                <FinanceStat
                  label={translate('budgetCycle.allocated')}
                  value={formatMoney(cycle.allocated, i18n.language)}
                />
                <FinanceStat
                  label={translate('budgetCycle.unallocated')}
                  value={formatMoney(cycle.unallocated, i18n.language)}
                />
              </FinanceStatGrid>
              <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
                <FinanceStatus
                  value={cycle.status}
                  label={translate(`budgetCycle.status.${cycle.status}`, { defaultValue: translate('unknown') })}
                />
                <span>
                  {translate('budgetCycle.deadlines', {
                    submission: cycle.submissionDeadline,
                    decision: cycle.decisionDeadline
                  })}
                </span>
              </div>
              {cycle.status === CYCLE_STATUS.CHANGED_AFTER_PUBLISH && (
                <p role='status' className='text-sm text-warning-ink'>
                  {translate('budgetCycle.changedAfterPublish')}
                </p>
              )}
            </>
          )}
        </FinanceQueryState>

        <FinanceSection title={translate('budgetCycle.ceilingsTitle')}>
          <FinanceQueryState query={packageQuery}>
            {cycle && budgetPackage && (
              <CycleCeilingsEditor
                key={`${cycle.year}-${cycle.allocated.amount}-${cycle.status}`}
                cycle={cycle}
                departments={budgetPackage.departments}
              />
            )}
          </FinanceQueryState>
        </FinanceSection>

        <FinanceSection title={translate('budgetCycle.packageTitle')}>
          <FinanceQueryState query={packageQuery}>
            {budgetPackage && <CyclePackageSummary budgetPackage={budgetPackage} />}
          </FinanceQueryState>
        </FinanceSection>
      </FinancePage>
    </FinanceDetailPage>
  )
}
