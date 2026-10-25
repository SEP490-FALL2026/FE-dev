import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Lock,
  Package,
  Search,
  Unlock
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItBatch, ItDepartment, ItProvisioningItem, ItProvisioningStatus } from '../../it-admin-data'

export type ProvisioningRequestsListProps = {
  currentDept: ItDepartment | null
  currentBatch: ItBatch | null
  selectedBatchId: string | null
  onBack: () => void
  onToggleLockBatch: (batchId: string) => void
  statusFilter: 'all' | ItProvisioningStatus
  setStatusFilter: (status: 'all' | ItProvisioningStatus) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  groupedBeneficiaries: Record<string, ItProvisioningItem[]>
  onOpenMoveBatch: (item: ItProvisioningItem) => void
  onSelectItem: (itemId: string) => void
}

export function ProvisioningRequestsList({
  currentDept,
  currentBatch,
  selectedBatchId,
  onBack,
  onToggleLockBatch,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  groupedBeneficiaries,
  onOpenMoveBatch,
  onSelectItem
}: ProvisioningRequestsListProps) {
  const { t, i18n } = useTranslation('dashboard')

  const unitLabel = (unit: string) => {
    if (unit === 'Tài khoản') return t('itAdmin.provisioning.extra.unitAccount')
    if (unit === 'API Key') return t('itAdmin.provisioning.extra.unitApiKey')
    if (unit === 'Seat') return t('itAdmin.provisioning.extra.unitSeat')
    if (unit === 'Quyền truy cập SSO') return t('itAdmin.provisioning.extra.unitSso')
    return unit
  }

  const batchLabel = (batch?: ItBatch | null) => {
    if (!batch) return t('itAdmin.provisioning.extra.batchShort')
    const number = batch.name.match(/^(?:Đợt|Batch) (\d+) - (?:tháng 10\/2026|October 2026)$/)?.[1]
    return number ? t('itAdmin.provisioning.extra.batchDefaultName', { number }) : batch.name
  }

  const itemText = (item: ItProvisioningItem, field: 'beneficiaryRole' | 'purpose') =>
    i18n.t(`dashboard:itAdmin.provisioning.extra.demoItems.${item.id}.${field}`, { defaultValue: item[field] })

  const getStatusBadge = (status: ItProvisioningStatus) => {
    switch (status) {
      case 'ready':
        return {
          label: t('itAdmin.provisioning.extra.readyToProvision'),
          tone: 'border-success/30 bg-success/10 text-success'
        }
      case 'inProgress':
        return {
          label: t('itAdmin.provisioning.extra.statusInProgress'),
          tone: 'border-primary/30 bg-primary/10 text-primary animate-pulse'
        }
      case 'needsCheck':
        return {
          label: t('itAdmin.provisioning.extra.statusNeedsCheck'),
          tone: 'border-warning/30 bg-warning/10 text-warning'
        }
      case 'needsHandover':
        return {
          label: t('itAdmin.provisioning.extra.statusNeedsHandover'),
          tone: 'border-warning/30 bg-warning/15 text-warning font-bold'
        }
      case 'failed':
        return {
          label: t('itAdmin.provisioning.extra.failed'),
          tone: 'border-danger/30 bg-danger/10 text-danger'
        }
      case 'completed':
        return {
          label: t('itAdmin.provisioning.extra.completed'),
          tone: 'border-border bg-surface-subtle text-muted-foreground'
        }
      case 'pendingConfig':
        return {
          label: t('itAdmin.provisioning.extra.statusPendingConfig'),
          tone: 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
        }
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
          onClick={onBack}
          type='button'
        >
          <ArrowLeft className='size-4 text-primary' />
          <span>
            {t('itAdmin.provisioning.extra.backBatches')}
            {currentDept ? itAdminDepartmentLabel(currentDept.name) : ''})
          </span>
        </button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-bold text-muted-foreground'>
              {currentDept ? itAdminDepartmentLabel(currentDept.name) : ''}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${
                currentBatch?.status === 'locked'
                  ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                  : 'border-success/30 bg-success/10 text-success'
              }`}
            >
              {currentBatch?.status === 'locked'
                ? t('itAdmin.provisioning.extra.lockedBatch')
                : t('itAdmin.provisioning.extra.acceptingRequests')}
            </span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1'>
            {selectedBatchId === 'unbatched'
              ? t('itAdmin.provisioning.extra.unassignedQueue')
              : batchLabel(currentBatch)}
          </h1>
          {currentBatch && (
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('itAdmin.provisioning.extra.effectiveDates')} {currentBatch.startDate} – {currentBatch.endDate}{' '}
              {t('itAdmin.provisioning.extra.month')} {currentBatch.month}
            </p>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {currentBatch && (
            <button
              className='flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle'
              onClick={() => onToggleLockBatch(currentBatch.id)}
              type='button'
            >
              {currentBatch.status === 'open' ? (
                <>
                  <Lock className='size-4 text-warning' />
                  <span>{t('itAdmin.provisioning.extra.lockBatch')}</span>
                </>
              ) : (
                <>
                  <Unlock className='size-4 text-success' />
                  <span>{t('itAdmin.provisioning.extra.unlockBatch')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2'>
          {(
            [
              { id: 'all', label: t('itAdmin.provisioning.extra.allStatuses') },
              { id: 'ready', label: t('itAdmin.provisioning.extra.ready') },
              { id: 'inProgress', label: t('itAdmin.provisioning.extra.statusInProgress') },
              { id: 'needsCheck', label: t('itAdmin.provisioning.extra.filterNeedsCheck') },
              { id: 'needsHandover', label: t('itAdmin.provisioning.extra.filterNeedsHandover') },
              { id: 'failed', label: t('itAdmin.provisioning.extra.failed') },
              { id: 'completed', label: t('itAdmin.provisioning.extra.completed') },
              { id: 'pendingConfig', label: t('itAdmin.provisioning.extra.filterPendingConfig') }
            ] as const
          ).map((tab) => (
            <button
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-primary text-primary-foreground font-bold shadow'
                  : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              type='button'
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-4 text-xs outline-none focus:border-primary'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('itAdmin.provisioning.extra.search')}
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      <div className='space-y-4'>
        {Object.keys(groupedBeneficiaries).length === 0 ? (
          <div className='rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground'>
            <Package className='size-10 mx-auto opacity-40 mb-3' />
            <p className='text-sm font-semibold'>{t('itAdmin.provisioning.extra.emptyBatch')}</p>
            <p className='text-xs mt-1'>{t('itAdmin.provisioning.extra.emptyBatchHelp')}</p>
          </div>
        ) : (
          Object.entries(groupedBeneficiaries).map(([beneficiaryKey, userItems]) => {
            const [name, email] = beneficiaryKey.split('__')
            return (
              <div
                className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3'
                key={beneficiaryKey}
              >
                <div className='flex items-center justify-between pb-3 border-b border-border/60'>
                  <div className='flex items-center gap-3'>
                    <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs'>
                      {name.split(' ').slice(-1)[0][0]}
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-sm font-bold text-foreground'>{name}</h3>
                        <span className='text-xs text-muted-foreground'>({email})</span>
                      </div>
                      <p className='text-[0.7rem] text-muted-foreground'>{itemText(userItems[0], 'beneficiaryRole')}</p>
                    </div>
                  </div>
                  <span className='text-xs font-semibold text-muted-foreground'>
                    {userItems.length} {t('itAdmin.provisioning.extra.independentRequests')}
                  </span>
                </div>

                <div className='space-y-2'>
                  {userItems.map((item) => (
                    <div
                      className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-surface-subtle p-3.5 transition hover:border-primary/50'
                      key={item.id}
                    >
                      <div className='flex items-center gap-4 min-w-[280px]'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-bold text-foreground'>{item.softwareName}</span>
                            <span className='rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
                              {item.planName}
                            </span>
                            <span className='rounded-md bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground border border-border'>
                              1 {unitLabel(item.unit)}
                            </span>
                          </div>
                          <div className='flex items-center gap-3 mt-1 text-[0.7rem] text-muted-foreground'>
                            <span>
                              {t('itAdmin.provisioning.extra.code')} {item.id}
                            </span>
                            <span>
                              {t('itAdmin.provisioning.extra.sent')} {item.submittedAt}
                            </span>
                            <span>
                              {t('itAdmin.provisioning.extra.type')} {unitLabel(item.unit)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        {item.feasibility.purchasedRemaining <= 0 && (
                          <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[0.65rem] font-bold text-danger border border-danger/20'>
                            <AlertCircle className='size-3' />
                            <span>{t('itAdmin.provisioning.extra.purchaseShortage')}</span>
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${getStatusBadge(item.status).tone}`}
                        >
                          {getStatusBadge(item.status).label}
                        </span>

                        {item.status === 'ready' && currentBatch?.status === 'open' && (
                          <button
                            className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground'
                            onClick={() => onOpenMoveBatch(item)}
                            title={t('itAdmin.provisioning.extra.moveTitle')}
                            type='button'
                          >
                            {t('itAdmin.provisioning.extra.moveBatch')}
                          </button>
                        )}

                        <button
                          className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                          onClick={() => onSelectItem(item.id)}
                          type='button'
                        >
                          <span>{t('itAdmin.provisioning.extra.details')}</span>
                          <ChevronRight className='size-3.5' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
