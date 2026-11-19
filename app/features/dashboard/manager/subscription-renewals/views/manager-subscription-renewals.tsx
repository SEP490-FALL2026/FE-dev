import { Boxes, RefreshCw, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'
import { useSubscriptionRenewalList } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { useSubscriptionRenewalGet } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-get'
import { useSubscriptionRenewalSeatRanking } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-seat-ranking'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerPagination, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { isResourceId } from '../../shared/manager-identifiers'
import { RENEWAL_STATE } from '../enums/renewal-state'

export function ManagerSubscriptionRenewals() {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage('renewalPage')
  const [params, setParams] = useSearchParams()
  const id = params.get('renewalId') ?? ''
  const query = useSubscriptionRenewalList({
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
                render: (item) => (
                  <div className='flex items-center gap-3'>
                    <span
                      aria-hidden='true'
                      className='grid size-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                    >
                      <Boxes strokeWidth={1.5} className='size-4' />
                    </span>
                    <span className='font-medium text-foreground'>{item.subscription.applicationName}</span>
                  </div>
                )
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
                render: (item) => (
                  <span className='font-mono text-xs tabular-nums text-muted-foreground'>
                    {formatDate(item.proposedAt)}
                  </span>
                )
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
  const paging = useManagerPage('seatPage')
  const ranking = useSubscriptionRenewalSeatRanking(renewal.id, { page: paging.page, pageSize: paging.pageSize })

  return (
    <ManagerSection title={renewal.subscription.applicationName}>
      <div className='space-y-5'>
        {/* Software Spotlight Banner */}
        <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
          <div className='flex items-center gap-3.5 min-w-0'>
            <span
              aria-hidden='true'
              className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
            >
              <Boxes strokeWidth={1.5} className='size-6' />
            </span>
            <div className='min-w-0'>
              <h2 className='truncate text-lg font-bold text-foreground' title={renewal.subscription.applicationName}>
                {renewal.subscription.applicationName}
              </h2>
              <p className='truncate text-xs text-muted-foreground'>
                {translate(`renewal.choice.${renewal.proposedChoice}`, { defaultValue: translate('unavailable') })}
              </p>
            </div>
          </div>
          <span className='rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground'>
            {translate(`renewal.state.${renewal.state}`, { defaultValue: translate('unavailable') })}
          </span>
        </div>

        {/* Metric Cards Strip */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-2'>
          <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
            <dt className='text-xs font-medium text-muted-foreground'>{translate('renewal.quantity')}</dt>
            <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-foreground'>
              {renewal.proposedQuantity ?? '—'}
            </dd>
          </div>
          <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
            <dt className='text-xs font-medium text-muted-foreground'>{translate('renewal.activeUsers')}</dt>
            <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-foreground'>
              {renewal.period.seatsInUse}
            </dd>
          </div>
        </div>

        {renewal.proposal.note && (
          <div className='space-y-1.5'>
            <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {translate('note')}
            </dt>
            <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm text-foreground'>
              <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{renewal.proposal.note}</p>
            </dd>
          </div>
        )}

        {renewal.state === RENEWAL_STATE.STALE && (
          <div
            role='status'
            className='rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs font-medium text-warning-ink'
          >
            {translate('renewal.stale')}
          </div>
        )}

        <div className='space-y-3 border-t border-border/50 pt-4'>
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
                  render: (item) => (
                    <div className='flex items-center gap-2.5'>
                      <span
                        aria-hidden='true'
                        className='grid size-7 shrink-0 place-items-center rounded-lg border border-border/60 bg-surface-subtle text-muted-foreground'
                      >
                        <UserRound strokeWidth={1.5} className='size-3.5' />
                      </span>
                      <span className='font-medium text-foreground'>
                        {item.employee?.fullName ?? translate('unavailable')}
                      </span>
                    </div>
                  )
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
      </div>
    </ManagerSection>
  )
}
