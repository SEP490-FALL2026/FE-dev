import { ChevronRight, FolderOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItDepartment } from '../../it-admin-data'

export interface ProvisioningDeptListProps {
  departments: ItDepartment[]
  onSelectDept: (deptId: string) => void
}

export function ProvisioningDeptList({ departments, onSelectDept }: ProvisioningDeptListProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('itAdmin.provisioning.extra.departmentList')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.provisioning.extra.departmentListHelp')}</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {departments.map((dept) => {
          const hasRequests = dept.totalRequests > 0

          return (
            <div
              className={`rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                hasRequests
                  ? 'border-border bg-surface hover:border-primary/50 hover:shadow-md'
                  : 'border-dashed border-border/80 bg-surface/40'
              }`}
              key={dept.id}
            >
              <div>
                <div className='flex items-center justify-between'>
                  <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-mono font-bold text-muted-foreground border border-border'>
                    {dept.code}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {dept.batchCount} {t('itAdmin.provisioning.extra.requestBatches')}
                  </span>
                </div>

                <h3 className='text-lg font-bold text-foreground mt-3'>{itAdminDepartmentLabel(dept.name)}</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {t('itAdmin.provisioning.extra.manager')} {dept.managerName} · {dept.managerEmail}
                </p>

                {hasRequests ? (
                  <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.provisioning.extra.readyToProvision')}
                      </span>
                      <span className='text-base font-bold text-success'>{dept.requestCounts.ready}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.provisioning.extra.inProgressAction')}
                      </span>
                      <span className='text-base font-bold text-warning'>
                        {dept.requestCounts.inProgress +
                          dept.requestCounts.needsCheck +
                          dept.requestCounts.needsHandover}
                      </span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.provisioning.extra.failed')}
                      </span>
                      <span className='text-base font-bold text-danger'>{dept.requestCounts.failed}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.provisioning.extra.completed')}
                      </span>
                      <span className='text-base font-bold text-foreground'>{dept.requestCounts.completed}</span>
                    </div>
                  </div>
                ) : (
                  <div className='mt-6 rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-center text-xs text-muted-foreground'>
                    <FolderOpen className='size-6 mx-auto opacity-40 mb-1' />
                    <span>{t('itAdmin.provisioning.extra.noDepartmentRequests')}</span>
                  </div>
                )}
              </div>

              <div className='mt-5 pt-3 border-t border-border flex items-center justify-between'>
                <span className='text-xs text-muted-foreground font-semibold'>
                  {t('itAdmin.provisioning.extra.totalColon')} {dept.totalRequests}{' '}
                  {t('itAdmin.provisioning.extra.requests')}
                </span>
                <button
                  className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                  onClick={() => onSelectDept(dept.id)}
                  type='button'
                >
                  <span>{t('itAdmin.provisioning.extra.openDepartment')}</span>
                  <ChevronRight className='size-3.5' />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
