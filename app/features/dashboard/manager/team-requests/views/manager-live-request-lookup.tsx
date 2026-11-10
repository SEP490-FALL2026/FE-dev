import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ManagerDepartmentRequests } from '../components/manager-department-requests'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerNeedQueue } from '../components/manager-need-queue'

export function ManagerRequestLookup({ history, onOpen }: { history?: boolean; onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='space-y-5'>
      <ManagerPageHeader title={translate('requests')} icon={ClipboardCheck} />
      {!history && <ManagerNeedQueue onOpen={onOpen} />}
      <ManagerDepartmentRequests ended={history} onOpen={onOpen} />
    </div>
  )
}
