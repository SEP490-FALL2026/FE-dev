import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceGet } from '~/shared/api/generated/operations/devices/device-get'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { DeviceHistory } from './device-history'
import { DeviceActionDialog } from './device-forms'
import { SignatureDialog } from './signature-dialog'
import { EnrollmentDialog } from './enrollment-dialog'
import { CredentialList } from './credential-list'
import { DeviceResults } from './device-results'
import { DeviceState } from '../enums/device-state'

export function DeviceDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itDevices')
  const query = useDeviceGet(id)
  const device = query.data?.data
  const [action, setAction] = useState<
    'holder' | 'retire' | 'signature' | 'enroll' | 'credentials' | 'usage' | 'status' | 'rejections'
  >()
  const back = () => setAction(undefined)
  if (device) {
    if (action === 'holder' || action === 'retire')
      return <DeviceActionDialog device={device} action={action} onClose={back} />
    if (action === 'signature' && device.registrationId)
      return <SignatureDialog deviceId={id} registrationId={device.registrationId} onClose={back} />
    if (action === 'enroll' && device.registrationId)
      return <EnrollmentDialog registrationId={device.registrationId} onClose={back} />
    if (action === 'credentials' && device.registrationId)
      return <CredentialList deviceId={id} registrationId={device.registrationId} onClose={back} />
    if (action === 'usage' || action === 'status' || action === 'rejections')
      return <DeviceResults id={id} kind={action} onClose={back} />
  }
  const known = device && Object.values(DeviceState).some((value) => value === device.state)
  return (
    <ItDetailDialog title={device?.assetCode ?? translate('detail')} onClose={onClose}>
      <ItQueryState query={query}>
        {device ? (
          <div className='space-y-5'>
            <div className='flex flex-wrap gap-2'>
              {known && device.state !== DeviceState.RETIRED && (
                <>
                  <button type='button' className={itButtonClass} onClick={() => setAction('holder')}>
                    {translate('holder')}
                  </button>
                  <button type='button' className={itButtonClass} onClick={() => setAction('retire')}>
                    {translate('retire')}
                  </button>
                  {device.registrationId && (
                    <button type='button' className={itButtonClass} onClick={() => setAction('signature')}>
                      {translate('signature')}
                    </button>
                  )}
                  {device.registrationId && device.state === DeviceState.ACTIVE && (
                    <button type='button' className={itButtonClass} onClick={() => setAction('enroll')}>
                      {translate('enroll')}
                    </button>
                  )}
                </>
              )}
              {device.registrationId && (
                <button type='button' className={itButtonClass} onClick={() => setAction('credentials')}>
                  {translate('credentials')}
                </button>
              )}
              {(['usage', 'status', 'rejections'] as const).map((kind) => (
                <button key={kind} type='button' className={itButtonClass} onClick={() => setAction(kind)}>
                  {translate(kind)}
                </button>
              ))}
            </div>
            <DeviceHistory device={device} />
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </ItDetailDialog>
  )
}
