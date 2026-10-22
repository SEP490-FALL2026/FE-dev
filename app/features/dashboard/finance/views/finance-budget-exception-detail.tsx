import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InfoRow, Notice, PageHeader, Panel, PanelTitle, Pill, useDashboardFormat } from '../../dashboard-ui'
import { budgetChecks, type BudgetException } from '../annual-budget-data'
import { costCenters } from '../finance-data'
import { checkResultTones } from './finance-budget-check-view'
import { FinanceBudgetExceptionForm } from './finance-budget-exception-form'

/** FIN-44 detail: what failed the automatic check, and how Finance handles it (or handled it). */
export function FinanceBudgetExceptionDetail({
  formatCurrency,
  item,
  onBack
}: {
  formatCurrency: (value: number) => string
  item: BudgetException
  onBack: () => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [justResolved, setJustResolved] = useState(false)
  const check = budgetChecks.find((entry) => entry.id === item.checkId)
  const costCenter = costCenters.find((entry) => entry.code === item.costCenter)
  const resolution = item.resolution

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('budgetPlan.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-2'>
            <Pill tone={checkResultTones[item.kind]}>{t(`budgetPlan.check.result.${item.kind}`)}</Pill>
            <Pill tone={resolution ? 'success' : 'warning'}>
              {t(resolution ? 'budgetPlan.exceptions.state.resolved' : 'budgetPlan.exceptions.state.open')}
            </Pill>
          </span>
        }
        subtitle={`${item.requestCode} · ${item.costCenter}`}
        title={item.software}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle title={t('budgetPlan.exceptions.factsTitle')} />
            <p className='mt-3 rounded-xl border border-border bg-background p-3 text-xs'>{item.detail}</p>
            <div className='mt-3 divide-y divide-border'>
              <InfoRow
                label={t('budget.costCenter')}
                value={
                  <span className='inline-flex flex-wrap items-center justify-end gap-1.5'>
                    <span className='font-mono'>{item.costCenter}</span>
                    {costCenter?.status === 'RETIRED' && (
                      <Pill tone='warning'>{t('budgetPlan.exceptions.retired')}</Pill>
                    )}
                    {costCenter?.replacedBy && (
                      <span className='text-muted-foreground'>
                        {t('budgetPlan.exceptions.replacedBy', { code: costCenter.replacedBy })}
                      </span>
                    )}
                  </span>
                }
              />
              <InfoRow label={t('budgetPlan.exceptions.manager')} value={item.manager} />
              <InfoRow label={t('budgetPlan.exceptions.amount')} value={formatCurrency(item.amount)} />
              <InfoRow label={t('budgetPlan.exceptions.raisedAt')} value={formatDate(item.raisedAt)} />
            </div>
          </Panel>

          {check && (
            <Panel>
              <PanelTitle title={t('budgetPlan.exceptions.checkTitle')} />
              <div className='mt-3 divide-y divide-border'>
                <InfoRow
                  label={t('budgetPlan.check.colResult')}
                  value={
                    <Pill tone={checkResultTones[check.result]}>{t(`budgetPlan.check.result.${check.result}`)}</Pill>
                  }
                />
                <InfoRow label={t('budgetPlan.check.colRequester')} value={check.requester} />
                <InfoRow
                  label={t('budgetPlan.exceptions.remainingBefore')}
                  value={check.remainingBefore === null ? '—' : formatCurrency(check.remainingBefore)}
                />
                <InfoRow label={t('budgetPlan.exceptions.checkedAt')} value={formatDate(check.checkedAt)} />
              </div>
            </Panel>
          )}
        </div>

        <Panel className='h-fit'>
          <PanelTitle hint={t('budgetPlan.exceptions.decisionHint')} title={t('budgetPlan.exceptions.decisionTitle')} />
          <div className='mt-4 space-y-3'>
            {justResolved && (
              <div role='status'>
                <Notice icon={CheckCircle2} tone='success'>
                  {t('budgetPlan.exceptions.success', { code: item.requestCode })}
                </Notice>
              </div>
            )}
            {resolution ? (
              <Notice icon={CheckCircle2} tone='info'>
                <p className='font-bold'>
                  {t('budgetPlan.exceptions.resolvedTitle', {
                    action: t(`budgetPlan.exceptions.action.${resolution.action}`)
                  })}
                </p>
                <p className='mt-1'>{t('budgetPlan.exceptions.resolvedAt', { time: formatDate(resolution.at) })}</p>
                {resolution.targetCostCenter && (
                  <p className='mt-1'>
                    {t('budgetPlan.exceptions.resolvedTarget', { code: resolution.targetCostCenter })}
                  </p>
                )}
                {resolution.topUp !== undefined && (
                  <p className='mt-1'>
                    {t('budgetPlan.exceptions.resolvedTopUp', { amount: formatCurrency(resolution.topUp) })}
                  </p>
                )}
                <p className='mt-1 italic'>{resolution.note}</p>
              </Notice>
            ) : (
              <FinanceBudgetExceptionForm
                item={item}
                onResolved={() => setJustResolved(true)}
                suggestedTopUp={
                  check && check.remainingBefore !== null
                    ? Math.max(item.amount - check.remainingBefore, 0)
                    : item.amount
                }
              />
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
