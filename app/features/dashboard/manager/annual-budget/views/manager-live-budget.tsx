import { useState } from 'react'
import { Landmark, Plus } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import {
  useBudgetProposalList,
  getBudgetProposalListQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import {
  useBudgetProposalGet,
  getBudgetProposalGetQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { useBudgetProposalLineList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-line-list'
import { budgetProposalWithdraw } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-withdraw'
import { getBudgetMineQueryKey } from '~/shared/api/generated/operations/budgets/budget-mine'
import { Dialog } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { ManagerCurrentBudget } from '../components/manager-current-budget'
import { PROPOSAL_STATE } from '../enums/budget-status'

export function managerBudgetYear(params: URLSearchParams) {
  const year = Number(params.get('year'))
  return Number.isInteger(year) && year >= 2000 && year <= 2200 ? year : new Date().getFullYear()
}
export function ManagerLiveBudget() {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const year = managerBudgetYear(params)
  const paging = useManagerPage()
  const query = useBudgetProposalList({ year, page: paging.page, pageSize: paging.pageSize })
  const proposalId = params.get('proposalId') ?? ''
  return (
    <div className='space-y-6'>
      <ManagerPageHeader
        title={translate('budget')}
        icon={Landmark}
        actions={
          <ManagerButton
            primary
            onClick={() =>
              void navigate({ pathname: '/dashboard/manager/annual-budget/new', search: params.toString() })
            }
          >
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('newProposal')}
          </ManagerButton>
        }
      />
      <ManagerField label={translate('year')}>
        <input
          className={`${managerInputClass} max-w-40`}
          type='number'
          min={2000}
          max={2200}
          value={year}
          onChange={(event) => {
            const value = event.target.value
            if (value.length !== 4) return
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('year', value)
              next.delete('page')
              next.delete('proposalId')
              return next
            })
          }}
        />
      </ManagerField>
      <div className='grid items-start gap-5 2xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]'>
        <ManagerCurrentBudget year={year} />
        <ManagerSection title={translate('proposals')}>
          <ManagerQueryState
            query={query}
            empty={!query.data?.data?.items.length}
            emptyTitle={translate('noProposals')}
            emptyDescription={translate('noProposalsHint')}
          />
          {!query.isError && (
            <ManagerDataTable
              label={translate('proposals')}
              items={query.data?.data?.items ?? []}
              rowKey={(proposal) => proposal.id}
              columns={[
                {
                  key: 'costCenter',
                  label: translate('costCenter'),
                  render: (proposal) => (
                    <div>
                      <p className='max-w-48 truncate font-medium' title={proposal.costCenter.name}>
                        {proposal.costCenter.name}
                      </p>
                      <p className='mt-1 font-mono text-xs text-muted-foreground'>{proposal.year}</p>
                    </div>
                  )
                },
                {
                  key: 'amount',
                  label: translate('total'),
                  align: 'right',
                  render: (proposal) => <ManagerMoney money={proposal.total} />
                },
                {
                  key: 'status',
                  label: translate('status'),
                  render: (proposal) => <ManagerStatus value={proposal.state} />
                }
              ]}
              onOpen={(proposal) =>
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('proposalId', proposal.id)
                  next.delete('linePage')
                  return next
                })
              }
            />
          )}
          <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
        </ManagerSection>
      </div>
      {isResourceId(proposalId) && <ProposalDetail key={proposalId} id={proposalId} />}
    </div>
  )
}
function ProposalDetail({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
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
  return (
    <Dialog
      presentation='drawer'
      title={translate('proposal')}
      onClose={() => {
        if (action.isPending) return
        setParams((previous) => {
          const next = new URLSearchParams(previous)
          next.delete('proposalId')
          next.delete('linePage')
          return next
        })
      }}
    >
      <ManagerQueryState query={query} empty={!proposal} />
      {proposal && (
        <>
          <div className='flex flex-wrap justify-between gap-3'>
            <p className='break-all font-mono text-xs'>{proposal.id}</p>
            <ManagerStatus value={proposal.state} />
          </div>
          {proposal.returned && (
            <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{proposal.returned.reason}</p>
          )}
          <ProposalLines id={id} />
          <div className='flex flex-wrap justify-end gap-3'>
            {(proposal.state === PROPOSAL_STATE.SUBMITTED || proposal.state === PROPOSAL_STATE.REVIEWED) && (
              <ManagerButton disabled={action.blocked} busy={action.isPending} onClick={() => setConfirm(true)}>
                {action.retrySeconds
                  ? translate('retryAfter', { seconds: action.retrySeconds })
                  : translate('withdraw')}
              </ManagerButton>
            )}
            {proposal.state === PROPOSAL_STATE.RETURNED && !proposal.successorProposalId && (
              <ManagerButton
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
          <ManagerActionState action={action} />
        </>
      )}
      {confirm && (
        <Dialog
          presentation='sheet'
          title={translate('withdraw')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirm(false)
          }}
        >
          <div className='flex justify-end gap-3'>
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
    </Dialog>
  )
}
function ProposalLines({ id }: { id: string }) {
  const paging = useManagerPage('linePage')
  const query = useBudgetProposalLineList(id, { page: paging.page, pageSize: paging.pageSize })
  return (
    <div>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((line) => (
          <div key={line.position} className='flex flex-wrap justify-between gap-3 border-b border-border/40 py-3'>
            <p className='min-w-0 flex-1 truncate text-sm' title={line.description}>
              {line.description}
            </p>
            <ManagerMoney money={line.amount} />
          </div>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </div>
  )
}
