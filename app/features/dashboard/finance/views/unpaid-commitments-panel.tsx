import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Notice, Panel, PanelTitle, Pill, useDashboardFormat, type Tone } from '../../dashboard-ui'
import { unpaidCommitments, type UnpaidCommitment } from '../annual-budget-data'
import { financeDataAsOf } from '../finance-data'

const stages: readonly UnpaidCommitment['stage'][] = ['NOT_RECORDED', 'RECORDED']
const stageTones: Record<UnpaidCommitment['stage'], Tone> = { NOT_RECORDED: 'warning', RECORDED: 'info' }
const asOfDate = financeDataAsOf.slice(0, 10)

/** Spending approved by the Spending Approver but not yet recorded or paid; it already reduces the remaining budget. */
export function UnpaidCommitmentsPanel({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  const total = unpaidCommitments.reduce((sum, item) => sum + item.amount, 0)
  const byStage = stages.map((stage) => {
    const items = unpaidCommitments.filter((item) => item.stage === stage)
    return { amount: items.reduce((sum, item) => sum + item.amount, 0), count: items.length, stage }
  })

  return (
    <Panel>
      <PanelTitle hint={t('budgetPlan.existing.unpaid.hint')} title={t('budgetPlan.existing.unpaid.title')} />

      <dl aria-label={t('budgetPlan.existing.unpaid.total')} className='mt-4 grid gap-3 sm:grid-cols-3'>
        {byStage.map(({ amount, count, stage }) => (
          <div className='rounded-xl border border-border p-3' key={stage}>
            <dt className='text-xs font-semibold text-muted-foreground'>
              {t(`budgetPlan.existing.unpaid.stage.${stage}`)}
            </dt>
            <dd className='mt-1 text-sm font-bold text-foreground'>{formatCurrency(amount)}</dd>
            <dd className='text-[0.7rem] text-muted-foreground'>{t('budgetPlan.existing.unpaid.count', { count })}</dd>
          </div>
        ))}
        <div className='rounded-xl border border-warning/30 bg-warning/10 p-3'>
          <dt className='text-xs font-semibold text-muted-foreground'>{t('budgetPlan.existing.unpaid.total')}</dt>
          <dd className='mt-1 text-sm font-extrabold text-foreground'>{formatCurrency(total)}</dd>
          <dd className='text-[0.7rem] text-muted-foreground'>
            {t('budgetPlan.existing.unpaid.count', { count: unpaidCommitments.length })}
          </dd>
        </div>
      </dl>

      <div className='mt-4 overflow-x-auto'>
        <table className='w-full min-w-200 text-left text-xs'>
          <thead>
            <tr className='border-b border-border text-muted-foreground'>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.unpaid.colCode')}</th>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.unpaid.colSoftware')}</th>
              <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.unpaid.colApproved')}</th>
              <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.existing.unpaid.colAmount')}</th>
              <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.existing.unpaid.colStage')}</th>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.unpaid.colPayment')}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {unpaidCommitments.map((item) => {
              const isOverdue = item.expectedPaymentAt < asOfDate

              return (
                <tr key={item.code}>
                  <td className='py-3 font-mono font-bold text-primary'>{item.code}</td>
                  <td className='py-3 font-semibold text-foreground'>{item.software}</td>
                  <td className='py-3 font-mono'>{item.costCenter}</td>
                  <td className='py-3 text-muted-foreground'>{formatDate(item.approvedAt)}</td>
                  <td className='py-3 text-right font-bold'>{formatCurrency(item.amount)}</td>
                  <td className='py-3 pl-6'>
                    <Pill tone={stageTones[item.stage]}>{t(`budgetPlan.existing.unpaid.stage.${item.stage}`)}</Pill>
                  </td>
                  <td className={`py-3 ${isOverdue ? 'font-bold text-danger' : 'text-muted-foreground'}`}>
                    {formatDate(item.expectedPaymentAt)}
                    {isOverdue && (
                      <span className='ml-2'>
                        <Pill tone='danger'>{t('budgetPlan.existing.unpaid.overdue')}</Pill>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='mt-4'>
        <Notice icon={Info} tone='info'>
          {t('budgetPlan.existing.unpaid.note')}
        </Notice>
      </div>
    </Panel>
  )
}
