import { useTranslation } from 'react-i18next'
import type { PreviewResponseDtoDataPreview } from '~/shared/api/generated/model'
import { EmployeeStatus } from '../../shared/components/employee-api-ui'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeMoney } from '../../shared/components/employee-money'

export function LiveRequestPreview({ preview }: { preview: PreviewResponseDtoDataPreview }) {
  const { t: translate } = useTranslation('employee')
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
      <p className='text-sm text-muted-foreground'>
        {translate('termLimit', {
          months: preview.termLimit.maxMonths,
          date: preview.termLimit.endsBy ? formatDate(preview.termLimit.endsBy) : '?'
        })}
      </p>
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
