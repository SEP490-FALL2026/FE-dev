import { AlertTriangle, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { spendApprovalGet } from '~/shared/api/generated/operations/spend-approvals/spend-approval-get'
import {
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { SPEND_ROUTING_MODE } from '../enums/spend-routing-mode'
import { useDashboardFormat } from '../../../dashboard-ui'

export type SpendApproval = NonNullable<Awaited<ReturnType<typeof spendApprovalGet>>['data']>['spendApproval']

const noticeClass = 'flex items-start gap-2 rounded-lg border px-4 py-3 text-sm'

function FactList({ facts }: { facts: { label: string; value: string; numeric?: boolean }[] }) {
  return (
    <>
      {facts.map(({ label, value, numeric }) => (
        <div key={label} className='min-w-0'>
          <dt className='text-xs text-muted-foreground'>{label}</dt>
          <dd className={`mt-1 truncate text-sm ${numeric ? 'font-mono tabular-nums' : ''}`} title={value}>
            {value}
          </dd>
        </div>
      ))}
    </>
  )
}

export function SpendRequestFacts({ approval, isGroup }: { approval: SpendApproval; isGroup: boolean }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const { formatDate, formatDateTime, formatNumber } = useDashboardFormat()
  const { request, step, need, cost, assessment, decision, routing, budgetSnapshot, annualVendorAmount } = approval
  const headlineCost = cost?.totalPayable ?? cost?.estimatedCost ?? null
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <ApprovalsStatus value={step.state} />
      </div>
      {step.waitingReason && (
        <p role='status' className={`${noticeClass} border-warning/30 bg-warning/10 text-warning-ink`}>
          <Clock aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          {translate(`waitingReason.${step.waitingReason}`, { defaultValue: translate('waitingReason.unknown') })}
        </p>
      )}
      {routing.mode === SPEND_ROUTING_MODE.ONE_STEP && (
        <div className={`${noticeClass} border-warning/30 bg-warning/10 text-warning-ink`}>
          <AlertTriangle aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          <p>
            {translate(`oneStepReason.${routing.oneStepReason ?? 'UNKNOWN'}`, {
              defaultValue: translate('oneStepReason.UNKNOWN')
            })}
          </p>
        </div>
      )}
      {budgetSnapshot?.reserveConfirmation && (
        <div className={`${noticeClass} border-warning/30 bg-warning/10 text-warning-ink`}>
          <AlertTriangle aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          <div className='space-y-1'>
            <p className='font-medium'>
              {translate('reserveConfirmedBy', { name: budgetSnapshot.reserveConfirmation.confirmedBy.fullName })}
            </p>
            <p className='whitespace-pre-wrap'>{budgetSnapshot.reserveConfirmation.reason}</p>
          </div>
        </div>
      )}
      <ApprovalsStatGrid>
        <ApprovalsStat
          label={translate('totalPayable')}
          value={headlineCost ? formatMoney(headlineCost, i18n.language) : translate('unavailable')}
          emphasis
        />
        <ApprovalsStat
          label={translate('term')}
          value={request.termMonths === null ? translate('unavailable') : formatNumber(request.termMonths)}
        />
        {annualVendorAmount && (
          <ApprovalsStat
            label={translate('annualVendorAmount')}
            value={formatMoney(annualVendorAmount, i18n.language)}
          />
        )}
        <ApprovalsStat label={translate('openedAt')} value={formatDate(step.openedAt)} />
        <ApprovalsStat label={translate('sla')} value={formatNumber(step.slaWorkingDays)} />
        <ApprovalsStat label={translate('budgetYear')} value={request.budgetYear ?? translate('unavailable')} />
      </ApprovalsStatGrid>
      <ApprovalsSection title={translate('requestInfo')}>
        <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3'>
          <FactList
            facts={[
              { label: translate('requester'), value: request.requester.fullName },
              {
                label: translate('beneficiary'),
                value: request.beneficiary?.fullName ?? translate(isGroup ? 'group' : 'unavailable')
              },
              { label: translate('costCenter'), value: request.costCenter.code, numeric: true },
              { label: translate('assignee'), value: step.assignee?.fullName ?? translate('unavailable') },
              { label: translate('need'), value: need?.decidedBy.fullName ?? translate('unavailable') }
            ]}
          />
          <div className='min-w-0 sm:col-span-2 lg:col-span-3'>
            <dt className='text-xs text-muted-foreground'>{translate('reason')}</dt>
            <dd className='mt-1 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</dd>
          </div>
        </dl>
      </ApprovalsSection>
      {cost && (
        <ApprovalsSection title={translate('costs')} actions={<ApprovalsStatus value={cost.label} />}>
          <dl className='grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3'>
            {(['preTax', 'tax', 'deductibleTax', 'nonDeductibleTax', 'estimatedCost', 'totalPayable'] as const).map(
              (key) => (
                <ApprovalsStat
                  key={key}
                  label={translate(key === 'estimatedCost' ? 'amount' : key)}
                  value={formatMoney(cost[key], i18n.language)}
                />
              )
            )}
          </dl>
        </ApprovalsSection>
      )}
      {assessment && (
        <ApprovalsSection title={translate('assessment')}>
          <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('classification')}</dt>
              <dd className='mt-1'>
                <ApprovalsStatus value={assessment.classification} />
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('controlLevel')}</dt>
              <dd className='mt-1'>
                <ApprovalsStatus value={assessment.controlLevel} />
              </dd>
            </div>
            <FactList
              facts={[
                {
                  label: translate('controlRisk'),
                  value: assessment.controlRiskNote ?? translate('unavailable')
                },
                { label: translate('sensitivity'), value: assessment.dataSensitivity ?? translate('unavailable') },
                {
                  label: translate('equivalent'),
                  value: assessment.equivalentTool?.planName ?? translate('unavailable')
                }
              ]}
            />
          </dl>
        </ApprovalsSection>
      )}
      {decision && (
        <ApprovalsSection title={translate('savedDecision')} actions={<ApprovalsStatus value={decision.decision} />}>
          <div className='space-y-2 rounded-lg border border-border/70 bg-surface p-4'>
            <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
              <span>{decision.decidedBy.fullName}</span>
              <span className='font-mono text-xs text-muted-foreground tabular-nums'>
                {formatDateTime(decision.decidedAt)}
              </span>
            </div>
            {decision.reason && <p className='text-sm whitespace-pre-wrap'>{decision.reason}</p>}
          </div>
        </ApprovalsSection>
      )}
    </div>
  )
}
