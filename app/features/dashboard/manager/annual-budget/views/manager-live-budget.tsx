import { ManagerProposalDetail } from '../components/manager-proposal-detail'
import { ChevronLeft, ChevronRight, Landmark, Plus } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetMineVersionList } from '~/shared/api/generated/operations/budgets/budget-mine-version-list'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { isResourceId } from '../../shared/manager-identifiers'
import {
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
import { ManagerBudgetVersions } from '../components/manager-budget-versions'
import { ManagerVersionFiles } from '../components/manager-version-files'
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
      {isResourceId(proposalId) && <ManagerProposalDetail key={proposalId} id={proposalId} />}
      {isResourceId(versionId) && <VersionDetail key={versionId} id={versionId} year={year} />}
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
