import { useTranslation } from 'react-i18next'
import type { spendApprovalGet } from '~/shared/api/generated/operations/spend-approvals/spend-approval-get'
import { ApprovalsStatus } from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { useDashboardFormat } from '../../../dashboard-ui'

export type SpendApproval = NonNullable<Awaited<ReturnType<typeof spendApprovalGet>>['data']>['spendApproval']

export function SpendRequestFacts({ approval, isGroup }: { approval: SpendApproval; isGroup: boolean }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const { formatDate, formatNumber } = useDashboardFormat()
  const { request, step, need, cost, assessment, decision } = approval
  const facts = [
    { label: translate('requester'), value: request.requester.fullName },
    {
      label: translate('beneficiary'),
      value: request.beneficiary?.fullName ?? translate(isGroup ? 'group' : 'unavailable')
    },
    { label: translate('costCenter'), value: request.costCenter.code },
    { label: translate('assignee'), value: step.assignee?.fullName ?? translate('unavailable') },
    { label: translate('term'), value: formatNumber(request.termMonths), numeric: true },
    {
      label: translate('expectedSpend'),
      value: request.expectedSpendOn ? formatDate(request.expectedSpendOn) : translate('unavailable'),
      numeric: true
    },
    { label: translate('need'), value: need?.decidedBy.fullName ?? translate('unavailable') }
  ]
  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap items-center gap-3'>
        <ApprovalsStatus value={step.state} />
        {request.offPlan && <span className='text-sm text-muted-foreground'>{translate('offPlan')}</span>}
      </div>
      <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
        {facts.map(({ label, value, numeric }) => (
          <div key={label}>
            <dt className='text-xs text-muted-foreground'>{label}</dt>
            <dd className={`truncate text-sm ${numeric ? 'text-right font-mono tabular-nums' : ''}`} title={value}>
              {value}
            </dd>
          </div>
        ))}
        <div className='sm:col-span-2'>
          <dt className='text-xs text-muted-foreground'>{translate('reason')}</dt>
          <dd className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</dd>
        </div>
      </dl>
      {(step.samePersonAsSpend || step.noIndependentReview) && (
        <div className='space-y-1 border-l-2 border-warning pl-3 text-sm text-muted-foreground'>
          {step.samePersonAsSpend && <p>{translate('samePerson')}</p>}
          {step.noIndependentReview && <p>{translate('noReview')}</p>}
        </div>
      )}
      {cost && (
        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>{translate('costs')}</h2>
          <ApprovalsStatus value={cost.label} />
          <dl className='grid gap-4 sm:grid-cols-2'>
            {(['preTax', 'tax', 'deductibleTax', 'nonDeductibleTax', 'estimatedCost', 'totalPayable'] as const).map(
              (key) => (
                <div key={key}>
                  <dt className='text-sm text-muted-foreground'>
                    {translate(key === 'estimatedCost' ? 'amount' : key)}
                  </dt>
                  <dd className='text-right font-mono tabular-nums'>{formatMoney(cost[key], i18n.language)}</dd>
                </div>
              )
            )}
          </dl>
        </section>
      )}
      {assessment && (
        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>{translate('assessment')}</h2>
          <dl className='grid gap-4 sm:grid-cols-2'>
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('classification')}</dt>
              <dd>
                <ApprovalsStatus value={assessment.classification} />
              </dd>
            </div>
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('controlLevel')}</dt>
              <dd>
                <ApprovalsStatus value={assessment.controlLevel} />
              </dd>
            </div>
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('controlRisk')}</dt>
              <dd className='text-sm whitespace-pre-wrap'>{assessment.controlRiskNote ?? translate('unavailable')}</dd>
            </div>
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('sensitivity')}</dt>
              <dd className='text-sm'>{assessment.dataSensitivity ?? translate('unavailable')}</dd>
            </div>
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('equivalent')}</dt>
              <dd className='truncate text-sm' title={assessment.equivalentTool?.planName}>
                {assessment.equivalentTool?.planName ?? translate('unavailable')}
              </dd>
            </div>
          </dl>
        </section>
      )}
      {decision && (
        <section className='space-y-3 rounded-lg border border-border bg-surface p-4'>
          <h2 className='text-lg font-semibold'>{translate('savedDecision')}</h2>
          <ApprovalsStatus value={decision.decision} />
          <p className='text-sm'>{decision.decidedBy.fullName}</p>
          <p className='text-right font-mono text-xs tabular-nums'>
            {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
              new Date(decision.decidedAt)
            )}
          </p>
          {decision.reason && <p className='text-sm whitespace-pre-wrap'>{decision.reason}</p>}
          {decision.overrideReason && <p className='text-sm whitespace-pre-wrap'>{decision.overrideReason}</p>}
        </section>
      )}
    </div>
  )
}
