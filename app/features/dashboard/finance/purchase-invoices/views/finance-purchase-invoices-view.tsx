import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PurchaseInvoiceListLabel, PurchaseInvoiceListState } from '~/shared/api/generated/model/purchase-invoices'
import {
  usePurchaseInvoiceList,
  usePurchaseInvoiceMissingPeriodList
} from '~/shared/api/generated/operations/purchase-invoices'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import type { FinanceTabKey } from '../../enums'
import { PurchaseInvoiceDetail } from '../components/purchase-invoice-detail'
import { invoiceLabelText } from '../invoice-label'

type Mode = 'queue' | 'missing'

interface Props {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

export function FinancePurchaseInvoicesView({ itemId, onSelectTab }: Props) {
  const { t: translate } = useTranslation('financePurchases')
  const [mode, setMode] = useState<Mode>('queue')
  if (itemId)
    return (
      <PurchaseInvoiceDetail
        id={itemId}
        onBack={() => onSelectTab?.('purchase-invoices')}
        onOpenInvoice={(invoiceId) => onSelectTab?.('purchase-invoices', { id: invoiceId })}
        onOpenRequest={(requestId) => onSelectTab?.('request-monitor', { id: requestId })}
      />
    )
  return (
    <FinancePage
      title={translate('invoice.title')}
      description={translate('invoice.description')}
      actions={
        <div role='group' aria-label={translate('invoice.title')} className='flex gap-2'>
          {(['queue', 'missing'] as const).map((key) => (
            <FinanceButton
              key={key}
              variant={mode === key ? 'primary' : 'secondary'}
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
            >
              {translate(`invoice.${key}`)}
            </FinanceButton>
          ))}
        </div>
      }
    >
      {mode === 'queue' ? <InvoiceQueue onSelectTab={onSelectTab} /> : <MissingPeriods />}
    </FinancePage>
  )
}

function InvoiceQueue({ onSelectTab }: Pick<Props, 'onSelectTab'>) {
  const { t: translate, i18n } = useTranslation('financePurchases')
  const { page, pageSize, setPage } = useFinanceList()
  const [month, setMonth] = useState('')
  const [state, setState] = useState<PurchaseInvoiceListState | ''>(PurchaseInvoiceListState.SUBMITTED)
  const [label, setLabel] = useState<PurchaseInvoiceListLabel | ''>('')
  const query = usePurchaseInvoiceList({
    page,
    pageSize,
    ...(state ? { state } : {}),
    ...(label ? { label } : {}),
    ...(month ? { servicePeriodMonth: month } : {})
  })
  const result = query.data?.data
  return (
    <>
      <FinanceToolbar>
        <div className='sm:w-56'>
          <FinanceField label={translate('invoice.state')}>
            <FinanceSelect
              value={state}
              onChange={(event) => {
                setState(Object.values(PurchaseInvoiceListState).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(PurchaseInvoiceListState).map((value) => (
                <option key={value} value={value}>
                  {translate(`invoice.states.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-56'>
          <FinanceField label={translate('invoice.label')}>
            <FinanceSelect
              value={label}
              onChange={(event) => {
                setLabel(Object.values(PurchaseInvoiceListLabel).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(PurchaseInvoiceListLabel).map((value) => (
                <option key={value} value={value}>
                  {translate(`invoice.labels.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-48'>
          <FinanceField label={translate('invoice.servicePeriodMonth')}>
            <input
              type='month'
              title={translate('invoice.monthFilterHint')}
              aria-label={`${translate('invoice.servicePeriodMonth')}. ${translate('invoice.monthFilterHint')}`}
              className={financeInputClass}
              value={month}
              onChange={(event) => {
                setMonth(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(invoice) => invoice.id}
          onOpen={(invoice) => onSelectTab?.('purchase-invoices', { id: invoice.id })}
          columns={[
            {
              key: 'number',
              label: translate('invoice.vendorInvoiceNumber'),
              render: (invoice) => invoice.vendorInvoiceNumber
            },
            {
              key: 'label',
              label: translate('invoice.label'),
              render: (invoice) => invoiceLabelText(translate, invoice.label, invoice.periodIndex, invoice.periodCount)
            },
            {
              key: 'month',
              label: translate('invoice.servicePeriodMonth'),
              numeric: true,
              render: (invoice) => invoice.servicePeriodMonth
            },
            {
              key: 'net',
              label: translate('invoice.netAmount'),
              numeric: true,
              render: (invoice) => formatMoney(invoice.netAmount, i18n.language)
            },
            {
              key: 'match',
              label: translate('invoice.match'),
              render: (invoice) => (
                <FinanceStatus
                  value={invoice.matchResult === 'MATCHED' ? 'ACTIVE' : 'PENDING'}
                  label={translate(`invoice.matches.${invoice.matchResult}`)}
                />
              )
            },
            {
              key: 'flags',
              label: translate('invoice.flags'),
              render: (invoice) =>
                invoice.flags.length ? (
                  <span className='flex flex-wrap gap-1'>
                    {invoice.flags.map((flag) => (
                      <FinanceStatus key={flag} value='PENDING' label={translate(`invoice.flagNames.${flag}`)} />
                    ))}
                  </span>
                ) : (
                  translate('none')
                )
            },
            {
              key: 'state',
              label: translate('invoice.state'),
              render: (invoice) => (
                <FinanceStatus value={invoice.state} label={translate(`invoice.states.${invoice.state}`)} />
              )
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </>
  )
}

function MissingPeriods() {
  const { t: translate } = useTranslation('financePurchases')
  const { page, pageSize, setPage } = useFinanceList()
  const query = usePurchaseInvoiceMissingPeriodList({ page, pageSize })
  const result = query.data?.data
  return (
    <>
      <p className='text-sm text-muted-foreground'>{translate('invoice.missingHint')}</p>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(item) => `${item.requestId ?? item.subscriptionId}-${item.servicePeriodMonth}-${item.label}`}
          columns={[
            {
              key: 'link',
              label: translate('invoice.label'),
              render: (item) =>
                `${translate(`invoice.linkKinds.${item.linkKind}`)} · ${invoiceLabelText(translate, item.label, item.periodIndex, item.periodCount)}`
            },
            {
              key: 'plan',
              label: translate('invoice.plan'),
              render: (item) => `${item.plan.applicationName} · ${item.plan.planName}`
            },
            {
              key: 'department',
              label: translate('invoice.department'),
              render: (item) => item.department?.name ?? translate('invoice.sharedPool')
            },
            {
              key: 'month',
              label: translate('invoice.servicePeriodMonth'),
              numeric: true,
              render: (item) => item.servicePeriodMonth
            },
            {
              key: 'payment',
              label: translate('invoice.paymentDate'),
              numeric: true,
              render: (item) => item.paymentDate
            },
            { key: 'due', label: translate('invoice.dueDate'), numeric: true, render: (item) => item.dueDate }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </>
  )
}
