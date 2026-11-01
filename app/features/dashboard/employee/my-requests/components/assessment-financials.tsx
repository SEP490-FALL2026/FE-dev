import { useTranslation } from 'react-i18next'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { EmployeeMoney } from '../../shared/components/employee-money'
import { useDashboardFormat } from '../../../dashboard-ui'

export function AssessmentFinancials({ assessment }: { assessment: AssessmentResponseDtoDataAssessment }) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const label = (value: string | null) =>
    value
      ? translate(`assessment.values.${value}` as 'assessment.values.DRAFT', {
          defaultValue: translate('unknownStatus')
        })
      : translate('assessment.notRecorded')
  return (
    <div className='space-y-4 border-t border-border/60 pt-5'>
      <h3 className='text-sm font-semibold'>{translate('assessment.financials')}</h3>
      <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
        <span className='text-muted-foreground'>{translate('assessment.pricing')}</span>
        <span>{label(assessment.pricing.status)}</span>
      </div>
      {assessment.pricing.missingReason && (
        <p className='text-sm text-muted-foreground'>{label(assessment.pricing.missingReason)}</p>
      )}
      {assessment.quote && (
        <dl className='grid gap-4 rounded-md bg-surface-subtle p-4 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('assessment.unitPrice')}</dt>
            <dd className='mt-2 text-right'>
              <EmployeeMoney value={assessment.quote.unitPrice} />
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('assessment.billingCycle')}</dt>
            <dd className='mt-2'>{label(assessment.quote.billingCycle)}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('assessment.quoteFrom')}</dt>
            <dd className='mt-2 text-right font-mono tabular-nums'>{formatDate(assessment.quote.validFrom)}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('assessment.quoteUntil')}</dt>
            <dd className='mt-2 text-right font-mono tabular-nums'>
              {assessment.quote.validUntil
                ? formatDate(assessment.quote.validUntil)
                : translate('assessment.notRecorded')}
            </dd>
          </div>
        </dl>
      )}
      {assessment.costEstimate && (
        <dl className='grid gap-4 text-sm sm:grid-cols-2'>
          <div>
            <dt className='text-muted-foreground'>{translate('estimatedCost')}</dt>
            <dd className='mt-2 text-right'>
              <EmployeeMoney value={assessment.costEstimate.estimatedCost} />
            </dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>{translate('assessment.totalPayable')}</dt>
            <dd className='mt-2 text-right'>
              <EmployeeMoney value={assessment.costEstimate.totalPayable} />
            </dd>
          </div>
        </dl>
      )}
      <p className='text-xs leading-relaxed text-muted-foreground'>{translate('assessment.estimateHint')}</p>
    </div>
  )
}
