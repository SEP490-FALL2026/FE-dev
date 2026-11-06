import { FileText, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeButton } from '../../shared/components/employee-api-ui'
import type { EmployeeTabKey } from '../../enums'
import { EmployeeSubmittedRequests } from '../components/employee-submitted-requests'
import { EmployeeDraftRequests } from '../components/employee-draft-requests'

export function EmployeeLiveRequestsView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const open = (id: string) => onSelectTab('request-detail', { id })
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('myRequests')}
        icon={FileText}
        actions={
          <EmployeeButton primary onClick={() => onSelectTab('create-request')}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('create')}
          </EmployeeButton>
        }
      />
      <EmployeeSubmittedRequests onOpen={open} />
      <EmployeeDraftRequests onSelectTab={onSelectTab} />
    </div>
  )
}
