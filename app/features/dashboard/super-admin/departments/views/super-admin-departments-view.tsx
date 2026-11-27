import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Building2, Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, adminButtonClass, adminInputClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { AdminPageHeader, AdminSectionTitle } from '../../shared/components/admin-page-header'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
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
  const items = query.data?.data?.items ?? []
  const total = query.data?.data?.pagination.totalItems
  return (
    <div className='grid gap-6'>
      <AdminPageHeader
        icon={Building2}
        title={translate('title')}
        subtitle={translate('subtitle')}
        actions={
          <button className={adminPrimaryClass} type='button' onClick={() => setCreate(true)}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('createDepartment')}
          </button>
        }
      />
      <div className='soft-panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-end'>
        <label className='grid gap-1.5 text-sm font-medium'>
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
        <AdminField label={translate('status')} description=''>
          <AdminSelect
            value={status}
            clearable
            onChange={(value) => updateParameters({ status: value, page: null })}
            options={Object.values(DepartmentStatus).map((value) => ({
              value,
              label: translate(`departmentStatus.${value}`)
            }))}
            placeholder={translate('allStatuses')}
          />
        </AdminField>
      </div>
      <section className='grid gap-4'>
        <AdminSectionTitle
          title={translate('departments')}
          hint={total !== undefined ? translate('ui.listCount', { count: total }) : undefined}
        />
        <AdminQueryState query={query}>
          {!items.length && (
            <WorkspaceEmptyState
              icon={Building2}
              title={translate(search || status ? 'ui.noMatchTitle' : 'ui.emptyTitle')}
              description={translate(search || status ? 'ui.noMatchHint' : 'ui.emptyHint')}
            />
          )}
          <div className='grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {items.map((department, position) => (
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
      </section>
      {create && <DepartmentForm onClose={() => setCreate(false)} />}
    </div>
  )
}
