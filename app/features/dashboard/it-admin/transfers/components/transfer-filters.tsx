import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DepartmentTransferListParams } from '~/shared/api/generated/model/department-transfers'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
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
  const [employeeId, setEmployeeId] = useState(params.employeeId ?? '')
  return (
    <form
      className='soft-panel space-y-4 p-4'
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onApply({
          page: 1,
          pageSize: 20,
          status: Object.values(TransferStatus).find((value) => value === status),
          employeeId: employeeId || undefined,
          effectiveFrom: String(form.get('effectiveFrom') ?? '') || undefined,
          effectiveTo: String(form.get('effectiveTo') ?? '') || undefined,
          graceEndsFrom: String(form.get('graceEndsFrom') ?? '') || undefined,
          graceEndsBefore: String(form.get('graceEndsBefore') ?? '') || undefined
        })
      }}
    >
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'>
        <ItChoiceSelect
          label={translate('status')}
          value={status}
          onChange={setStatus}
          options={[
            { value: '', label: translate('all') },
            ...Object.values(TransferStatus).map((value) => ({ value, label: translate(`values.${value}`) }))
          ]}
        />
        <ItDirectoryLookup
          mode='employee'
          clearable
          label={translate('employeeId')}
          hint={translate(employeeId ? 'employeeSelected' : 'employeePlaceholder')}
          value={employeeId}
          onSelect={setEmployeeId}
        />
      </div>
      <div className='field-bar grid gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]'>
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
      </div>
    </form>
  )
}
