import { ArrowUpRight, Building2, CircleCheck, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import type { SuperAdminSelectTab } from '../../super-admin-nav'
import { groupDepartmentIssues, type SetupStep } from '../overview-model'
import { SETUP_WARNING } from '../enums/setup-warning'

export function DepartmentAttention({ steps, onSelectTab }: { steps: SetupStep[]; onSelectTab: SuperAdminSelectTab }) {
  const { t: translate } = useTranslation('admin')
  const departments = groupDepartmentIssues(steps)
  return (
    <section className='admin-overview-surface overflow-hidden rounded-lg' aria-labelledby='admin-department-attention'>
      <header className='flex flex-wrap items-start justify-between gap-3 border-b border-border/70 p-5 sm:px-6'>
        <div>
          <h2 id='admin-department-attention' className='flex items-center gap-2 text-base font-semibold'>
            <TriangleAlert aria-hidden strokeWidth={1.5} className='size-4 text-warning-ink' />
            {translate('overview.redesign.attentionTitle')}
          </h2>
          <p className='mt-1.5 text-sm text-muted-foreground'>{translate('overview.redesign.attentionDescription')}</p>
        </div>
        <span className='rounded-md bg-warning/15 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-warning-ink'>
          {translate('overview.redesign.departmentCount', { count: departments.length })}
        </span>
      </header>
      {departments.length ? (
        <div className='divide-y divide-border/60'>
          {departments.map((department, position) => (
            <article
              key={department.code}
              className='grid gap-4 p-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'
            >
              <div className='flex min-w-0 items-start gap-3'>
                <span className='mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-surface-subtle text-muted-foreground'>
                  <Building2 aria-hidden strokeWidth={1.5} className='size-4' />
                </span>
                <div className='min-w-0'>
                  <p className='mb-1 font-mono text-xs tabular-nums text-muted-foreground'>{department.code}</p>
                  <h3 className='truncate font-semibold' title={department.name}>
                    {department.name}
                  </h3>
                  <ul className='mt-3 space-y-2'>
                    {department.warnings.map((warning) => (
                      <li key={warning} className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
                        <span className='text-warning-ink'>
                          {translate(`overview.setupWarnings.${warning}`, {
                            defaultValue: translate('overview.warning')
                          })}
                        </span>
                        {warning === SETUP_WARNING.MISSING_COST_CENTER && (
                          <span className='text-xs text-muted-foreground'>
                            {translate('overview.redesign.financeResponsible')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type='button'
                className={`${position === 0 ? adminPrimaryClass : adminButtonClass} w-fit md:justify-self-end`}
                aria-label={translate('overview.redesign.reviewDepartment', { name: department.name })}
                onClick={() => onSelectTab('departments', { departmentCode: department.code })}
              >
                {translate('overview.redesign.reviewAction')}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className='size-4' />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className='flex items-center gap-3 p-6 text-sm'>
          <CircleCheck aria-hidden strokeWidth={1.5} className='size-5 shrink-0 text-success-ink' />
          <p>{translate('overview.redesign.noDepartmentWarnings')}</p>
        </div>
      )}
    </section>
  )
}
