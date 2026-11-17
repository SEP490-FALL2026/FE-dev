import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SubscriptionDeadlineEventListKind,
  SubscriptionRenewalListLate,
  SubscriptionRenewalListState
} from '~/shared/api/generated/model/subscription-renewals'
import {
  useSubscriptionDeadlineEventList,
  useSubscriptionRenewalList
} from '~/shared/api/generated/operations/subscription-renewals'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatDay } from '../../shared/finance-date'
import { SubscriptionRenewalDetail } from '../components/subscription-renewal-detail'
import { useOwnerLabel } from '../hooks/use-owner-label'

interface Props {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

const pick = <Value extends string>(values: Record<string, Value>, value: string): Value | '' =>
  Object.values(values).find((item) => item === value) ?? ''

/**
 * Subscription adjustments, read only: what IT Admin recorded for each shared-pool subscription at its adjustment
 * point, and the deadlines that passed without a recorded outcome. Finance is told about both and decides nothing.
 */
export function FinanceSubscriptionRenewalsView({ itemId, onSelectTab }: Props) {
  if (itemId) return <SubscriptionRenewalDetail id={itemId} onBack={() => onSelectTab?.('subscription-renewals')} />
  return <RenewalsPage onOpen={(id) => onSelectTab?.('subscription-renewals', { id })} />
}

function RenewalsPage({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('financeSettings')
  return (
    <FinancePage title={translate('renewals.title')} description={translate('renewals.description')}>
      <RenewalCases onOpen={onOpen} />
      <DeadlineEvents />
    </FinancePage>
  )
}

function RenewalCases({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const ownerLabel = useOwnerLabel()
  const [state, setState] = useState<SubscriptionRenewalListState | ''>('')
  const [late, setLate] = useState<SubscriptionRenewalListLate | ''>('')
  const [page, setPage] = useState(1)
  const query = useSubscriptionRenewalList({
    page,
    pageSize: 20,
    ...(state ? { state } : {}),
    ...(late ? { late } : {})
  })
  return (
    <FinanceSection title={translate('renewals.cases')}>
      <FinanceToolbar>
        <div className='sm:w-64'>
          <FinanceField label={translate('renewals.state')}>
            <FinanceSelect
              value={state}
              onChange={(event) => {
                setState(pick(SubscriptionRenewalListState, event.target.value))
                setPage(1)
              }}
            >
              <option value=''>{translate('renewals.allStates')}</option>
              {Object.values(SubscriptionRenewalListState).map((value) => (
                <option key={value} value={value}>
                  {translate(`renewals.states.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-56'>
          <FinanceField label={translate('renewals.lateFilter')}>
            <FinanceSelect
              value={late}
              onChange={(event) => {
                setLate(pick(SubscriptionRenewalListLate, event.target.value))
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              <option value='true'>{translate('renewals.lateYes')}</option>
              <option value='false'>{translate('renewals.lateNo')}</option>
            </FinanceSelect>
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={(item) => onOpen(item.id)}
          columns={[
            {
              key: 'software',
              label: translate('renewals.software'),
              render: (item) => (
                <span className='flex flex-col'>
                  <span className='font-medium'>
                    {item.subscription.applicationName} · {item.subscription.planName}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {ownerLabel(item.subscription.ownerDepartmentId)}
                  </span>
                </span>
              )
            },
            {
              key: 'choice',
              label: translate('renewals.choice'),
              render: (item) => {
                const choice = translate(`renewals.choices.${item.decidedChoice ?? item.proposedChoice}`, {
                  defaultValue: item.proposedChoice
                })
                return item.proposedQuantity === null
                  ? choice
                  : translate('renewals.choiceWithQuantity', { choice, count: item.proposedQuantity })
              }
            },
            {
              key: 'milestone',
              label: translate('renewals.milestone'),
              numeric: true,
              render: (item) => formatDay(item.milestone.baseDate, i18n.language)
            },
            {
              key: 'state',
              label: translate('renewals.state'),
              render: (item) => (
                <span className='flex flex-wrap gap-1.5'>
                  <FinanceStatus
                    value={item.state === 'OUTCOME_RECORDED' ? 'COMPLETED' : item.state}
                    label={translate(`renewals.states.${item.state}`, { defaultValue: item.state })}
                  />
                  {item.lateFlagged && <FinanceStatus value='PENDING' label={translate('renewals.late')} />}
                </span>
              )
            }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceSection>
  )
}

function DeadlineEvents() {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const ownerLabel = useOwnerLabel()
  const [kind, setKind] = useState<SubscriptionDeadlineEventListKind | ''>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const rangeInvalid = Boolean(from && to && from > to)
  const query = useSubscriptionDeadlineEventList(
    { page, pageSize: 20, ...(kind ? { kind } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) },
    { query: { enabled: !rangeInvalid } }
  )
  return (
    <FinanceSection title={translate('renewals.events.title')}>
      <p className='text-sm text-muted-foreground'>{translate('renewals.events.hint')}</p>
      <FinanceToolbar>
        <div className='sm:w-64'>
          <FinanceField label={translate('renewals.events.kind')}>
            <FinanceSelect
              value={kind}
              onChange={(event) => {
                setKind(pick(SubscriptionDeadlineEventListKind, event.target.value))
                setPage(1)
              }}
            >
              <option value=''>{translate('renewals.events.allKinds')}</option>
              {Object.values(SubscriptionDeadlineEventListKind).map((value) => (
                <option key={value} value={value}>
                  {translate(`renewals.events.kinds.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-48'>
          <FinanceField label={translate('from')}>
            <input
              type='date'
              className={financeInputClass}
              value={from}
              onChange={(event) => {
                setFrom(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
        <div className='sm:w-48'>
          <FinanceField
            label={translate('to')}
            floatingError
            error={rangeInvalid ? translate('dateRangeInvalid') : undefined}
          >
            <input
              type='date'
              aria-invalid={rangeInvalid}
              className={financeInputClass}
              value={to}
              onChange={(event) => {
                setTo(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          columns={[
            {
              key: 'software',
              label: translate('renewals.software'),
              render: (item) => (
                <span className='flex flex-col'>
                  <span className='font-medium'>
                    {item.subscription.applicationName} · {item.subscription.planName}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {ownerLabel(item.subscription.ownerDepartmentId)}
                  </span>
                </span>
              )
            },
            {
              key: 'kind',
              label: translate('renewals.events.kind'),
              render: (item) => (
                <FinanceStatus
                  value={item.kind === 'AUTO_RENEWAL_INCIDENT' ? 'PENDING' : 'REJECTED'}
                  label={translate(`renewals.events.kinds.${item.kind}`)}
                />
              )
            },
            {
              key: 'milestone',
              label: translate('renewals.events.milestoneDate'),
              numeric: true,
              render: (item) => formatDay(item.milestoneDate, i18n.language)
            },
            {
              key: 'recorded',
              label: translate('renewals.events.recordedOn'),
              numeric: true,
              render: (item) => formatDay(item.recordedOn, i18n.language)
            }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceSection>
  )
}
