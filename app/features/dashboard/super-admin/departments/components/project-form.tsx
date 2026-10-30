import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import {
  useDepartmentList,
  getDepartmentListQueryKey,
  getDepartmentGetQueryKey
} from '~/shared/api/generated/operations/departments'
import {
  getProjectListQueryKey,
  getProjectGetQueryKey,
  useProjectCreate,
  useProjectUpdate,
  useProjectGet
} from '~/shared/api/generated/operations/projects'
import { AdminField, AdminFormDialog, adminInputClass, adminButtonClass } from '../../shared/components/admin-form'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { DepartmentStatus } from '../enums/department-status'
import { ProjectStatus } from '../enums/project-status'
import { HrBasisFields, readHrBasis } from './hr-basis-fields'

export function ProjectForm({
  project,
  departmentId,
  onClose
}: {
  project?: ProjectListResponseDtoDataItemsItem
  departmentId?: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(
    project?.departments.map((department) => department.id) ?? (departmentId ? [departmentId] : [])
  )
  const query = useDepartmentList({ page, pageSize: 20, status: DepartmentStatus.ACTIVE })
  const detail = useProjectGet(project?.id ?? '', { query: { enabled: Boolean(project) } })
  const feedback = useAdminMutationFeedback(
    [
      getProjectListQueryKey(),
      getDepartmentListQueryKey(),
      ...selected.map(getDepartmentGetQueryKey),
      ...(project ? [getProjectGetQueryKey(project.id)] : [])
    ],
    onClose
  )
  const create = useProjectCreate({ mutation: { ...feedback, retry: false } })
  const update = useProjectUpdate({ mutation: { ...feedback, retry: false } })
  if (project && !detail.data?.data)
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-5'>
        <section
          role='dialog'
          aria-modal='true'
          aria-label={translate('editProject')}
          className='grid w-full max-w-lg gap-4 rounded-lg border border-border bg-surface p-5 shadow-xl'
        >
          <h2 className='text-lg font-semibold'>{translate('editProject')}</h2>
          <AdminQueryState query={detail}>
            <AdminEmpty />
          </AdminQueryState>
          <button type='button' className={adminButtonClass} onClick={onClose}>
            {translate('back')}
          </button>
        </section>
      </div>
    )
  return (
    <AdminFormDialog
      wide
      title={translate(project ? 'editProject' : 'createProject')}
      onClose={onClose}
      pending={create.isPending || update.isPending}
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const status = form.get('status') === ProjectStatus.FINISHED ? ProjectStatus.FINISHED : ProjectStatus.RUNNING
        const data = {
          name: String(form.get('name')).trim(),
          description: String(form.get('description') ?? '').trim() || null,
          status,
          departmentIds: selected,
          hrBasis: readHrBasis(form)
        }
        if (project) update.mutate({ id: project.id, data })
        else create.mutate({ data })
      }}
    >
      <section className='grid gap-4'>
        <h3 className='font-semibold'>{translate('projectDetails')}</h3>
        <AdminField label={translate('name')}>
          <input
            required
            name='name'
            className={adminInputClass}
            pattern='.*\S.*'
            maxLength={1000}
            defaultValue={detail.data?.data?.name ?? project?.name}
          />
        </AdminField>
        <AdminField label={translate('description')}>
          <textarea
            name='description'
            className={adminInputClass}
            maxLength={5000}
            defaultValue={detail.data?.data?.description ?? ''}
          />
        </AdminField>
        <AdminField label={translate('status')}>
          <select
            name='status'
            className={adminInputClass}
            defaultValue={detail.data?.data?.status ?? project?.status ?? ProjectStatus.RUNNING}
          >
            {Object.values(ProjectStatus).map((status) => (
              <option key={status} value={status}>
                {translate(`projectStatus.${status}`)}
              </option>
            ))}
          </select>
        </AdminField>
      </section>
      <section className='grid gap-3'>
        <h3 className='font-semibold'>{translate('participatingDepartments', { count: selected.length })}</h3>
        <p className='text-sm text-muted-foreground'>{translate('departmentSelectionHelp')}</p>
        {project?.departments
          .filter((department) => selected.includes(department.id))
          .map((department) => (
            <button
              type='button'
              className='text-left text-sm text-muted-foreground'
              key={department.id}
              onClick={() => setSelected((current) => current.filter((id) => id !== department.id))}
            >
              {translate('removeDepartment', { name: department.name })}
            </button>
          ))}
        <AdminQueryState query={query}>
          {!query.data?.data?.items.length && <AdminEmpty />}
          {query.data?.data?.items.map((department) => (
            <label key={department.id} className='flex items-center gap-3 rounded-md border border-border p-3 text-sm'>
              <input
                type='checkbox'
                checked={selected.includes(department.id)}
                disabled={!selected.includes(department.id) && selected.length >= 100}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked ? [...current, department.id] : current.filter((id) => id !== department.id)
                  )
                }
              />
              {department.code} · {department.name}
            </label>
          ))}
          <AdminPagination
            pagination={query.data?.data?.pagination}
            onPageChange={setPage}
            disabled={query.isFetching}
          />
        </AdminQueryState>
      </section>
      <HrBasisFields />
    </AdminFormDialog>
  )
}
