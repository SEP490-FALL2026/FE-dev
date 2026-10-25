import { ArrowLeft, ChevronRight, PackageCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItBatch, ItDepartment, ItProvisioningItem } from '../../it-admin-data'

export interface ProvisioningBatchListProps {
  batchLabel: (batch?: ItBatch | null) => string
  batches: ItBatch[]
  currentDept: ItDepartment | null
  onBack: () => void
  onOpenCreateBatch: () => void
  onSelectBatch: (batchId: string) => void
  onToggleLockBatch: (batchId: string) => void
  selectedDeptId: string
  unbatchedItemsInDept: ItProvisioningItem[]
}

export function ProvisioningBatchList({
  batchLabel,
  batches,
  currentDept,
  onBack,
  onOpenCreateBatch,
  onSelectBatch,
  onToggleLockBatch,
  selectedDeptId,
  unbatchedItemsInDept
}: ProvisioningBatchListProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
          onClick={onBack}
          type='button'
        >
          <ArrowLeft className='size-4 text-primary' />
          <span>{t('itAdmin.provisioning.extra.backDepartments')}</span>
        </button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-bold text-muted-foreground'>
              {t('itAdmin.provisioning.extra.code')} {currentDept?.code}
            </span>
            <span className='text-xs text-muted-foreground'>
              {t('itAdmin.provisioning.extra.manager')} {currentDept?.managerName}
            </span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1'>
            {t('itAdmin.provisioning.extra.batches')} {currentDept ? itAdminDepartmentLabel(currentDept.name) : ''}
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>{t('itAdmin.provisioning.extra.batchesHelp')}</p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
            onClick={onOpenCreateBatch}
            type='button'
          >
            <PackageCheck className='size-4' />
            <span>{t('itAdmin.provisioning.extra.newBatch')}</span>
          </button>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {batches
          .filter((b) => b.departmentId === selectedDeptId)
          .map((batch) => (
            <div
              className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md flex flex-col justify-between'
              key={batch.id}
            >
              <div>
                <div className='flex items-center justify-between'>
                  <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-bold text-muted-foreground border border-border'>
                    {t('itAdmin.provisioning.extra.monthLabel')} {batch.month}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.65rem] font-bold ${
                      batch.status === 'locked'
                        ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                        : 'border-success/30 bg-success/10 text-success'
                    }`}
                  >
                    {batch.status === 'locked'
                      ? t('itAdmin.provisioning.extra.batchLocked')
                      : t('itAdmin.provisioning.extra.batchOpen')}
                  </span>
                </div>

                <h3 className='text-base font-bold text-foreground mt-3'>{batchLabel(batch)}</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {t('itAdmin.provisioning.extra.dateRange')} {batch.startDate} – {batch.endDate}
                </p>

                <div className='mt-4 grid grid-cols-3 gap-2 text-center text-xs'>
                  <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                    <span className='text-[0.65rem] text-muted-foreground block'>
                      {t('itAdmin.provisioning.extra.total')}
                    </span>
                    <span className='text-sm font-bold text-foreground'>{batch.totalRequests}</span>
                  </div>
                  <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                    <span className='text-[0.65rem] text-muted-foreground block'>
                      {t('itAdmin.provisioning.extra.ready')}
                    </span>
                    <span className='text-sm font-bold text-success'>{batch.readyCount}</span>
                  </div>
                  <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                    <span className='text-[0.65rem] text-muted-foreground block'>
                      {t('itAdmin.provisioning.extra.completed')}
                    </span>
                    <span className='text-sm font-bold text-foreground'>{batch.completedCount}</span>
                  </div>
                </div>
              </div>

              <div className='mt-5 pt-3 border-t border-border flex items-center justify-between'>
                <button
                  className='text-xs font-semibold text-muted-foreground hover:text-foreground'
                  onClick={() => onToggleLockBatch(batch.id)}
                  type='button'
                >
                  {batch.status === 'open'
                    ? t('itAdmin.provisioning.extra.lock')
                    : t('itAdmin.provisioning.extra.unlock')}
                </button>
                <button
                  className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                  onClick={() => onSelectBatch(batch.id)}
                  type='button'
                >
                  <span>{t('itAdmin.provisioning.extra.openBatch')}</span>
                  <ChevronRight className='size-3.5' />
                </button>
              </div>
            </div>
          ))}

        <div className='rounded-2xl border border-dashed border-border bg-surface/50 p-5 shadow-sm flex flex-col justify-between'>
          <div>
            <span className='rounded-md bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning border border-warning/20'>
              {t('itAdmin.provisioning.extra.unassigned')}
            </span>
            <h3 className='text-base font-bold text-foreground mt-3'>
              {t('itAdmin.provisioning.extra.unassignedRequests')}
            </h3>
            <p className='text-xs text-muted-foreground mt-0.5'>{t('itAdmin.provisioning.extra.unassignedHelp')}</p>

            <div className='mt-4 flex items-baseline gap-2'>
              <span className='text-3xl font-black text-foreground'>{unbatchedItemsInDept.length}</span>
              <span className='text-xs text-muted-foreground'>
                {t('itAdmin.provisioning.extra.pendingRequests')}
              </span>
            </div>
          </div>

          <div className='mt-5 pt-3 border-t border-border flex items-center justify-end'>
            <button
              className='flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground shadow-sm hover:bg-surface-subtle'
              onClick={() => onSelectBatch('unbatched')}
              type='button'
            >
              <span>{t('itAdmin.provisioning.extra.viewGroup')}</span>
              <ChevronRight className='size-3.5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
