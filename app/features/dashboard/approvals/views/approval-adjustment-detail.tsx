import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { InfoRow, Notice, PageHeader, Panel, PanelTitle, Pill, useDashboardFormat } from '../../dashboard-ui'
import type { BudgetAdjustment } from '../../finance/annual-budget-data'
import { decideBudgetAdjustment } from '../../finance/annual-budget-store'
import { ApprovalDecisionPanel, approvalStatusOf, approvalStatusTones } from './approval-exception-detail'

/**
 * APV-07 adjustment detail: Finance asks to change an approved annual budget; the approver approves or rejects with
 * a reason. Approving records the decision only — the approved figure on Finance's allocation screen is demo data.
 */
export function ApprovalAdjustmentDetail({
  adjustment,
  formatCurrency,
  onBack
}: {
  adjustment: BudgetAdjustment
  formatCurrency: (value: number) => string
  onBack: () => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const status = approvalStatusOf(adjustment.approval)
  const difference = adjustment.after - adjustment.before

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('budgetPlan.approverExceptions.backToList')}
      </button>

      <PageHeader
        actions={<Pill tone={approvalStatusTones[status]}>{t(`budgetPlan.approverExceptions.status.${status}`)}</Pill>}
        subtitle={t('budgetPlan.approverExceptions.adjustment.subtitle', {
          costCenter: adjustment.costCenter,
          year: adjustment.year
        })}
        title={t('budgetPlan.approverExceptions.adjustment.title', { costCenter: adjustment.costCenter })}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle title={t('budgetPlan.approverExceptions.adjustment.changeTitle')} />
          <p className='mt-4 flex flex-wrap items-center gap-2 text-lg font-extrabold text-foreground'>
            <span className='text-muted-foreground line-through'>{formatCurrency(adjustment.before)}</span>
            <ArrowRight aria-hidden='true' className='size-4 text-muted-foreground' />
            <span>{formatCurrency(adjustment.after)}</span>
          </p>
          <div className='mt-3 divide-y divide-border'>
            <InfoRow label={t('budgetPlan.approverExceptions.adjustment.costCenter')} value={adjustment.costCenter} />
            <InfoRow
              label={t('budgetPlan.approverExceptions.adjustment.before')}
              value={formatCurrency(adjustment.before)}
            />
            <InfoRow
              label={t('budgetPlan.approverExceptions.adjustment.after')}
              value={formatCurrency(adjustment.after)}
            />
            <InfoRow
              label={t('budgetPlan.approverExceptions.adjustment.difference')}
              value={
                <span className={difference > 0 ? 'text-warning' : 'text-success'}>
                  {difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference)}
                </span>
              }
            />
            <InfoRow label={t('budgetPlan.approverExceptions.adjustment.requestedBy')} value={adjustment.requestedBy} />
            <InfoRow
              label={t('budgetPlan.approverExceptions.adjustment.requestedAt')}
              value={formatDate(adjustment.requestedAt)}
            />
          </div>
          <div className='mt-3 space-y-1 text-xs'>
            <p className='font-bold text-foreground'>{t('budgetPlan.approverExceptions.adjustment.reason')}</p>
            <p className='text-muted-foreground'>{adjustment.reason}</p>
          </div>
        </Panel>

        <div className='space-y-6'>
          <Notice icon={Info} tone='info'>
            {t('budgetPlan.approverExceptions.adjustment.demoNote')}
          </Notice>
          <ApprovalDecisionPanel
            approval={adjustment.approval}
            idPrefix={`adjustment-${adjustment.id}`}
            onDecide={(approved, reason) => decideBudgetAdjustment(adjustment.id, approved, reason)}
          />
        </div>
      </div>
    </div>
  )
}
