import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionListWarning } from '~/shared/api/generated/model/subscriptions'
import { SubscriptionListStatus } from '../enums/subscription-status'
import { SubscriptionListKind } from '../enums/subscription-kind'

import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions'
import {
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { CatalogEnumFilter } from './catalog-enum-filter'

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
    <FinanceSection title={translate('subscriptions')}>
      <FinanceToolbar>
        <CatalogEnumFilter
          label={translate('status')}
          options={SubscriptionListStatus}
          value={status}
          className='sm:flex-1'
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
        />
        <CatalogEnumFilter
          label={translate('kind')}
          options={SubscriptionListKind}
          value={kind}
          className='sm:flex-1'
          onChange={(value) => {
            setKind(value)
            setPage(1)
          }}
        />
        <CatalogEnumFilter
          label={translate('warning')}
          options={SubscriptionListWarning}
          value={warning}
          className='sm:flex-1'
          onChange={(value) => {
            setWarning(value)
            setPage(1)
          }}
        />
      </FinanceToolbar>
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
              render: (item) =>
                item.unitPrice ? (
                  formatMoney(item.unitPrice, i18n.language)
                ) : (
                  <span className='font-sans text-muted-foreground'>{translate('noPrice')}</span>
                )
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
    </FinanceSection>
  )
}
