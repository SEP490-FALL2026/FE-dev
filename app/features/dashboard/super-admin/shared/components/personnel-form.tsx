import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreateEmployeeBodyDtoHrBasis } from '~/shared/api/generated/model/employees'
import { AdminField, AdminFormDialog, adminInputClass } from './admin-form'
import { EmployeeLookup } from './employee-lookup'
import { DepartmentLookup } from './department-lookup'

export interface PersonnelField {
  name: string
  type?: 'text' | 'date' | 'email' | 'uuid' | 'checkbox'
  optional?: boolean
  options?: readonly string[]
  initial?: string
  maxLength?: number
}
export const basisFields: PersonnelField[] = [
  { name: 'type', maxLength: 100 },
  { name: 'reference', maxLength: 200 },
  { name: 'issuer', maxLength: 200 },
  { name: 'issuedOn', type: 'date' }
]
export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function readBasis(values: FormData): CreateEmployeeBodyDtoHrBasis {
  return {
    type: value(values, 'type'),
    reference: value(values, 'reference'),
    issuer: value(values, 'issuer'),
    issuedOn: value(values, 'issuedOn')
  }
}
export function value(values: FormData, key: string) {
  return String(values.get(key) ?? '').trim()
}
export function readSuccessor(values: FormData) {
  const employeeId = value(values, 'successorEmployeeId')
  return employeeId
    ? { kind: 'EMPLOYEE' as const, employeeId }
    : values.get('noSuccessor')
      ? { kind: 'NONE' as const }
      : undefined
}
export const successorFields: PersonnelField[] = [
  { name: 'successorEmployeeId', type: 'uuid', optional: true },
  { name: 'noSuccessor', type: 'checkbox', optional: true }
]

export function PersonnelForm({
  title,
  fields,
  basis = false,
  pending,
  onClose,
  onSubmit,
  children,
  submitLabel
}: {
  title: string
  fields: PersonnelField[]
  basis?: boolean
  pending: boolean
  onClose: () => void
  onSubmit: (values: FormData) => void
  children?: ReactNode
  submitLabel?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [validation, setValidation] = useState(false)
  return (
    <AdminFormDialog
      page={fields.length + (basis ? basisFields.length : 0) > 10}
      title={title}
      wide
      pending={pending}
      onClose={onClose}
      submitLabel={submitLabel}
      onSubmit={(event) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        if (value(values, 'successorEmployeeId') && values.get('noSuccessor')) {
          setValidation(true)
          return
        }
        setValidation(false)
        onSubmit(values)
      }}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        {[...fields, ...(basis ? basisFields : [])].map((field) => (
          <AdminField
            key={field.name}
            label={translate(`fields.${field.name}`, { defaultValue: translate('unknown') })}
          >
            {field.name === 'employeeId' || field.name === 'successorEmployeeId' ? (
              <EmployeeLookup name={field.name} required={!field.optional} />
            ) : field.name === 'toDepartmentId' || field.name === 'departmentId' ? (
              <DepartmentLookup name={field.name} required={!field.optional} initial={field.initial} />
            ) : field.options ? (
              <select
                name={field.name}
                required={!field.optional}
                defaultValue={field.initial ?? ''}
                className={adminInputClass}
              >
                <option value=''>{translate('choose')}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {translate(`codes.${option}`, { defaultValue: translate('unknown') })}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type === 'uuid' ? 'text' : (field.type ?? 'text')}
                pattern={field.type === 'uuid' ? uuidPattern : undefined}
                maxLength={field.maxLength}
                defaultValue={field.initial}
                required={!field.optional}
                className={field.type === 'checkbox' ? 'size-5 accent-primary' : adminInputClass}
              />
            )}
          </AdminField>
        ))}
      </div>
      {basis && <p className='text-xs text-muted-foreground'>{translate('basisHelp')}</p>}
      {validation && (
        <p role='alert' className='text-sm text-danger'>
          {translate('successorConflict')}
        </p>
      )}
      {children}
    </AdminFormDialog>
  )
}
