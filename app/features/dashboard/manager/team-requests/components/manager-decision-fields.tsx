import { useTranslation } from 'react-i18next'
import type { NeedDecisionBodyDto } from '~/shared/api/generated/model/access-requests/needDecisionBodyDto'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { NEED_DECISION } from '../enums/need-decision'

export type ManagerDecisionChoice = { decision: NeedDecisionBodyDto['decision'] | ''; reason: string }

const decisionLabel = {
  APPROVE: 'approve',
  REJECT: 'reject',
  RETURN: 'requestDetail.returnLabel'
} as const

export function ManagerDecisionFields({
  label,
  name,
  value,
  onChange,
  fallbackReason = '',
  approveLocked = false
}: {
  label: string
  name: string
  value: ManagerDecisionChoice
  onChange: (value: ManagerDecisionChoice) => void
  /** A checklist answer is No: only reject or return remain. */
  approveLocked?: boolean
  fallbackReason?: string
}) {
  const { t: translate } = useTranslation('manager')
  return (
    <fieldset className='space-y-3'>
      <legend className='mb-2 text-sm font-medium'>{label}</legend>
      <div className='grid gap-3 sm:grid-cols-3'>
        {([NEED_DECISION.APPROVE, NEED_DECISION.REJECT, NEED_DECISION.RETURN] as const).map((decision) => (
          <label
            key={decision}
            className='flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:disabled]:opacity-50'
          >
            <input
              type='radio'
              name={`${name}.decision`}
              value={decision}
              required
              disabled={decision === NEED_DECISION.APPROVE && approveLocked}
              checked={value.decision === decision}
              onChange={() => onChange({ ...value, decision })}
            />
            {translate(decisionLabel[decision])}
          </label>
        ))}
      </div>
      {(value.decision === NEED_DECISION.REJECT || value.decision === NEED_DECISION.RETURN) && (
        <ManagerField
          label={translate(
            value.decision === NEED_DECISION.RETURN ? 'requestDetail.returnReason' : 'requestForm.rejectionReason'
          )}
        >
          <textarea
            name={`${name}.reason`}
            className={managerInputClass}
            value={value.reason}
            onChange={(event) => {
              onChange({ ...value, reason: event.target.value })
            }}
            rows={2}
            required={!fallbackReason}
            placeholder={fallbackReason}
            maxLength={1000}
          />
        </ManagerField>
      )}
    </fieldset>
  )
}
