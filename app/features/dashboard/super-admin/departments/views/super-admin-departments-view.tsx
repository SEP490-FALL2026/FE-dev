import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass, adminInputClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { DepartmentStatus } from '../enums/department-status'
import { DepartmentCard } from '../components/department-card'
import { DepartmentForm } from '../components/department-form'
import { DepartmentDetailView } from '../components/department-detail-view'
import type { SuperAdminTabKey } from '../../super-admin-nav'
import { useAdminSearch } from '../../shared/hooks/use-admin-search'
import { useDepartmentByCode } from '../hooks/use-department-by-code'

export function SuperAdminDepartmentsView(_props: { onSelectTab?: (tab: SuperAdminTabKey) => void } = {}) {
  // Kept for the role shell's existing view contract.
  void _props.onSelectTab
  const { t: translate } = useTranslation('adminOrganization')
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedDepartmentCode = searchParams.get('departmentCode')
  const selectedId = searchParams.get('departmentId')
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const search = searchParams.get('search') ?? requestedDepartmentCode ?? ''
  const debouncedSearch = useAdminSearch(search)
  const requestedStatus = searchParams.get('status')
  const status =
    requestedStatus === DepartmentStatus.ACTIVE || requestedStatus === DepartmentStatus.INACTIVE ? requestedStatus : ''
  const [create, setCreate] = useState(searchParams.get('action') === 'create')
  const query = useDepartmentList(
    { page, pageSize: 20, search: debouncedSearch || undefined, status: status || undefined },
    { query: { enabled: !selectedId && !requestedDepartmentCode } }
  )
  const departmentByCode = useDepartmentByCode(requestedDepartmentCode)
  function updateParameters(changes: Record<string, string | null>, replace = false) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace }
    )
  }
  function backToList() {
    updateParameters({
      departmentId: null,
      departmentCode: null,
      search: search || null
    })
  }
  const detailId = requestedDepartmentCode ? departmentByCode.data?.id : selectedId
  if (detailId) return <DepartmentDetailView key={detailId} id={detailId} onBack={backToList} />
  if (requestedDepartmentCode)
    return (
      <div className='grid gap-4'>
        <button type='button' className={`${adminButtonClass} justify-self-start`} onClick={backToList}>
          {translate('back')}
        </button>
        <AdminQueryState query={departmentByCode}>
          <AdminEmpty />
        </AdminQueryState>
      </div>
    )
  return (
    <div className='grid gap-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{translate('title')}</h1>
          <p className='mt-2 text-sm text-muted-foreground'>{translate('subtitle')}</p>
        </div>
        <button className={adminPrimaryClass} type='button' onClick={() => setCreate(true)}>
          {translate('createDepartment')}
        </button>
      </header>
      <div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]'>
        <label className='grid gap-2 text-sm'>
          {translate('search')}
          <span className='relative block'>
            <Search
              aria-hidden
              strokeWidth={1.5}
              className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
            />
            <input
              type='search'
              placeholder={translate('searchPlaceholder')}
              className={`${adminInputClass} pl-10`}
              value={search}
              maxLength={100}
              onChange={(event) => {
                updateParameters({ page: null, search: event.target.value }, true)
              }}
            />
          </span>
        </label>
        <label className='grid gap-2 text-sm'>
          {translate('status')}
          <select
            className={adminInputClass}
            value={status}
            onChange={(event) => {
              const value = event.target.value
              updateParameters({ status: value, page: null })
            }}
          >
            <option value=''>{translate('allStatuses')}</option>
            {Object.values(DepartmentStatus).map((value) => (
              <option key={value} value={value}>
                {translate(`departmentStatus.${value}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        <div className='grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {query.data?.data?.items.map((department, position) => (
            <DepartmentCard
              key={department.id}
              department={department}
              position={(page - 1) * 20 + position}
              onOpen={() => updateParameters({ departmentId: department.id })}
            />
          ))}
        </div>
        <AdminPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(nextPage) => updateParameters({ page: String(nextPage) })}
          disabled={query.isFetching}
        />
      </AdminQueryState>
      {create && <DepartmentForm onClose={() => setCreate(false)} />}
    </div>
  )
}
