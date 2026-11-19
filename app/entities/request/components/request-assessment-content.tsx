import { useTranslation } from 'react-i18next'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ASSESSMENT_STATUS } from '../enums/assessment-status'
import { AssessmentFinancials } from './assessment-financials'
export function RequestAssessmentContent({ assessment }: { assessment: AssessmentResponseDtoDataAssessment }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime, formatNumber } = useWorkspaceFormat()
  const label = (value: string | null | undefined) =>
    value
      ? translate(`assessment.values.${value}` as 'assessment.values.DRAFT', {
          defaultValue: translate('unknownStatus')
        })
      : translate('assessment.notRecorded')
  const booleanLabel = (value: boolean | null) =>
    translate(value === null ? 'assessment.notRecorded' : value ? 'assessment.yes' : 'assessment.no')
  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <span
          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${assessment.status === ASSESSMENT_STATUS.COMPLETED ? 'bg-success/10 text-success' : assessment.status === ASSESSMENT_STATUS.REJECTED ? 'bg-danger/10 text-danger' : 'bg-surface-subtle text-muted-foreground'}`}
        >
          <span aria-hidden className='size-1.5 rounded-full bg-current' />
          {label(assessment.status)}
        </span>
        {assessment.completedAt && (
          <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
            {formatDateTime(assessment.completedAt)}
          </p>
        )}
      </div>
      <p className='text-sm leading-relaxed text-muted-foreground'>{translate('assessment.readOnlyHint')}</p>
      <dl className='grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3'>
        {[
          [
            'reviewer',
            assessment.completedBy?.fullName ??
              assessment.step?.assignee?.fullName ??
              translate('assessment.notAssigned')
          ],
          ['step', label(assessment.step?.state)],
          ['classification', label(assessment.classification)],
          ['controlLevel', label(assessment.controlLevel)],
          ['sensitivity', label(assessment.dataSensitivity)],
          ['vendor', assessment.vendor.name ?? translate('assessment.notRecorded')],
          ['plannedPlan', assessment.plannedPlanName ?? translate('assessment.notRecorded')],
          ['expectedUsers', formatNumber(assessment.proposal.expectedUsers)],
          ['adminConsole', booleanLabel(assessment.adminConsole)],
          ['memberExport', booleanLabel(assessment.memberExport)],
          ['sso', booleanLabel(assessment.sso)]
        ].map(([key, value]) => (
          <div key={key}>
            <dt className='text-xs text-muted-foreground'>
              {translate(`assessment.fields.${key}` as 'assessment.fields.reviewer')}
            </dt>
            <dd className='mt-1 whitespace-pre-wrap break-words leading-relaxed'>{value}</dd>
          </div>
        ))}
      </dl>
      <dl className='space-y-4 border-t border-border/60 pt-5 text-sm'>
        {[
          ['purpose', assessment.proposal.purpose],
          ['dataDescription', assessment.proposal.dataDescription],
          ['terms', assessment.termsSummary],
          ['usageMethod', assessment.memberUsageMethod],
          ['grantMethod', assessment.grantRevokeMethod],
          ['riskNote', assessment.controlRiskNote],
          [
            'opinion',
            assessment.opinion
              ? [label(assessment.opinion.status), assessment.opinion.note].filter(Boolean).join(' · ')
              : null
          ],
          [
            'equivalent',
            assessment.equivalentTool
              ? `${assessment.equivalentTool.applicationName} · ${assessment.equivalentTool.planName}`
              : null
          ]
        ]
          .filter(([, value]) => !!value)
          .map(([key, value]) => (
            <div key={key}>
              <dt className='text-xs text-muted-foreground'>
                {translate(`assessment.fields.${key}` as 'assessment.fields.reviewer')}
              </dt>
              <dd className='mt-1 whitespace-pre-wrap break-words leading-relaxed'>{value}</dd>
            </div>
          ))}
      </dl>
      {assessment.rejection && (
        <section className='space-y-3 rounded-md border border-danger/20 bg-danger/5 p-4'>
          <h3 className='text-sm font-semibold'>{translate('assessment.rejected')}</h3>
          <p className='whitespace-pre-wrap break-words text-sm leading-relaxed'>{assessment.rejection.reason}</p>
          <p className='text-xs text-muted-foreground'>{label(assessment.rejection.kind)}</p>
          {assessment.rejection.alternative.plan && (
            <p className='text-sm'>
              {translate('assessment.alternative')}: {assessment.rejection.alternative.plan.applicationName} ·{' '}
              {assessment.rejection.alternative.plan.planName}
            </p>
          )}
          {assessment.rejection.alternative.note && (
            <p className='whitespace-pre-wrap break-words text-sm'>{assessment.rejection.alternative.note}</p>
          )}
          <p className='flex flex-wrap justify-between gap-2 text-xs text-muted-foreground'>
            <span>{assessment.rejection.rejectedBy.fullName}</span>
            <span className='text-right font-mono tabular-nums'>{formatDateTime(assessment.rejection.rejectedAt)}</span>
          </p>
        </section>
      )}
      <AssessmentFinancials assessment={assessment} />
    </>
  )
}
