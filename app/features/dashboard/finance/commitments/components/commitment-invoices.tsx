import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetCommitmentInvoiceList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-invoice-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { FinanceEmpty, FinancePagination, FinanceQueryState, FinanceSection } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { InvoiceMatchBadge } from './invoice-match-badge'

const pageSize = 20

export function CommitmentInvoices({ commitmentId, action }: { commitmentId: string; action?: ReactNode }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const { formatDate, formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const invoices = useBudgetCommitmentInvoiceList(commitmentId, { page, pageSize })
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)
  return (
    <FinanceSection title={translate('commitments.invoices.title')} actions={action}>
      <FinanceQueryState query={invoices}>
        {invoices.data?.data?.items.length ? (
          <FinanceTable
            items={invoices.data.data.items}
            rowKey={(invoice) => invoice.id}
            columns={[
              {
                key: 'number',
                label: translate('commitments.invoices.number'),
                render: (invoice) => (
                  <span className='font-mono text-xs' title={invoice.note ?? invoice.number}>
                    {invoice.number}
                  </span>
                )
              },
              {
                key: 'issuedOn',
                label: translate('commitments.invoices.issuedOn'),
                numeric: true,
                render: (invoice) => <span className='text-xs'>{formatDate(invoice.issuedOn)}</span>
              },
              {
                key: 'netAmount',
                label: translate('commitments.invoices.netAmount'),
                numeric: true,
                render: (invoice) => money(invoice.netAmount)
              },
              {
                key: 'deductibleTax',
                label: translate('commitments.invoices.deductibleTax'),
                numeric: true,
                render: (invoice) => money(invoice.deductibleTax)
              },
              {
                key: 'nonDeductibleTax',
                label: translate('commitments.invoices.nonDeductibleTax'),
                numeric: true,
                render: (invoice) => money(invoice.nonDeductibleTax)
              },
              {
                key: 'actualCost',
                label: translate('commitments.invoices.actualCost'),
                numeric: true,
                render: (invoice) => <span className='font-semibold'>{money(invoice.actualCost)}</span>
              },
              {
                key: 'matchResult',
                label: translate('commitments.invoices.matchResult'),
                render: (invoice) => <InvoiceMatchBadge value={invoice.matchResult} />
              },
              {
                key: 'recorded',
                label: translate('commitments.invoices.recordedBy'),
                render: (invoice) => (
                  <span title={formatDateTime(invoice.recordedAt)}>
                    {invoice.recordedBy?.fullName ?? translate('commitments.invoices.system')}
                  </span>
                )
              }
            ]}
          />
        ) : (
          <FinanceEmpty message={translate('commitments.invoices.empty')} />
        )}
        <FinancePagination pagination={invoices.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceSection>
  )
}
