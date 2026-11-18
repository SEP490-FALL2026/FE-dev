import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  departmentTransferList,
  getDepartmentTransferListQueryKey
} from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { getLongLeaveListQueryKey, longLeaveList } from '~/shared/api/generated/operations/long-leaves/long-leave-list'
import {
  getOffboardingCaseListQueryKey,
  offboardingCaseList
} from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminQueryState } from './admin-query-state'
import { AdminSelect, type SearchableOption } from './admin-select'

export type NoticeEventSource = 'transfers' | 'leaves' | 'offboarding'

/** Only request events for this notice's employee and event kind; further pages load inside the picker. */
export function NoticeEventLookup({
  employeeId,
  source,
  descriptionId
}: {
  employeeId: string
  source: NoticeEventSource
  descriptionId?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [selection, setSelection] = useState<SearchableOption | null>(null)
  const params = { employeeId, pageSize: 20 }
  const query = useInfiniteQuery({
    queryKey: [
      ...(source === 'transfers'
        ? getDepartmentTransferListQueryKey(params)
        : source === 'leaves'
          ? getLongLeaveListQueryKey(params)
          : getOffboardingCaseListQueryKey(params)),
      'notice-event-picker'
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }): Promise<{ options: SearchableOption[]; totalPages: number }> => {
      const page = { ...params, page: pageParam }
      if (source === 'transfers') {
        const response = await departmentTransferList(page, undefined, signal)
        return {
          totalPages: response.data?.pagination.totalPages ?? 0,
          options: (response.data?.items ?? []).map((event) => ({
            value: event.id,
            label: translate('transferEventOption', {
              employee: event.employee.fullName,
              from: event.from.department.name,
              to: event.to.department.name,
              date: formatDate(event.effectiveOn)
            })
          }))
        }
      }
      if (source === 'leaves') {
        const response = await longLeaveList(page, undefined, signal)
        return {
          totalPages: response.data?.pagination.totalPages ?? 0,
          options: (response.data?.items ?? []).map((event) => ({
            value: event.id,
            label: translate('leaveEventOption', {
              employee: event.employee.fullName,
              start: formatDate(event.startedOn),
              end: formatDate(event.approvedReturnOn)
            })
          }))
        }
      }
      const response = await offboardingCaseList(page, undefined, signal)
      return {
        totalPages: response.data?.pagination.totalPages ?? 0,
        options: (response.data?.items ?? []).map((event) => ({
          value: event.id,
          label: translate('offboardingEventOption', {
            employee: event.employee.fullName,
            date: formatDate(event.lastWorkingDay)
          })
        }))
      }
    },
    getNextPageParam: (last, pages) => (pages.length < last.totalPages ? pages.length + 1 : undefined)
  })
  const options = query.data?.pages.flatMap((page) => page.options) ?? []
  return (
    <div className='grid gap-2'>
      <AdminSelect
        name='eventId'
        aria-label={translate('fields.eventId')}
        descriptionId={descriptionId}
        required
        value={selection?.value ?? ''}
        onChange={(_, option) => setSelection(option)}
        options={options}
        selectedLabel={selection?.label}
        loading={query.isFetching}
        hasMore={query.hasNextPage}
        onLoadMore={() => void query.fetchNextPage()}
        placeholder={translate('ui.pickEvent')}
        emptyText={translate('ui.noEventMatch')}
      />
      {(query.isPending || query.isError) && <AdminQueryState query={query}>{null}</AdminQueryState>}
    </div>
  )
}
