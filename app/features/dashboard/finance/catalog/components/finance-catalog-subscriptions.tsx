import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionListExpiry, SubscriptionListWarning } from '~/shared/api/generated/model/subscriptions'
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
import { formatDay } from '../../shared/finance-date'
import { CatalogEnumFilter } from './catalog-enum-filter'
import { CatalogSubscriptionDetail } from './catalog-subscription-detail'

export function FinanceCatalogSubscriptions({ applicationId, planId }: { applicationId: string; planId?: string }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const [status, setStatus] = useState<SubscriptionListStatus | ''>('')
  const [kind, setKind] = useState<SubscriptionListKind | ''>('')
  const [warning, setWarning] = useState<SubscriptionListWarning | ''>('')
  const [expiry, setExpiry] = useState<SubscriptionListExpiry | ''>('')
  const [page, setPage] = useState(1)
  const [opened, setOpened] = useState<{ id: string; planName: string } | null>(null)
  const subscriptions = useSubscriptionList({
    applicationId,
    planId,
    status: status || undefined,
    kind: kind || undefined,
    warning: warning || undefined,
    expiry: expiry || undefined,
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
        <CatalogEnumFilter
          label={translate('expiry')}
          options={SubscriptionListExpiry}
          value={expiry}
          className='sm:flex-1'
          onChange={(value) => {
            setExpiry(value)
            setPage(1)
          }}
        />
      </FinanceToolbar>
      <FinanceQueryState query={subscriptions}>
        <FinanceTable
          items={subscriptions.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={(item) => setOpened({ id: item.id, planName: item.planName })}
          columns={[
            { key: 'plan', label: translate('plan'), render: (item) => item.planName },
            {
              key: 'status',
              label: translate('status'),
              render: (item) => (
                <span className='flex flex-wrap gap-1.5'>
                  <FinanceStatus value={item.status} />
                  {item.missing.length > 0 && (
                    <FinanceStatus value='MISSING' label={translate('missingFinancialData')} />
                  )}
                </span>
              )
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
              key: 'renewal',
              label: translate('renewalDate'),
              numeric: true,
              render: (item) => (
                <div className='flex flex-col items-end'>
                  <span>{formatDay(item.renewalDate, i18n.language)}</span>
                  {item.expiry && item.daysLeft !== null && item.deadlineKind && (
                    <span className='font-sans text-xs text-muted-foreground'>
                      {translate(item.daysLeft < 0 ? 'daysOverdue' : 'daysLeft', {
                        days: Math.abs(item.daysLeft),
                        kind: translate(`enum.${item.deadlineKind}`)
                      })}
                    </span>
                  )}
                </div>
              )
            },
            {
              key: 'seats',
              label: translate('seats'),
              render: (item) =>
                item.seats
                  ? translate('seatsSummary', {
                      assigned: item.seats.assigned,
                      purchased: item.seats.purchased ?? '—'
                    })
                  : '—'
            }
          ]}
        />
        <FinancePagination pagination={subscriptions.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {opened && (
        <CatalogSubscriptionDetail
          subscriptionId={opened.id}
          planName={opened.planName}
          onClose={() => setOpened(null)}
        />
      )}
    </FinanceSection>
  )
}
