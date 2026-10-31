import { Boxes, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useDepartmentMemberList } from '~/shared/api/generated/operations/departments/department-member-list'
import { useDepartmentToolsInUse } from '~/shared/api/generated/operations/departments/department-tools-in-use'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerSearchToolbar } from '../../shared/components/manager-search-toolbar'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  filterDepartmentPage,
  useDepartmentMemberSearch,
  useDepartmentToolSearch
} from '../hooks/use-department-search'
import {
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'

export function ManagerLiveTeam({
  departmentId,
  tools = false,
  embedded = false
}: {
  departmentId?: string
  tools?: boolean
  embedded?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage()
  const valid = isResourceId(departmentId ?? '')
  const department = useDepartmentGet(departmentId ?? '', { query: { enabled: valid } })
  return (
    <div className='space-y-5'>
      {!embedded && <ManagerPageHeader title={translate(tools ? 'tools' : 'team')} icon={tools ? Boxes : UsersRound} />}
      <ManagerSearchToolbar
        label={translate(tools ? 'toolSearch' : 'memberSearch')}
        placeholder={translate(tools ? 'toolSearchPlaceholder' : 'memberSearchPlaceholder')}
        disabled={!valid}
      />
      {!valid ? (
        <ManagerSection>
          <ManagerDataTable
            label={translate(tools ? 'tools' : 'team')}
            items={[]}
            rowKey={() => ''}
            columns={[
              { key: 'name', label: translate(tools ? 'application' : 'employee'), render: () => null },
              { key: 'status', label: translate('status'), render: () => null },
              { key: 'since', label: translate('since'), align: 'right', render: () => null }
            ]}
            emptyState={
              <WorkspaceEmptyState title={translate('selectDepartment')} description={translate('departmentListGap')} />
            }
          />
        </ManagerSection>
      ) : (
        <ManagerQueryState query={department} />
      )}
      {valid &&
        !department.isError &&
        department.data?.data &&
        (tools ? (
          <Tools departmentId={departmentId ?? ''} paging={paging} />
        ) : (
          <Members departmentId={departmentId ?? ''} paging={paging} />
        ))}
    </div>
  )
}
function Members({ departmentId, paging }: { departmentId: string; paging: ReturnType<typeof useManagerPage> }) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const [params] = useSearchParams()
  const search = params.get('search') ?? ''
  const paged = useDepartmentMemberList(
    departmentId,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !search } }
  )
  const index = useDepartmentMemberSearch(departmentId, !!search)
  const query = search ? index : paged
  const data = query.isError
    ? undefined
    : search
      ? index.isSuccess
        ? filterDepartmentPage(index.data, search, paging.page, paging.pageSize, (member) => [
            member.fullName,
            member.employeeCode
          ])
        : undefined
      : paged.data?.data
  return (
    <ManagerSection
      title={translate('team')}
      action={
        data && (
          <span className='font-mono text-xs text-muted-foreground tabular-nums'>
            {translate('tableTotal', { count: data.pagination.totalItems })}
          </span>
        )
      }
    >
      <ManagerQueryState
        query={query}
        empty={!data?.items.length}
        emptyTitle={translate(search ? 'noSearchResults' : 'noMembers')}
        emptyDescription={translate(search ? 'noSearchResultsHint' : 'noMembersHint')}
      />
      <ManagerDataTable
        label={translate('team')}
        items={data?.items ?? []}
        rowKey={(member) => member.employeeCode}
        columns={[
          {
            key: 'employee',
            label: translate('employee'),
            render: (member) => (
              <div className='flex min-w-0 items-center gap-3'>
                <span
                  aria-hidden
                  className='grid size-9 shrink-0 place-items-center rounded-md border border-primary/15 bg-primary-soft/50 text-primary-ink'
                >
                  <UsersRound strokeWidth={1.5} className='size-4' />
                </span>
                <div className='min-w-0'>
                  <p className='max-w-64 truncate font-medium' title={member.fullName}>
                    {member.fullName}
                  </p>
                  <p className='mt-1 font-mono text-xs text-muted-foreground'>{member.employeeCode}</p>
                </div>
              </div>
            )
          },
          { key: 'status', label: translate('status'), render: (member) => <ManagerStatus value={member.workState} /> },
          {
            key: 'since',
            label: translate('since'),
            align: 'right',
            render: (member) => formatDate(member.memberSince)
          }
        ]}
      />
      <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
function Tools({ departmentId, paging }: { departmentId: string; paging: ReturnType<typeof useManagerPage> }) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const [params] = useSearchParams()
  const search = params.get('search') ?? ''
  const paged = useDepartmentToolsInUse(
    departmentId,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !search } }
  )
  const index = useDepartmentToolSearch(departmentId, !!search)
  const query = search ? index : paged
  const data = query.isError
    ? undefined
    : search
      ? index.isSuccess
        ? filterDepartmentPage(index.data, search, paging.page, paging.pageSize, (item) => [
            item.application.name,
            item.plan.name,
            item.fullName,
            item.employeeCode,
            item.assignmentId
          ])
        : undefined
      : paged.data?.data
  return (
    <ManagerSection>
      <ManagerQueryState
        query={query}
        empty={!data?.items.length}
        emptyTitle={translate(search ? 'noSearchResults' : 'noTools')}
        emptyDescription={translate(search ? 'noSearchResultsHint' : 'noToolsHint')}
      />
      <ManagerDataTable
        label={translate('tools')}
        items={data?.items ?? []}
        rowKey={(assignment) => assignment.assignmentId}
        columns={[
          {
            key: 'application',
            label: translate('application'),
            render: (item) => (
              <div>
                <p className='max-w-56 truncate font-medium' title={item.application.name}>
                  {item.application.name}
                </p>
                <p className='mt-1 max-w-56 truncate text-xs text-muted-foreground' title={item.plan.name}>
                  {item.plan.name}
                </p>
              </div>
            )
          },
          {
            key: 'employee',
            label: translate('employee'),
            render: (item) => (
              <div>
                <p className='max-w-56 truncate' title={item.fullName}>
                  {item.fullName}
                </p>
                <p className='mt-1 font-mono text-xs text-muted-foreground'>{item.employeeCode}</p>
              </div>
            )
          },
          { key: 'kind', label: translate('kind'), render: (item) => <ManagerStatus value={item.kind} /> },
          { key: 'since', label: translate('since'), align: 'right', render: (item) => formatDate(item.effectiveFrom) }
        ]}
      />
      <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
