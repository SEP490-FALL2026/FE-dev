import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceUsageList } from '~/shared/api/generated/operations/ai-usage/device-usage-list'
import { useMyDeviceUsageList } from '~/shared/api/generated/operations/ai-usage/my-device-usage-list'
import { useDeviceToolStatusList } from '~/shared/api/generated/operations/ai-tool-status/device-tool-status-list'
import { useMyDeviceToolStatusList } from '~/shared/api/generated/operations/ai-tool-status/my-device-tool-status-list'
import { useDeviceIntakeRejectionList } from '~/shared/api/generated/operations/intake-rejections/device-intake-rejection-list'
import { DeviceIntakeRejectionListReasonCode } from '~/shared/api/generated/model/intake-rejections/deviceIntakeRejectionListReasonCode'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'

export function DeviceResults({
  id,
  kind,
  mine = false,
  onClose
}: {
  id: string
  kind: 'usage' | 'status' | 'rejections'
  mine?: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  return (
    <ItDetailDialog title={translate(kind)} onClose={onClose}>
      {kind === 'usage' ? (
        <Usage id={id} mine={mine} />
      ) : kind === 'status' ? (
        <ToolStatus id={id} mine={mine} />
      ) : !mine ? (
        <Rejections id={id} />
      ) : null}
    </ItDetailDialog>
  )
}

function Usage({ id, mine }: { id: string; mine: boolean }) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const params = { page, pageSize: 20, ...(from ? { from } : {}), ...(to ? { to } : {}) }
  const adminQuery = useDeviceUsageList(id, params, { query: { enabled: !mine } })
  const myQuery = useMyDeviceUsageList(id, params, { query: { enabled: mine } })
  const query = mine ? myQuery : adminQuery
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ItField label={translate('from')} hint={translate('hints.from')}>
          <input
            type='date'
            className={itInputClass}
            value={from}
            max={to || undefined}
            onChange={(event) => {
              setFrom(event.target.value)
              setPage(1)
            }}
          />
        </ItField>
        <ItField label={translate('to')} hint={translate('hints.to')}>
          <input
            type='date'
            className={itInputClass}
            value={to}
            min={from || undefined}
            onChange={(event) => {
              setTo(event.target.value)
              setPage(1)
            }}
          />
        </ItField>
      </div>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/40'>
            {data.items.map((item, index) => (
              <article key={`${item.date}-${item.tool}-${index}`} className='space-y-2 py-4 text-sm'>
                <p>
                  {translate(`values.${item.tool}`, { defaultValue: translate('unknown') })}
                  {item.experimental && (
                    <span className='ml-2 text-xs text-muted-foreground'>{translate('experimental')}</span>
                  )}
                </p>
                <p className='text-xs text-muted-foreground'>{formatDate(item.date)}</p>
                {item.coverage === 'NOT_OBSERVABLE' ? (
                  <p>{translate('noData')}</p>
                ) : (
                  <dl className='grid grid-cols-2 gap-3'>
                    <div>
                      <dt className='text-muted-foreground'>{translate('responses')}</dt>
                      <dd className='font-mono tabular-nums'>{formatNumber(item.responses)}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('tokens')}</dt>
                      <dd className='font-mono tabular-nums'>{formatNumber(item.totalTokens)}</dd>
                    </div>
                  </dl>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
    </div>
  )
}

function ToolStatus({ id, mine }: { id: string; mine: boolean }) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDateTime, formatPercent } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const params = { page, pageSize: 20 }
  const adminQuery = useDeviceToolStatusList(id, params, { query: { enabled: !mine } })
  const myQuery = useMyDeviceToolStatusList(id, params, { query: { enabled: mine } })
  const query = mine ? myQuery : adminQuery
  const data = query.data?.data
  return (
    <ItQueryState query={query}>
      {data?.items.length ? (
        <div className='divide-y divide-border/40'>
          {data.items.map((item, index) => (
            <article key={`${item.tool}-${item.observedAt}-${index}`} className='space-y-2 py-4 text-sm'>
              <p>{translate(`values.${item.tool}`, { defaultValue: translate('unknown') })}</p>
              <p className='text-xs text-muted-foreground'>{formatDateTime(item.observedAt)}</p>
              <dl className='grid grid-cols-2 gap-3'>
                <div>
                  <dt className='text-muted-foreground'>{translate('authStatus')}</dt>
                  <dd>{translate(`values.${item.authStatus}`, { defaultValue: translate('unknown') })}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('quotaStatus')}</dt>
                  <dd>{translate(`values.${item.quotaStatus}`, { defaultValue: translate('unknown') })}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('usedPercent')}</dt>
                  <dd>{item.usedPercent === null ? translate('noData') : formatPercent(item.usedPercent / 100)}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('resetsAt')}</dt>
                  <dd>{item.resetsAt ? formatDateTime(item.resetsAt) : translate('noData')}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <ItEmpty />
      )}
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
    </ItQueryState>
  )
}

function Rejections({ id }: { id: string }) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const [reasonCode, setReason] = useState<DeviceIntakeRejectionListReasonCode>()
  const query = useDeviceIntakeRejectionList(id, { page, pageSize: 20, ...(reasonCode ? { reasonCode } : {}) })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <ItField label={translate('reasonCode')}>
        <select
          className={itInputClass}
          value={reasonCode ?? ''}
          onChange={(event) => {
            setReason(Object.values(DeviceIntakeRejectionListReasonCode).find((value) => value === event.target.value))
            setPage(1)
          }}
        >
          <option value=''>{translate('allReasons')}</option>
          {Object.values(DeviceIntakeRejectionListReasonCode).map((value) => (
            <option key={value} value={value}>
              {translate(`reasons.${value}`, { defaultValue: value })}
            </option>
          ))}
        </select>
      </ItField>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/40'>
            {data.items.map((item) => (
              <article key={item.id} className='space-y-2 py-4 text-sm'>
                <p>{translate(`reasons.${item.reasonCode}`, { defaultValue: item.reasonCode })}</p>
                <p className='text-xs text-muted-foreground'>{formatDateTime(item.rejectedAt)}</p>
                <p className='break-all font-mono text-xs'>{item.endpoint}</p>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
    </div>
  )
}
