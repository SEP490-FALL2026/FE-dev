import { useTranslation } from 'react-i18next'
import { FinanceField, FinanceSelect } from '../../shared/components/finance-ui'

/** Filter select over a generated enum, with a leading "all" option that maps to an empty value. */
export function CatalogEnumFilter<Value extends string>({
  label,
  options,
  value,
  onChange,
  className = 'sm:w-48'
}: {
  label: string
  options: Record<string, Value>
  value: Value | ''
  onChange: (value: Value | '') => void
  className?: string
}) {
  const { t: translate } = useTranslation('financeSettings')
  const values = Object.values(options)
  return (
    <div className={className}>
      <FinanceField label={label}>
        <FinanceSelect
          value={value}
          onChange={(event) => onChange(values.find((option) => option === event.target.value) ?? '')}
        >
          <option value=''>{translate('all')}</option>
          {values.map((option) => (
            <option key={option} value={option}>
              {translate(`enum.${option}`, { defaultValue: translate('unavailable') })}
            </option>
          ))}
        </FinanceSelect>
      </FinanceField>
    </div>
  )
}
