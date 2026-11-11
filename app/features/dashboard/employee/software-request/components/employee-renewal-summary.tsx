import { useTranslation } from 'react-i18next'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { useDashboardFormat } from '../../../dashboard-ui'

export function EmployeeRenewalSummary({
  assignment,
  failure
}: {
  assignment: MySoftwarePageResponseDtoDataItemsItem
  failure: { opensOn?: string; previousEndDate?: string; maxEndDate?: string } | null
}) {
  const { t } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  return (
    <section aria-label={t('requestUx.selectedAccess')} className='space-y-3 border-y border-border/60 py-4'>
      <p className='break-words text-sm font-medium'>
        {assignment.application.name} · {assignment.plan.name}
      </p>
      <dl className='grid gap-2 text-sm sm:grid-cols-2'>
        <dt className='text-muted-foreground'>{t('requestUx.currentEnd')}</dt>
        <dd className='font-mono tabular-nums sm:text-right'>
          {assignment.expectedEndDate ? formatDate(assignment.expectedEndDate) : t('requestAssignment.noEnd')}
        </dd>
      </dl>
      {failure?.opensOn && (
        <p role='status' className='text-sm text-warning-ink'>
          {t('requestUx.renewalOpens', { date: formatDate(failure.opensOn) })}
        </p>
      )}
      {failure?.previousEndDate && failure.maxEndDate && (
        <p role='status' className='text-sm text-warning-ink'>
          {t('requestUx.renewalRange', {
            previous: formatDate(failure.previousEndDate),
            max: formatDate(failure.maxEndDate)
          })}
        </p>
      )}
    </section>
  )
}
