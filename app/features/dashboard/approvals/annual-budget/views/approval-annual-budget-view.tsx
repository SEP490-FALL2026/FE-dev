import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsButton,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'
import { ApprovalAnnualBudgetDetail } from '../components/approval-annual-budget-detail'
import { ApprovalAnnualBudgetFilters } from '../components/approval-annual-budget-filters'
import { ApprovalBudgetProposalDetail } from '../components/approval-budget-proposal-detail'
import type { ApprovalBudgetViewProps } from '../budget-view-props'
import { versionState, type VersionState } from '../enums/version-state'
import { proposalState, type ProposalState } from '../enums/proposal-state'

export function ApprovalAnnualBudgetView(props: ApprovalBudgetViewProps) {
  if (props.itemId?.startsWith('proposal:'))
    return (
      <ApprovalBudgetProposalDetail {...props} key={props.itemId} itemId={props.itemId.slice('proposal:'.length)} />
    )
  if (props.itemId) return <ApprovalAnnualBudgetDetail {...props} key={props.itemId} itemId={props.itemId} />
  return <ApprovalBudgetLists {...props} />
}

function ApprovalBudgetLists({ onSelectTab }: ApprovalBudgetViewProps) {
  const { t: translate } = useTranslation('approvalsBudget')
  const [section, setSection] = useState<'versions' | 'proposals'>('versions')
  return (
    <ApprovalsPage title={translate('title')} description={translate('pageDescription')}>
      <div
        role='group'
        aria-label={translate('title')}
        className='inline-flex flex-wrap gap-1 rounded-lg border border-border/70 bg-surface-subtle p-1'
      >
        {(['versions', 'proposals'] as const).map((item) => (
          <ApprovalsButton key={item} variant='ghost' aria-pressed={section === item} onClick={() => setSection(item)}>
            {translate(item)}
          </ApprovalsButton>
        ))}
      </div>
      {section === 'versions' ? (
        <VersionList onOpen={(id) => onSelectTab('annual-budget', { id })} />
      ) : (
        <ProposalList onOpen={(id) => onSelectTab('annual-budget', { id: `proposal:${id}` })} />
      )}
    </ApprovalsPage>
  )
}

function VersionList({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{ state?: VersionState; year?: number }>({ state: versionState.SENT })
  const query = useBudgetVersionList({ ...filters, page, pageSize: 20 })
  return (
    <>
      <ApprovalAnnualBudgetFilters
        states={Object.values(versionState)}
        state={filters.state}
        year={filters.year}
        onApply={(next) => {
          setFilters({ state: Object.values(versionState).find((state) => state === next.state), year: next.year })
          setPage(1)
        }}
      />
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(version) => version.id}
          onOpen={(version) => onOpen(version.id)}
          columns={[
            {
              key: 'center',
              label: translate('center'),
              render: (version) => (
                <span title={`${version.costCenter.code} · ${version.costCenter.name}`}>{version.costCenter.name}</span>
              )
            },
            {
              key: 'year',
              label: translate('year'),
              numeric: true,
              align: 'center',
              render: (version) => version.year
            },
            {
              key: 'number',
              label: translate('number'),
              numeric: true,
              align: 'center',
              render: (version) => version.number
            },
            {
              key: 'total',
              label: translate('total'),
              numeric: true,
              render: (version) => formatMoney(version.total, i18n.language)
            },
            { key: 'state', label: translate('state'), render: (version) => <ApprovalsStatus value={version.state} /> },
            {
              key: 'sentAt',
              label: translate('sentAt'),
              numeric: true,
              align: 'center',
              render: (version) => (version.sentAt ? formatDate(version.sentAt) : translate('unavailable'))
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </>
  )
}

function ProposalList({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{ state?: ProposalState; year?: number }>({})
  const query = useBudgetProposalList({ ...filters, page, pageSize: 20 })
  return (
    <>
      <p role='note' className='text-sm text-muted-foreground'>
        {translate('readOnly')}
      </p>
      <ApprovalAnnualBudgetFilters
        states={Object.values(proposalState)}
        state={filters.state}
        year={filters.year}
        onApply={(next) => {
          setFilters({ state: Object.values(proposalState).find((state) => state === next.state), year: next.year })
          setPage(1)
        }}
      />
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(proposal) => proposal.id}
          onOpen={(proposal) => onOpen(proposal.id)}
          columns={[
            {
              key: 'center',
              label: translate('center'),
              render: (proposal) => <span title={proposal.costCenter.name}>{proposal.costCenter.name}</span>
            },
            { key: 'year', label: translate('year'), numeric: true, render: (proposal) => proposal.year },
            {
              key: 'total',
              label: translate('total'),
              numeric: true,
              render: (proposal) => formatMoney(proposal.total, i18n.language)
            },
            {
              key: 'state',
              label: translate('state'),
              render: (proposal) => <ApprovalsStatus value={proposal.state} />
            },
            {
              key: 'submittedAt',
              label: translate('submittedAt'),
              numeric: true,
              align: 'center',
              render: (proposal) => formatDate(proposal.submittedAt)
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </>
  )
}
