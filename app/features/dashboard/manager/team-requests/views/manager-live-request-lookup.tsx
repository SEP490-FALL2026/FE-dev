import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerButton, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerSearchToolbar } from '../../shared/components/manager-search-toolbar'
import { isResourceId } from '../../shared/manager-identifiers'

export function ManagerRequestLookup({ history, onOpen }: { history?: boolean; onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const [params] = useSearchParams()
  const search = params.get('requestSearch') ?? ''
  const validSearch = isResourceId(search)
  const query = useAccessRequestGet(search, { query: { enabled: validSearch } })
  const data = !query.isError ? query.data?.data : null
  const request = data && 'request' in data ? data.request : null
  const rows = validSearch && request ? [request] : []
  const title = translate(search ? 'searchResults' : 'needQueue')
  const empty = !search ? (
    <WorkspaceEmptyState
      icon={ClipboardCheck}
      title={translate('needQueueUnavailable')}
      description={translate(history ? 'noHistory' : 'needQueueGap')}
    />
  ) : !validSearch ? (
    <WorkspaceEmptyState title={translate('invalidRequestSearch')} />
  ) : (
    <ManagerQueryState query={query} empty={!request} emptyTitle={translate('noSearchResults')} />
  )
  return (
    <div className='space-y-5'>
      <ManagerPageHeader title={translate('requests')} icon={ClipboardCheck} />
      <ManagerSearchToolbar
        queryKey='requestSearch'
        label={translate('requestLookup')}
        placeholder={translate('requestSearchPlaceholder')}
      />
      <ManagerSection title={title}>
        <ManagerDataTable
          label={title}
          items={rows}
          rowKey={(item) => item.id}
          emptyState={empty}
          columns={[
            {
              key: 'application',
              label: translate('application'),
              render: (item) => (
                <div>
                  <p
                    className='max-w-64 truncate font-medium'
                    title={item.plan?.applicationName ?? item.proposal?.softwareName ?? ''}
                  >
                    {item.plan?.applicationName ?? item.proposal?.softwareName}
                  </p>
                  <p className='mt-1 truncate font-mono text-xs text-muted-foreground' title={item.id}>
                    {item.id}
                  </p>
                </div>
              )
            },
            {
              key: 'employee',
              label: translate('employee'),
              render: (item) => (
                <p className='max-w-56 truncate' title={item.requester.fullName}>
                  {item.requester.fullName}
                </p>
              )
            },
            { key: 'status', label: translate('status'), render: (item) => <ManagerStatus value={item.state} /> },
            {
              key: 'submitted',
              label: translate('submittedAt'),
              align: 'right',
              render: (item) => formatDateTime(item.submittedAt)
            }
          ]}
          onOpen={(item) => onOpen(item.id)}
        />
        <nav
          aria-label={translate('pagination')}
          className='flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4'
        >
          <p className='text-sm text-muted-foreground'>
            {rows.length ? translate('tableTotal', { count: rows.length }) : translate('needQueuePaginationGap')}
          </p>
          <div className='flex gap-2'>
            <ManagerButton disabled>{translate('previous')}</ManagerButton>
            <ManagerButton disabled>{translate('next')}</ManagerButton>
          </div>
        </nav>
      </ManagerSection>
    </div>
  )
}
