import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InvoiceDiscrepancyListState } from '~/shared/api/generated/model/invoice-discrepancies'
import { useInvoiceDiscrepancyList } from '~/shared/api/generated/operations/invoice-discrepancies'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import type { FinanceTabKey } from '../../enums'
import { DiscrepancyDetail } from '../components/discrepancy-detail'

interface Props {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

export function FinanceDiscrepanciesView({ itemId, onSelectTab }: Props) {
  const { t: translate, i18n } = useTranslation('financePurchases')
  const { page, pageSize, setPage } = useFinanceList()
  const [state, setState] = useState<InvoiceDiscrepancyListState | ''>(InvoiceDiscrepancyListState.OPEN)
  const query = useInvoiceDiscrepancyList({ page, pageSize, ...(state ? { state } : {}) })
  const result = query.data?.data
  if (itemId)
    return (
      <DiscrepancyDetail
        id={itemId}
        onBack={() => onSelectTab?.('invoice-discrepancies')}
        onOpenInvoice={(invoiceId) => onSelectTab?.('purchase-invoices', { id: invoiceId })}
      />
    )
  return (
    <FinancePage title={translate('discrepancy.title')} description={translate('discrepancy.description')}>
      <FinanceToolbar>
        <div className='sm:w-56'>
          <FinanceField label={translate('discrepancy.state')}>
            <FinanceSelect
              value={state}
              onChange={(event) => {
                setState(Object.values(InvoiceDiscrepancyListState).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(InvoiceDiscrepancyListState).map((value) => (
                <option key={value} value={value}>
                  {translate(`discrepancy.states.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={(item) => onSelectTab?.('invoice-discrepancies', { id: item.id })}
          columns={[
            {
              key: 'invoice',
              label: translate('discrepancy.invoice'),
              render: (item) => item.purchaseInvoice.vendorInvoiceNumber
            },
            {
              key: 'mismatches',
              label: translate('discrepancy.mismatches'),
              render: (item) =>
                item.mismatches.map((mismatch) => translate(`discrepancy.mismatchNames.${mismatch}`)).join(', ')
            },
            {
              key: 'net',
              label: translate('invoice.netAmount'),
              numeric: true,
              render: (item) => formatMoney(item.purchaseInvoice.netAmount, i18n.language)
            },
            {
              key: 'state',
              label: translate('discrepancy.state'),
              render: (item) => (
                <FinanceStatus value={item.state} label={translate(`discrepancy.states.${item.state}`)} />
              )
            },
            {
              key: 'outcome',
              label: translate('discrepancy.outcome'),
              render: (item) => (item.outcome ? translate(`discrepancy.outcomes.${item.outcome}`) : translate('none'))
            },
            {
              key: 'opened',
              label: translate('discrepancy.openedAt'),
              numeric: true,
              render: (item) => item.openedAt.slice(0, 10)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
