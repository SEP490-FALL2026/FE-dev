import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceButton, FinanceDrawer, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { useReleaseCommitment, type Commitment } from '../hooks/use-commitment-actions'

const maxReasonLength = 1000

export function ReleaseDrawer({ commitment, onClose }: { commitment: Commitment; onClose: () => void }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<'reasonRequired' | 'reasonLength' | null>(null)
  const retrySeconds = useFinanceRetry()
  const release = useReleaseCommitment(commitment, {
    onDone: onClose,
    onReasonError: () => setError('reasonRequired')
  })
  return (
    <FinanceDrawer title={translate('commitments.release.title')} onClose={onClose} pending={release.isPending}>
      <form
        noValidate
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (release.isPending || retrySeconds > 0) return
          const trimmed = reason.trim()
          const nextError = !trimmed ? 'reasonRequired' : trimmed.length > maxReasonLength ? 'reasonLength' : null
          setError(nextError)
          if (!nextError) release.mutate({ id: commitment.id, data: { reason: trimmed } })
        }}
      >
        <p className='text-sm text-muted-foreground'>
          {translate('commitments.release.summary', { amount: formatMoney(commitment.held, i18n.language) })}
        </p>
        <fieldset disabled={release.isPending}>
          <FinanceField
            label={translate('commitments.release.reason')}
            required
            error={error ? translate(`commitments.release.${error}`) : null}
            hint={translate('commitments.release.reasonHint')}
          >
            <textarea
              name='reason'
              rows={4}
              maxLength={maxReasonLength}
              className={`${financeInputClass} resize-y`}
              placeholder={translate('commitments.release.reasonPlaceholder')}
              value={reason}
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                setReason(event.target.value)
                setError(null)
              }}
            />
          </FinanceField>
        </fieldset>
        <div className='sticky bottom-0 flex justify-end gap-3 border-t border-border/60 bg-surface py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <FinanceButton variant='ghost' disabled={release.isPending} onClick={onClose}>
            {translate('commitments.release.cancel')}
          </FinanceButton>
          <FinanceButton variant='danger' type='submit' pending={release.isPending}>
            {translate('commitments.release.submit')}
          </FinanceButton>
        </div>
      </form>
    </FinanceDrawer>
  )
}
