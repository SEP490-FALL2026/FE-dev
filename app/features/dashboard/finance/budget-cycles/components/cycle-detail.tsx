import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useBudgetCycleBaseline,
  useBudgetCycleGet,
  useBudgetCyclePackage
} from '~/shared/api/generated/operations/budget-cycles'
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
import { CYCLE_STATUS, canEditCycle, canOpenCycle, isCycleStatus } from '../enums/cycle-status'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { CycleBaseline } from './cycle-baseline'
import { CycleEditDialog } from './cycle-edit-dialog'
import { CyclePackageSummary } from './cycle-package-summary'

export function CycleDetail({ year, onBack }: { year: number; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const cycleQuery = useBudgetCycleGet(year)
  const packageQuery = useBudgetCyclePackage(year)
  const baselineQuery = useBudgetCycleBaseline(year)
  const baseline = baselineQuery.data?.data
  const { open, remove, buildFromBaseline } = useBudgetCycleActions(year)
  const [buildingDepartmentId, setBuildingDepartmentId] = useState<string>()
  const cycle = cycleQuery.data?.data
  const budgetPackage = packageQuery.data?.data
  const openable = Boolean(cycle && isCycleStatus(cycle.status) && canOpenCycle(cycle.status))
  const editable = Boolean(cycle && isCycleStatus(cycle.status) && canEditCycle(cycle.status))
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState<'open' | 'delete'>()

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
            {editable && (
              <FinanceButton onClick={() => setEditing(true)}>{translate('budgetCycle.edit')}</FinanceButton>
            )}
            {openable && (
              <FinanceButton variant='ghost' pending={remove.isPending} onClick={() => setConfirming('delete')}>
                {translate('budgetCycle.delete')}
              </FinanceButton>
            )}
            {openable && (
              <FinanceButton variant='primary' pending={open.isPending} onClick={() => setConfirming('open')}>
                {translate('budgetCycle.open')}
              </FinanceButton>
            )}
          </>
        }
      >
        <FinanceQueryState query={cycleQuery}>
          {cycle && (
            <>
              <FinanceStatGrid columns={3}>
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
                  label={translate('budgetCycle.available')}
                  value={formatMoney(cycle.available, i18n.language)}
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
              {cycle.openedAt && (
                <p className='text-sm text-muted-foreground'>
                  {translate('budgetCycle.openedAt', { time: new Date(cycle.openedAt).toLocaleString(i18n.language) })}
                </p>
              )}
              {cycle.priorities && (
                <div className='rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-sm'>
                  <div className='text-xs font-medium text-muted-foreground'>{translate('budgetCycle.priorities')}</div>
                  <p className='mt-1 break-words whitespace-pre-line [text-wrap:pretty]'>{cycle.priorities}</p>
                </div>
              )}
              {cycle.status === CYCLE_STATUS.DRAFT && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translate('budgetCycle.draftHint')}
                </p>
              )}
              {cycle.status === CYCLE_STATUS.LOCKED && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translate('budgetCycle.lockedHint')}
                </p>
              )}
            </>
          )}
        </FinanceQueryState>

        <FinanceSection title={translate('budgetCycle.packageTitle')}>
          <FinanceQueryState query={packageQuery}>
            {budgetPackage && (
              <CyclePackageSummary
                budgetPackage={budgetPackage}
                buildingDepartmentId={buildingDepartmentId}
                onBuildFromBaseline={(departmentId) => {
                  // The baseline carries the Cost Center of each department; without one the version cannot be built.
                  const costCenterId = baseline?.departments.find(
                    (item) => item.departmentId === departmentId
                  )?.costCenterId
                  if (!costCenterId) return
                  setBuildingDepartmentId(departmentId)
                  buildFromBaseline.mutate(
                    { data: { source: 'BASELINE', costCenterId, year } },
                    { onSettled: () => setBuildingDepartmentId(undefined) }
                  )
                }}
              />
            )}
          </FinanceQueryState>
        </FinanceSection>

        {confirming && (
          <AdminFormDialog
            title={translate(confirming === 'open' ? 'budgetCycle.open' : 'budgetCycle.delete')}
            pending={confirming === 'open' ? open.isPending : remove.isPending}
            submitLabel={translate(confirming === 'open' ? 'budgetCycle.open' : 'budgetCycle.delete')}
            onClose={() => setConfirming(undefined)}
            onSubmit={(event) => {
              event.preventDefault()
              if (confirming === 'open') open.mutate({ year }, { onSuccess: () => setConfirming(undefined) })
              else remove.mutate({ year }, { onSuccess: onBack })
            }}
          >
            <p className='text-sm'>
              {translate(confirming === 'open' ? 'budgetCycle.openConfirm' : 'budgetCycle.deleteConfirm', { year })}
            </p>
          </AdminFormDialog>
        )}

        {editing && cycle && editable && <CycleEditDialog cycle={cycle} onClose={() => setEditing(false)} />}

        <FinanceSection title={translate('budgetCycle.baselineTitle')}>
          <FinanceQueryState query={baselineQuery}>
            {baseline && <CycleBaseline baseline={baseline} />}
          </FinanceQueryState>
        </FinanceSection>
      </FinancePage>
    </FinanceDetailPage>
  )
}
