import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useBudgetProposalGet } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import {
  ApprovalsButton,
  ApprovalsEmpty,
  ApprovalsPage,
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { formatMoney } from '../../shared/approvals-money'
import type { ApprovalBudgetViewProps } from '../budget-view-props'
import { ApprovalBudgetAttachments } from './approval-budget-attachments'

export function ApprovalBudgetProposalDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const query = useBudgetProposalGet(itemId)
  const proposal = query.data?.data?.proposal
  return (
    <ApprovalsPage
      title={proposal ? proposal.costCenter.name : translate('proposalTitle')}
      description={translate('readOnly')}
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('annual-budget')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </ApprovalsButton>
      }
    >
      <ApprovalsQueryState query={query}>
        {proposal ? (
          <div className='space-y-6'>
            <ApprovalsStatus value={proposal.state} />
            <ApprovalsStatGrid>
              <ApprovalsStat label={translate('total')} value={formatMoney(proposal.total, i18n.language)} emphasis />
              <ApprovalsStat label={translate('year')} value={proposal.year} />
              <ApprovalsStat label={translate('submittedAt')} value={formatDate(proposal.submittedAt)} />
            </ApprovalsStatGrid>
            <ApprovalsSection title={translate('proposalInfo')}>
              <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
                <div className='min-w-0'>
                  <dt className='text-xs text-muted-foreground'>{translate('center')}</dt>
                  <dd className='mt-1 truncate font-mono text-sm tabular-nums' title={proposal.costCenter.code}>
                    {proposal.costCenter.code}
                  </dd>
                </div>
                <div className='min-w-0'>
                  <dt className='text-xs text-muted-foreground'>{translate('submittedBy')}</dt>
                  <dd className='mt-1 truncate text-sm' title={proposal.submittedBy?.fullName}>
                    {proposal.submittedBy?.fullName ?? translate('unavailable')}
                  </dd>
                </div>
              </dl>
            </ApprovalsSection>
            {proposal.returned && (
              <ApprovalsSection title={translate('returnedTitle')}>
                <div className='space-y-2 rounded-lg border border-border/70 bg-surface p-4'>
                  <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{proposal.returned.reason}</p>
                  <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                    {formatDateTime(proposal.returned.at)}
                  </p>
                </div>
              </ApprovalsSection>
            )}
            {proposal.note && (
              <ApprovalsSection title={translate('note')}>
                <p className='rounded-lg border border-border/70 bg-surface p-4 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>
                  {proposal.note}
                </p>
              </ApprovalsSection>
            )}
            <ApprovalBudgetAttachments target='proposal' ownerId={itemId} />
          </div>
        ) : (
          <ApprovalsEmpty />
        )}
      </ApprovalsQueryState>
    </ApprovalsPage>
  )
}
