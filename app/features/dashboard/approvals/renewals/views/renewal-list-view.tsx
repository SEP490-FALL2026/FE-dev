import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalList } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import {
  ApprovalsEmpty,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { RenewalDeadlineEvents } from '../components/renewal-deadline-events'
import { RenewalListFilters } from '../components/renewal-list-filters'
import { RENEWAL_CHOICE } from '../enums/renewal-choice'
import { RENEWAL_STATE } from '../enums/renewal-state'
import { ALL_STATES, renewalFilterParams, useRenewalFilters, type RenewalFilters } from '../hooks/use-renewal-filters'

const PAGE_SIZE = 20

export function RenewalListView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const filters = useRenewalFilters()
  const query = useSubscriptionRenewalList({
    state: filters.state === ALL_STATES ? undefined : filters.state,
    late: filters.late,
    page: filters.page,
    pageSize: PAGE_SIZE
  })
  const items = query.data?.data?.items ?? []
  const isQueue = filters.state === RENEWAL_STATE.PROPOSED && !filters.late
  const applyFilters = (next: RenewalFilters) => onSelectTab('renewal', renewalFilterParams(next))

  return (
    <ApprovalsPage title={translate('title')}>
      <RenewalListFilters filters={filters} onChange={applyFilters} />
      <ApprovalsQueryState query={query}>
        {items.length === 0 ? (
          <ApprovalsEmpty message={translate(isQueue ? 'emptyQueue' : 'emptyFiltered')} />
        ) : (
          <ApprovalsTable
            items={items}
            rowKey={(item) => item.id}
            onOpen={(item) => onSelectTab('renewal', { ...renewalFilterParams(filters), id: item.id })}
            columns={[
              {
                key: 'software',
                label: translate('columns.software'),
                render: (item) => (
                  <span title={`${item.subscription.applicationName} · ${item.subscription.planName}`}>
                    {item.subscription.applicationName}
                    <span className='block truncate text-xs text-muted-foreground'>{item.subscription.planName}</span>
                  </span>
                )
              },
              {
                key: 'milestone',
                label: translate('columns.milestone'),
                numeric: true,
                render: (item) => formatDate(item.milestone.baseDate)
              },
              {
                key: 'proposal',
                label: translate('columns.proposal'),
                render: (item) =>
                  item.proposedChoice === RENEWAL_CHOICE.REDUCE && item.proposedQuantity !== null
                    ? `${translate(`values.choice.${item.proposedChoice}`)} · ${translate('seats', {
                        value: formatNumber(item.proposedQuantity)
                      })}`
                    : translate(`values.choice.${item.proposedChoice}`, { defaultValue: translate('unknown') })
              },
              {
                key: 'state',
                label: translate('columns.state'),
                render: (item) => <ApprovalsStatus value={item.state} />
              },
              {
                key: 'late',
                label: translate('columns.late'),
                render: (item) =>
                  item.lateFlagged ? (
                    <span className='font-medium text-danger'>{translate('lateBadge')}</span>
                  ) : (
                    translate('no')
                  )
              },
              {
                key: 'proposedAt',
                label: translate('columns.proposedAt'),
                numeric: true,
                render: (item) => formatDate(item.proposedAt)
              }
            ]}
          />
        )}
        <ApprovalsPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(page) => applyFilters({ ...filters, page })}
        />
      </ApprovalsQueryState>
      <RenewalDeadlineEvents />
    </ApprovalsPage>
  )
}
