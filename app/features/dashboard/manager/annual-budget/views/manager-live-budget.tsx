import { useState } from 'react'
import { ChevronLeft, ChevronRight, Landmark, Plus } from 'lucide-react'
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
import { useBudgetMineVersionList } from '~/shared/api/generated/operations/budgets/budget-mine-version-list'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
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
import { ManagerBudgetContext } from '../components/manager-budget-context'
import { ManagerCurrentBudget } from '../components/manager-current-budget'
import { ManagerBudgetFiles } from '../components/manager-budget-files'
import { ManagerBudgetVersions } from '../components/manager-budget-versions'
import { ManagerVersionFiles } from '../components/manager-version-files'
import { PROPOSAL_STATE } from '../enums/budget-status'
import { ManagerBudgetScope } from '../components/manager-budget-scope'
import { useBudgetScope } from '../hooks/use-budget-scope'

export function managerBudgetYear(params: URLSearchParams) {
  const year = Number(params.get('year'))
  return Number.isInteger(year) && year >= 2000 && year <= 2200 ? year : new Date().getFullYear()
}
export function ManagerLiveBudget() {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const year = managerBudgetYear(params)
  const scope = useBudgetScope()
  const paging = useManagerPage()
  const query = useBudgetProposalList({ year, page: paging.page, pageSize: paging.pageSize })
  const proposalId = params.get('proposalId') ?? ''
  const versionId = params.get('versionId') ?? ''
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
      <div className='flex items-center gap-3'>
        <ManagerBudgetScope />
        <ManagerField label={translate('year')}>
          <div className='flex items-center gap-1.5'>
            <button
              type='button'
              aria-label={translate('previous')}
              disabled={year <= 2000}
              onClick={() => {
                const nextYear = String(year - 1)
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('year', nextYear)
                  next.delete('page')
                  next.delete('proposalId')
                  return next
                })
              }}
              className='grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-surface-subtle hover:text-foreground disabled:opacity-40'
            >
              <ChevronLeft strokeWidth={1.5} className='size-4' />
            </button>
            <input
              className={`${managerInputClass} w-28 text-center font-mono font-semibold tabular-nums`}
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
            <button
              type='button'
              aria-label={translate('next')}
              disabled={year >= 2200}
              onClick={() => {
                const nextYear = String(year + 1)
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('year', nextYear)
                  next.delete('page')
                  next.delete('proposalId')
                  return next
                })
              }}
              className='grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-surface-subtle hover:text-foreground disabled:opacity-40'
            >
              <ChevronRight strokeWidth={1.5} className='size-4' />
            </button>
          </div>
        </ManagerField>
      </div>
      <div className='grid items-start gap-5 2xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]'>
        <div className='space-y-6'>
          <ManagerBudgetContext year={year} costCenterId={params.get('costCenterId') ?? undefined} />
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
      {isResourceId(versionId) && <VersionDetail key={versionId} id={versionId} year={year} />}
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
          <div className='flex flex-wrap gap-3'>
            <ManagerStatus value={proposal.state} />
          </div>
          {proposal.returned && (
            <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger'>
              <p className='font-semibold'>{translate('returned')}</p>
              <p className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>{proposal.returned.reason}</p>
            </div>
          )}
          <ProposalLines id={id} />
          <ManagerBudgetFiles id={id} />
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
  const { t: flow } = useTranslation('requestFlow')
  const { formatNumber } = useDashboardFormat()
  const paging = useManagerPage('linePage')
  const query = useBudgetProposalLineList(id, { page: paging.page, pageSize: paging.pageSize })
  return (
    <div className='space-y-3'>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError && (
        <div className='space-y-2'>
          {query.data?.data?.items.map((line) => (
            <div
              key={line.position}
              className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface p-3.5'
            >
              <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-surface-subtle font-mono text-xs font-semibold text-muted-foreground'>
                  #{line.position}
                </span>
                <p className='min-w-0 truncate text-sm font-medium text-foreground' title={line.description}>
                  {line.description}
                </p>
              </div>
              <div className='font-mono font-semibold text-foreground'>
                <ManagerMoney money={line.amount} />
              </div>
              <div className='w-full space-y-2 text-sm'>
                <p className='text-xs text-muted-foreground'>
                  {flow(line.lineType, { defaultValue: flow('unknown') })} · {flow('priorityRank')}:{' '}
                  {formatNumber(line.priorityRank)}
                </p>
                {line.overCeiling && <p className='text-warning'>{flow('overCeiling')}</p>}
                {line.note && <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{line.note}</p>}
                {line.zbb && (
                  <details>
                    <summary className='cursor-pointer'>{flow('zbb')}</summary>
                    <dl className='grid gap-3 pt-3 sm:grid-cols-2'>
                      {(['purpose', 'alternatives', 'consequenceIfNot', 'usageIndicator'] as const).map((field) => (
                        <div key={field}>
                          <dt className='text-xs text-muted-foreground'>{flow(field)}</dt>
                          <dd className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{line.zbb?.[field]}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </div>
  )
}
function VersionDetail({ id, year }: { id: string; year: number }) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const [, setParams] = useSearchParams()
  const versionsQuery = useBudgetMineVersionList({ year, page: 1, pageSize: 100 })
  const version = versionsQuery.data?.data?.items?.find((item) => item.id === id)

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
        <ManagerVersionFiles versionId={id} />
      </div>
    </Dialog>
  )
}
