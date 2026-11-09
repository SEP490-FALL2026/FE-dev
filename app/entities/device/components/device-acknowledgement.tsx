import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMonitoringNoticeCurrentGet } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { AcknowledgementState } from '../enums/acknowledgement-state'
import type { MyDevicePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/my-devices/myDevicePageResponseDtoDataItemsItem'
import { useDeviceAcknowledgement } from '../hooks/use-device-acknowledgement'
import { DeviceButton, DeviceQueryState } from './device-privacy-ui'
import { MonitoringNoticeContent } from './monitoring-notice-content'

export function DeviceAcknowledgement({
  device,
  refreshing,
  onClose
}: {
  device: MyDevicePageResponseDtoDataItemsItem
  refreshing: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('devicePrivacy')
  const query = useMonitoringNoticeCurrentGet({ query: { staleTime: 0, refetchOnMount: 'always' } })
  const notice = !query.isError ? query.data?.data : undefined
  // The checked box belongs to the exact version the user read, including after a refetch.
  const [confirmedVersion, setConfirmedVersion] = useState<string>()
  const feedback = useDeviceAcknowledgement(device.deviceId, onClose)
  const eligible = device.canAcknowledge && Object.values(AcknowledgementState).includes(device.acknowledgementState)
  const blocked =
    !notice ||
    confirmedVersion !== notice.id ||
    !eligible ||
    refreshing ||
    query.isFetching ||
    feedback.uncertain ||
    feedback.checking ||
    feedback.retrySeconds > 0
  return (
    <AdminFormDialog
      title={translate('acknowledge')}
      pending={feedback.mutation.isPending || feedback.checking}
      onClose={onClose}
      submitLabel={
        feedback.retrySeconds ? translate('retryIn', { count: feedback.retrySeconds }) : translate('acknowledge')
      }
      submitDisabled={blocked}
      onSubmit={(event) => {
        event.preventDefault()
        if (!blocked && notice) feedback.submit(device.registrationId, notice.id)
      }}
    >
      <p className='truncate text-sm font-semibold' title={device.assetCode}>
        {device.assetCode}
      </p>
      <p className='text-sm leading-relaxed text-muted-foreground'>{translate('collectionStarts')}</p>
      <DeviceQueryState query={query} empty={!notice} emptyTitle={translate('noNotice')}>
        {notice && (
          <>
            <MonitoringNoticeContent notice={notice} />
            <label className='flex min-h-11 items-start gap-3 py-3 text-sm'>
              <input
                type='checkbox'
                className='mt-1 size-4 shrink-0 accent-primary'
                checked={confirmedVersion === notice.id}
                disabled={!eligible || refreshing || feedback.uncertain}
                onChange={(event) => setConfirmedVersion(event.target.checked ? notice.id : undefined)}
              />
              {translate('confirmRead')}
            </label>
          </>
        )}
      </DeviceQueryState>
      {feedback.uncertain && (
        <DeviceButton
          busy={feedback.checking}
          disabled={feedback.retrySeconds > 0}
          onClick={() => {
            setConfirmedVersion(undefined)
            void feedback.recheck()
          }}
        >
          {translate('recheck')}
        </DeviceButton>
      )}
    </AdminFormDialog>
  )
}
