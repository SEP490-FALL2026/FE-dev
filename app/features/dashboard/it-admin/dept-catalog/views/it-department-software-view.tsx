import { useSearchParams } from 'react-router'
import { ListChecks } from 'lucide-react'
import { ItPageHeader } from '../../shared/components/it-page-header'
import { useTranslation } from 'react-i18next'
import { useItManagedDepartments } from '../../shared/hooks/use-it-managed-departments'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItDepartmentCards } from '../../shared/components/it-department-cards'
import { DepartmentSoftware } from '../components/department-software'

export function ItDepartmentSoftwareView() {
  const { t: translate } = useTranslation('itDepartmentSoftware')
  const [params, setParams] = useSearchParams()
  const departmentId = params.get('departmentId') ?? ''
  const me = useMeGet()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const { departments: query } = useItManagedDepartments()
  const items = query.data ?? []
  const visible = items.slice((page - 1) * 20, page * 20)
  const department = useDepartmentGet(departmentId, { query: { enabled: !!departmentId } })
  function update(key: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }
  if (departmentId)
    return (
      <ItQueryState query={department}>
        {department.data?.data ? (
          <DepartmentSoftware
            key={departmentId}
            departmentId={departmentId}
            departmentName={department.data.data.name}
            canManage={
              me.isSuccess &&
              me.data.data?.roles.includes('IT_ADMIN') === true &&
              (!department.data.data.itAdmin?.usable ||
                department.data.data.itAdmin.employeeId === me.data.data.employee.id)
            }
            onBack={() => update('departmentId', '')}
          />
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    )
  return (
    <section className='space-y-5'>
      <ItPageHeader icon={ListChecks} title={translate('title')} subtitle={translate('description')} />
      <ItQueryState query={me}>
        <ItQueryState query={query}>
          {visible.length ? (
            <ItDepartmentCards
              items={visible}
              onSelect={(item) => update('departmentId', item.id)}
              actionLabel={translate('select')}
            />
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      </ItQueryState>
      {(items.length > 20 || page > 1) && (
        <ItPagination
          page={page}
          pageSize={20}
          total={items.length}
          onChange={(next) => update('page', String(next))}
        />
      )}
    </section>
  )
}
