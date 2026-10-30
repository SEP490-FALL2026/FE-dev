import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useProjectList } from '~/shared/api/generated/operations/projects'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { ProjectStatus } from '../enums/project-status'
import { ProjectForm } from './project-form'

export function ProjectsPanel({ departmentId }: { departmentId?: string }) {
  const { t: translate } = useTranslation('adminOrganization')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<ProjectListResponseDtoDataItemsItem | 'create' | null>(null)
  const query = useProjectList({ departmentId, page, pageSize: 20 })
  return (
    <section className='grid gap-4'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold'>{translate('projects')}</h2>
        <button className={adminPrimaryClass} type='button' onClick={() => setForm('create')}>
          {translate('createProject')}
        </button>
      </header>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        <div className='grid gap-3'>
          {query.data?.data?.items.map((project) => (
            <article
              key={project.id}
              className='flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border p-4'
            >
              <div className='min-w-0 flex-1'>
                <h3 className='font-medium'>{project.name}</h3>
                <p className='mt-2 text-sm'>
                  {Object.values(ProjectStatus).includes(project.status)
                    ? translate(`projectStatus.${project.status}`)
                    : translate('unknown')}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {project.departments.map((department) => department.name).join(', ')}
                </p>
              </div>
              <button
                type='button'
                className={adminButtonClass}
                disabled={!Object.values(ProjectStatus).includes(project.status)}
                onClick={() => setForm(project)}
              >
                {translate('editProject')}
              </button>
            </article>
          ))}
        </div>
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {form && (
        <ProjectForm
          project={form === 'create' ? undefined : form}
          departmentId={departmentId}
          onClose={() => setForm(null)}
        />
      )}
    </section>
  )
}
