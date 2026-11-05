import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsSelect,
  ApprovalsToolbar,
  approvalsInputClass
} from '../../shared/components/approvals-ui'

export function ApprovalAnnualBudgetFilters({
  states,
  state,
  year,
  onApply
}: {
  states: string[]
  state?: string
  year?: number
  onApply: (filters: { state?: string; year?: number }) => void
}) {
  const { t: translate } = useTranslation('approvalsBudget')
  const [draftState, setDraftState] = useState(state ?? '')
  const [draftYear, setDraftYear] = useState(year?.toString() ?? '')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onApply({ state: draftState || undefined, year: draftYear ? Number(draftYear) : undefined })
      }}
    >
      <ApprovalsToolbar>
        <div className='w-full sm:w-64'>
          <ApprovalsSelect
            label={translate('state')}
            value={draftState}
            onChange={setDraftState}
            options={[
              { value: '', label: translate('all') },
              ...states.map((value) => ({
                value,
                label: translate(`status.${value}`, { defaultValue: translate('unavailable') })
              }))
            ]}
          />
        </div>
        <div className='w-full sm:w-48'>
          <ApprovalsField label={translate('year')}>
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2200}
              step={1}
              className={`${approvalsInputClass} text-right font-mono tabular-nums`}
              placeholder={translate('yearPlaceholder')}
              value={draftYear}
              onChange={(event) => setDraftYear(event.target.value)}
            />
          </ApprovalsField>
        </div>
        <ApprovalsButton type='submit'>{translate('apply')}</ApprovalsButton>
      </ApprovalsToolbar>
    </form>
  )
}
