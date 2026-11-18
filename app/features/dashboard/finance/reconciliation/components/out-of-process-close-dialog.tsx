import { useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  OutOfProcessClosureBodyDto,
  OutOfProcessListResponseDtoDataItemsItem
} from '~/shared/api/generated/model/out-of-process-cases'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import {
  getOutOfProcessCaseListQueryKey,
  useOutOfProcessCaseClose
} from '~/shared/api/generated/operations/out-of-process-cases'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { MoneyInput } from '~/shared/ui/money-input'
import { FinanceButton, FinanceField, FinanceSelect, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useCostCenterLabel } from '../../shared/hooks/use-cost-center-label'
import { usePurchasesFeedback } from '../../purchase-invoices/hooks/use-purchases-feedback'
import {
  PURCHASE_DOCUMENT_LIMIT,
  PURCHASE_DOCUMENT_TYPES,
  usePurchaseDocumentUpload,
  type UploadedDocument
} from '../hooks/use-purchase-document-upload'

/** Finance closes with one of three outcomes; REVOKED belongs to IT Admin. */
const FINANCE_OUTCOMES = ['RECORD_SPENT', 'FALSE_ALARM', 'REPORT_ONLY'] as const
type FinanceOutcome = (typeof FINANCE_OUTCOMES)[number]

export function OutOfProcessCloseDialog({
  item,
  onClose
}: {
  item: OutOfProcessListResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financePurchases')
  const alreadyRecorded = item.amount !== null
  // A case with no vendor cannot take the spend (OUT_OF_PROCESS_CASE.NO_VENDOR).
  const cannotRecord = alreadyRecorded || item.vendorId === null
  const [outcome, setOutcome] = useState<FinanceOutcome>(cannotRecord ? 'REPORT_ONLY' : 'RECORD_SPENT')
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')
  const [costCenterId, setCostCenterId] = useState('UNALLOCATED')
  const [costCenterLabel, setCostCenterLabel] = useState('')
  const [costCenterSearch, setCostCenterSearch] = useState('')
  const search = useDebouncedValue(costCenterSearch, 300)
  const nameOf = useCostCenterLabel()
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const fileInput = useRef<HTMLInputElement>(null)
  const costCenters = useCostCenterList({ pageSize: 100, status: 'ACTIVE', ...(search ? { search } : {}) })
  // "Chưa phân bổ" stays first while nothing is typed; typed text searches the active Cost Centers on the server.
  const costCenterOptions = [
    ...(search ? [] : [{ value: 'UNALLOCATED', label: translate('outOfProcess.unallocated') }]),
    ...(costCenters.data?.data?.items ?? []).map((costCenter) => ({
      value: costCenter.id,
      label: nameOf(costCenter),
      description: costCenter.code
    }))
  ]
  const upload = usePurchaseDocumentUpload()
  const feedback = usePurchasesFeedback([getOutOfProcessCaseListQueryKey()], onClose)
  const close = useOutOfProcessCaseClose({ mutation: feedback })

  const recording = outcome === 'RECORD_SPENT'
  const amountValid = isDecimal(amount) && Number(amount) > 0
  const valid = Boolean(note.trim()) && (!recording || (amountValid && documents.length > 0))

  const addFile = (file: File | undefined) => {
    if (!file || documents.length >= PURCHASE_DOCUMENT_LIMIT) return
    upload.mutate(file, { onSuccess: (uploaded) => setDocuments((current) => [...current, uploaded]) })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || close.isPending || upload.isPending) return
    const data: OutOfProcessClosureBodyDto = recording
      ? {
          outcome,
          note: note.trim(),
          amount: { amount },
          costCenterId,
          documentIds: documents.map((document) => document.id)
        }
      : { outcome, note: note.trim() }
    close.mutate({ id: item.id, data })
  }

  return (
    <AdminFormDialog
      title={translate('outOfProcess.closeTitle')}
      pending={close.isPending}
      submitLabel={translate('outOfProcess.closeSubmit')}
      submitDisabled={!valid || upload.isPending}
      onClose={onClose}
      onSubmit={submit}
    >
      <FinanceField
        label={translate('outOfProcess.closeOutcome')}
        hint={translate(`outOfProcess.outcomeHints.${outcome}`)}
      >
        <FinanceSelect
          placeholder={translate('ui.outcomePlaceholder')}
          value={outcome}
          onChange={(event) =>
            setOutcome(FINANCE_OUTCOMES.find((value) => value === event.target.value) ?? 'REPORT_ONLY')
          }
        >
          {FINANCE_OUTCOMES.filter(
            (value) =>
              !(alreadyRecorded && value !== 'REPORT_ONLY') && !(item.vendorId === null && value === 'RECORD_SPENT')
          ).map((value) => (
            <option key={value} value={value}>
              {translate(`outOfProcess.outcomes.${value}`)}
            </option>
          ))}
        </FinanceSelect>
      </FinanceField>
      {item.vendorId === null && !alreadyRecorded && (
        <p role='status' className='text-xs text-muted-foreground'>
          {translate('outOfProcess.noVendorNote')}
        </p>
      )}
      {item.companyAsset && outcome === 'RECORD_SPENT' && (
        <p role='status' className='text-xs text-muted-foreground'>
          {translate('outOfProcess.companyAssetNote')}
        </p>
      )}
      {recording && (
        <>
          <FinanceField
            required
            label={translate('outOfProcess.amountField')}
            error={amount && !amountValid ? translate('errors.differenceInvalid') : null}
          >
            <MoneyInput
              maxLength={40}
              placeholder={translate('ui.amountPlaceholder')}
              aria-invalid={Boolean(amount) && !amountValid}
              className={`${financeInputClass} font-mono tabular-nums`}
              value={amount}
              onValueChange={setAmount}
            />
          </FinanceField>
          <FinanceField required label={translate('outOfProcess.costCenterField')}>
            <FinanceSelect
              required
              value={costCenterId}
              options={costCenterOptions}
              placeholder={translate('ui.costCenterPlaceholder')}
              emptyText={translate('ui.costCenterEmpty')}
              loading={costCenters.isFetching}
              onSearchChange={setCostCenterSearch}
              selectedLabel={costCenterId === 'UNALLOCATED' ? translate('outOfProcess.unallocated') : costCenterLabel}
              onValueChange={(value, option) => {
                // Clearing is not offered: the spend always goes to a Cost Center or stays unallocated.
                if (!value) return
                setCostCenterId(value)
                setCostCenterLabel(option?.label ?? '')
              }}
            />
          </FinanceField>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>{translate('outOfProcess.documents')}</p>
            <p className='text-xs text-muted-foreground'>{translate('outOfProcess.documentsHint')}</p>
            <ul className='space-y-1'>
              {documents.map((document) => (
                <li key={document.id} className='flex items-center justify-between gap-3 text-sm'>
                  <span className='truncate'>{document.name}</span>
                  <FinanceButton
                    variant='ghost'
                    onClick={() => setDocuments((current) => current.filter((entry) => entry.id !== document.id))}
                  >
                    {translate('outOfProcess.removeFile')}
                  </FinanceButton>
                </li>
              ))}
            </ul>
            <input
              ref={fileInput}
              type='file'
              hidden
              accept={PURCHASE_DOCUMENT_TYPES.join(',')}
              aria-label={translate('outOfProcess.addFile')}
              onChange={(event) => {
                addFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            <FinanceButton
              pending={upload.isPending}
              disabled={documents.length >= PURCHASE_DOCUMENT_LIMIT}
              onClick={() => fileInput.current?.click()}
            >
              {upload.isPending ? translate('outOfProcess.uploading') : translate('outOfProcess.addFile')}
            </FinanceButton>
          </div>
        </>
      )}
      <FinanceField required label={translate('outOfProcess.noteField')} hint={translate('outOfProcess.noteHint')}>
        <textarea
          required
          rows={3}
          maxLength={1000}
          placeholder={translate('ui.notePlaceholder')}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </FinanceField>
    </AdminFormDialog>
  )
}
