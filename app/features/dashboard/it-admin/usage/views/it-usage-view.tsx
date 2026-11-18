import { useUsageNavigation } from '../hooks/use-usage-navigation'
import { Activity } from 'lucide-react'
import { ItPageHeader } from '../../shared/components/it-page-header'
import { UsagePeriod } from '../components/usage-period'
import { UsageDetail } from '../components/usage-detail'
import { useTranslation } from 'react-i18next'
import { useItManagedDepartments } from '../../shared/hooks/use-it-managed-departments'
import { useDepartmentTechnicalMemberList } from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useUsageEmployeeSoftwareList } from '~/shared/api/generated/operations/usage-overview/usage-employee-software-list'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { UsageImports } from '../components/usage-imports'
import { ItDepartmentCards } from '../../shared/components/it-department-cards'

export function ItUsageView() {
  const { t } = useTranslation('itDepartmentWork')
  const { params, update } = useUsageNavigation()
  const department = params.get('department')
    ? { id: params.get('department')!, name: params.get('departmentName') ?? t('usage.chooseDepartment') }
    : undefined
  const employee = params.get('employee')
    ? { id: params.get('employee')!, code: params.get('employeeCode') ?? t('code') }
    : undefined
  const application = params.get('application')
    ? { id: params.get('application')!, name: params.get('applicationName') ?? t('application') }
    : undefined
  const imports = params.get('usageView') === 'imports'
  const setDepartment = (item?: { id: string; name: string }) =>
    update({
      department: item?.id,
      departmentName: item?.name,
      employee: undefined,
      employeeCode: undefined,
      application: undefined,
      applicationName: undefined
    })
  const setEmployee = (item?: { id: string; code: string }) =>
    update({ employee: item?.id, employeeCode: item?.code, application: undefined, applicationName: undefined })
  const setApplication = (item?: { id: string; name: string }) =>
    update({ application: item?.id, applicationName: item?.name })
  const setImports = (open: boolean) => update({ usageView: open ? 'imports' : undefined })
  if (imports) return <UsageImports onBack={() => setImports(false)} />
  if (department && employee && application)
    return <UsageDetail employeeId={employee.id} application={application} onBack={() => setApplication(undefined)} />
  if (department && employee)
    return <Software employee={employee} onBack={() => setEmployee(undefined)} onOpen={setApplication} />
  if (department)
    return <Members department={department} onBack={() => setDepartment(undefined)} onOpen={setEmployee} />
  return (
    <section className='space-y-5'>
      <ItPageHeader icon={Activity} title={t('usage.title')} />
      <Departments onOpen={setDepartment} onOpenImports={() => setImports(true)} />
    </section>
  )
}

function Departments({
  onOpen,
  onOpenImports
}: {
  onOpen: (item: { id: string; name: string }) => void
  onOpenImports: () => void
}) {
  const { t } = useTranslation('itDepartmentWork')
  const { page: readPage, update } = useUsageNavigation()
  const page = readPage('departmentPage')
  const setPage = (value: number) => update({ departmentPage: String(value) })
  const { me, departments: query } = useItManagedDepartments()
  const items = query.data ?? []
  const visible = items.slice((page - 1) * 20, page * 20)
  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('usage.chooseDepartment')}</h2>
        <button type='button' className={itButtonClass} onClick={onOpenImports}>
          {t('usageImport.history')}
        </button>
      </div>
      <ItQueryState query={me}>
        <ItQueryState query={query}>
          {visible.length ? (
            <ItDepartmentCards items={visible} onSelect={onOpen} actionLabel={t('open')} />
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      </ItQueryState>
      {(items.length > 20 || page > 1) && (
        <ItPagination page={page} pageSize={20} total={items.length} onChange={setPage} />
      )}
    </section>
  )
}

function Members({
  department,
  onBack,
  onOpen
}: {
  department: { id: string; name: string }
  onBack: () => void
  onOpen: (item: { id: string; code: string }) => void
}) {
  const { t } = useTranslation('itDepartmentWork')
  const { page: readPage, update } = useUsageNavigation()
  const page = readPage('memberPage')
  const setPage = (value: number) => update({ memberPage: String(value) })
  const query = useDepartmentTechnicalMemberList(department.id, { page, pageSize: 20 })
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <ItPageHeader
        icon={Activity}
        eyebrow={t('usage.title')}
        title={department.name}
        subtitle={t('usage.chooseMember')}
      />
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0'>
                  <p className='truncate font-medium' title={item.fullName}>
                    {item.fullName}
                  </p>
                  <p className='font-mono text-xs text-muted-foreground'>{item.code}</p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => onOpen(item)}>
                  {t('usage.open')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} pageSize={20} total={query.data?.data?.pagination.totalItems ?? 0} onChange={setPage} />
    </section>
  )
}

function Software({
  employee,
  onBack,
  onOpen
}: {
  employee: { id: string; code: string }
  onBack: () => void
  onOpen: (item: { id: string; name: string }) => void
}) {
  const { t } = useTranslation('itDepartmentWork')
  const { page: readPage, update, params } = useUsageNavigation()
  const page = readPage('softwarePage')
  const setPage = (value: number) => update({ softwarePage: String(value) })
  const query = useUsageEmployeeSoftwareList(employee.id, {
    from: params.get('from') || undefined,
    to: params.get('to') || undefined,
    page,
    pageSize: 20
  })
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <ItPageHeader icon={Activity} eyebrow={employee.code} title={t('usage.chooseSoftware')}>
        <UsagePeriod />
      </ItPageHeader>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.application.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div>
                  <h2 className='font-medium'>{item.application.name}</h2>
                  <p className='text-sm text-muted-foreground'>
                    {t(`usage.${item.status}`, { defaultValue: t('unknown') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => onOpen(item.application)}>
                  {t('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} pageSize={20} total={query.data?.data?.pagination.totalItems ?? 0} onChange={setPage} />
    </section>
  )
}
