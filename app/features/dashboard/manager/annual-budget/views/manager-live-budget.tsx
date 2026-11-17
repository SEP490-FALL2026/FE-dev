import { useState } from 'react'
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
import { budgetProposalWithdraw } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-withdraw'
import { getBudgetMineQueryKey } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useBudgetMineVersionList } from '~/shared/api/generated/operations/budgets/budget-mine-version-list'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { ManagerBudgetContext } from '../components/manager-budget-context'
import { useBudgetContext } from '../hooks/use-budget-context'
import { ManagerCurrentBudget } from '../components/manager-current-budget'
import { ManagerBudgetFiles } from '../components/manager-budget-files'
import { ManagerBudgetVersions } from '../components/manager-budget-versions'
import { ManagerVersionFiles } from '../components/manager-version-files'
import { PROPOSAL_STATE } from '../enums/budget-status'
import { ManagerBudgetNavigation } from '../components/manager-budget-navigation'
import { budgetView } from '../budget-navigation'
import { ManagerInYearBudget } from './manager-in-year-budget'
import { useBudgetScope } from '../hooks/use-budget-scope'

export function managerBudgetYear(params: URLSearchParams) {
  const year = Number(params.get('year'))
  return Number.isInteger(year) && year >= 2000 && year <= 2200 ? year : new Date().getFullYear()
}
export function ManagerLiveBudget() {
  const { t: translate } = useTranslation('manager')
  const [params, setParams] = useSearchParams()
  const year = managerBudgetYear(params)
  const scope = useBudgetScope()
  const view = budgetView(params.get('budgetView'))
  const paging = useManagerPage()
  const query = useBudgetProposalList(
    { year, page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: view === 'annual' } }
  )
  const proposalId = params.get('proposalId') ?? ''
  const versionId = params.get('versionId') ?? ''
  const budgetContext = useBudgetContext(year)
  return (
    <div className='space-y-6'>
      <ManagerBudgetNavigation year={year} view={view} canPropose={budgetContext.cycleOpen} />
      {view === 'annual' ? (
        <>
          <div className='grid items-start gap-5 2xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]'>
            <div className='space-y-6'>
              <ManagerBudgetContext year={year} context={budgetContext} />
              <ManagerCurrentBudget year={year} />
              <ManagerBudgetVersions
                year={year}
                costCenterId={scope.costCenterId}
                onOpenVersion={(version) =>
                  setParams((previous) => {
                    const next = new URLSearchParams(previous)
                    next.set('versionId', version.id)
                    next.delete('versionFilePage')
                    return next
                  })
                }
              />
            </div>
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
                      const unit = scope.units.find((item) => item.costCenterId === proposal.costCenter.id)
                      if (unit) {
                        next.set('departmentId', unit.departmentId)
                        next.set('costCenterId', proposal.costCenter.id)
                      }
                      next.set('proposalId', proposal.id)
                      return next
                    })
                  }
                />
              )}
              <ManagerPagination
                pagination={query.data?.data?.pagination}
                onPage={paging.onPage}
                busy={query.isFetching}
              />
            </ManagerSection>
          </div>
          {isResourceId(proposalId) && (
            <ProposalDetail
              key={proposalId}
              id={proposalId}
              year={year}
              costCenterId={scope.costCenterId}
              cycleOpen={budgetContext.cycleOpen}
            />
          )}
          {isResourceId(versionId) && (
            <VersionDetail key={versionId} id={versionId} year={year} costCenterId={scope.costCenterId} />
          )}
        </>
      ) : (
        <ManagerInYearBudget key={`${year}:${scope.departmentId}:${view}`} year={year} view={view} scope={scope} />
      )}
    </div>
  )
}
function ProposalDetail({
  id,
  year,
  costCenterId,
  cycleOpen
}: {
  id: string
  year: number
  costCenterId?: string
  cycleOpen: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const query = useBudgetProposalGet(id)
  const response = !query.isError ? query.data?.data?.proposal : null
  const proposal =
    response?.id === id && response.year === year && response.costCenter.id === costCenterId ? response : null
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
          return next
        })
      }}
    >
      <ManagerQueryState query={query} empty={!proposal} emptyTitle={translate('budgetWorkspace.unavailable')} />
      {proposal && (
        <>
          <div className='flex flex-wrap gap-3'>
            <ManagerStatus value={proposal.state} />
          </div>
          {proposal.returned && (
            <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger'>
              <p className='font-semibold'>{translate('returned')}</p>
              <p className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>{proposal.returned.reason}</p>
            </div>
          )}
          <ProposalAmount money={proposal.requestedAmount} note={proposal.note} />
          <ManagerBudgetFiles id={id} />
          <div className='flex flex-wrap justify-end gap-3'>
            {cycleOpen && proposal.state === PROPOSAL_STATE.SUBMITTED && (
              <ManagerButton disabled={action.blocked} busy={action.isPending} onClick={() => setConfirm(true)}>
                {action.retrySeconds
                  ? translate('retryAfter', { seconds: action.retrySeconds })
                  : translate('withdraw')}
              </ManagerButton>
            )}
            {cycleOpen && proposal.state === PROPOSAL_STATE.RETURNED && !proposal.successorProposalId && (
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
      {confirm && proposal && cycleOpen && (
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
function VersionDetail({ id, year, costCenterId }: { id: string; year: number; costCenterId?: string }) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const [, setParams] = useSearchParams()
  const paging = useManagerPage('versionPage')
  const enabled = isResourceId(costCenterId ?? '')
  const versionsQuery = useBudgetMineVersionList(
    { year, costCenterId, page: paging.page, pageSize: paging.pageSize },
    { query: { enabled } }
  )
  const version = !versionsQuery.isError
    ? versionsQuery.data?.data?.items?.find((item) => item.id === id && item.year === year)
    : null

  return (
    <Dialog
      presentation='drawer'
      title={version ? translate('versionNumber', { number: version.number }) : translate('version')}
      onClose={() => {
        setParams((previous) => {
          const next = new URLSearchParams(previous)
          next.delete('versionId')
          next.delete('versionFilePage')
          return next
        })
      }}
    >
      <div className='space-y-6'>
        <ManagerQueryState
          query={{ ...versionsQuery, isPending: enabled && versionsQuery.isPending }}
          empty={!version}
        />
        {version && (
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-surface-subtle p-3.5'>
            <div>
              <p className='text-xs text-muted-foreground'>{translate('sentAt')}</p>
              <p className='mt-0.5 font-mono text-xs font-semibold tabular-nums text-foreground'>
                {formatDateTime(version.sentAt)}
              </p>
            </div>
            <ManagerStatus value={version.state} />
          </div>
        )}
        {version && <ManagerVersionFiles versionId={id} />}
      </div>
    </Dialog>
  )
}
function ProposalAmount({ money, note }: { money: { amount: string; currency: string }; note: string | null }) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='space-y-2 rounded-xl border border-border/60 bg-surface p-3.5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-xs text-muted-foreground'>{translate('amount')}</p>
        <p className='text-right font-mono font-semibold tabular-nums text-foreground'>
          <ManagerMoney money={money} />
        </p>
      </div>
      {note && <p className='whitespace-pre-wrap text-sm [overflow-wrap:anywhere]'>{note}</p>}
    </div>
  )
}
