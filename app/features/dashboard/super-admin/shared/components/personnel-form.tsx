import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { RecordNoticeBodyDto } from '~/shared/api/generated/model/personnel-notices'
import { AdminField, AdminFormDialog, adminInputClass } from './admin-form'
import { EmployeeLookup } from './employee-lookup'
import { DepartmentLookup } from './department-lookup'
import { EmployeeDepartmentSelect } from './employee-department-select'
import { NoticeEventLookup, type NoticeEventSource } from './notice-event-lookup'

export interface PersonnelField {
  name: string
  type?: 'text' | 'date' | 'email' | 'uuid' | 'checkbox'
  optional?: boolean
  optionalWhenChecked?: string
  fixed?: boolean
  options?: readonly string[]
  initial?: string
  initialLabel?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  eventSource?: NoticeEventSource
  employeeId?: string
}
export const basisFields: PersonnelField[] = [
  { name: 'type', options: ['HR_DECISION', 'APPROVED_APPLICATION', 'WRITTEN_DIRECTIVE'] },
  { name: 'reference', maxLength: 200 },
  { name: 'issuer', maxLength: 200 },
  { name: 'issuedOn', type: 'date' }
]
export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function readBasis(values: FormData): RecordNoticeBodyDto['grounds'] {
  const type = value(values, 'type')
  if (type !== 'HR_DECISION' && type !== 'APPROVED_APPLICATION' && type !== 'WRITTEN_DIRECTIVE') {
    throw new Error('Invalid personnel grounds type')
  }
  return {
    type,
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
  page,
  onClose,
  onSubmit,
  children,
  submitLabel
}: {
  title: string
  fields: PersonnelField[]
  basis?: boolean | 'note'
  pending: boolean
  page?: boolean
  onClose: () => void
  onSubmit: (values: FormData) => void
  children?: ReactNode
  submitLabel?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [validation, setValidation] = useState(false)
  const [departmentReady, setDepartmentReady] = useState(false)
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>({})
  return (
    <AdminFormDialog
      page={page ?? fields.length + (basis === 'note' ? 1 : basis ? basisFields.length : 0) > 10}
      title={title}
      wide
      pending={pending}
      submitDisabled={fields.some((field) => field.name === 'departmentCode') && !departmentReady}
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
      <div className='grid content-start items-start gap-4 sm:grid-cols-2'>
        {[
          ...fields,
          ...(basis === 'note' ? [{ name: 'groundsNote', minLength: 1, maxLength: 500 }] : basis ? basisFields : [])
        ].map((field) =>
          field.name === 'departmentCode' ? (
            <EmployeeDepartmentSelect key={field.name} onReadyChange={setDepartmentReady} />
          ) : (
            <AdminField
              key={field.name}
              label={translate(`fields.${field.name}`, { defaultValue: translate('unknown') })}
            >
              {field.fixed ? (
                <input
                  className={adminInputClass}
                  value={field.initialLabel ?? ''}
                  disabled
                  readOnly
                  required={!field.optional}
                />
              ) : field.name === 'employeeId' || field.name === 'successorEmployeeId' ? (
                <EmployeeLookup
                  name={field.name}
                  required={!field.optional}
                  initial={field.initial}
                  initialLabel={field.initialLabel}
                />
              ) : field.name === 'toDepartmentId' || field.name === 'departmentId' ? (
                <DepartmentLookup
                  name={field.name}
                  required={!field.optional}
                  initial={field.initial}
                  initialLabel={field.initialLabel}
                />
              ) : field.name === 'eventId' && field.eventSource && field.employeeId ? (
                <NoticeEventLookup source={field.eventSource} employeeId={field.employeeId} />
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
                  pattern={field.type === 'uuid' ? uuidPattern : field.pattern}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  defaultValue={field.initial}
                  placeholder={
                    field.type === 'checkbox' || field.type === 'date'
                      ? undefined
                      : translate(`placeholders.${field.name}`, {
                          defaultValue: translate('fieldPlaceholder', {
                            field: translate(`fields.${field.name}`, { defaultValue: translate('unknown') })
                          })
                        })
                  }
                  required={!field.optional && !(field.optionalWhenChecked && checkedFields[field.optionalWhenChecked])}
                  onChange={
                    field.type === 'checkbox'
                      ? (event) => setCheckedFields((current) => ({ ...current, [field.name]: event.target.checked }))
                      : undefined
                  }
                  className={field.type === 'checkbox' ? 'size-5 accent-primary' : adminInputClass}
                />
              )}
            </AdminField>
          )
        )}
      </div>
      {basis === true && <p className='text-xs text-muted-foreground'>{translate('basisHelp')}</p>}
      {validation && (
        <p role='alert' className='text-sm text-danger'>
          {translate('successorConflict')}
        </p>
      )}
      {children}
    </AdminFormDialog>
  )
}
