import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalGet } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { useBudgetProposalReturn } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-return'
import { useBudgetVersionCreate } from '~/shared/api/generated/operations/budget-versions/budget-version-create'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinanceQueryState,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys } from '../budget-query-keys'
import type { BudgetViewProps } from '../budget-view-props'
import { proposalState } from '../enums/proposal-state'
import { BudgetVersionForm } from './budget-version-form'
import { BudgetAttachments } from './budget-attachments'

export function BudgetProposalDetail({ itemId, onSelectTab }: BudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const [dialog, setDialog] = useState<'return' | 'create'>()
  const [reason, setReason] = useState('')
  const query = useBudgetProposalGet(itemId)
  const feedback = useFinanceFeedback(budgetQueryKeys(undefined, itemId), () => setDialog(undefined))
  const returnMutation = useBudgetProposalReturn({ mutation: feedback })
  const createMutation = useBudgetVersionCreate({
    mutation: {
      onError: feedback.onError,
      onSuccess: async (result) => {
        await feedback.onSuccess()
        if (result.data?.version) onSelectTab?.('budget-negotiation', { id: result.data.version.id })
      }
    }
  })
  const proposal = query.data?.data?.proposal
  if (proposal && dialog === 'create')
    return (
      <BudgetVersionForm
        initial={{
          base: { amount: (proposal.requestedAmount ?? proposal.total).amount }
        }}
        currency={proposal.total.currency}
        pending={createMutation.isPending}
        disabled={query.isError || query.isFetching || proposal.state !== proposalState.SUBMITTED}
        onClose={() => setDialog(undefined)}
        onSubmit={(figures) =>
          createMutation.mutate({
            data: {
              source: 'PROPOSAL',
              proposalId: itemId,
              base: figures.base,
              reserve: figures.reserve,
              reservePercent: figures.reservePercent,
              reserveReason: figures.reserveReason
            }
          })
        }
      />
    )
  return (
    <FinancePage
      title={translate('proposals')}
      actions={
        <FinanceButton variant='ghost' onClick={() => onSelectTab?.('annual-proposals')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={query}>
        {proposal ? (
          <>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='truncate text-lg font-semibold tracking-tight' title={proposal.costCenter.name}>
                {proposal.costCenter.name}
              </h2>
              <FinanceStatus value={proposal.state} />
            </div>
            <FinanceStatGrid>
              <FinanceStat label={translate('fields.year')} value={proposal.year} />
              <FinanceStat
                emphasis
                label={translate('fields.total')}
                value={formatMoney(proposal.requestedAmount ?? proposal.total, i18n.language)}
              />
            </FinanceStatGrid>
            {proposal.note && (
              <p className='rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-sm break-words [text-wrap:pretty]'>
                {proposal.note}
              </p>
            )}
            <dl className='grid gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-sm sm:grid-cols-2'>
              {proposal.submittedBy && (
                <ProposalItem
                  label={translate('detail.submittedBy')}
                  value={`${proposal.submittedBy.fullName} (${proposal.submittedBy.employeeCode})`}
                />
              )}
              <ProposalItem
                label={translate('detail.submittedAt')}
                value={new Date(proposal.submittedAt).toLocaleString(i18n.language)}
              />
              {proposal.returned && (
                <>
                  <ProposalItem label={translate('detail.returnReason')} value={proposal.returned.reason} />
                  {proposal.returned.by && (
                    <ProposalItem
                      label={translate('detail.returnedBy')}
                      value={`${proposal.returned.by.fullName} (${proposal.returned.by.employeeCode})`}
                    />
                  )}
                  <ProposalItem
                    label={translate('detail.returnedAt')}
                    value={new Date(proposal.returned.at).toLocaleString(i18n.language)}
                  />
                </>
              )}
              {proposal.withdrawnAt && (
                <ProposalItem
                  label={translate('detail.withdrawnAt')}
                  value={new Date(proposal.withdrawnAt).toLocaleString(i18n.language)}
                />
              )}
              {proposal.closedAt && (
                <ProposalItem
                  label={translate('detail.closedAt')}
                  value={new Date(proposal.closedAt).toLocaleString(i18n.language)}
                />
              )}
            </dl>
            {(proposal.previousProposalId || proposal.successorProposalId) && (
              <div className='flex flex-wrap items-center gap-2 text-sm'>
                {proposal.previousProposalId && (
                  <>
                    <span className='text-muted-foreground'>{translate('detail.resubmissionOf')}</span>
                    <FinanceButton
                      variant='ghost'
                      onClick={() => onSelectTab?.('annual-proposals', { id: proposal.previousProposalId ?? '' })}
                    >
                      {translate('detail.openPrevious')}
                    </FinanceButton>
                  </>
                )}
                {proposal.successorProposalId && (
                  <FinanceButton
                    variant='ghost'
                    onClick={() => onSelectTab?.('annual-proposals', { id: proposal.successorProposalId ?? '' })}
                  >
                    {translate('detail.openSuccessor')}
                  </FinanceButton>
                )}
              </div>
            )}
            {proposal.state === proposalState.SUBMITTED && (
              <div className='flex flex-wrap gap-2'>
                <FinanceButton variant='primary' onClick={() => setDialog('create')}>
                  {translate('actions.create')}
                </FinanceButton>
                <FinanceButton onClick={() => setDialog('return')}>{translate('actions.return')}</FinanceButton>
              </div>
            )}
            <BudgetAttachments target='proposal' ownerId={itemId} />
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
      {dialog === 'return' && (
        <FinanceFormDialog
          title={translate('actions.return')}
          pending={returnMutation.isPending}
          onClose={() => setDialog(undefined)}
          submitLabel={translate('actions.confirmReturn')}
          submitDisabled={
            !reason.trim() || query.isError || query.isFetching || proposal?.state !== proposalState.SUBMITTED
          }
          onSubmit={(event) => {
            event.preventDefault()
            if (reason.trim()) returnMutation.mutate({ id: itemId, data: { reason: reason.trim() } })
          }}
        >
          <FinanceField required label={translate('fields.reason')} hint={translate('returnHint')}>
            <textarea
              required
              rows={4}
              maxLength={1000}
              className={financeInputClass}
              placeholder={translate('placeholders.returnReason')}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </FinanceField>
        </FinanceFormDialog>
      )}
    </FinancePage>
  )
}

function ProposalItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0'>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 break-words [text-wrap:pretty]'>{value}</dd>
    </div>
  )
}
