import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionDeadlineEventList } from '~/shared/api/generated/operations/subscription-renewals/subscription-deadline-event-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import {
  ApprovalsEmpty,
  ApprovalsField,
  ApprovalsNativeSelect,
  ApprovalsPagination,
  ApprovalsSection
} from '../../shared/components/approvals-ui'
import { DEADLINE_EVENT_KIND, type DeadlineEventKind } from '../enums/deadline-event-kind'

const PAGE_SIZE = 10

/** Milestones that passed with no decision; a later decision never removes an event. */
export function RenewalDeadlineEvents() {
  const { t: translate } = useTranslation('approvalsRenewal')
  const { formatDate } = useWorkspaceFormat()
  const [kind, setKind] = useState<DeadlineEventKind | ''>('')
  const [page, setPage] = useState(1)
  const query = useSubscriptionDeadlineEventList({ kind: kind || undefined, page, pageSize: PAGE_SIZE })
  const items = query.data?.data?.items ?? []
  return (
    <ApprovalsSection
      title={translate('deadline.title')}
      actions={
        <div className='w-full sm:w-64'>
          <ApprovalsField label={translate('deadline.kind')}>
            <ApprovalsNativeSelect
              value={kind}
              onChange={(event) => {
                setKind(event.target.value as DeadlineEventKind | '')
                setPage(1)
              }}
            >
              <option value=''>{translate('deadline.allKinds')}</option>
              {Object.values(DEADLINE_EVENT_KIND).map((value) => (
                <option key={value} value={value}>
                  {translate(`values.kind.${value}`)}
                </option>
              ))}
            </ApprovalsNativeSelect>
          </ApprovalsField>
        </div>
      }
    >
      <ApprovalsQueryState query={query}>
        {items.length === 0 ? (
          <ApprovalsEmpty message={translate('deadline.empty')} />
        ) : (
          <ApprovalsTable
            items={items}
            rowKey={(event) => event.id}
            columns={[
              {
                key: 'software',
                label: translate('columns.software'),
                render: (event) => (
                  <span title={`${event.subscription.applicationName} · ${event.subscription.planName}`}>
                    {event.subscription.applicationName}
                    <span className='block truncate text-xs text-muted-foreground'>{event.subscription.planName}</span>
                  </span>
                )
              },
              {
                key: 'kind',
                label: translate('deadline.kind'),
                render: (event) => translate(`values.kind.${event.kind}`, { defaultValue: translate('unknown') })
              },
              {
                key: 'milestone',
                label: translate('deadline.milestoneDate'),
                numeric: true,
                render: (event) => formatDate(event.milestoneDate)
              },
              {
                key: 'autoRenew',
                label: translate('deadline.autoRenew'),
                render: (event) => translate(event.autoRenewAtTime ? 'yes' : 'no')
              },
              {
                key: 'recordedOn',
                label: translate('deadline.recordedOn'),
                numeric: true,
                render: (event) => formatDate(event.recordedOn)
              }
            ]}
          />
        )}
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}
