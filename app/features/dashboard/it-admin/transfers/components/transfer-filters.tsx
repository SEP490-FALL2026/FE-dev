import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DepartmentTransferListParams } from '~/shared/api/generated/model/department-transfers'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { TransferStatus } from '../enums/transfer-status'

export function TransferFilters({
  params,
  onApply
}: {
  params: DepartmentTransferListParams
  onApply: (params: DepartmentTransferListParams) => void
}) {
  const { t: translate } = useTranslation('itTransfers')
  const [status, setStatus] = useState(params.status ?? '')
  return (
    <form
      className='grid items-end gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 xl:grid-cols-4'
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onApply({
          page: 1,
          pageSize: 20,
          status: Object.values(TransferStatus).find((value) => value === status),
          employeeId: String(form.get('employeeId') ?? '').trim() || undefined,
          effectiveFrom: String(form.get('effectiveFrom') ?? '') || undefined,
          effectiveTo: String(form.get('effectiveTo') ?? '') || undefined,
          graceEndsFrom: String(form.get('graceEndsFrom') ?? '') || undefined,
          graceEndsBefore: String(form.get('graceEndsBefore') ?? '') || undefined
        })
      }}
    >
      <ItChoiceSelect
        label={translate('status')}
        value={status}
        onChange={setStatus}
        options={[
          { value: '', label: translate('all') },
          ...Object.values(TransferStatus).map((value) => ({ value, label: translate(`values.${value}`) }))
        ]}
      />
      <ItField label={translate('employeeId')}>
        <input
          name='employeeId'
          defaultValue={params.employeeId ?? ''}
          pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
          placeholder={translate('employeePlaceholder')}
          className={itInputClass}
        />
      </ItField>
      {(['effectiveFrom', 'effectiveTo', 'graceEndsFrom', 'graceEndsBefore'] as const).map((key) => (
        <ItField
          key={key}
          label={translate(key)}
          hint={key === 'graceEndsBefore' ? translate('graceEndsBeforeHint') : undefined}
        >
          <input name={key} type='date' defaultValue={params[key] ?? ''} className={itInputClass} />
        </ItField>
      ))}
      <button type='submit' className={itButtonClass}>
        {translate('applyFilters')}
      </button>
    </form>
  )
}
