import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import {
  useDeviceStopRequestList,
  getDeviceStopRequestListQueryKey
} from '~/shared/api/generated/operations/device-stop-requests/device-stop-request-list'
import { useDeviceStopRequestComplete } from '~/shared/api/generated/operations/device-stop-requests/device-stop-request-complete'
import { StopRequestState } from '../enums/stop-request-state'
import { getDeviceGetQueryKey, useDeviceGet } from '~/shared/api/generated/operations/devices/device-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getDeviceListQueryKey } from '~/shared/api/generated/operations/devices/device-list'
import { getMyDeviceListQueryKey } from '~/shared/api/generated/operations/my-devices/my-device-list'
import type { StopRequestPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/device-stop-requests'

export function DeviceStopRequests() {
  const { t: translate } = useTranslation('itDevices')
  const { formatDateTime } = useWorkspaceFormat()
  const [params, setParams] = useSearchParams()
  const state =
    Object.values(StopRequestState).find((value) => value === params.get('stopState')) ?? StopRequestState.OPEN
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<StopRequestPageResponseDtoDataItemsItem>()
  const query = useDeviceStopRequestList({ state, page, pageSize: 20 })
  const feedback = useItMutationFeedback(
    [
      getDeviceStopRequestListQueryKey(),
      getDeviceListQueryKey(),
      getMyDeviceListQueryKey(),
      ...(selected ? [getDeviceGetQueryKey(selected.deviceId)] : [])
    ],
    () => setSelected(undefined)
  )
  const mutation = useDeviceStopRequestComplete({
    mutation: {
      ...feedback,
      onError: async (error) => {
        await feedback.onError(error)
        setSelected(undefined)
      }
    }
  })
  return (
    <section className='space-y-4'>
      <div className='max-w-xs'>
        <ItChoiceSelect
          label={translate('state')}
          value={state}
          options={Object.values(StopRequestState).map((value) => ({
            value,
            label: translate(`stopStates.${value}`)
          }))}
          onChange={(value) => {
            setPage(1)
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('stopState', value)
              return next
            })
          }}
        />
      </div>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto]'>
                <div className='space-y-3'>
                  <StopDeviceName id={item.deviceId} />
                  <dl className='grid gap-3 text-sm sm:grid-cols-3'>
                    <div>
                      <dt className='text-muted-foreground'>{translate('stopRequestedAt')}</dt>
                      <dd className='text-right font-mono tabular-nums'>{formatDateTime(item.requestedAt)}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('stopDueAt')}</dt>
                      <dd className={`text-right font-mono tabular-nums ${item.overdue ? 'text-danger' : ''}`}>
                        {formatDateTime(item.dueAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('state')}</dt>
                      <dd>
                        {translate(`stopStates.${item.state}`)}
                        {item.overdue && <span className='ml-2 text-danger'>{translate('stopOverdue')}</span>}
                      </dd>
                    </div>
                  </dl>
                  {item.invalidReason && (
                    <p className='text-sm text-muted-foreground'>{translate(`stopReasons.${item.invalidReason}`)}</p>
                  )}
                  {item.handledAt && (
                    <p className='text-right font-mono text-sm tabular-nums'>{formatDateTime(item.handledAt)}</p>
                  )}
                  {item.selfHandled && <p className='text-sm text-muted-foreground'>{translate('stopSelfHandled')}</p>}
                </div>
                {item.state === StopRequestState.OPEN && (
                  <button
                    type='button'
                    className={`self-center ${itButtonClass}`}
                    disabled={query.isFetching || mutation.isPending}
                    onClick={() => setSelected(item)}
                  >
                    {translate('stopComplete')}
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {query.data?.data && (
        <ItPagination page={page} total={query.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
      )}
      {selected && (
        <ItFormDialog
          title={translate('stopComplete')}
          pending={mutation.isPending}
          onClose={() => setSelected(undefined)}
          submitLabel={translate('stopComplete')}
          onSubmit={(event) => {
            event.preventDefault()
            if (!mutation.isPending) mutation.mutate({ id: selected.id, data: {} })
          }}
        >
          <StopDeviceName id={selected.deviceId} />
          <p className='text-sm text-muted-foreground'>{translate('stopConfirm')}</p>
        </ItFormDialog>
      )}
    </section>
  )
}

function StopDeviceName({ id }: { id: string }) {
  const { t: translate } = useTranslation('itDevices')
  const [, setParams] = useSearchParams()
  const query = useDeviceGet(id)
  const device = query.data?.data
  return (
    <button
      type='button'
      className='text-left font-semibold text-primary-ink hover:underline'
      onClick={() =>
        setParams((previous) => {
          const next = new URLSearchParams(previous)
          next.delete('deviceView')
          next.set('deviceId', id)
          return next
        })
      }
    >
      {device ? `${device.assetCode} · ${device.hostname}` : translate('stopDevice')}
    </button>
  )
}
