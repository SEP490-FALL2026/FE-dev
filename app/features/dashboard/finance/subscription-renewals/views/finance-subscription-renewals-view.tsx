import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SubscriptionRenewalListLate,
  SubscriptionRenewalListState
} from '~/shared/api/generated/model/subscription-renewals'
import { useSubscriptionRenewalList } from '~/shared/api/generated/operations/subscription-renewals'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar
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
 * point. Finance reads it and decides nothing. Missed deadlines are not Finance data (reference/subscription-renewals).
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
