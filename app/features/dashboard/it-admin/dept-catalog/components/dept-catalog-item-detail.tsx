import React from 'react'
import type { ItCatalogItem } from '../../it-admin-data'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

export interface DeptCatalogItemDetailProps {
  selectedItem: ItCatalogItem | null
  onToggleStatus: (item: ItCatalogItem) => void
  onDeleteOrStop: (item: ItCatalogItem) => void
  descriptionLabel: (item: ItCatalogItem) => string
  provisioningTypeLabel: (type: string) => string
  t: any
}

export const DeptCatalogItemDetail: React.FC<DeptCatalogItemDetailProps> = ({
  selectedItem,
  onToggleStatus,
  onDeleteOrStop,
  descriptionLabel,
  provisioningTypeLabel,
  t,
}) => {
  if (!selectedItem) return null

  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
      <div className='space-y-4'>
        <div className='pb-3 border-b border-border/80'>
          <div className='flex items-center justify-between'>
            <span className='font-mono text-xs text-muted-foreground'>{selectedItem.id}</span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-bold ${
                selectedItem.status === 'allowed'
                  ? 'border-success/30 bg-success/10 text-success'
                  : selectedItem.status === 'stopped'
                    ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                    : 'border-warning/30 bg-warning/10 text-warning'
              }`}
            >
              {selectedItem.status === 'allowed'
                ? t('itAdmin.deptCatalog.extra.allowed')
                : selectedItem.status === 'stopped'
                  ? t('itAdmin.deptCatalog.extra.stopped')
                  : t('itAdmin.deptCatalog.extra.draftFull')}
            </span>
          </div>
          <h3 className='text-xl font-bold text-foreground mt-1'>
            {selectedItem.softwareName} — {selectedItem.planName}
          </h3>
          <p className='text-xs text-muted-foreground'>{selectedItem.vendor}</p>
        </div>

        {/* Description */}
        <div className='text-xs space-y-1'>
          <span className='font-bold text-muted-foreground uppercase text-[0.68rem]'>
            {t('itAdmin.deptCatalog.extra.planDescription')}
          </span>
          <p className='rounded-xl border border-border bg-surface-subtle p-3 text-foreground leading-relaxed'>
            {descriptionLabel(selectedItem)}
          </p>
        </div>

        {/* Scope & Provisioning Type */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
            <span className='text-[0.68rem] text-muted-foreground block'>
              {t('itAdmin.deptCatalog.extra.type')}
            </span>
            <span className='font-bold text-foreground'>
              {provisioningTypeLabel(selectedItem.provisioningType)}
            </span>
          </div>
          <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
            <span className='text-[0.68rem] text-muted-foreground block'>
              {t('itAdmin.deptCatalog.extra.api')}
            </span>
            <span className={`font-bold ${selectedItem.apiReady ? 'text-success' : 'text-warning'}`}>
              {selectedItem.apiReady
                ? t('itAdmin.deptCatalog.extra.apiAutomatic')
                : t('itAdmin.deptCatalog.extra.apiUnavailable')}
            </span>
          </div>
        </div>

        {/* Allowed Departments */}
        <div className='text-xs space-y-1.5'>
          <span className='font-bold text-muted-foreground uppercase text-[0.68rem] block'>
            {t('itAdmin.deptCatalog.extra.allowedDepartments')}
          </span>
          <div className='flex flex-wrap items-center gap-1.5'>
            {selectedItem.departments.map((deptName, idx) => (
              <span
                className='rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-xs font-semibold text-foreground'
                key={idx}
              >
                {itAdminDepartmentLabel(deptName)}
              </span>
            ))}
          </div>
        </div>

        {/* Notice about draft and history */}
        {selectedItem.status === 'draft' && (
          <div className='rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-muted-foreground leading-relaxed'>
            <span className='font-bold text-warning block'>{t('itAdmin.deptCatalog.extra.draftStatus')}</span>
            {t('itAdmin.deptCatalog.extra.draftHelp')}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='pt-4 border-t border-border flex items-center justify-between gap-3'>
        <button
          className='flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-bold text-foreground hover:bg-surface-subtle'
          onClick={() => onToggleStatus(selectedItem)}
          type='button'
        >
          {selectedItem.status === 'allowed'
            ? t('itAdmin.deptCatalog.extra.stopped')
            : t('itAdmin.deptCatalog.extra.enableTitle')}
        </button>
        <button
          className='flex-1 rounded-xl border border-danger/40 bg-danger/10 py-2 text-xs font-bold text-danger hover:bg-danger/20'
          onClick={() => onDeleteOrStop(selectedItem)}
          type='button'
        >
          {selectedItem.hasHistory
            ? t('itAdmin.deptCatalog.extra.stopKeepHistory')
            : t('itAdmin.deptCatalog.extra.deletePlan')}
        </button>
      </div>
    </div>
  )
}
