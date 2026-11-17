import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { ApprovalsField, approvalsInputClass } from './approvals-ui'
import { ChecklistText } from './checklist-text'

/**
 * Asks for the reason of a rejection or a return and for one more confirmation before it is sent.
 * The reason stays in the box when the write fails, so nothing typed is lost.
 */
export function DecisionDeclineDialog({
  title,
  question,
  confirmLabel,
  danger = false,
  criteria,
  pending,
  onSubmit,
  onClose
}: {
  title: string
  question: string
  confirmLabel: string
  danger?: boolean
  /** The checklist criteria answered No: the ground of the decision. */
  criteria: string[]
  pending: boolean
  onSubmit: (reason: string) => void
  onClose: () => void
}) {
  const { t: translate } = useTranslation('approvals')
  const [reason, setReason] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reason.trim() || pending) return
    onSubmit(reason.trim())
  }
  return (
    <AdminFormDialog
      title={title}
      pending={pending}
      submitLabel={confirmLabel}
      submitDisabled={!reason.trim()}
      danger={danger}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='text-sm text-muted-foreground [text-wrap:pretty]'>{question}</p>
      {criteria.length > 0 && (
        <div className='space-y-1.5 rounded-md border border-border/70 bg-surface-subtle p-3 text-sm'>
          <p className='font-medium'>{translate('decline.criteria')}</p>
          <ul className='list-disc space-y-1 pl-5 text-muted-foreground'>
            {criteria.map((text) => (
              <li key={text}>
                <ChecklistText text={text} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <ApprovalsField label={translate('decline.reason')} required>
        <textarea
          required
          autoFocus
          rows={4}
          maxLength={1000}
          className={approvalsInputClass}
          value={reason}
          placeholder={translate('decline.placeholder')}
          onChange={(event) => setReason(event.target.value)}
        />
      </ApprovalsField>
    </AdminFormDialog>
  )
}
