import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import type { EmployeeListParams } from '~/shared/api/generated/model/employees'
import { useEmployeeList } from '~/shared/api/generated/operations/employees/employee-list'
import { WorkspaceDataTable } from '~/shared/ui/workspace-data-table'
import { AdminField, adminInputClass, adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { DepartmentLookup } from '../../shared/components/department-lookup'
import { value } from '../../shared/components/personnel-form'
import { PersonnelCode } from '../../shared/components/personnel-list'
import { employeeWorkStates } from '../enums/employee-work-state'
import { employmentTypes } from '../enums/employment-type'
import { EmployeeDetail } from './employee-detail'

export function EmployeeDirectory({ onCorrect }: { onCorrect: (employeeId: string) => void }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [searchParams, setSearchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId') ?? ''
  const [params, setParams] = useState<EmployeeListParams>({ page: 1, pageSize: 20 })
  const [resetKey, setResetKey] = useState(0)
  const query = useEmployeeList(params)
  const filtersActive = Object.keys(params).some((key) => key !== 'page' && key !== 'pageSize')
  const openProfile = (id: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (id) next.set('employeeId', id)
      else next.delete('employeeId')
      return next
    })
  }
  return (
    <section className='space-y-4'>
      <h2 className='text-base font-semibold'>{translate('directory.title')}</h2>
      <form
        key={resetKey}
        className='grid items-end gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-3'
        onSubmit={(event) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget)
          const unplaced = value(values, 'unplaced')
          const hasAccount = value(values, 'hasAccount')
          const workState = employeeWorkStates.find((state) => state === value(values, 'workState'))
          const employmentType = employmentTypes.find((type) => type === value(values, 'employmentType'))
          setParams({
            page: 1,
            pageSize: 20,
            ...(value(values, 'q') ? { q: value(values, 'q') } : {}),
            ...(value(values, 'departmentId') ? { departmentId: value(values, 'departmentId') } : {}),
            ...(unplaced === 'true' || unplaced === 'false' ? { unplaced } : {}),
            ...(hasAccount === 'true' || hasAccount === 'false' ? { hasAccount } : {}),
            ...(workState ? { workState } : {}),
            ...(employmentType ? { employmentType } : {})
          })
        }}
      >
        <AdminField label={translate('directory.search')}>
          <input
            name='q'
            maxLength={100}
            placeholder={translate('directory.searchPlaceholder')}
            className={adminInputClass}
          />
        </AdminField>
        <AdminField label={translate('fields.departmentId')}>
          <DepartmentLookup name='departmentId' required={false} />
        </AdminField>
        <AdminField label={translate('directory.placement')}>
          <select name='unplaced' className={adminInputClass} defaultValue=''>
            <option value=''>{translate('directory.all')}</option>
            <option value='true'>{translate('directory.unplaced')}</option>
            <option value='false'>{translate('directory.placed')}</option>
          </select>
        </AdminField>
        <AdminField label={translate('directory.workState')}>
          <select name='workState' className={adminInputClass} defaultValue=''>
            <option value=''>{translate('directory.all')}</option>
            {employeeWorkStates.map((state) => (
              <option key={state} value={state}>
                {translate(`codes.${state}`)}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label={translate('directory.employmentType')}>
          <select name='employmentType' className={adminInputClass} defaultValue=''>
            <option value=''>{translate('directory.all')}</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {translate(`codes.${type}`)}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label={translate('directory.account')}>
          <select name='hasAccount' className={adminInputClass} defaultValue=''>
            <option value=''>{translate('directory.all')}</option>
            <option value='true'>{translate('directory.hasAccount')}</option>
            <option value='false'>{translate('directory.noAccount')}</option>
          </select>
        </AdminField>
        <div className='flex flex-wrap gap-2 sm:col-span-2 xl:col-span-3'>
          <button className={adminButtonClass} aria-busy={query.isFetching}>
            <Search aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('directory.apply')}
          </button>
          <button
            type='button'
            className={adminButtonClass}
            disabled={!filtersActive}
            onClick={() => {
              setParams({ page: 1, pageSize: 20 })
              setResetKey((key) => key + 1)
            }}
          >
            {translate('directory.reset')}
          </button>
        </div>
      </form>
      <AdminQueryState query={query}>
        <div className='overflow-hidden rounded-lg border border-border bg-surface'>
          <WorkspaceDataTable
            items={query.data?.data?.items ?? []}
            rowKey={(employee) => employee.id}
            label={translate('directory.title')}
            actionLabel={translate('directory.details')}
            emptyState={<AdminEmpty />}
            columns={[
              {
                key: 'employee',
                label: translate('directory.employee'),
                render: (employee) => (
                  <div className='min-w-0'>
                    <button
                      type='button'
                      title={employee.fullName}
                      className='block min-h-11 max-w-64 truncate rounded-sm text-left font-medium text-primary-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary md:min-h-8'
                      onClick={() => openProfile(employee.id)}
                    >
                      {employee.fullName}
                    </button>
                    <p
                      title={employee.workEmail ?? employee.employeeCode}
                      className='mt-1 max-w-64 truncate text-xs text-muted-foreground'
                    >
                      {employee.workEmail ?? employee.employeeCode}
                    </p>
                  </div>
                )
              },
              {
                key: 'code',
                label: translate('fields.employeeCode'),
                align: 'right',
                render: (employee) => <span className='font-mono tabular-nums'>{employee.employeeCode}</span>
              },
              {
                key: 'department',
                label: translate('directory.department'),
                render: (employee) => (
                  <span
                    className='block max-w-56 truncate'
                    title={employee.department?.name ?? translate('directory.unplaced')}
                  >
                    {employee.department?.name ?? translate('directory.unplaced')}
                  </span>
                )
              },
              {
                key: 'workState',
                label: translate('directory.status'),
                render: (employee) => <PersonnelCode code={employee.workState} values={employeeWorkStates} />
              },
              {
                key: 'account',
                label: translate('directory.account'),
                render: (employee) => translate(employee.account ? 'directory.hasAccount' : 'directory.noAccount')
              }
            ]}
          />
        </div>
        <AdminPagination
          pagination={query.data?.data?.pagination}
          disabled={query.isFetching}
          onPageChange={(page) => setParams((previous) => ({ ...previous, page }))}
        />
      </AdminQueryState>
      {employeeId && <EmployeeDetail employeeId={employeeId} onClose={() => openProfile('')} onCorrect={onCorrect} />}
    </section>
  )
}
