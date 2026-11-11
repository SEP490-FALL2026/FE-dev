import { ArrowLeft, FileSearch, History } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionGet } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { versionState } from '../enums/version-state'
import type { ApprovalBudgetViewProps } from '../budget-view-props'
import { ApprovalAnnualBudgetDecision } from './approval-annual-budget-decision'
import { ApprovalAnnualBudgetLines } from './approval-annual-budget-lines'
import { ApprovalAnnualBudgetSummary, ApprovalBudgetWaitingNotice } from './approval-annual-budget-summary'
import { ApprovalBudgetAttachments } from './approval-budget-attachments'

export function ApprovalAnnualBudgetDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const query = useBudgetVersionGet(itemId)
  const identity = useMeGet()
  const version = query.data?.data?.version
  const [decisionOpen, setDecisionOpen] = useState(false)
  const employeeId = identity.data?.data?.employee.id
  const isSpendingApprover = identity.data?.data?.roles.includes('SPENDING_APPROVER') === true
  const ownVersion = !!employeeId && employeeId === version?.createdBy?.employeeId
  const canDecide =
    version?.state === versionState.SENT &&
    isSpendingApprover &&
    !!employeeId &&
    !ownVersion &&
    !identity.isError &&
    !identity.isFetching &&
    !query.isError &&
    !query.isFetching
  return (
    <ApprovalsPage
      title={version ? version.costCenter.name : translate('versionTitle')}
      description={
        version
          ? translate('versionSubtitle', { code: version.costCenter.code, year: version.year, number: version.number })
          : undefined
      }
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('annual-budget')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </ApprovalsButton>
      }
    >
      <ApprovalsQueryState query={query}>
        {version ? (
          <div className='space-y-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <ApprovalsStatus value={version.state} />
              <div className='flex flex-wrap gap-2'>
                {version.proposalId && (
                  <ApprovalsButton
                    variant='ghost'
                    onClick={() => onSelectTab('annual-budget', { id: `proposal:${version.proposalId}` })}
                  >
                    <FileSearch aria-hidden className='size-4' strokeWidth={1.5} />
                    {translate('relatedProposal')}
                  </ApprovalsButton>
                )}
                <ApprovalsButton onClick={() => onSelectTab('version-history', { id: itemId })}>
                  <History aria-hidden className='size-4' strokeWidth={1.5} />
                  {translate('history')}
                </ApprovalsButton>
                <ApprovalsQueryState query={identity}>
                  {canDecide && (
                    <ApprovalsButton variant='primary' onClick={() => setDecisionOpen(true)}>
                      {translate('reviewDecision')}
                    </ApprovalsButton>
                  )}
                </ApprovalsQueryState>
              </div>
            </div>
            <ApprovalBudgetWaitingNotice reason={version.waitingReason} />
            {ownVersion && (
              <p role='status' className='rounded-lg border border-border bg-surface-subtle p-4 text-sm'>
                {translate('ownVersion')}
              </p>
            )}
            <ApprovalAnnualBudgetSummary version={version} />
            <ApprovalAnnualBudgetLines itemId={itemId} />
            <ApprovalBudgetAttachments target='version' ownerId={itemId} />
          </div>
        ) : (
          <ApprovalsEmpty />
        )}
      </ApprovalsQueryState>
      {decisionOpen && (
        <ApprovalAnnualBudgetDecision itemId={itemId} disabled={!canDecide} onClose={() => setDecisionOpen(false)} />
      )}
    </ApprovalsPage>
  )
}
