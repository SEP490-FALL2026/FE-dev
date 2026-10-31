import { useTranslation } from 'react-i18next'
import { useMeDepartureNoticeGet } from '~/shared/api/generated/operations/me/me-departure-notice-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState, EmployeeSection, EmployeeStatus } from '../../shared/components/employee-api-ui'

export function EmployeeDepartureNotice() {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const query = useMeDepartureNoticeGet()
  const notice = !query.isError ? query.data?.data : undefined
  return (
    <EmployeeSection title={translate('departure')}>
      <EmployeeQueryState query={query} empty={!notice} />
      {notice && (
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <EmployeeStatus value={notice.state} />
          <p className='text-right font-mono text-sm tabular-nums'>
            {translate('lastWorkingDay')}: {formatDate(notice.lastWorkingDay)}
          </p>
        </div>
      )}
    </EmployeeSection>
  )
}
