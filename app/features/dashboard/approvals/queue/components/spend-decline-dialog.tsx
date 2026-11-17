import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { ApprovalsField, approvalsInputClass } from '../../shared/components/approvals-ui'

export type DeclineKind = 'REJECT' | 'RETURN'

/**
 * Asks for the reason of a rejection or a return and for one more confirmation before it is sent.
 * The reason stays in the box when the write fails, so nothing typed is lost.
 */
export function SpendDeclineDialog({
  kind,
  criteria,
  pending,
  onSubmit,
  onClose
}: {
  kind: DeclineKind
  /** The checklist criteria answered No: the ground of the decision. */
  criteria: string[]
  pending: boolean
  onSubmit: (reason: string) => void
  onClose: () => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [reason, setReason] = useState('')
  const rejecting = kind === 'REJECT'
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reason.trim() || pending) return
    onSubmit(reason.trim())
  }
  return (
    <AdminFormDialog
      title={translate(rejecting ? 'declineRejectTitle' : 'declineReturnTitle')}
      pending={pending}
      submitLabel={translate(rejecting ? 'declineRejectConfirm' : 'declineReturnConfirm')}
      submitDisabled={!reason.trim()}
      danger={rejecting}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='text-sm text-muted-foreground [text-wrap:pretty]'>
        {translate(rejecting ? 'declineRejectAsk' : 'declineReturnAsk')}
      </p>
      {criteria.length > 0 && (
        <div className='space-y-1.5 rounded-md border border-border/70 bg-surface-subtle p-3 text-sm'>
          <p className='font-medium'>{translate('declineCriteria')}</p>
          <ul className='list-disc space-y-1 pl-5 text-muted-foreground'>
            {criteria.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      )}
      <ApprovalsField label={translate('declineReason')} required>
        <textarea
          required
          autoFocus
          rows={4}
          maxLength={1000}
          className={approvalsInputClass}
          value={reason}
          placeholder={translate('declinePlaceholder')}
          onChange={(event) => setReason(event.target.value)}
        />
      </ApprovalsField>
    </AdminFormDialog>
  )
}
