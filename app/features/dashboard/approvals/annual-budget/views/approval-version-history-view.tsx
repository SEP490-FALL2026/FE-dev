import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionGet } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage } from '../../shared/components/approvals-ui'
import { ApprovalAnnualBudgetHistory } from '../components/approval-annual-budget-history'
import type { ApprovalBudgetViewProps } from '../budget-view-props'

/** The change history of one budget version, on its own screen; back returns to the version. */
export function ApprovalVersionHistoryView({ itemId, onSelectTab }: ApprovalBudgetViewProps) {
  const { t: translate } = useTranslation('approvalsBudget')
  const query = useBudgetVersionGet(itemId ?? '', { query: { enabled: Boolean(itemId) } })
  const version = query.data?.data?.version
  return (
    <ApprovalsPage
      title={translate('history')}
      description={
        version
          ? translate('versionSubtitle', { code: version.costCenter.code, year: version.year, number: version.number })
          : undefined
      }
      actions={
        <ApprovalsButton
          variant='ghost'
          onClick={() => onSelectTab('annual-budget', itemId ? { id: itemId } : undefined)}
        >
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('backToVersion')}
        </ApprovalsButton>
      }
    >
      {itemId ? <ApprovalAnnualBudgetHistory itemId={itemId} /> : <ApprovalsEmpty />}
    </ApprovalsPage>
  )
}
