import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InvoiceRecordedResponseDtoData } from '~/shared/api/generated/model/budget-commitments'
import { useBudgetCommitmentList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import {
  FinanceButton,
  FinanceEmpty,
  FinanceField,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  financeInputClass
} from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { CommitmentState } from '../enums/commitment-state'
import { useCostCenterOptions } from '../hooks/use-cost-center-options'
import { useRecordInvoice, type Commitment } from '../hooks/use-commitment-actions'
import { emptyInvoiceDraft, validateInvoice, type InvoiceDraft, type InvoiceFieldErrors } from '../invoice-form'
import { InvoiceFields } from './invoice-fields'
import { InvoiceMatchBadge } from './invoice-match-badge'
import { InvoicePreviewPanel } from './invoice-preview-panel'

const optionClass =
  'flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border px-4 py-3 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'

function InvoiceEntryForm({
  commitment,
  onRecorded
}: {
  commitment: Commitment
  onRecorded: (recorded: InvoiceRecordedResponseDtoData) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const [draft, setDraft] = useState<InvoiceDraft>(emptyInvoiceDraft)
  const [errors, setErrors] = useState<InvoiceFieldErrors>({})
  // Checked against the approved seats only; the API has no field for it yet, so it is never sent.
  const [billedQuantity, setBilledQuantity] = useState('')
  const [quantityMissing, setQuantityMissing] = useState(false)
  const retrySeconds = useFinanceRetry()
  const record = useRecordInvoice(commitment, {
    onDone: () => undefined,
    onFieldErrors: setErrors
  })
  return (
    <form
      noValidate
      className='space-y-5'
      onSubmit={(event) => {
        event.preventDefault()
        if (record.isPending || retrySeconds > 0) return
        const result = validateInvoice(draft, commitment.amount.currency)
        setErrors(result.errors)
        const quantityValid = /^[1-9]d*$/.test(billedQuantity.trim())
        setQuantityMissing(!quantityValid)
        if (result.body && quantityValid)
          record.mutate(
            { id: commitment.id, data: result.body },
            {
              onSuccess: (response) => {
                onRecorded(response.data)
                setDraft(emptyInvoiceDraft)
                setBilledQuantity('')
              }
            }
          )
      }}
    >
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]'>
        <fieldset disabled={record.isPending} className='space-y-4'>
          <div className='max-w-xs'>
            <FinanceField
              required
              label={translate('invoiceIntake.billedQuantity')}
              hint={translate('invoiceIntake.billedQuantityHint')}
              error={quantityMissing ? translate('invoiceIntake.billedQuantityRequired') : null}
            >
              <input
                name='billedQuantity'
                type='number'
                inputMode='numeric'
                min={1}
                aria-invalid={quantityMissing}
                className={`${financeInputClass} font-mono tabular-nums`}
                placeholder={translate('invoiceIntake.billedQuantityPlaceholder')}
                value={billedQuantity}
                onChange={(event) => {
                  setBilledQuantity(event.target.value)
                  setQuantityMissing(false)
                }}
              />
            </FinanceField>
          </div>
          <InvoiceFields
            currency={commitment.amount.currency}
            draft={draft}
            setDraft={setDraft}
            errors={errors}
            setErrors={setErrors}
          />
        </fieldset>
        <InvoicePreviewPanel commitment={commitment} draft={draft} billedQuantity={billedQuantity} />
      </div>
      <div className='flex justify-end gap-3 border-t border-border/60 pt-4'>
        <FinanceButton
          variant='ghost'
          disabled={record.isPending}
          onClick={() => {
            setDraft(emptyInvoiceDraft)
            setBilledQuantity('')
          }}
        >
          {translate('invoiceIntake.clear')}
        </FinanceButton>
        <FinanceButton variant='primary' type='submit' pending={record.isPending}>
          {translate('commitments.record.submit')}
        </FinanceButton>
      </div>
    </form>
  )
}

/** Manual intake: pick the department, then the held commitment the invoice belongs to, then record it. */
export function InvoiceManualEntry() {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const [costCenterId, setCostCenterId] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string>()
  const [recorded, setRecorded] = useState<InvoiceRecordedResponseDtoData>(null)
  const options = useCostCenterOptions()
  const commitments = useBudgetCommitmentList(
    { costCenterId, state: CommitmentState.HELD, page, pageSize: 10 },
    { query: { enabled: Boolean(costCenterId) } }
  )
  const items = commitments.data?.data?.items ?? []
  const selected = items.find((item) => item.id === selectedId)
  return (
    <div className='space-y-6'>
      <FinanceSection title={translate('invoiceIntake.step1')}>
        <div className='max-w-sm'>
          <FinanceField label={translate('invoiceIntake.department')} required>
            <FinanceSelect
              value={costCenterId}
              disabled={options.isPending}
              onChange={(event) => {
                setCostCenterId(event.target.value)
                setSelectedId(undefined)
                setRecorded(null)
                setPage(1)
              }}
            >
              <option value=''>{translate('invoiceIntake.departmentPlaceholder')}</option>
              {(options.data?.costCenters ?? []).map((center) => (
                <option key={center.id} value={center.id}>
                  {center.code} · {center.department?.name ?? center.name}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        {costCenterId && (
          <FinanceQueryState query={commitments}>
            {items.length ? (
              <div role='list' className='space-y-2'>
                {items.map((item) => {
                  const active = item.id === selectedId
                  const name = item.request
                    ? [item.request.software.name, item.request.plan?.name].filter(Boolean).join(' · ')
                    : item.requestId
                  return (
                    <div role='listitem' key={item.id}>
                      <button
                        type='button'
                        aria-pressed={active}
                        className={`${optionClass} ${active ? 'border-primary/50 bg-primary-soft text-primary-ink' : 'border-border/70 bg-surface hover:border-primary/40 hover:bg-surface-subtle'}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <span className='min-w-0'>
                          <span className='block truncate font-medium' title={name}>
                            {name}
                          </span>
                          <span className='block truncate text-xs text-muted-foreground'>
                            {item.request?.requester.fullName ?? '—'}
                          </span>
                        </span>
                        <span className='shrink-0 text-right'>
                          <span className='block text-xs text-muted-foreground'>{translate('invoiceIntake.held')}</span>
                          <span className='block font-mono font-semibold tabular-nums'>
                            {formatMoney(item.held, i18n.language)}
                          </span>
                        </span>
                      </button>
                    </div>
                  )
                })}
                <FinancePagination pagination={commitments.data?.data?.pagination} onPageChange={setPage} />
              </div>
            ) : (
              <FinanceEmpty message={translate('invoiceIntake.noHeld')} />
            )}
          </FinanceQueryState>
        )}
      </FinanceSection>
      {recorded && (
        <div
          role='status'
          className='flex flex-wrap items-center gap-3 rounded-lg border border-success/25 bg-success/5 p-4 text-sm'
        >
          <CheckCircle2 aria-hidden className='size-5 text-success-ink' strokeWidth={1.5} />
          <span className='font-medium'>
            {translate('commitments.record.success', { number: recorded.invoice.number })}
          </span>
          <InvoiceMatchBadge value={recorded.invoice.matchResult} />
          <span className='text-muted-foreground'>
            {translate('invoiceIntake.recordedHeld', {
              amount: formatMoney(recorded.commitment.held, i18n.language)
            })}
          </span>
        </div>
      )}
      {selected && (
        <FinanceSection title={translate('invoiceIntake.step2')}>
          <InvoiceEntryForm key={selected.id} commitment={selected} onRecorded={setRecorded} />
        </FinanceSection>
      )}
    </div>
  )
}
