import { useTranslation } from 'react-i18next'
import { usePurchaseInvoiceList } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-list'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'

export function ProvisioningInvoiceAction({
  requestId,
  onSelectTab
}: {
  requestId: string
  onSelectTab: (tab: ItAdminTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const invoices = usePurchaseInvoiceList({ requestId, page: 1, pageSize: 1 }, { query: { refetchOnMount: 'always' } })
  const invoice = invoices.data?.data?.items[0]
  return (
    <ItQueryState query={{ ...invoices, isPending: invoices.isPending || invoices.isFetching }}>
      {invoices.data?.data && (
        <button
          type='button'
          className={itButtonClass}
          onClick={() =>
            onSelectTab(
              'purchase-invoices',
              invoice ? { invoiceId: invoice.id, view: 'history' } : { requestId, view: 'new' }
            )
          }
        >
          {translate(invoice ? 'viewInvoice' : 'submitInvoice')}
        </button>
      )}
    </ItQueryState>
  )
}
