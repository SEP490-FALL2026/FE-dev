import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useReviewPeriodActions } from '../hooks/use-in-year-actions'

/** Signing is allowed with unexplained lines: BE records them as not explained, so the dialog only warns. */
export function ReviewSignDialog({
  periodId,
  kind,
  unexplained,
  moreLines,
  onClose
}: {
  periodId: string
  kind: 'MONTH' | 'QUARTER'
  unexplained: number
  /** More lines than the page in view: the count of waiting lines is then a lower bound. */
  moreLines: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeReview')
  const [note, setNote] = useState('')
  const { sign } = useReviewPeriodActions(periodId)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sign.isPending) return
    sign.mutate({ id: periodId, data: note.trim() ? { note: note.trim() } : {} }, { onSuccess: onClose })
  }

  return (
    <AdminFormDialog
      title={translate('periods.signTitle')}
      pending={sign.isPending}
      submitLabel={translate('periods.signSubmit')}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='text-sm text-muted-foreground'>
        {translate(kind === 'QUARTER' ? 'periods.signHintQuarter' : 'periods.signHintMonth')}
      </p>
      {kind === 'QUARTER' && unexplained > 0 && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate(moreLines ? 'periods.unexplainedWarningMore' : 'periods.unexplainedWarning', {
            count: unexplained
          })}
        </p>
      )}
      <FinanceField label={translate('note')}>
        <textarea
          rows={3}
          maxLength={2000}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </FinanceField>
    </AdminFormDialog>
  )
}
