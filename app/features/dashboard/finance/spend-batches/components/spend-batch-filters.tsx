import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FinanceButton,
  FinanceField,
  FinanceSelect,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { useDepartmentOptions } from '../hooks/use-department-options'

export interface SpendBatchFilterValues {
  departmentId: string
  fromDay: string
  toDay: string
}

export function SpendBatchFilters({
  values,
  invalidWindow,
  onChange
}: {
  values: SpendBatchFilterValues
  invalidWindow: boolean
  onChange: (values: SpendBatchFilterValues) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const departments = useDepartmentOptions()
  const windowError = invalidWindow ? translate('batches.invalidWindow') : null
  const hasFilters = Boolean(values.departmentId || values.fromDay || values.toDay)
  const departmentHint = departments.isError
    ? translate('pickerUnavailable')
    : departments.data?.truncated
      ? translate('pickerTruncated')
      : undefined
  return (
    <FinanceToolbar>
      <div className='min-w-0 sm:w-64'>
        <FinanceField label={translate('batches.department')} hint={departmentHint}>
          <FinanceSelect
            value={values.departmentId}
            disabled={departments.isPending || departments.isError}
            onChange={(event) => onChange({ ...values, departmentId: event.target.value })}
          >
            <option value=''>{translate('batches.departmentAll')}</option>
            {departments.data?.departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </FinanceSelect>
        </FinanceField>
      </div>
      <div className='sm:w-48'>
        <FinanceField label={translate('batches.submittedFrom')}>
          <input
            type='date'
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('batches.datePlaceholder')}
            value={values.fromDay}
            max={values.toDay || undefined}
            aria-invalid={invalidWindow}
            onChange={(event) => onChange({ ...values, fromDay: event.target.value })}
          />
        </FinanceField>
      </div>
      <div className='sm:w-48'>
        <FinanceField label={translate('batches.submittedTo')} error={windowError}>
          <input
            type='date'
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('batches.datePlaceholder')}
            value={values.toDay}
            min={values.fromDay || undefined}
            aria-invalid={invalidWindow}
            onChange={(event) => onChange({ ...values, toDay: event.target.value })}
          />
        </FinanceField>
      </div>
      {hasFilters && (
        <FinanceButton variant='ghost' onClick={() => onChange({ departmentId: '', fromDay: '', toDay: '' })}>
          <X aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('batches.clearFilters')}
        </FinanceButton>
      )}
    </FinanceToolbar>
  )
}
