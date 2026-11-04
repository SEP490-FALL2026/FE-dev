import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import {
  getDepartmentListQueryKey,
  getDepartmentGetQueryKey,
  useDepartmentCreate
} from '~/shared/api/generated/operations/departments'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { EmployeePicker } from './employee-picker'
import { organizationSummaryQueryKeys } from '../hooks/organization-query-keys'
import { useDepartmentEditor, type HeadChange } from '../hooks/use-department-editor'
import { DepartmentHeadPicker } from './department-head-picker'

function calendarToday() {
  const current = new Date()
  return [
    current.getFullYear(),
    String(current.getMonth() + 1).padStart(2, '0'),
    String(current.getDate()).padStart(2, '0')
  ].join('-')
}

export function DepartmentForm({
  department,
  onClose
}: {
  department?: NonNullable<DepartmentResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [headChange, setHeadChange] = useState<HeadChange>('keep')
  const [effectiveFrom, setEffectiveFrom] = useState(calendarToday)
  const minimumDate = calendarToday()
  const editor = useDepartmentEditor(department, onClose)
  const errorId = useId()
  const feedback = useAdminMutationFeedback(
    [
      ...organizationSummaryQueryKeys,
      getDepartmentListQueryKey(),
      ...(department ? [getDepartmentGetQueryKey(department.id)] : [])
    ],
    onClose
  )
  const create = useDepartmentCreate({ mutation: { ...feedback, retry: false } })
  const error = editor.fieldError
  return (
    <AdminFormDialog
      wide
      title={translate(department ? 'editDepartment' : 'createDepartment')}
      onClose={onClose}
      pending={create.isPending || editor.pending}
      submitDisabled={editor.reviewRequired && (!editor.reviewed || !editor.latest)}
      onSubmit={(event) => {
        event.preventDefault()
        if (create.isPending || editor.pending) return
        if (!event.currentTarget.checkValidity()) {
          event.currentTarget.reportValidity()
          return
        }
        const form = new FormData(event.currentTarget)
        const data = {
          name: String(form.get('name')).trim(),
          function: String(form.get('function') ?? '').trim() || null,
          itAdminEmployeeId: String(form.get('itAdminEmployeeId') ?? '').trim() || null
        }
        if (department)
          void editor.save({
            ...data,
            headChange,
            effectiveFrom,
            employeeId: String(form.get('employeeId') ?? '').trim()
          })
        else create.mutate({ data: { ...data, code: String(form.get('code')).trim() } })
      }}
    >
      <section className='grid gap-4'>
        <h3 className='font-semibold'>{translate('departmentDetails')}</h3>
        {!department && (
          <AdminField label={translate('code')}>
            <input
              required
              name='code'
              className={adminInputClass}
              minLength={2}
              maxLength={20}
              pattern='[A-Za-z0-9]+(-[A-Za-z0-9]+)*'
              placeholder={translate('editor.codePlaceholder')}
            />
          </AdminField>
        )}
        <AdminField label={translate('name')}>
          <input
            required
            name='name'
            className={adminInputClass}
            maxLength={200}
            pattern='.*\S.*'
            defaultValue={department?.name}
            placeholder={translate('editor.namePlaceholder')}
            aria-invalid={error?.code === 'DEPARTMENT.NAME_INVALID' || editor.invalidFields.has('name') || undefined}
            aria-describedby={
              error?.code === 'DEPARTMENT.NAME_INVALID' || editor.invalidFields.has('name') ? errorId : undefined
            }
          />
        </AdminField>
        <AdminField label={translate('function')}>
          <textarea
            name='function'
            className={adminInputClass}
            maxLength={1000}
            defaultValue={department?.function ?? ''}
            placeholder={translate('editor.functionPlaceholder')}
            aria-invalid={editor.invalidFields.has('function') || undefined}
            aria-describedby={editor.invalidFields.has('function') ? errorId : undefined}
          />
        </AdminField>
        <EmployeePicker
          name='itAdminEmployeeId'
          itAdmin
          optional
          invalid={error?.code === 'DEPARTMENT.IT_ADMIN_INVALID' || editor.invalidFields.has('itAdminEmployeeId')}
          descriptionId={
            error?.code === 'DEPARTMENT.IT_ADMIN_INVALID' || editor.invalidFields.has('itAdminEmployeeId')
              ? errorId
              : undefined
          }
          initialId={department?.itAdmin?.employeeId}
          initialLabel={
            department?.itAdmin ? `${department.itAdmin.employeeCode} — ${department.itAdmin.fullName}` : ''
          }
        />
      </section>
      {department && (
        <section className='grid gap-4 border-t border-border pt-4'>
          <div>
            <h3 className='font-semibold'>{translate('head')}</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              {department.head
                ? `${department.head.employeeCode} — ${department.head.fullName}`
                : translate('unassigned')}
            </p>
          </div>
          <AdminField label={translate('editor.headChoice')}>
            <select
              className={adminInputClass}
              value={headChange}
              onChange={(event) => {
                const next = event.target.value
                if (next === 'keep' || next === 'assign' || next === 'vacate') setHeadChange(next)
              }}
            >
              <option value='keep'>{translate('editor.keepHead')}</option>
              <option value='assign'>{translate('editor.assignHead')}</option>
              <option value='vacate'>{translate('editor.vacateHead')}</option>
            </select>
          </AdminField>
          {headChange !== 'keep' && (
            <AdminField label={translate('effectiveFrom')}>
              <input
                required
                type='date'
                name='effectiveFrom'
                className={`${adminInputClass} max-w-xs`}
                value={effectiveFrom}
                min={minimumDate}
                onChange={(event) => setEffectiveFrom(event.target.value)}
                aria-invalid={
                  error?.code === 'DEPARTMENT.HEAD_DATE_IN_PAST' ||
                  editor.invalidFields.has('effectiveFrom') ||
                  undefined
                }
                aria-describedby={
                  error?.code === 'DEPARTMENT.HEAD_DATE_IN_PAST' || editor.invalidFields.has('effectiveFrom')
                    ? errorId
                    : undefined
                }
              />
            </AdminField>
          )}
          {headChange === 'assign' && (
            <DepartmentHeadPicker
              key={effectiveFrom}
              departmentId={department.id}
              effectiveFrom={effectiveFrom}
              errorId={
                error && error.code !== 'DEPARTMENT.NAME_INVALID' && error.code !== 'DEPARTMENT.IT_ADMIN_INVALID'
                  ? errorId
                  : undefined
              }
            />
          )}
          {headChange === 'vacate' && <p className='text-sm text-muted-foreground'>{translate('editor.vacateHelp')}</p>}
          {error && (
            <p id={errorId} role='alert' className='min-h-5 text-sm text-danger'>
              {error.message}
            </p>
          )}
        </section>
      )}
      {editor.reviewRequired && (
        <section className='grid gap-3 border-t border-border pt-4'>
          <h3 className='font-semibold'>{translate('editor.latestTitle')}</h3>
          {editor.latest ? (
            <>
              <p className='break-words text-sm'>{editor.latest.name}</p>
              <p className='break-words text-sm text-muted-foreground'>
                {editor.latest.function ?? translate('noFunction')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {translate('itAdmin')}: {editor.latest.itAdmin?.fullName ?? translate('unassigned')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {translate('head')}: {editor.latest.head?.fullName ?? translate('unassigned')}
              </p>
              <label className='flex items-center gap-3 text-sm'>
                <input
                  type='checkbox'
                  className='size-5 accent-primary'
                  checked={editor.reviewed}
                  onChange={(event) => editor.setReviewed(event.target.checked)}
                />
                {translate('editor.review')}
              </label>
            </>
          ) : (
            <button type='button' className={adminInputClass} onClick={() => void editor.reread()}>
              {translate('editor.readLatest')}
            </button>
          )}
        </section>
      )}
    </AdminFormDialog>
  )
}
