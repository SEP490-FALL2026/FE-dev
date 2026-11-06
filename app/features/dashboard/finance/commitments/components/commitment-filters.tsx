import { useTranslation } from 'react-i18next'
import { FinanceField, FinanceSelect, FinanceToolbar, financeInputClass } from '../../shared/components/finance-ui'
import { CommitmentState } from '../enums/commitment-state'
import { useCostCenterOptions } from '../hooks/use-cost-center-options'

export interface CommitmentFilterValues {
  costCenterId: string
  year: string
  state: CommitmentState | ''
}

export const isValidCommitmentYear = (value: string) =>
  value === '' || (/^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2200)

export function CommitmentFilters({
  values,
  onChange
}: {
  values: CommitmentFilterValues
  onChange: (values: CommitmentFilterValues) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  // Same labels as the state badge on each row.
  const { t: translateStatus } = useTranslation('finance')
  const costCenters = useCostCenterOptions()
  const costCenterHint = costCenters.isError
    ? translate('pickerUnavailable')
    : costCenters.data?.truncated
      ? translate('pickerTruncated')
      : undefined
  const yearValid = isValidCommitmentYear(values.year)
  return (
    <FinanceToolbar>
      <div className='min-w-0 sm:w-72'>
        <FinanceField label={translate('commitments.costCenter')} hint={costCenterHint}>
          <FinanceSelect
            value={values.costCenterId}
            disabled={costCenters.isPending || costCenters.isError}
            onChange={(event) => onChange({ ...values, costCenterId: event.target.value })}
          >
            <option value=''>{translate('commitments.costCenterAll')}</option>
            {costCenters.data?.costCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.department ? `${center.code} · ${center.department.name}` : `${center.code} · ${center.name}`}
              </option>
            ))}
          </FinanceSelect>
        </FinanceField>
      </div>
      <div className='sm:w-40'>
        <FinanceField
          label={translate('commitments.year')}
          error={yearValid ? null : translate('commitments.invalidYear')}
        >
          <input
            type='number'
            inputMode='numeric'
            min={2000}
            max={2200}
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('commitments.yearPlaceholder')}
            aria-invalid={!yearValid}
            value={values.year}
            onChange={(event) => onChange({ ...values, year: event.target.value })}
          />
        </FinanceField>
      </div>
      <div className='sm:w-52'>
        <FinanceField label={translate('commitments.state')}>
          <FinanceSelect
            value={values.state}
            onChange={(event) =>
              onChange({
                ...values,
                state: Object.values(CommitmentState).find((state) => state === event.target.value) ?? ''
              })
            }
          >
            {Object.values(CommitmentState).map((state) => (
              <option key={state} value={state}>
                {translateStatus(`status.${state}`)}
              </option>
            ))}
            <option value=''>{translate('commitments.stateAll')}</option>
          </FinanceSelect>
        </FinanceField>
      </div>
    </FinanceToolbar>
  )
}
