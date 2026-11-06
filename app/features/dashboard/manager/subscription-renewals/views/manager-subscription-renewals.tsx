import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'
import {
  useSubscriptionRenewalList,
  getSubscriptionRenewalListQueryKey
} from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import {
  useSubscriptionRenewalGet,
  getSubscriptionRenewalGetQueryKey
} from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-get'
import { subscriptionRenewalDecide } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-decide'
import { useSubscriptionRenewalSeatRanking } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-seat-ranking'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import { RENEWAL_DECISION, RENEWAL_STATE } from '../enums/renewal-state'

export function ManagerSubscriptionRenewals() {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage('renewalPage')
  const [params, setParams] = useSearchParams()
  const id = params.get('renewalId') ?? ''
  const query = useSubscriptionRenewalList({
    state: RENEWAL_STATE.PROPOSED,
    page: paging.page,
    pageSize: paging.pageSize
  })
  const detail = useSubscriptionRenewalGet(id, { query: { enabled: isResourceId(id) } })
  const renewal = !detail.isError ? detail.data?.data?.renewal : null
  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('renewal.title')} description={translate('renewal.hint')} icon={RefreshCw} />
      <ManagerSection>
        <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
        {!query.isError && (
          <ManagerDataTable
            label={translate('renewal.title')}
            items={query.data?.data?.items ?? []}
            rowKey={(item) => item.id}
            onOpen={(item) =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                next.set('renewalId', item.id)
                return next
              })
            }
            columns={[
              {
                key: 'application',
                label: translate('application'),
                render: (item) => item.subscription.applicationName
              },
              {
                key: 'proposal',
                label: translate('renewal.proposal'),
                render: (item) =>
                  translate(`renewal.choice.${item.proposedChoice}`, { defaultValue: translate('unavailable') })
              },
              {
                key: 'date',
                label: translate('submittedAt'),
                align: 'right',
                render: (item) => formatDate(item.proposedAt)
              }
            ]}
          />
        )}
        <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </ManagerSection>
      {id && <ManagerQueryState query={detail} />}
      {renewal && <RenewalConfirmation key={id} renewal={renewal} />}
    </div>
  )
}

function RenewalConfirmation({ renewal }: { renewal: SubscriptionRenewalResponseDtoDataRenewal }) {
  const { t: translate } = useTranslation('manager')
  const [acknowledged, setAcknowledged] = useState(false)
  const paging = useManagerPage('seatPage')
  const ranking = useSubscriptionRenewalSeatRanking(renewal.id, { page: paging.page, pageSize: paging.pageSize })
  const action = useManagerAction({
    mutationFn: ({ reason }: { reason: string }) =>
      subscriptionRenewalDecide(renewal.id, {
        decision: RENEWAL_DECISION.CONFIRM,
        ...(reason ? { reason } : {}),
        ...(acknowledged ? { acknowledgeActiveUsers: true } : {})
      }),
    invalidate: [getSubscriptionRenewalListQueryKey(), getSubscriptionRenewalGetQueryKey(renewal.id)]
  })
  const needsAcknowledgement = renewal.proposedChoice === 'CANCEL' && renewal.period.seatsInUse > 0
  return (
    <ManagerSection title={renewal.subscription.applicationName}>
      <dl className='grid gap-4 sm:grid-cols-2'>
        <div>
          <dt className='text-xs text-muted-foreground'>{translate('renewal.proposal')}</dt>
          <dd>{translate(`renewal.choice.${renewal.proposedChoice}`, { defaultValue: translate('unavailable') })}</dd>
        </div>
        <div>
          <dt className='text-xs text-muted-foreground'>{translate('status')}</dt>
          <dd>{translate(`renewal.state.${renewal.state}`, { defaultValue: translate('unavailable') })}</dd>
        </div>
        <div>
          <dt className='text-xs text-muted-foreground'>{translate('renewal.quantity')}</dt>
          <dd className='font-mono tabular-nums'>{renewal.proposedQuantity ?? '—'}</dd>
        </div>
        <div>
          <dt className='text-xs text-muted-foreground'>{translate('renewal.activeUsers')}</dt>
          <dd className='font-mono tabular-nums'>{renewal.period.seatsInUse}</dd>
        </div>
      </dl>
      {renewal.proposal.note && <p className='mt-4 text-sm whitespace-pre-wrap'>{renewal.proposal.note}</p>}
      {renewal.state === RENEWAL_STATE.STALE && (
        <p role='status' className='mt-4 text-sm text-warning'>
          {translate('renewal.stale')}
        </p>
      )}
      <div className='mt-5 space-y-3'>
        <ManagerQueryState query={ranking} empty={!ranking.data?.data?.items.length} />
        {ranking.data?.data?.usage.status === 'NOT_AVAILABLE' && (
          <p className='text-sm text-muted-foreground'>{translate('renewal.usageUnavailable')}</p>
        )}
        {!ranking.isError && (
          <ManagerDataTable
            label={translate('seats')}
            items={ranking.data?.data?.items ?? []}
            rowKey={(item) => item.assignmentId}
            columns={[
              {
                key: 'employee',
                label: translate('employee'),
                render: (item) => item.employee?.fullName ?? translate('unavailable')
              },
              {
                key: 'release',
                label: translate('renewal.proposal'),
                render: (item) => (item.inProposal ? translate('renewal.selectedSeat') : '—')
              }
            ]}
          />
        )}
        <ManagerPagination
          pagination={ranking.data?.data?.pagination}
          onPage={paging.onPage}
          busy={ranking.isFetching}
        />
      </div>
      {renewal.state === RENEWAL_STATE.PROPOSED && (
        <form
          className='mt-5 space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked || (needsAcknowledgement && !acknowledged)) return
            action.mutate({ reason: String(new FormData(event.currentTarget).get('reason') ?? '').trim() })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <ManagerField label={translate('reason')}>
              <textarea name='reason' maxLength={1000} className={managerInputClass} />
            </ManagerField>
            {needsAcknowledgement && (
              <label className='flex min-h-11 items-start gap-3 text-sm'>
                <input
                  type='checkbox'
                  required
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                />
                {translate('renewal.acknowledge')}
              </label>
            )}
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex justify-end'>
            <ManagerButton
              primary
              type='submit'
              busy={action.isPending}
              disabled={action.blocked || (needsAcknowledgement && !acknowledged)}
            >
              {translate('renewal.confirm')}
            </ManagerButton>
          </div>
        </form>
      )}
    </ManagerSection>
  )
}
