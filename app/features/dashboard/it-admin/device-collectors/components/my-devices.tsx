import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useMyDeviceList } from '~/shared/api/generated/operations/my-devices/my-device-list'
import { myDeviceAcknowledgementCreate } from '~/shared/api/generated/operations/my-devices/my-device-acknowledgement-create'
import { useMonitoringNoticeCurrentGet } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import { ItField, ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useDeviceFeedback } from '../hooks/use-device-feedback'
import { DeviceResults } from './device-results'

export function MyDevices() {
  const { t: translate } = useTranslation('itDevices')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<{
    deviceId: string
    registrationId: string
    kind: 'acknowledge' | 'usage' | 'status'
  }>()
  const query = useMyDeviceList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{translate('hints.acknowledge')}</p>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/40 rounded-lg border border-border bg-surface px-4'>
            {data.items.map((item) => (
              <article key={item.registrationId} className='space-y-3 py-4 text-sm'>
                <p className='max-w-96 truncate font-medium' title={item.assetCode}>
                  {item.assetCode}
                </p>
                <p className='max-w-96 truncate text-muted-foreground' title={item.hostname}>
                  {item.hostname}
                </p>
                <p>{translate(`values.${item.acknowledgementState}`, { defaultValue: translate('unknown') })}</p>
                {item.blockedReason && (
                  <p className='text-xs text-muted-foreground'>
                    {translate(`blocked.${item.blockedReason}`, { defaultValue: translate('unknown') })}
                  </p>
                )}
                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    className={itButtonClass}
                    disabled={!item.canAcknowledge}
                    onClick={() =>
                      setSelected({ deviceId: item.deviceId, registrationId: item.registrationId, kind: 'acknowledge' })
                    }
                  >
                    {translate('acknowledge')}
                  </button>
                  {(['usage', 'status'] as const).map((kind) => (
                    <button
                      key={kind}
                      type='button'
                      className={itButtonClass}
                      onClick={() =>
                        setSelected({ deviceId: item.deviceId, registrationId: item.registrationId, kind })
                      }
                    >
                      {translate(kind)}
                    </button>
                  ))}
                </div>
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
      {selected &&
        (selected.kind === 'acknowledge' ? (
          <Acknowledgement
            deviceId={selected.deviceId}
            registrationId={selected.registrationId}
            onClose={() => setSelected(undefined)}
          />
        ) : (
          <DeviceResults id={selected.deviceId} kind={selected.kind} mine onClose={() => setSelected(undefined)} />
        ))}
    </div>
  )
}

function Acknowledgement({
  deviceId,
  registrationId,
  onClose
}: {
  deviceId: string
  registrationId: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const query = useMonitoringNoticeCurrentGet()
  const notice = query.data?.data
  const [confirmed, setConfirmed] = useState(false)
  const feedback = useDeviceFeedback(deviceId, registrationId, onClose)
  const mutation = useMutation({
    mutationFn: () => myDeviceAcknowledgementCreate(registrationId, { noticeVersionId: notice!.id }),
    retry: false,
    ...feedback
  })
  return (
    <ItFormDialog
      wide
      title={translate('acknowledge')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!notice || !confirmed || query.isFetching}
      submitLabel={translate('acknowledge')}
      onSubmit={(event) => {
        event.preventDefault()
        if (notice && confirmed) mutation.mutate()
      }}
    >
      <ItQueryState query={query}>
        {notice && (
          <>
            <p className='text-sm font-medium'>
              {translate('versionNumber')}: {notice.versionNumber}
            </p>
            <dl className='space-y-4'>
              {(['collected', 'notCollected', 'purpose', 'retention', 'stopRight'] as const).map((key) => (
                <div key={key}>
                  <dt className='text-sm font-medium'>{translate(key)}</dt>
                  <dd className='mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground'>{notice[key]}</dd>
                </div>
              ))}
            </dl>
            <p className='text-sm'>
              {translate('includesToolStatus')}: {translate(notice.includesToolStatus ? 'yes' : 'no')}
            </p>
            <ItField label={translate('confirmRead')}>
              <input type='checkbox' checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            </ItField>
          </>
        )}
      </ItQueryState>
    </ItFormDialog>
  )
}
