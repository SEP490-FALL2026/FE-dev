import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RemainingValue } from '../../budget-figures'
import { InfoRow, Panel, PanelTitle, Pill } from '../../dashboard-ui'
import { activeFiscalYear, type BudgetCheckResult } from '../../finance/annual-budget-data'
import { budgetCheckTones, budgetPosition } from '../approval-budget-check'

interface ApprovalBudgetCheckPanelProps {
  amount: number
  costCenter: string
  formatCurrency: (value: number) => string
  result: BudgetCheckResult
}

/** APV-02: budget check of a SaaS spend item against the approved annual budget of its Cost Center. */
export function ApprovalBudgetCheckPanel({
  amount,
  costCenter,
  formatCurrency,
  result
}: ApprovalBudgetCheckPanelProps) {
  const { t } = useTranslation('dashboard')
  const position = budgetPosition(costCenter, amount)
  const title = t('budgetPlan.approverSpend.check.title')

  return (
    <section aria-label={title}>
      <Panel>
        <PanelTitle
          hint={t('budgetPlan.approverSpend.check.hint', { costCenter, year: activeFiscalYear })}
          title={title}
        />
        <div className='mt-3'>
          <InfoRow
            label={t('budgetPlan.approverSpend.check.result')}
            value={<Pill tone={budgetCheckTones[result]}>{t(`budgetPlan.approverSpend.result.${result}`)}</Pill>}
          />
          <InfoRow
            label={t('budgetPlan.approverSpend.check.approved')}
            value={
              position.approved === null ? (
                <Pill tone='warning'>{t('budget.noBudget')}</Pill>
              ) : (
                formatCurrency(position.approved)
              )
            }
          />
          <InfoRow label={t('budgetPlan.approverSpend.check.used')} value={formatCurrency(position.used)} />
          <InfoRow label={t('budgetPlan.approverSpend.check.committed')} value={formatCurrency(position.committed)} />
          <InfoRow
            label={t('budgetPlan.approverSpend.check.before')}
            value={<RemainingValue formatCurrency={formatCurrency} remaining={position.before} />}
          />
          <InfoRow label={t('budgetPlan.approverSpend.check.amount')} value={formatCurrency(amount)} />
          <InfoRow
            label={t('budgetPlan.approverSpend.check.after')}
            value={<RemainingValue formatCurrency={formatCurrency} remaining={position.after} />}
          />
        </div>
        <p className='mt-3 flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
          <Info aria-hidden='true' className='mt-px size-3.5 shrink-0' />
          {t('budgetPlan.approverSpend.check.rule')}
        </p>
      </Panel>
    </section>
  )
}
