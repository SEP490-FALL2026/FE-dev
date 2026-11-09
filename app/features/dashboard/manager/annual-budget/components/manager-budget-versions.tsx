import { useTranslation } from 'react-i18next'
import { useBudgetMineVersionList } from '~/shared/api/generated/operations/budgets/budget-mine-version-list'
import type { MineVersionPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/mineVersionPageResponseDtoDataItemsItem'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'

interface Props {
  year: number
  onOpenVersion?: (version: MineVersionPageResponseDtoDataItemsItem) => void
}

export function ManagerBudgetVersions({ year, onOpenVersion }: Props) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const paging = useManagerPage('versionPage')
  const query = useBudgetMineVersionList({ year, page: paging.page, pageSize: paging.pageSize })

  const items: MineVersionPageResponseDtoDataItemsItem[] = !query.isError ? (query.data?.data?.items ?? []) : []

  return (
    <ManagerSection title={translate('versions')}>
      <ManagerQueryState
        query={query}
        empty={!items.length}
        emptyTitle={translate('noVersions')}
        emptyDescription={translate('noVersionsHint')}
      />
      {!query.isError && items.length > 0 && (
        <ManagerDataTable<MineVersionPageResponseDtoDataItemsItem>
          label={translate('versions')}
          items={items}
          rowKey={(version) => version.id}
          columns={[
            {
              key: 'version',
              label: translate('version'),
              render: (version: MineVersionPageResponseDtoDataItemsItem) => (
                <div>
                  <p className='font-medium text-foreground'>
                    {translate('versionNumber', { number: version.number })}
                  </p>
                  <p className='mt-0.5 font-mono text-xs text-muted-foreground'>{version.year}</p>
                </div>
              )
            },
            {
              key: 'status',
              label: translate('status'),
              render: (version: MineVersionPageResponseDtoDataItemsItem) => <ManagerStatus value={version.state} />
            },
            {
              key: 'sentAt',
              label: translate('sentAt'),
              align: 'right',
              render: (version: MineVersionPageResponseDtoDataItemsItem) => (
                <span className='font-mono text-xs text-muted-foreground tabular-nums'>
                  {formatDateTime(version.sentAt)}
                </span>
              )
            }
          ]}
          onOpen={onOpenVersion}
        />
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
