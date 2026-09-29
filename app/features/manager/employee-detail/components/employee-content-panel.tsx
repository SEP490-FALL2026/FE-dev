import { useTranslation } from 'react-i18next'

import { employeeDetailDemo, type DetailTab } from '../employee-detail-demo'
import { AssignedSoftware } from './assigned-software'
import { EmployeeActivity } from './employee-activity'
import { EmployeeRequest } from './employee-request'
import { UsageSummary } from './usage-summary'

export function EmployeeContentPanel({
  selected,
  detailed,
  onTab
}: {
  selected: DetailTab
  detailed: boolean
  onTab: (tab: DetailTab) => void
}) {
  const { t, i18n } = useTranslation()
  return (
    <div
      id='employee-detail-panel'
      role='tabpanel'
      aria-labelledby={`employee-tab-${selected}`}
      tabIndex={0}
      className='space-y-6'
    >
      {!detailed ? (
        <section className='rounded-xl border border-neutral-200 bg-white p-6'>
          <h2 className='text-base font-semibold'>{t('employeeDetail.missing')}</h2>
          <p className='mt-2 text-sm text-neutral-500'>{t('employeeDetail.missingDescription')}</p>
        </section>
      ) : selected === 'assigned' ? (
        <>
          <AssignedSoftware onUsage={() => onTab('usage')} />
          <UsageSummary onUsage={() => onTab('usage')} />
        </>
      ) : selected === 'usage' ? (
        <UsageSummary full />
      ) : selected === 'requests' ? (
        <section className='space-y-4 rounded-xl border border-neutral-200 bg-white p-6'>
          <h2 className='text-base font-semibold'>{t('employeeDetail.requests')}</h2>
          <EmployeeRequest />
          <p className='text-xs text-neutral-500'>
            {t('employeeDetail.requestsSample', { count: 1, total: employeeDetailDemo.totalRequests })}
          </p>
        </section>
      ) : selected === 'history' ? (
        <section className='rounded-xl border border-neutral-200 bg-white p-6'>
          <h2 className='mb-4 text-base font-semibold'>{t('employeeDetail.history')}</h2>
          <EmployeeActivity />
        </section>
      ) : (
        <section className='rounded-xl border border-neutral-200 bg-white p-6'>
          <h2 className='mb-4 text-base font-semibold'>{t('employeeDetail.accessReview')}</h2>
          <p className='text-sm font-medium text-success'>{t('employeeDetail.reviewActivity')}</p>
          <p className='mt-2 text-sm text-neutral-500'>
            {t('employeeDetail.reviewDate', {
              date: new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' }).format(
                new Date(`${employeeDetailDemo.reviewDate}T00:00:00Z`)
              )
            })}
          </p>
          <p className='mt-3 text-xs text-neutral-500'>{t('employeeDetail.reviewSample')}</p>
        </section>
      )}
    </div>
  )
}
