import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyDeviceUsageList } from '~/shared/api/generated/operations/ai-usage/my-device-usage-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { adminInputClass } from '~/shared/ui/form-dialog'
import { WorkspaceDataTable } from '~/shared/ui/workspace-data-table'
import { DevicePagination, DeviceQueryState, DeviceValue } from './device-privacy-ui'
import { UsageCoverage } from '../enums/usage-coverage'

export function MyDeviceUsage({ deviceId }: { deviceId: string }) {
  const { t: translate } = useTranslation('devicePrivacy')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const dateErrorId = useId()
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const invalidDates = !!from && !!to && from > to
  const query = useMyDeviceUsageList(
    deviceId,
    { page, pageSize: 20, ...(from ? { from } : {}), ...(to ? { to } : {}) },
    { query: { enabled: !invalidDates } }
  )
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{translate('usageHint')}</p>
      <div className='grid max-w-xl gap-x-4 sm:grid-cols-2'>
        <label className='grid gap-2 text-sm font-medium'>
          {translate('from')}
          <input
            type='date'
            className={adminInputClass}
            value={from}
            max={to || undefined}
            aria-invalid={invalidDates || undefined}
            aria-describedby={invalidDates ? dateErrorId : undefined}
            onChange={(event) => {
              setFrom(event.target.value)
              setPage(1)
            }}
          />
        </label>
        <label className='grid gap-2 text-sm font-medium'>
          {translate('to')}
          <input
            type='date'
            className={adminInputClass}
            value={to}
            min={from || undefined}
            aria-invalid={invalidDates || undefined}
            aria-describedby={invalidDates ? dateErrorId : undefined}
            onChange={(event) => {
              setTo(event.target.value)
              setPage(1)
            }}
          />
        </label>
        <p id={dateErrorId} className='min-h-5 text-xs text-danger sm:col-span-2'>
          {invalidDates ? translate('invalidDates') : null}
        </p>
      </div>
      {!invalidDates && (
        <DeviceQueryState query={query} empty={!data?.items.length} emptyTitle={translate('emptyUsage')}>
          {data && (
            <>
              <WorkspaceDataTable
                label={translate('usage')}
                actionLabel={translate('view')}
                items={data.items}
                rowKey={(item) => `${item.date}-${item.tool}`}
                columns={[
                  { key: 'date', label: translate('date'), align: 'right', render: (item) => formatDate(item.date) },
                  {
                    key: 'tool',
                    label: translate('tool'),
                    render: (item) => (
                      <>
                        <DeviceValue value={item.tool} />
                        {item.experimental && (
                          <span className='block text-xs text-muted-foreground'>{translate('experimental')}</span>
                        )}
                      </>
                    )
                  },
                  {
                    key: 'coverage',
                    label: translate('coverage'),
                    render: (item) => <DeviceValue value={item.coverage} />
                  },
                  {
                    key: 'responses',
                    label: translate('responses'),
                    align: 'right',
                    render: (item) =>
                      item.coverage === UsageCoverage.COVERED || item.coverage === UsageCoverage.PARTIAL
                        ? formatNumber(item.responses)
                        : translate('noData')
                  },
                  {
                    key: 'tokens',
                    label: translate('tokens'),
                    align: 'right',
                    render: (item) =>
                      item.coverage === UsageCoverage.COVERED || item.coverage === UsageCoverage.PARTIAL
                        ? formatNumber(item.totalTokens)
                        : translate('noData')
                  }
                ]}
              />
              <DevicePagination pagination={data.pagination} busy={query.isFetching} onPage={setPage} />
            </>
          )}
        </DeviceQueryState>
      )}
    </div>
  )
}
