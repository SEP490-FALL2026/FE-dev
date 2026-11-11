import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentAccessRequestList } from '~/shared/api/generated/operations/access-requests/department-access-request-list'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function ManagerDepartmentRequests({ ended, onOpen }: { ended?: boolean; onOpen: (id: string) => void }) {
  const { t } = useTranslation('requestFlow')
  const { t: manager } = useTranslation('manager')
  const { formatDateTime } = useWorkspaceFormat()
  const me = useMeGet()
  const departmentId = me.data?.data?.managerScope?.departmentId ?? ''
  const paging = useManagerPage('departmentRequestPage')
  const query = useDepartmentAccessRequestList(
    departmentId,
    { page: paging.page, pageSize: paging.pageSize, view: ended ? 'ended' : 'open' },
    { query: { enabled: !!departmentId } }
  )
  const items = !query.isError ? (query.data?.data?.items ?? []) : []
  return (
    <ManagerSection title={t('departmentRequests')}>
      <ManagerQueryState query={me} />
      {departmentId && (
        <>
          <ManagerQueryState query={query} empty={!items.length} />
          <ManagerDataTable
            items={items}
            rowKey={(item) => item.id}
            label={t('departmentRequests')}
            onOpen={(item) => onOpen(item.id)}
            columns={[
              {
                key: 'software',
                label: manager('application'),
                render: (item) => (
                  <span
                    className='block max-w-60 truncate'
                    title={item.plan?.applicationName ?? item.softwareName ?? undefined}
                  >
                    {item.plan?.applicationName ?? item.softwareName}
                  </span>
                )
              },
              {
                key: 'requester',
                label: manager('requestDetail.requester'),
                render: (item) => (
                  <span className='block max-w-48 truncate' title={item.requester.fullName}>
                    {item.requester.fullName}
                  </span>
                )
              },
              {
                key: 'status',
                label: manager('status'),
                render: (item) => (
                  <div>
                    <ManagerStatus value={item.state} />
                    {item.awaitingMe && <p className='mt-1 text-xs text-primary-ink'>{t('awaitingMe')}</p>}
                  </div>
                )
              },
              {
                key: 'submittedAt',
                label: manager('requestDetail.submittedAt'),
                align: 'right',
                render: (item) => (
                  <span className='font-mono text-xs tabular-nums'>{formatDateTime(item.submittedAt)}</span>
                )
              }
            ]}
          />
          <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
        </>
      )}
    </ManagerSection>
  )
}
