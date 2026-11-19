import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyDeviceToolStatusList } from '~/shared/api/generated/operations/ai-tool-status/my-device-tool-status-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { WorkspaceDataTable } from '~/shared/ui/workspace-data-table'
import { DevicePagination, DeviceQueryState, DeviceValue } from './device-privacy-ui'
import { QuotaStatus } from '../enums/quota-status'

export function MyDeviceToolStatus({ deviceId }: { deviceId: string }) {
  const { t: translate } = useTranslation('devicePrivacy')
  const { formatDateTime, formatPercent } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useMyDeviceToolStatusList(deviceId, { page, pageSize: 20 })
  const data = query.data?.data
  return (
    <DeviceQueryState query={query} empty={!data?.items.length} emptyTitle={translate('emptyStatus')}>
      {data && (
        <>
          <WorkspaceDataTable
            label={translate('status')}
            actionLabel={translate('view')}
            items={data.items}
            rowKey={(item) => `${item.tool}-${item.windowCode ?? ''}-${item.observedAt}`}
            columns={[
              { key: 'tool', label: translate('tool'), render: (item) => <DeviceValue value={item.tool} /> },
              {
                key: 'observed',
                label: translate('observed'),
                align: 'right',
                render: (item) => formatDateTime(item.observedAt)
              },
              { key: 'auth', label: translate('auth'), render: (item) => <DeviceValue value={item.authStatus} /> },
              { key: 'quota', label: translate('quota'), render: (item) => <DeviceValue value={item.quotaStatus} /> },
              {
                key: 'window',
                label: translate('window'),
                render: (item) =>
                  item.windowCode ? <DeviceValue value={item.windowCode} /> : translate('unavailableValue')
              },
              {
                key: 'used',
                label: translate('used'),
                align: 'right',
                render: (item) =>
                  item.quotaStatus === QuotaStatus.OK && item.usedPercent !== null
                    ? formatPercent(item.usedPercent / 100)
                    : translate('unavailableValue')
              },
              {
                key: 'resets',
                label: translate('resets'),
                align: 'right',
                render: (item) => (item.resetsAt ? formatDateTime(item.resetsAt) : translate('unavailableValue'))
              }
            ]}
          />
          <DevicePagination pagination={data.pagination} busy={query.isFetching} onPage={setPage} />
        </>
      )}
    </DeviceQueryState>
  )
}
