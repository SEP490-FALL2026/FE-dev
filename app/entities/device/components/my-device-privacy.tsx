import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyDeviceList } from '~/shared/api/generated/operations/my-devices/my-device-list'
import { useMonitoringNoticeCurrentGet } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { WorkspaceSection } from '~/shared/ui/workspace-section'
import { WorkspaceDataTable } from '~/shared/ui/workspace-data-table'
import { AcknowledgementState } from '../enums/acknowledgement-state'
import { DeviceButton, DevicePagination, DeviceQueryState, DeviceValue } from './device-privacy-ui'
import { DeviceAcknowledgement } from './device-acknowledgement'
import { MonitoringNoticeContent } from './monitoring-notice-content'
import { MyDeviceUsage } from './my-device-usage'
import { MyDeviceToolStatus } from './my-device-tool-status'

/** Holder self-service, shared by Employee and IT; never calls privileged device routes. */
export function MyDevicePrivacy() {
  const { t: translate } = useTranslation('devicePrivacy')
  const { formatDate, formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const [registrationId, setRegistrationId] = useState<string>()
  const [view, setView] = useState<'usage' | 'status'>('usage')
  const [acknowledging, setAcknowledging] = useState(false)
  const query = useMyDeviceList({ page, pageSize: 20 })
  const noticeQuery = useMonitoringNoticeCurrentGet()
  const data = !query.isError ? query.data?.data : undefined
  const notice = !noticeQuery.isError ? noticeQuery.data?.data : undefined
  const device = data?.items.find((item) => item.registrationId === registrationId)
  const knownState = device && Object.values(AcknowledgementState).includes(device.acknowledgementState)
  return (
    <div className='space-y-6'>
      {!registrationId && (
        <WorkspaceSection title={translate('notice')}>
          <DeviceQueryState query={noticeQuery} empty={!notice} emptyTitle={translate('noNotice')}>
            {notice && (
              <details className='group'>
                <summary className='min-h-11 cursor-pointer py-2 text-sm font-medium text-primary-ink focus-visible:outline-2 focus-visible:outline-primary'>
                  {translate('noticeDetails')}
                </summary>
                <div className='pt-4'>
                  <MonitoringNoticeContent notice={notice} />
                </div>
              </details>
            )}
          </DeviceQueryState>
        </WorkspaceSection>
      )}
      {registrationId && (
        <DeviceButton
          onClick={() => {
            setRegistrationId(undefined)
            setAcknowledging(false)
          }}
        >
          {translate('back')}
        </DeviceButton>
      )}
      <WorkspaceSection
        title={device ? device.assetCode : translate('devices')}
        description={!registrationId ? translate('devicesHint') : undefined}
      >
        <DeviceQueryState
          query={query}
          empty={!data?.items.length || (!!registrationId && !device)}
          emptyTitle={translate(registrationId ? 'errors.missing' : 'emptyDevices')}
          emptyHint={!registrationId ? translate('emptyDevicesHint') : undefined}
        >
          {!registrationId && data && (
            <>
              <WorkspaceDataTable
                label={translate('devices')}
                actionLabel={translate('view')}
                items={data.items}
                rowKey={(item) => item.registrationId}
                onOpen={(item) => {
                  setRegistrationId(item.registrationId)
                  setView('usage')
                }}
                columns={[
                  {
                    key: 'device',
                    label: translate('device'),
                    render: (item) => (
                      <div className='min-w-0'>
                        <p className='max-w-64 truncate font-medium' title={item.assetCode}>
                          {item.assetCode}
                        </p>
                        <p className='max-w-64 truncate text-xs text-muted-foreground' title={item.hostname}>
                          {item.hostname}
                        </p>
                        <p className='max-w-64 truncate text-xs text-muted-foreground' title={item.os}>
                          {item.os}
                        </p>
                      </div>
                    )
                  },
                  {
                    key: 'period',
                    label: translate('period'),
                    align: 'right',
                    render: (item) => (
                      <>
                        <p>{translate('since', { date: formatDate(item.validFrom) })}</p>
                        {item.endedAt && (
                          <p className='text-xs text-muted-foreground'>
                            {translate('ended', { date: formatDateTime(item.endedAt) })}
                          </p>
                        )}
                      </>
                    )
                  },
                  {
                    key: 'acknowledgement',
                    label: translate('acknowledgement'),
                    render: (item) => (
                      <>
                        <DeviceValue value={item.acknowledgementState} />
                        {item.acknowledgedVersionNumber !== null && (
                          <p className='text-xs text-muted-foreground'>
                            {translate('acknowledgedVersion', { version: item.acknowledgedVersionNumber })}
                          </p>
                        )}
                        {item.blockedReason && (
                          <p className='mt-1 text-xs text-muted-foreground'>
                            <DeviceValue value={item.blockedReason} blocked />
                          </p>
                        )}
                      </>
                    )
                  }
                ]}
              />
              <DevicePagination pagination={data.pagination} busy={query.isFetching} onPage={setPage} />
            </>
          )}
          {device && (
            <div className='space-y-5'>
              <p className='truncate text-sm text-muted-foreground' title={device.hostname}>
                {device.hostname}
              </p>
              <div className='flex flex-wrap items-center gap-3 text-sm'>
                <DeviceValue value={device.acknowledgementState} />
                <DeviceButton
                  disabled={!knownState || !device.canAcknowledge || query.isFetching}
                  onClick={() => setAcknowledging(true)}
                >
                  {translate('acknowledge')}
                </DeviceButton>
              </div>
              {device.blockedReason && (
                <p className='text-sm text-muted-foreground'>
                  <DeviceValue value={device.blockedReason} blocked />
                </p>
              )}
              <div
                role='group'
                aria-label={translate('device')}
                className='flex flex-wrap gap-2 border-t border-border/50 pt-4'
              >
                {(['usage', 'status'] as const).map((kind) => (
                  <DeviceButton key={kind} aria-pressed={view === kind} onClick={() => setView(kind)}>
                    {translate(kind)}
                  </DeviceButton>
                ))}
              </div>
              {view === 'usage' ? (
                <MyDeviceUsage key={device.registrationId} deviceId={device.deviceId} />
              ) : (
                <MyDeviceToolStatus key={device.registrationId} deviceId={device.deviceId} />
              )}
            </div>
          )}
        </DeviceQueryState>
      </WorkspaceSection>
      {acknowledging && device && (
        <DeviceAcknowledgement device={device} refreshing={query.isFetching} onClose={() => setAcknowledging(false)} />
      )}
    </div>
  )
}
