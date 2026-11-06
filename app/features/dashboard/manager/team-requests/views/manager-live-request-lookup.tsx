import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { ManagerSection } from '../../shared/components/manager-api-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerNeedQueue } from '../components/manager-need-queue'

export function ManagerRequestLookup({ history, onOpen }: { history?: boolean; onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='space-y-5'>
      <ManagerPageHeader title={translate('requests')} icon={ClipboardCheck} />
      {history ? (
        <ManagerSection title={translate('needQueue')}>
          <WorkspaceEmptyState
            icon={ClipboardCheck}
            title={translate('needQueueUnavailable')}
            description={translate('noHistory')}
          />
        </ManagerSection>
      ) : (
        <ManagerNeedQueue onOpen={onOpen} />
      )}
    </div>
  )
}
