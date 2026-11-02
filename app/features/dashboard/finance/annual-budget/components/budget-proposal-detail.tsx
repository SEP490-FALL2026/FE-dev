import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalGet } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { useBudgetProposalLineList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-line-list'
import { useBudgetProposalReturn } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-return'
import { useBudgetVersionCreate } from '~/shared/api/generated/operations/budget-versions/budget-version-create'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys } from '../budget-query-keys'
import type { BudgetViewProps } from '../budget-view-props'
import { proposalState } from '../enums/proposal-state'
import { BudgetVersionForm } from './budget-version-form'
import { BudgetPlanLineFacts } from './budget-plan-line-facts'

export function BudgetProposalDetail({ itemId, onSelectTab }: BudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<'return' | 'create'>()
  const [reason, setReason] = useState('')
  const [linePosition, setLinePosition] = useState<number>()
  const query = useBudgetProposalGet(itemId)
  const linesQuery = useBudgetProposalLineList(itemId, { page, pageSize: 20 })
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
  const lines = linesQuery.data?.data
  const selectedLine = lines?.items.find((line) => line.position === linePosition)
  if (proposal && dialog === 'create')
    return (
      <BudgetVersionForm
        allowReason={false}
        initial={{
          base: proposal.total,
          reserve: { amount: '0', currency: proposal.total.currency },
          highValuePercent: 10
        }}
        pending={createMutation.isPending}
        disabled={query.isError || query.isFetching || proposal.state !== proposalState.SUBMITTED}
        onClose={() => setDialog(undefined)}
        onSubmit={(figures) =>
          createMutation.mutate({
            data: {
              proposalId: itemId,
              base: figures.base,
              reserve: figures.reserve,
              highValuePercent: figures.highValuePercent,
              highValueAmount: figures.highValueAmount,
              quarters: figures.quarters
            }
          })
        }
      />
    )
  return (
    <FinancePage
      title={translate('proposals')}
      actions={<FinanceButton onClick={() => onSelectTab?.('annual-proposals')}>{translate('back')}</FinanceButton>}
    >
      <FinanceQueryState query={query}>
        {proposal ? (
          <>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='min-w-0'>
                <h2 className='truncate text-lg font-semibold' title={proposal.costCenter.name}>
                  {proposal.costCenter.name}
                </h2>
                <p className='font-mono tabular-nums'>{proposal.year}</p>
              </div>
              <FinanceStatus value={proposal.state} />
              <p className='font-mono tabular-nums'>{formatMoney(proposal.total, i18n.language)}</p>
            </div>
            {proposal.returned && <p>{proposal.returned.reason}</p>}
            {proposal.state === proposalState.SUBMITTED && (
              <div className='flex flex-wrap gap-2'>
                <FinanceButton variant='primary' onClick={() => setDialog('create')}>
                  {translate('actions.create')}
                </FinanceButton>
                <FinanceButton onClick={() => setDialog('return')}>{translate('actions.return')}</FinanceButton>
              </div>
            )}
            <h3 className='font-semibold'>{translate('lines')}</h3>
            <FinanceQueryState query={linesQuery}>
              <FinanceTable
                items={lines?.items ?? []}
                rowKey={(line) => String(line.position)}
                onOpen={(line) => setLinePosition(line.position)}
                columns={[
                  {
                    key: 'position',
                    label: translate('fields.position'),
                    numeric: true,
                    render: (line) => line.position
                  },
                  { key: 'description', label: translate('fields.description'), render: (line) => line.description },
                  {
                    key: 'amount',
                    label: translate('fields.amount'),
                    numeric: true,
                    render: (line) => formatMoney(line.amount, i18n.language)
                  },
                  {
                    key: 'seats',
                    label: translate('fields.seats'),
                    numeric: true,
                    render: (line) => line.seats ?? translate('none')
                  }
                ]}
              />
              <FinancePagination pagination={lines?.pagination} onPageChange={setPage} />
            </FinanceQueryState>
            {selectedLine && <BudgetPlanLineFacts line={selectedLine} onClose={() => setLinePosition(undefined)} />}
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
          <FinanceField label={translate('fields.reason')}>
            <textarea
              required
              maxLength={1000}
              className={financeInputClass}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </FinanceField>
        </FinanceFormDialog>
      )}
    </FinancePage>
  )
}
