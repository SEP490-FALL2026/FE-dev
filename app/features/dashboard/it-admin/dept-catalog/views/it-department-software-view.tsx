import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { DepartmentSoftware } from '../components/department-software'

export function ItDepartmentSoftwareView() {
  const { t: translate } = useTranslation('itDepartmentSoftware')
  const [params, setParams] = useSearchParams()
  const departmentId = params.get('departmentId') ?? ''
  const me = useMeGet()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const query = useDepartmentList({ status: 'ACTIVE', page, pageSize: 20 }, { query: { enabled: !departmentId } })
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
      <h1 className='text-2xl font-semibold'>{translate('title')}</h1>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('description')}</p>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='flex items-center justify-between gap-3 p-4'>
                <h2 className='truncate font-medium' title={item.name}>
                  {item.name}
                </h2>
                <button type='button' className={itButtonClass} onClick={() => update('departmentId', item.id)}>
                  {translate('select')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination
        page={page}
        pageSize={20}
        total={query.data?.data?.pagination.totalItems ?? 0}
        onChange={(next) => update('page', String(next))}
      />
    </section>
  )
}
