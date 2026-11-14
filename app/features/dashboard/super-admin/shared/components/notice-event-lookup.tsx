import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentTransferList } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { useLongLeaveList } from '~/shared/api/generated/operations/long-leaves/long-leave-list'
import { useOffboardingCaseList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminInputClass } from './admin-form'
import { AdminEmpty, AdminQueryState } from './admin-query-state'
import { AdminPagination } from './admin-pagination'

export type NoticeEventSource = 'transfers' | 'leaves' | 'offboarding'

/** Only request events for this notice's employee and event kind. */
export function NoticeEventLookup({ employeeId, source }: { employeeId: string; source: NoticeEventSource }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<{ id: string; label: string } | null>(null)
  const params = { employeeId, page, pageSize: 20 }
  const transfers = useDepartmentTransferList(params, { query: { enabled: source === 'transfers' } })
  const leaves = useLongLeaveList(params, { query: { enabled: source === 'leaves' } })
  const offboarding = useOffboardingCaseList(params, { query: { enabled: source === 'offboarding' } })
  const query = source === 'transfers' ? transfers : source === 'leaves' ? leaves : offboarding
  const items =
    source === 'transfers'
      ? transfers.data?.data?.items.map((event) => ({
          id: event.id,
          label: translate('transferEventOption', {
            employee: event.employee.fullName,
            from: event.from.department.name,
            to: event.to.department.name,
            date: formatDate(event.effectiveOn)
          })
        }))
      : source === 'leaves'
        ? leaves.data?.data?.items.map((event) => ({
            id: event.id,
            label: translate('leaveEventOption', {
              employee: event.employee.fullName,
              start: formatDate(event.startedOn),
              end: formatDate(event.approvedReturnOn)
            })
          }))
        : offboarding.data?.data?.items.map((event) => ({
            id: event.id,
            label: translate('offboardingEventOption', {
              employee: event.employee.fullName,
              date: formatDate(event.lastWorkingDay)
            })
          }))
  return (
    <div className='grid gap-2'>
      <select
        className={adminInputClass}
        name='eventId'
        aria-label={translate('fields.eventId')}
        required
        value={selection?.id ?? ''}
        onChange={(event) => setSelection(items?.find((item) => item.id === event.target.value) ?? null)}
      >
        <option value=''>{translate('choose')}</option>
        {selection && !items?.some((item) => item.id === selection.id) && (
          <option value={selection.id}>{selection.label}</option>
        )}
        {items?.map((event) => (
          <option key={event.id} value={event.id}>
            {event.label}
          </option>
        ))}
      </select>
      <AdminQueryState query={query}>
        {!items?.length && <AdminEmpty />}
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
    </div>
  )
}
