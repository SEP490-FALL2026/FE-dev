import { useTranslation } from 'react-i18next'
import { isYearFilterInvalid } from '../../shared/finance-validation'
import { FinanceField, FinanceSelect, FinanceToolbar, financeInputClass } from '../../shared/components/finance-ui'

export function BudgetListFilters<State extends string>({
  year,
  onYearChange,
  states,
  state,
  onStateChange
}: {
  year: string
  onYearChange: (year: string) => void
  states?: readonly State[]
  state?: State
  onStateChange?: (state?: State) => void
}) {
  const { t: translate } = useTranslation('financeBudget')
  return (
    <FinanceToolbar>
      <div className='w-full sm:w-44'>
        <FinanceField
          label={translate('fields.year')}
          error={isYearFilterInvalid(year) ? translate('yearRange') : null}
        >
          <input
            className={`${financeInputClass} font-mono tabular-nums`}
            type='number'
            inputMode='numeric'
            min={2000}
            max={2200}
            aria-invalid={isYearFilterInvalid(year)}
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
            placeholder={translate('placeholders.yearFilter')}
          />
        </FinanceField>
      </div>
      {states && (
        <div className='w-full sm:w-60'>
          <FinanceField label={translate('fields.state')}>
            <FinanceSelect
              value={state ?? ''}
              onChange={(event) => onStateChange?.(event.target.value ? (event.target.value as State) : undefined)}
            >
              <option value=''>{translate('allStates')}</option>
              {states.map((value) => (
                <option key={value} value={value}>
                  {translate(`states.${value}`, { defaultValue: translate('unknown') })}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
      )}
    </FinanceToolbar>
  )
}
