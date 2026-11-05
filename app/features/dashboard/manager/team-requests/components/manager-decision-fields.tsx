import { useTranslation } from 'react-i18next'
import type { NeedDecisionBodyDto } from '~/shared/api/generated/model/access-requests/needDecisionBodyDto'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { NEED_DECISION } from '../enums/need-decision'

export type ManagerDecisionChoice = { decision: NeedDecisionBodyDto['decision'] | ''; reason: string }

export function ManagerDecisionFields({
  label,
  name,
  value,
  onChange
}: {
  label: string
  name: string
  value: ManagerDecisionChoice
  onChange: (value: ManagerDecisionChoice) => void
}) {
  const { t: translate } = useTranslation('manager')
  return (
    <fieldset className='space-y-3'>
      <legend className='mb-2 text-sm font-medium'>{label}</legend>
      <div className='grid gap-3 sm:grid-cols-2'>
        {([NEED_DECISION.APPROVE, NEED_DECISION.REJECT] as const).map((decision) => (
          <label
            key={decision}
            className='flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft'
          >
            <input
              type='radio'
              name={`${name}.decision`}
              value={decision}
              required
              checked={value.decision === decision}
              onChange={() => onChange({ ...value, decision })}
            />
            {translate(decision === NEED_DECISION.APPROVE ? 'approve' : 'reject')}
          </label>
        ))}
      </div>
      {value.decision === NEED_DECISION.REJECT && (
        <ManagerField label={translate('requestForm.rejectionReason')}>
          <textarea
            name={`${name}.reason`}
            className={managerInputClass}
            value={value.reason}
            onChange={(event) => {
              event.target.setCustomValidity(event.target.value.trim() ? '' : translate('validation'))
              onChange({ ...value, reason: event.target.value })
            }}
            rows={2}
            required
            maxLength={1000}
          />
        </ManagerField>
      )}
    </fieldset>
  )
}
