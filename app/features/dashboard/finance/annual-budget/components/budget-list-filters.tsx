import { useTranslation } from 'react-i18next'
import { FinanceButton, FinanceField, financeInputClass } from '../../shared/components/finance-ui'

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
    <div className='flex flex-wrap items-end gap-3'>
      <div className='max-w-40'>
        <FinanceField label={translate('fields.year')}>
          <input
            className={financeInputClass}
            type='number'
            min={2000}
            max={2200}
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
            placeholder={translate('allYears')}
          />
        </FinanceField>
      </div>
      {states && (
        <details className='relative'>
          <summary className='min-h-11 cursor-pointer rounded-md border border-border bg-surface px-4 py-2 text-base md:min-h-10 md:text-sm'>
            {state ? translate(`states.${state}`, { defaultValue: translate('unknown') }) : translate('allStates')}
          </summary>
          <div className='absolute left-0 z-10 mt-1 grid min-w-56 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
            <FinanceButton aria-pressed={!state} onClick={() => onStateChange?.()}>
              {translate('allStates')}
            </FinanceButton>
            {states.map((value) => (
              <FinanceButton key={value} aria-pressed={state === value} onClick={() => onStateChange?.(value)}>
                {translate(`states.${value}`, { defaultValue: translate('unknown') })}
              </FinanceButton>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
