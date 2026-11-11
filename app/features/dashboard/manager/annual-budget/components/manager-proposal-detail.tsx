import { useState } from 'react'
import { Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { DetailDrawer } from '~/shared/ui/detail-drawer'
import {
  useBudgetProposalGet,
  getBudgetProposalGetQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { budgetProposalWithdraw } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-withdraw'
import { getBudgetMineQueryKey } from '~/shared/api/generated/operations/budgets/budget-mine'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import {
  ManagerActionState,
  ManagerButton,
  ManagerMoney,
  ManagerQueryState,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { PROPOSAL_STATE } from '../enums/budget-status'
import { ManagerBudgetFiles } from './manager-budget-files'
import { ManagerProposalLines } from './manager-proposal-lines'

export function ManagerProposalDetail({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const query = useBudgetProposalGet(id)
  const proposal = !query.isError ? query.data?.data?.proposal : null
  const [confirm, setConfirm] = useState(false)
  const action = useManagerAction({
    mutationFn: () => budgetProposalWithdraw(id),
    invalidate: [getBudgetProposalGetQueryKey(id), getBudgetProposalListQueryKey(), getBudgetMineQueryKey()],
    onSuccess: () => setConfirm(false)
  })
  const canWithdraw =
    proposal && (proposal.state === PROPOSAL_STATE.SUBMITTED || proposal.state === PROPOSAL_STATE.REVIEWED)
  const canRevise = proposal?.state === PROPOSAL_STATE.RETURNED && !proposal.successorProposalId
  return (
    <DetailDrawer
      title={translate('proposal')}
      closeLabel={translate('close')}
      closeDisabled={action.isPending}
      onClose={() => {
        if (action.isPending) return
        setParams((previous) => {
          const next = new URLSearchParams(previous)
          next.delete('proposalId')
          next.delete('linePage')
          return next
        })
      }}
      footer={
        proposal && (canWithdraw || canRevise || action.uncertain) ? (
          <div className='space-y-3'>
            <ManagerActionState action={action} />
            <div className='flex flex-wrap items-center justify-end gap-3'>
              {canWithdraw && (
                <ManagerButton disabled={action.blocked} busy={action.isPending} onClick={() => setConfirm(true)}>
                  <Undo2 aria-hidden strokeWidth={1.5} className='size-4' />
                  {action.retrySeconds
                    ? translate('retryAfter', { seconds: action.retrySeconds })
                    : translate('withdraw')}
                </ManagerButton>
              )}
              {canRevise && (
                <ManagerButton
                  primary
                  onClick={() =>
                    void navigate({
                      pathname: `/dashboard/manager/annual-budget/${id}/revise`,
                      search: params.toString()
                    })
                  }
                >
                  {translate('resubmit')}
                </ManagerButton>
              )}
            </div>
          </div>
        ) : undefined
      }
    >
      <ManagerQueryState query={query} empty={!proposal} />
      {proposal && (
        <div className='space-y-6'>
          <section aria-label={translate('proposal')} className='space-y-5'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <h3 className='min-w-0 text-lg leading-snug font-semibold break-words'>{proposal.costCenter.name}</h3>
              <ManagerStatus value={proposal.state} />
            </div>
            <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <dt className='text-xs text-muted-foreground'>{translate('year')}</dt>
                <dd className='font-mono text-sm tabular-nums'>{proposal.year}</dd>
              </div>
              <div className='space-y-1.5 sm:text-right'>
                <dt className='text-xs text-muted-foreground'>{translate('budgetHistory.total')}</dt>
                <dd className='text-xl font-semibold [overflow-wrap:anywhere]'>
                  <ManagerMoney money={proposal.total} />
                </dd>
              </div>
              <div className='min-w-0 space-y-1.5'>
                <dt className='text-xs text-muted-foreground'>{translate('budgetHistory.submittedBy')}</dt>
                <dd className='text-sm break-words'>{proposal.submittedBy?.fullName || translate('unknownPerson')}</dd>
              </div>
              <div className='space-y-1.5 sm:text-right'>
                <dt className='text-xs text-muted-foreground'>{translate('submittedAt')}</dt>
                <dd className='font-mono text-xs tabular-nums'>{formatDateTime(proposal.submittedAt)}</dd>
              </div>
            </dl>
          </section>
          {proposal.returned && (
            <section
              aria-label={translate('returned')}
              className='space-y-2 rounded-md border border-warning/25 bg-warning/10 p-4'
            >
              <h3 className='text-sm font-medium text-warning-ink'>{translate('returned')}</h3>
              <p className='text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]'>
                {proposal.returned.reason}
              </p>
              <p className='text-xs text-muted-foreground'>{translate('budgetHistory.reviseHint')}</p>
            </section>
          )}
          <ManagerProposalLines id={id} />
          <ManagerBudgetFiles id={id} />
        </div>
      )}
      {confirm && (
        <Dialog
          presentation='sheet'
          title={translate('withdraw')}
          hint={translate('budgetHistory.withdrawHint')}
          onClose={() => {
            if (!action.isPending) setConfirm(false)
          }}
        >
          <p className='text-sm leading-relaxed text-muted-foreground'>
            {translate('budgetHistory.withdrawDescription')}
          </p>
          <div className='mt-5 flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirm(false)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              disabled={action.blocked}
              busy={action.isPending}
              onClick={() => {
                if (!action.blocked) action.mutate()
              }}
            >
              {translate('confirm')}
            </ManagerButton>
          </div>
        </Dialog>
      )}
    </DetailDrawer>
  )
}
