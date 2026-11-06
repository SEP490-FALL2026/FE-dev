import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceButton, FinanceDrawer } from '../../shared/components/finance-ui'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { useRecordInvoice, type Commitment } from '../hooks/use-commitment-actions'
import { emptyInvoiceDraft, validateInvoice, type InvoiceDraft, type InvoiceFieldErrors } from '../invoice-form'
import { InvoiceFields } from './invoice-fields'

export function InvoiceFormDrawer({ commitment, onClose }: { commitment: Commitment; onClose: () => void }) {
  const { t: translate } = useTranslation('financeSpend')
  const currency = commitment.amount.currency
  const [draft, setDraft] = useState<InvoiceDraft>(emptyInvoiceDraft)
  const [errors, setErrors] = useState<InvoiceFieldErrors>({})
  const retrySeconds = useFinanceRetry()
  const record = useRecordInvoice(commitment, { onDone: onClose, onFieldErrors: setErrors })
  return (
    <FinanceDrawer title={translate('commitments.record.title')} onClose={onClose} pending={record.isPending}>
      <form
        noValidate
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (record.isPending || retrySeconds > 0) return
          const result = validateInvoice(draft, currency)
          setErrors(result.errors)
          if (result.body) record.mutate({ id: commitment.id, data: result.body })
        }}
      >
        <fieldset disabled={record.isPending}>
          <InvoiceFields currency={currency} draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} />
        </fieldset>
        <div className='sticky bottom-0 flex justify-end gap-3 border-t border-border/60 bg-surface py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <FinanceButton variant='ghost' disabled={record.isPending} onClick={onClose}>
            {translate('commitments.record.cancel')}
          </FinanceButton>
          <FinanceButton variant='primary' type='submit' pending={record.isPending}>
            {translate('commitments.record.submit')}
          </FinanceButton>
        </div>
      </form>
    </FinanceDrawer>
  )
}
