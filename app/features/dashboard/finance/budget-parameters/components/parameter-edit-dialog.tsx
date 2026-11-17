import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getOperatingParameterHistoryQueryKey,
  getOperatingParameterListQueryKey,
  useOperatingParameterHistory,
  useOperatingParameterSet
} from '~/shared/api/generated/operations/operating-parameters'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, FinanceQueryState, financeInputClass } from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { intRange, isValidParameterValue, parameterText, type BudgetParameter } from '../budget-parameters'

export function ParameterEditDialog({ parameter, onClose }: { parameter: BudgetParameter; onClose: () => void }) {
  const { t: translate } = useTranslation('financeReview')
  const range = intRange(parameter)
  const [value, setValue] = useState(String(parameter.value))
  const feedback = useFinanceFeedback(
    [getOperatingParameterListQueryKey(), getOperatingParameterHistoryQueryKey(parameter.key)],
    onClose
  )
  const set = useOperatingParameterSet({ mutation: feedback })
  const history = useOperatingParameterHistory(parameter.key)

  const valid = range !== null && isValidParameterValue(value, range) && value !== String(parameter.value)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || set.isPending) return
    set.mutate({ key: parameter.key, data: { value: Number(value) } })
  }

  return (
    <AdminFormDialog
      title={translate('parameters.editTitle', { label: parameterText(translate, parameter, 'label') })}
      pending={set.isPending}
      submitLabel={translate('parameters.save')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='text-sm text-muted-foreground'>{parameterText(translate, parameter, 'description')}</p>
      <FinanceField
        label={`${translate('parameters.value')} (${parameter.unitLabel})`}
        required
        hint={range ? translate('parameters.range', range) : undefined}
        error={
          range && value && !isValidParameterValue(value, range) ? translate('parameters.rangeInvalid', range) : null
        }
      >
        <input
          type='text'
          inputMode='numeric'
          className={`${financeInputClass} font-mono tabular-nums`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </FinanceField>
      <section aria-label={translate('parameters.history')} className='space-y-2'>
        <h3 className='text-sm font-semibold'>{translate('parameters.history')}</h3>
        <FinanceQueryState query={history}>
          {history.data?.data?.items.length ? (
            <ul className='space-y-1 text-sm'>
              {history.data.data.items.map((entry) => (
                <li key={entry.from} className='flex justify-between gap-3 font-mono tabular-nums'>
                  <span>{String(entry.value)}</span>
                  <span className='text-muted-foreground'>
                    {entry.from.slice(0, 10)} ·{' '}
                    {entry.until
                      ? translate('parameters.until', { date: entry.until.slice(0, 10) })
                      : translate('parameters.current')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-muted-foreground'>{translate('parameters.historyEmpty')}</p>
          )}
          {history.data?.data?.hasMore && (
            <p className='text-xs text-muted-foreground'>{translate('parameters.historyMore')}</p>
          )}
        </FinanceQueryState>
      </section>
    </AdminFormDialog>
  )
}
