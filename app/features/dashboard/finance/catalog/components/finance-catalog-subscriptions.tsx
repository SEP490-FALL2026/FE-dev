import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionListWarning } from '~/shared/api/generated/model/subscriptions'
import { SubscriptionListStatus } from '../enums/subscription-status'
import { SubscriptionListKind } from '../enums/subscription-kind'

import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions'
import {
  FinanceField,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'

export function FinanceCatalogSubscriptions({ applicationId, planId }: { applicationId: string; planId?: string }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const [status, setStatus] = useState<SubscriptionListStatus | ''>('')
  const [kind, setKind] = useState<SubscriptionListKind | ''>('')
  const [warning, setWarning] = useState<SubscriptionListWarning | ''>('')
  const [page, setPage] = useState(1)
  const subscriptions = useSubscriptionList({
    applicationId,
    planId,
    status: status || undefined,
    kind: kind || undefined,
    warning: warning || undefined,
    page,
    pageSize: 10
  })
  return (
    <section className='space-y-4'>
      <h3 className='font-semibold'>{translate('subscriptions')}</h3>
      <div className='grid gap-3 sm:grid-cols-3'>
        <FinanceField label={translate('status')}>
          <select
            className={financeInputClass}
            value={status}
            onChange={(event) => {
              setStatus(Object.values(SubscriptionListStatus).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(SubscriptionListStatus).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
        <FinanceField label={translate('kind')}>
          <select
            className={financeInputClass}
            value={kind}
            onChange={(event) => {
              setKind(Object.values(SubscriptionListKind).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(SubscriptionListKind).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
        <FinanceField label={translate('warning')}>
          <select
            className={financeInputClass}
            value={warning}
            onChange={(event) => {
              setWarning(Object.values(SubscriptionListWarning).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(SubscriptionListWarning).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
      </div>
      <FinanceQueryState query={subscriptions}>
        <FinanceTable
          items={subscriptions.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          columns={[
            { key: 'plan', label: translate('plan'), render: (item) => item.planName },
            { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> },
            {
              key: 'quantity',
              label: translate('purchasedQuantity'),
              numeric: true,
              render: (item) => item.purchasedQuantity ?? '—'
            },
            {
              key: 'price',
              label: translate('unitPrice'),
              numeric: true,
              render: (item) => (item.unitPrice ? formatMoney(item.unitPrice, i18n.language) : translate('noPrice'))
            },
            {
              key: 'billing',
              label: translate('billingCycle'),
              render: (item) =>
                item.billingCycle
                  ? translate(`enum.${item.billingCycle}`, { defaultValue: translate('unavailable') })
                  : '—'
            },
            {
              key: 'missing',
              label: translate('missingFinancialData'),
              render: (item) => translate(item.missingFinancialData ? 'yes' : 'no')
            }
          ]}
        />
        <FinancePagination pagination={subscriptions.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </section>
  )
}
