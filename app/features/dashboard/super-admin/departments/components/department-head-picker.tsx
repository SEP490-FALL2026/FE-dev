import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { appUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import { AdminField } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminSelect, type SearchableOption } from '../../shared/components/admin-select'

export function DepartmentHeadPicker({
  departmentId,
  effectiveFrom,
  errorId
}: {
  departmentId: string
  effectiveFrom: string
  errorId?: string
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [selected, setSelected] = useState<SearchableOption | null>(null)
  const params = {
    role: 'MANAGER' as const,
    departmentId,
    memberOn: effectiveFrom,
    status: 'ACTIVE' as const,
    activationState: 'ACTIVATED' as const,
    pageSize: 20
  }
  const query = useInfiniteQuery({
    queryKey: [...getAppUserListQueryKey(params), 'department-head-picker'],
    enabled: Boolean(effectiveFrom),
    retry: false,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => appUserList({ ...params, page: pageParam }, undefined, signal),
    getNextPageParam: (last, pages) =>
      pages.length < (last.data?.pagination.totalPages ?? 0) ? pages.length + 1 : undefined
  })
  const options: SearchableOption[] =
    query.data?.pages.flatMap((page) =>
      (page.data?.items ?? []).flatMap((account) =>
        account.employee &&
        account.roles.includes('MANAGER') &&
        !account.roles.includes('SPENDING_APPROVER') &&
        !account.roles.includes('SUPER_ADMIN')
          ? [
              {
                value: account.employee.id,
                label: account.employee.fullName,
                description: account.employee.employeeCode
              }
            ]
          : []
      )
    ) ?? []
  return (
    <div className='space-y-3'>
      <AdminField label={translate('editor.chooseHead')} description={translate('editor.managerHelp')}>
        <AdminSelect
          required
          name='employeeId'
          value={selected?.value ?? ''}
          invalid={Boolean(errorId)}
          aria-describedby={errorId}
          onChange={(_, option) => setSelected(option)}
          options={options}
          selectedLabel={selected?.label}
          loading={query.isFetching}
          hasMore={query.hasNextPage}
          onLoadMore={() => void query.fetchNextPage()}
          disabled={!effectiveFrom}
          placeholder={translate('ui.pickHead')}
          emptyText={translate('ui.noHeadCandidates')}
        />
      </AdminField>
      {(query.isError || (query.isPending && Boolean(effectiveFrom))) && (
        <AdminQueryState query={query}>{null}</AdminQueryState>
      )}
    </div>
  )
}
