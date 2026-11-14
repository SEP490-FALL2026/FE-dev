import { useTranslation } from 'react-i18next'
import type { PreviewResponseDtoDataPreview } from '~/shared/api/generated/model'
import { EmployeeStatus } from '../../shared/components/employee-api-ui'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeMoney } from '../../shared/components/employee-money'
import { Link } from 'react-router'
import { REQUEST_LIMIT_EXEMPTION } from '~/entities/request/enums/request-limit-exemption'

export function LiveRequestPreview({ preview }: { preview: PreviewResponseDtoDataPreview }) {
  const { t: translate } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const { formatDate } = useDashboardFormat()
  return (
    <div className='space-y-4'>
      <p className='truncate' title={preview.plan.applicationName}>
        {preview.plan.applicationName} · {preview.plan.planName}
      </p>
      <div className='flex flex-wrap justify-between gap-3'>
        <span className='text-sm text-muted-foreground'>{translate('estimatedCost')}</span>
        <EmployeeMoney value={preview.costEstimate?.estimatedCost ?? preview.pricing.amount} />
      </div>
      <p className='text-sm text-muted-foreground'>{flow('maxEndDate', { date: formatDate(preview.maxEndDate) })}</p>
      <p className='text-sm text-muted-foreground'>
        {flow('limits', {
          open: preview.limits.openNewCount,
          max: preview.limits.openNewMax,
          paid: preview.limits.paidSoftwareCount
        })}
      </p>
      {preview.limitExemption === REQUEST_LIMIT_EXEMPTION.TRANSFER_GRACE && (
        <div role='status' className='space-y-1 rounded-md bg-primary-soft p-3 text-sm text-primary-ink'>
          <p className='font-medium'>{flow('personnel.exemption')}</p>
          <p>{flow('personnel.exemptionHint')}</p>
        </div>
      )}
      {preview.existingAccess && preview.limitExemption !== REQUEST_LIMIT_EXEMPTION.TRANSFER_GRACE && (
        <p role='status' className='text-sm text-warning'>
          {flow('existingAccess')}
        </p>
      )}
      {preview.limits.refusal && (
        <p role='status' className='text-sm text-warning'>
          {flow(preview.limits.refusal)}
        </p>
      )}
      {preview.limits.openRequestId && (
        <Link
          className='text-sm text-primary-ink underline'
          to={{ search: new URLSearchParams({ tab: 'request-detail', id: preview.limits.openRequestId }).toString() }}
        >
          {flow('openRequest')}
        </Link>
      )}
      {preview.budgetYear !== null && (
        <p className='text-sm text-muted-foreground'>
          {translate('estimatedBudgetYear')}: {preview.budgetYear}
        </p>
      )}
      <ol className='space-y-2'>
        {preview.chain.map((step) => (
          <li key={step.sequence} className='flex flex-wrap items-center justify-between gap-2'>
            <EmployeeStatus value={step.kind} />
            <span className='text-sm'>{step.assignee?.fullName ?? translate('awaitingAssignment')}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
