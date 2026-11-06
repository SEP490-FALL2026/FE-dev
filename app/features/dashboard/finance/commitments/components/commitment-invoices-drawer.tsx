import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FinanceDrawer,
  FinanceEmpty,
  FinanceQueryState,
  FinanceSection
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useCommitmentInvoices } from '../hooks/use-finance-commitments'
import type { ExtendedCommitmentItem, InvoiceItem } from '../../shared/finance-api-extensions'

export function CommitmentInvoicesDrawer({
  commitment,
  onClose
}: {
  commitment: ExtendedCommitmentItem
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const query = useCommitmentInvoices(commitment.id)
  const invoices = query.data?.items ?? []

  const matchResultBadge = (result: string) => {
    switch (result) {
      case 'MATCHED':
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success-ink'>
            <CheckCircle2 className='size-3' />
            {translateFinance('matchResults.MATCHED')}
          </span>
        )
      case 'TAX_ONLY':
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-xs font-medium text-info-ink'>
            <Clock className='size-3' />
            {translateFinance('matchResults.TAX_ONLY')}
          </span>
        )
      case 'PRICE_QUANTITY_EXCEPTION':
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger'>
            <AlertCircle className='size-3' />
            {translateFinance('matchResults.PRICE_QUANTITY_EXCEPTION')}
          </span>
        )
      default:
        return <span className='text-xs text-muted-foreground'>{result}</span>
    }
  }

  return (
    <FinanceDrawer
      title={`${translateFinance('viewInvoices')} · ${commitment.request?.software.name ?? commitment.costCenter.name}`}
      onClose={onClose}
    >
      <div className='rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-xs space-y-1.5'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{translate('department')}:</span>
          <span className='font-medium text-foreground'>{commitment.costCenter.name}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{translate('kpis.total')}:</span>
          <span className='font-mono font-medium'>{formatMoney(commitment.amount, i18n.language)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{translateFinance('held')}:</span>
          <span className='font-mono font-bold text-warning-ink'>{formatMoney(commitment.held, i18n.language)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{translateFinance('invoiced')}:</span>
          <span className='font-mono font-bold text-foreground'>
            {commitment.invoiced ? formatMoney(commitment.invoiced, i18n.language) : '—'}
          </span>
        </div>
      </div>

      <FinanceSection title={translateFinance('viewInvoices')}>
        <FinanceQueryState query={query}>
          {invoices.length > 0 ? (
            <FinanceTable<InvoiceItem>
              items={invoices}
              rowKey={(inv) => inv.id}
              columns={[
                {
                  key: 'number',
                  label: translateFinance('invoiceNumber'),
                  render: (inv) => <span className='font-mono font-semibold'>{inv.number}</span>
                },
                {
                  key: 'issuedOn',
                  label: translateFinance('issuedOn'),
                  render: (inv) => (
                    <span className='text-xs text-muted-foreground'>
                      {new Date(inv.issuedOn).toLocaleDateString(i18n.language)}
                    </span>
                  )
                },
                {
                  key: 'netAmount',
                  label: translateFinance('netAmount'),
                  numeric: true,
                  render: (inv) => formatMoney(inv.netAmount, i18n.language)
                },
                {
                  key: 'deductibleTax',
                  label: translateFinance('deductibleTax'),
                  numeric: true,
                  render: (inv) =>
                    Number(inv.deductibleTax.amount) > 0 ? formatMoney(inv.deductibleTax, i18n.language) : '—'
                },
                {
                  key: 'actualCost',
                  label: translateFinance('actualCost'),
                  numeric: true,
                  render: (inv) => (
                    <span className='font-mono font-bold text-foreground'>
                      {formatMoney(inv.actualCost, i18n.language)}
                    </span>
                  )
                },
                {
                  key: 'matchResult',
                  label: translateFinance('matchResult'),
                  render: (inv) => matchResultBadge(inv.matchResult)
                },
                {
                  key: 'recordedBy',
                  label: translateFinance('submittedBy'),
                  render: (inv) =>
                    inv.recordedBy ? (
                      <div className='text-xs'>
                        <div className='font-medium text-foreground'>{inv.recordedBy.fullName}</div>
                        <div className='text-[10px] text-muted-foreground'>
                          {new Date(inv.recordedAt).toLocaleDateString(i18n.language)}
                        </div>
                      </div>
                    ) : (
                      '—'
                    )
                }
              ]}
            />
          ) : (
            <FinanceEmpty message={translateFinance('empty')} />
          )}
        </FinanceQueryState>
      </FinanceSection>
    </FinanceDrawer>
  )
}
