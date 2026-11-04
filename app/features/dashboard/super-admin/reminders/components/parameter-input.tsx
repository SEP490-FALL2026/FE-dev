import { useTranslation } from 'react-i18next'
import { useId } from 'react'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model/operating-parameters'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'

export function ParameterInput({
  parameter,
  value,
  invalid,
  onChange
}: {
  parameter: ParameterListResponseDtoDataItemsItem
  value: string
  invalid: boolean
  onChange: (value: string) => void
}) {
  const { t: translate } = useTranslation('admin')
  const constraintsId = useId()
  const errorId = useId()
  const constraints = parameter.constraints
  if (constraints?.kind === 'enum')
    return (
      <fieldset className='space-y-2' aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined}>
        <legend className='text-sm font-medium'>{translate('parameters.value')}</legend>
        <div className='flex flex-wrap gap-2'>
          {constraints.options.map((option) => (
            <label
              key={option}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${value === option ? 'border-primary bg-primary-soft text-primary-ink' : 'border-border bg-surface hover:bg-surface-subtle'}`}
            >
              <input
                type='radio'
                name='parameterValue'
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className='accent-primary'
              />
              {constraints.optionLabels[option] ?? option}
            </label>
          ))}
        </div>
        {invalid && (
          <p id={errorId} className='min-h-5 text-xs text-danger'>
            {translate('parameters.invalid')}
          </p>
        )}
      </fieldset>
    )
  if (constraints?.kind !== 'int' && constraints?.kind !== 'int-list')
    return <p className='text-sm text-muted-foreground'>{translate('parameters.contract.readOnly')}</p>
  const isList = constraints.kind === 'int-list'
  return (
    <div className='space-y-2'>
      <AdminField label={translate('parameters.value')}>
        <input
          required
          aria-invalid={invalid}
          aria-describedby={`${constraintsId}${invalid ? ` ${errorId}` : ''}`}
          className={adminInputClass}
          type={isList ? 'text' : 'number'}
          step={isList ? undefined : 1}
          min={isList ? undefined : constraints.min}
          max={isList ? undefined : constraints.max}
          placeholder={translate(
            isList ? 'parameters.contract.listPlaceholder' : 'parameters.contract.valuePlaceholder'
          )}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </AdminField>
      {invalid && (
        <p id={errorId} className='min-h-5 text-xs text-danger'>
          {translate('parameters.invalid')}
        </p>
      )}
      <p id={constraintsId} className='text-xs text-muted-foreground'>
        {constraints.kind === 'int'
          ? translate('parameters.contract.range', constraints)
          : translate('parameters.contract.list', {
              minLength: constraints.length.min,
              maxLength: constraints.length.max,
              min: constraints.min,
              max: constraints.max,
              order: translate(`parameters.contract.${constraints.order}`)
            })}
      </p>
    </div>
  )
}
