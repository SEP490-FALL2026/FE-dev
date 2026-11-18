import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useVendorAccountDiscrepancyDecide } from '~/shared/api/generated/operations/vendor-account-discrepancies/vendor-account-discrepancy-decide'
import { getVendorAccountDiscrepancyListQueryKey } from '~/shared/api/generated/operations/vendor-account-discrepancies/vendor-account-discrepancy-list'
import { useOutOfProcessCaseClose } from '~/shared/api/generated/operations/out-of-process-cases/out-of-process-case-close'
import { getOutOfProcessCaseListQueryKey } from '~/shared/api/generated/operations/out-of-process-cases/out-of-process-case-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItProofUpload } from '../../shared/components/it-proof-upload'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import type { ReconciliationAction } from '../types'

export function ReconciliationActionDialog({
  action,
  onClose,
  onSuccess
}: {
  action: ReconciliationAction
  onClose: () => void
  onSuccess: () => void
}) {
  const { t: translate } = useTranslation('itReconciliation')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const [note, setNote] = useState('')
  const [asset, setAsset] = useState<boolean>()
  const [renewalCancelled, setRenewalCancelled] = useState(false)
  const [document, setDocument] = useState<{ id: string; name: string }>()
  const [uploading, setUploading] = useState(false)
  const sending = useRef(false)
  const feedback = useItMutationFeedback(
    [getVendorAccountDiscrepancyListQueryKey(), getOutOfProcessCaseListQueryKey()],
    onSuccess
  )
  const decide = useVendorAccountDiscrepancyDecide({ mutation: { ...feedback, retry: false } })
  const close = useOutOfProcessCaseClose({ mutation: { ...feedback, retry: false } })
  const needsAsset = action.kind === 'vendor' && action.decision === 'OUT_OF_PROCESS'
  const revoked = action.kind === 'outside' && action.outcome === 'REVOKED'
  const pending = decide.isPending || close.isPending || uploading
  const invalid = !note.trim() || (needsAsset && asset === undefined) || (revoked && (!renewalCancelled || !document))
  const title = action.kind === 'vendor' ? action.decision : action.outcome
  return (
    <ItFormDialog
      title={translate(`outcomes.${title}`)}
      pending={pending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={invalid}
      onSubmit={async (event) => {
        event.preventDefault()
        if (sending.current || pending || invalid) return
        sending.current = true
        try {
          if (action.kind === 'vendor')
            await decide.mutateAsync({
              id: action.id,
              data: {
                decision: action.decision,
                note: note.trim(),
                ...(needsAsset ? { companyAsset: asset } : {})
              }
            })
          else
            await close.mutateAsync({
              id: action.id,
              data: {
                outcome: action.outcome,
                note: note.trim(),
                ...(revoked && document ? { renewalCancelled: true, documentIds: [document.id] } : {})
              }
            })
        } catch {
          /* Mutation feedback preserves the draft and reports the error. */
        } finally {
          sending.current = false
        }
      }}
    >
      <ItField label={translate('note')} hint={translate('noteHint')}>
        <textarea
          placeholder={translatePlaceholder('note')}
          required
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={itInputClass}
        />
      </ItField>
      {needsAsset && (
        <fieldset className='space-y-2'>
          <legend className='text-sm font-medium'>
            {translate('asset')}
            <span aria-hidden className='ml-1 text-danger'>
              *
            </span>
          </legend>
          <p className='text-xs text-muted-foreground'>{translate('assetHint')}</p>
          {[true, false].map((value) => (
            <label key={String(value)} className='flex items-center gap-2 text-sm'>
              <input type='radio' name='asset' required checked={asset === value} onChange={() => setAsset(value)} />
              {translate(value ? 'companyAsset' : 'personalAsset')}
            </label>
          ))}
        </fieldset>
      )}
      {revoked && (
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>{translate('revokeHint')}</p>
          <label className='flex items-start gap-2 text-sm'>
            <input
              type='checkbox'
              required
              checked={renewalCancelled}
              onChange={(event) => setRenewalCancelled(event.target.checked)}
            />
            {translate('renewalCancelled')}
            <span aria-hidden className='text-danger'>
              *
            </span>
          </label>
          {document ? (
            <p className='break-all text-sm'>{document.name}</p>
          ) : (
            <ItProofUpload
              label={translate('proof')}
              hint={translate('proofHint')}
              onUploaded={(id, name) => setDocument({ id, name })}
              onPendingChange={setUploading}
            />
          )}
        </div>
      )}
    </ItFormDialog>
  )
}
