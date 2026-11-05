import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubscriptionRenewalDecideBodyDto } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalDecideBodyDto'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsSection,
  approvalsInputClass
} from '../../shared/components/approvals-ui'
import { RENEWAL_CHOICE, type RenewalChoice } from '../enums/renewal-choice'
import { useRenewalDecision } from '../hooks/use-renewal-decision'
import { RenewalSeatRanking } from './renewal-seat-ranking'

const REASON_MAX = 2000
const choices: RenewalChoice[] = [RENEWAL_CHOICE.RENEW, RENEWAL_CHOICE.REDUCE, RENEWAL_CHOICE.CANCEL]

function parseQuantity(value: string) {
  return /^\d+$/.test(value.trim()) ? Number(value.trim()) : null
}

export function RenewalDecisionForm({ renewal }: { renewal: SubscriptionRenewalResponseDtoDataRenewal }) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const { formatNumber } = useWorkspaceFormat()
  const choiceLabelId = useId()
  const decision = useRenewalDecision(renewal.id)
  const [choice, setChoice] = useState<RenewalChoice | null>(null)
  const [quantityText, setQuantityText] = useState('')
  const [withinTerm, setWithinTerm] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [reason, setReason] = useState('')
  const [released, setReleased] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const { purchasedQuantity, seatsInUse, allowsMidTermReduction } = renewal.period
  const quantity = parseQuantity(quantityText)
  const quantityValid = quantity !== null && (purchasedQuantity === null || quantity < purchasedQuantity)
  const requiredRelease = choice === RENEWAL_CHOICE.REDUCE && quantityValid ? Math.max(0, seatsInUse - quantity) : 0
  const heldSeats = decision.reportedSeatsInUse ?? seatsInUse
  const needsAcknowledgement = choice === RENEWAL_CHOICE.CANCEL && (heldSeats > 0 || decision.acknowledgementRequested)
  const trimmedReason = reason.trim()

  const errors = {
    choice: choice === null ? translate('decision.choiceRequired') : null,
    quantity:
      choice === RENEWAL_CHOICE.REDUCE && !quantityValid
        ? purchasedQuantity === null
          ? translate('decision.quantityInvalidUnknown')
          : translate('decision.quantityInvalid', { purchased: formatNumber(purchasedQuantity) })
        : null,
    release:
      requiredRelease > 0 && released.length !== requiredRelease
        ? translate('decision.releaseInvalid', { required: requiredRelease, selected: released.length })
        : null,
    acknowledge: needsAcknowledgement && !acknowledged ? translate('decision.acknowledgeRequired') : null,
    reason: trimmedReason.length > REASON_MAX ? translate('decision.reasonTooLong') : null
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const show = (message: string | null) => (submitted ? message : null)
  const disabled = decision.isPending || decision.blocked

  const buildBody = (selected: RenewalChoice): SubscriptionRenewalDecideBodyDto => {
    const body: SubscriptionRenewalDecideBodyDto = { choice: selected }
    if (trimmedReason) body.reason = trimmedReason
    if (selected === RENEWAL_CHOICE.REDUCE && quantity !== null) {
      body.quantity = quantity
      if (withinTerm && allowsMidTermReduction) body.withinCurrentTerm = true
      if (requiredRelease > 0) body.releasedAssignmentIds = released
    }
    if (selected === RENEWAL_CHOICE.CANCEL && needsAcknowledgement) body.acknowledgeActiveUsers = true
    return body
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (hasErrors || choice === null || disabled) return
    decision.decide(buildBody(choice))
  }

  const toggleSeat = (assignmentId: string) =>
    setReleased((current) =>
      current.includes(assignmentId) ? current.filter((id) => id !== assignmentId) : [...current, assignmentId]
    )

  return (
    <>
      <RenewalSeatRanking
        renewalId={renewal.id}
        selection={
          requiredRelease > 0
            ? { selected: released, required: requiredRelease, disabled, onToggle: toggleSeat }
            : undefined
        }
      />
      <ApprovalsSection title={translate('decision.title')}>
        <form noValidate onSubmit={onSubmit} className='space-y-5 rounded-lg border border-border/70 bg-surface p-4'>
          {decision.blocked && (
            <p role='alert' className='text-sm font-medium text-danger'>
              {translate('decision.blocked')}
            </p>
          )}
          <div className='space-y-1.5'>
            <span id={choiceLabelId} className='flex items-center gap-1 text-sm font-medium'>
              {translate('decision.choice')}
              <span aria-hidden className='text-danger'>
                *
              </span>
            </span>
            <div role='group' aria-labelledby={choiceLabelId} className='flex flex-wrap gap-2'>
              {choices.map((option) => (
                <ApprovalsButton
                  key={option}
                  aria-pressed={choice === option}
                  disabled={disabled}
                  onClick={() => setChoice(option)}
                >
                  {translate(`values.choice.${option}`)}
                </ApprovalsButton>
              ))}
            </div>
            <p className={`min-h-5 text-xs ${show(errors.choice) ? 'text-danger' : 'text-muted-foreground'}`}>
              {show(errors.choice) ?? translate('decision.choiceHint')}
            </p>
          </div>

          {choice === RENEWAL_CHOICE.REDUCE && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <ApprovalsField
                label={translate('decision.quantity')}
                required
                error={show(errors.quantity)}
                hint={[
                  purchasedQuantity === null
                    ? translate('decision.quantityHintUnknown')
                    : translate('decision.quantityHint', { purchased: formatNumber(purchasedQuantity) }),
                  renewal.proposal.quantity !== null
                    ? translate('decision.itSuggests', { count: renewal.proposal.quantity })
                    : ''
                ].join(' ')}
              >
                <input
                  className={`${approvalsInputClass} max-w-[180px] text-right font-mono tabular-nums`}
                  inputMode='numeric'
                  placeholder={translate('decision.quantityPlaceholder')}
                  value={quantityText}
                  disabled={disabled}
                  aria-required
                  aria-invalid={Boolean(show(errors.quantity))}
                  onChange={(event) => setQuantityText(event.target.value)}
                />
              </ApprovalsField>
              {allowsMidTermReduction && (
                <label className='flex min-h-11 items-start gap-3 pt-7 text-sm'>
                  <input
                    type='checkbox'
                    className='mt-0.5 size-5 cursor-pointer accent-primary'
                    checked={withinTerm}
                    disabled={disabled}
                    onChange={(event) => setWithinTerm(event.target.checked)}
                  />
                  <span>
                    {translate('decision.withinTerm')}
                    <span className='block text-xs text-muted-foreground'>{translate('decision.withinTermHint')}</span>
                  </span>
                </label>
              )}
            </div>
          )}

          {requiredRelease > 0 && (
            <div className='space-y-2'>
              <p className='text-sm font-medium'>{translate('decision.release')}</p>
              <p
                role={show(errors.release) ? 'alert' : undefined}
                className={`text-xs ${show(errors.release) ? 'text-danger' : 'text-muted-foreground'}`}
              >
                {show(errors.release) ??
                  translate('decision.releaseHint', { required: requiredRelease, selected: released.length })}
              </p>
            </div>
          )}

          {needsAcknowledgement && (
            <div className='space-y-1'>
              <label className='flex items-start gap-3 text-sm'>
                <input
                  type='checkbox'
                  className='mt-0.5 size-5 cursor-pointer accent-primary'
                  checked={acknowledged}
                  disabled={disabled}
                  aria-invalid={Boolean(show(errors.acknowledge))}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                />
                <span>{translate('decision.acknowledge', { count: heldSeats })}</span>
              </label>
              {show(errors.acknowledge) && (
                <p role='alert' className='text-xs text-danger'>
                  {errors.acknowledge}
                </p>
              )}
            </div>
          )}

          <ApprovalsField
            label={translate('decision.reason')}
            hint={translate('decision.reasonHint')}
            error={show(errors.reason)}
          >
            <textarea
              className={`${approvalsInputClass} min-h-24 resize-y`}
              placeholder={translate('decision.reasonPlaceholder')}
              value={reason}
              disabled={disabled}
              aria-invalid={Boolean(show(errors.reason))}
              onChange={(event) => setReason(event.target.value)}
            />
          </ApprovalsField>

          <div className='flex justify-end'>
            <ApprovalsButton type='submit' variant='primary' pending={decision.isPending} disabled={decision.blocked}>
              {decision.isPending ? translate('decision.submitting') : translate('decision.submit')}
            </ApprovalsButton>
          </div>
        </form>
      </ApprovalsSection>
    </>
  )
}
