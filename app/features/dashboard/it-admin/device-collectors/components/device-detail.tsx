import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceGet } from '~/shared/api/generated/operations/devices/device-get'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { DeviceHistory } from './device-history'
import { DeviceActionDialog } from './device-forms'
import { CredentialList } from './credential-list'
import { DeviceResults } from './device-results'
import { DeviceState } from '../enums/device-state'
import { DeviceSection } from '../enums/device-section'
import { DevicePage } from './device-page'
import { RegistrationHistory } from './registration-history'

export function DeviceDetail({
  id,
  onClose,
  section: controlledSection,
  registrationId,
  credentialBack,
  onNavigate
}: {
  id: string
  onClose: () => void
  section?: DeviceSection
  registrationId?: string
  credentialBack?: 'history'
  onNavigate?: (section: DeviceSection, registrationId?: string, credentialBack?: 'history') => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const query = useDeviceGet(id)
  const device = query.data?.data
  const [action, setAction] = useState<'holder' | 'retire'>()
  const [localSection, setLocalSection] = useState<DeviceSection>('detail')
  const section = controlledSection ?? localSection
  const navigate = (next: DeviceSection, historyRegistrationId?: string, backTo?: 'history') => {
    if (onNavigate) onNavigate(next, historyRegistrationId, backTo)
    else setLocalSection(next)
  }
  const back = () => setAction(undefined)
  if (section === 'history')
    return (
      <RegistrationHistory
        id={id}
        onClose={() => navigate('detail')}
        onCredentials={(registration) => navigate('credentials', registration, 'history')}
      />
    )
  if (section === 'usage' || section === 'status' || section === 'rejections')
    return <DeviceResults id={id} kind={section} onClose={() => navigate('detail')} />
  const credentialsRegistration = registrationId ?? device?.registrationId
  if (section === 'credentials' && credentialsRegistration)
    return (
      <CredentialList
        deviceId={id}
        registrationId={credentialsRegistration}
        backLabel={translate(credentialBack === 'history' ? 'backToHistory' : 'backToDevice')}
        onClose={() => navigate(credentialBack === 'history' ? 'history' : 'detail')}
      />
    )
  if (device) {
    if (action === 'holder' || action === 'retire')
      return <DeviceActionDialog device={device} action={action} onClose={back} />
  }
  const known = device && Object.values(DeviceState).some((value) => value === device.state)
  return (
    <DevicePage
      title={device?.assetCode ?? translate('detail')}
      backLabel={translate('backToDevices')}
      onBack={onClose}
    >
      <ItQueryState query={query}>
        {device ? (
          <div className='space-y-5'>
            <DeviceHistory device={device} />
            <section
              className='space-y-4 rounded-lg border border-border bg-surface p-5'
              aria-label={translate('deviceActions')}
            >
              <h3 className='text-base font-semibold'>{translate('deviceActions')}</h3>
              <div className='flex flex-wrap gap-2'>
                {known && device.state !== DeviceState.RETIRED && (
                  <>
                    <button type='button' className={itButtonClass} onClick={() => setAction('holder')}>
                      {translate('holder')}
                    </button>
                    <button type='button' className={itButtonClass} onClick={() => setAction('retire')}>
                      {translate('retire')}
                    </button>
                  </>
                )}
                {device.registrationId && (
                  <button type='button' className={itButtonClass} onClick={() => navigate('credentials')}>
                    {translate('credentials')}
                  </button>
                )}
                {(['history', 'usage', 'status', 'rejections'] as const).map((kind) => (
                  <button key={kind} type='button' className={itButtonClass} onClick={() => navigate(kind)}>
                    {translate(kind)}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </DevicePage>
  )
}
