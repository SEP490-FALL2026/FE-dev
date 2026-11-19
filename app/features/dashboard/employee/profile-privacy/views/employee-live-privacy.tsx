import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MyDevicePrivacy } from '~/entities/device/components/my-device-privacy'
import { WorkspaceSection } from '~/shared/ui/workspace-section'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'

export function EmployeeLivePrivacy() {
  const { t: translate } = useTranslation('employee')
  const { t: privacyTranslate } = useTranslation('devicePrivacy')
  return (
    <div className='space-y-6'>
      <EmployeePageHeader title={translate('privacy')} icon={ShieldCheck} />
      <MyDevicePrivacy />
      <WorkspaceSection title={privacyTranslate('export')}>
        <p className='text-sm text-muted-foreground'>{privacyTranslate('exportUnavailable')}</p>
      </WorkspaceSection>
    </div>
  )
}
