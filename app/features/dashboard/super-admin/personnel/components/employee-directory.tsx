import { useId, useState, type ReactNode } from 'react'
import { ListFilter, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import type { EmployeeListParams } from '~/shared/api/generated/model/employees'
import { AppUserListRole } from '~/shared/api/generated/model/app-users/appUserListRole'
import { WorkspaceDataTable } from '~/shared/ui/workspace-data-table'
import { AdminField, adminInputClass, adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { EmployeeDepartmentSelect } from '../../shared/components/employee-department-select'
import { value } from '../../shared/components/personnel-form'
import { PersonnelCode } from '../../shared/components/personnel-list'
import { employeeWorkStates } from '../enums/employee-work-state'
import { employmentTypes } from '../enums/employment-type'
import { EmployeeDetail } from './employee-detail'
import { useEmployeeDirectory } from '../hooks/use-employee-directory'

export function EmployeeDirectory({
  onCorrect,
  renderAccountDetail
}: {
  onCorrect: (employeeId: string) => void
  renderAccountDetail?: (id: string, onClose: () => void) => ReactNode
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAccounts } = useTranslation('adminAccounts')
  const { t: translateAdmin } = useTranslation('admin')
  const [searchParams, setSearchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId') ?? ''
  const [params, setParams] = useState<EmployeeListParams>({ page: 1, pageSize: 20 })
  const [resetKey, setResetKey] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterId = useId()
  const [role, setRole] = useState<AppUserListRole | ''>('')
  const query = useEmployeeDirectory(params, role)
  const filtersActive = !!role || Object.keys(params).some((key) => key !== 'page' && key !== 'pageSize')
  const openProfile = (id: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (id) next.set('employeeId', id)
      else next.delete('employeeId')
      return next
    })
  }
  if (employeeId)
    return (
      <EmployeeDetail
        employeeId={employeeId}
        onClose={() => openProfile('')}
        onCorrect={onCorrect}
        renderAccountDetail={renderAccountDetail}
      />
    )
  return (
    <section className='space-y-4'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-semibold tracking-tight text-foreground'>{translate('directory.title')}</h2>
        <button
          type='button'
          className={adminButtonClass}
          aria-expanded={filtersOpen}
          aria-controls={filterId}
          aria-describedby={filtersActive ? `${filterId}-active` : undefined}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <ListFilter aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('directory.filters')}
          {filtersActive && <span aria-hidden className='size-2 rounded-full bg-primary' />}
        </button>
        {filtersActive && (
          <span id={`${filterId}-active`} className='sr-only'>
            {translate('directory.filtersActive')}
          </span>
        )}
      </header>
      <form
        key={resetKey}
        id={filterId}
        hidden={!filtersOpen}
        className={
          filtersOpen
            ? 'grid items-end gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-3'
            : 'hidden'
        }
        onSubmit={(event) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget)
          const unplaced = value(values, 'unplaced')
          const hasAccount = value(values, 'hasAccount')
          const workState = employeeWorkStates.find((state) => state === value(values, 'workState'))
          const employmentType = employmentTypes.find((type) => type === value(values, 'employmentType'))
          const selectedRole = Object.values(AppUserListRole).find((item) => item === value(values, 'role'))
          setRole(selectedRole ?? '')
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
        <EmployeeDepartmentSelect mode='filter' />
        <AdminField label={translate('directory.directRole')}>
          <select name='role' className={adminInputClass} defaultValue=''>
            <option value=''>{translate('directory.all')}</option>
            {Object.values(AppUserListRole).map((item) => (
              <option key={item} value={item}>
                {translateAccounts(`roles.${item}`)}
              </option>
            ))}
          </select>
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
              setRole('')
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
            items={query.items}
            rowKey={(employee) => employee.id}
            label={translate('directory.title')}
            actionLabel={translate('directory.viewDetails')}
            actionHeader={translateAdmin('actions')}
            onOpen={(employee) => openProfile(employee.id)}
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
                  </div>
                )
              },
              {
                key: 'code',
                label: translate('fields.employeeCode'),
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
                key: 'role',
                label: translate('directory.directRole'),
                render: (employee) =>
                  query.byEmployee
                    .get(employee.id)
                    ?.roles.map((item) =>
                      translateAccounts(`roles.${item}`, { defaultValue: translate('directory.unknownRole') })
                    )
                    .join(', ') || translate(employee.account ? 'directory.unknownRole' : 'directory.noAccount')
              }
            ]}
          />
        </div>
        <AdminPagination
          pagination={query.pagination}
          disabled={query.isFetching}
          onPageChange={(page) => setParams((previous) => ({ ...previous, page }))}
        />
      </AdminQueryState>
    </section>
  )
}
