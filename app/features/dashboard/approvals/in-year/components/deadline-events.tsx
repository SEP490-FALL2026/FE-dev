import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionDeadlineEventListKind } from '~/shared/api/generated/model/subscription-renewals/subscriptionDeadlineEventListKind'
import { useSubscriptionDeadlineEventList } from '~/shared/api/generated/operations/subscription-renewals/subscription-deadline-event-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsSelect,
  ApprovalsToolbar
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'

/** Subscription milestones that passed without a renewal decision; read-only. */
export function DeadlineEvents() {
  const { t: translate } = useTranslation('approvalsBudget')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [kind, setKind] = useState<SubscriptionDeadlineEventListKind | ''>('')
  const query = useSubscriptionDeadlineEventList({ ...(kind ? { kind } : {}), page, pageSize: 20 })
  return (
    <ApprovalsSection title={translate('inYear.deadlines')} description={translate('inYear.deadlinesNote')}>
      <ApprovalsToolbar>
        <div className='w-full sm:w-72'>
          <ApprovalsSelect
            label={translate('inYear.kind')}
            value={kind}
            options={[
              { value: '', label: translate('inYear.allKinds') },
              ...Object.values(SubscriptionDeadlineEventListKind).map((value) => ({
                value,
                label: translate(`inYear.deadlineKinds.${value}`)
              }))
            ]}
            onChange={(selected) => {
              setKind(Object.values(SubscriptionDeadlineEventListKind).find((value) => value === selected) ?? '')
              setPage(1)
            }}
          />
        </div>
      </ApprovalsToolbar>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(event) => event.id}
          columns={[
            {
              key: 'subscription',
              label: translate('inYear.subscription'),
              render: (event) => `${event.subscription.applicationName} · ${event.subscription.planName}`
            },
            {
              key: 'kind',
              label: translate('inYear.kind'),
              render: (event) => translate(`inYear.deadlineKinds.${event.kind}`)
            },
            {
              key: 'milestone',
              label: translate('inYear.milestoneDate'),
              numeric: true,
              align: 'center',
              render: (event) => formatDate(event.milestoneDate)
            },
            {
              key: 'autoRenew',
              label: translate('inYear.autoRenew'),
              align: 'center',
              render: (event) => (event.autoRenewAtTime ? translate('inYear.yes') : translate('inYear.no'))
            },
            {
              key: 'recorded',
              label: translate('inYear.recordedOn'),
              numeric: true,
              align: 'center',
              render: (event) => formatDate(event.recordedOn)
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}
