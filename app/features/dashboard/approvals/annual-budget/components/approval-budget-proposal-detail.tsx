import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalGet } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { useBudgetProposalLineList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-line-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsButton,
  ApprovalsEmpty,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'
import type { ApprovalBudgetViewProps } from '../budget-view-props'

export function ApprovalBudgetProposalDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const query = useBudgetProposalGet(itemId)
  const proposal = query.data?.data?.proposal
  return (
    <ApprovalsPage
      title={translate('proposals')}
      actions={<ApprovalsButton onClick={() => onSelectTab('annual-budget')}>{translate('back')}</ApprovalsButton>}
    >
      <p className='text-sm text-muted-foreground'>{translate('readOnly')}</p>
      <ApprovalsQueryState query={query}>
        {proposal ? (
          <>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <h2 className='truncate text-xl font-semibold' title={proposal.costCenter.name}>
                {proposal.costCenter.name}
              </h2>
              <ApprovalsStatus value={proposal.state} />
            </div>
            <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('center')}</dt>
                <dd className='text-right font-mono tabular-nums'>{proposal.costCenter.code}</dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('year')}</dt>
                <dd className='text-right font-mono tabular-nums'>{proposal.year}</dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('total')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatMoney(proposal.total, i18n.language)}</dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('submittedAt')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatDate(proposal.submittedAt)}</dd>
              </div>
            </dl>
            {proposal.returned && (
              <p className='break-words text-sm'>
                {translate('reason')}: {proposal.returned.reason}
              </p>
            )}
            <ProposalLines itemId={itemId} />
          </>
        ) : (
          <ApprovalsEmpty />
        )}
      </ApprovalsQueryState>
    </ApprovalsPage>
  )
}

function ProposalLines({ itemId }: { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useBudgetProposalLineList(itemId, { page, pageSize: 20 })
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold'>{translate('lines')}</h2>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(line) => String(line.position)}
          columns={[
            {
              key: 'description',
              label: translate('description'),
              render: (line) => <span title={line.description}>{line.description}</span>
            },
            {
              key: 'amount',
              label: translate('amount'),
              numeric: true,
              render: (line) => formatMoney(line.amount, i18n.language)
            },
            {
              key: 'seats',
              label: translate('seats'),
              numeric: true,
              render: (line) => line.seats ?? translate('unavailable')
            },
            {
              key: 'window',
              label: translate('window'),
              numeric: true,
              render: (line) => `${formatDate(line.windowFrom)} – ${formatDate(line.windowTo)}`
            },
            { key: 'period', label: translate('period'), numeric: true, render: (line) => line.servicePeriodMonths },
            {
              key: 'repeat',
              label: translate('repeatCycle'),
              render: (line) => translate(`repeat.${line.repeatCycle}`, { defaultValue: translate('unavailable') })
            },
            {
              key: 'quote',
              label: translate('quoteValidUntil'),
              numeric: true,
              render: (line) => (line.quoteValidUntil ? formatDate(line.quoteValidUntil) : translate('unavailable'))
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </section>
  )
}
