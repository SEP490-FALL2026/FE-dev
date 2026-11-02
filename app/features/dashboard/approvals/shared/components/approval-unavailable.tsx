import { useTranslation } from 'react-i18next'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsButton, ApprovalsPage } from './approvals-ui'

export function ApprovalUnavailable({ onSelectTab }: { onSelectTab: (tab: ApprovalTabKey) => void }) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateNeed } = useTranslation('approvalsNeed')
  return (
    <ApprovalsPage title={translate('unsupportedTitle')}>
      <p className='max-w-2xl text-sm text-muted-foreground'>{translate('unsupported')}</p>
      <div className='flex flex-wrap gap-3'>
        <ApprovalsButton onClick={() => onSelectTab('queue')}>{translate('queue')}</ApprovalsButton>
        <ApprovalsButton onClick={() => onSelectTab('annual-budget')}>{translateNeed('annualBudget')}</ApprovalsButton>
      </div>
    </ApprovalsPage>
  )
}
