import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { ItDepartment, ItCatalogItem } from '../../it-admin-data'

export interface DeptCatalogCreateModalProps {
  isOpen: boolean
  onClose: () => void
  departments: ItDepartment[]
  onSave: (newItem: {
    softwareName: string
    vendor: string
    planName: string
    provisioningType: 'Tài khoản' | 'API key' | 'Quyền truy cập SSO'
    description: string
    departments: string[]
    apiReady: boolean
  }) => void
  t: any
}

export const DeptCatalogCreateModal: React.FC<DeptCatalogCreateModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSave,
  t,
}) => {
  const [newSoftwareName, setNewSoftwareName] = useState('')
  const [newVendor, setNewVendor] = useState('')
  const [newPlanName, setNewPlanName] = useState('')
  const [newProvisioningType, setNewProvisioningType] = useState<'Tài khoản' | 'API key' | 'Quyền truy cập SSO'>(
    'Tài khoản'
  )
  const [newDescription, setNewDescription] = useState('')
  const [newSelectedDepts, setNewSelectedDepts] = useState<string[]>(['Kỹ thuật phần mềm'])
  const [newApiReady, setNewApiReady] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    onSave({
      softwareName: newSoftwareName,
      vendor: newVendor,
      planName: newPlanName,
      provisioningType: newProvisioningType,
      description: newDescription,
      departments: newSelectedDepts,
      apiReady: newApiReady,
    })
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.addTitle')}</h3>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        <div className='space-y-3 text-xs'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.softwareName')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewSoftwareName(e.target.value)}
                placeholder={t('itAdmin.deptCatalog.extra.softwarePlaceholder')}
                type='text'
                value={newSoftwareName}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.vendor')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewVendor(e.target.value)}
                placeholder={t('itAdmin.deptCatalog.extra.vendorPlaceholder')}
                type='text'
                value={newVendor}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.planName')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder={t('itAdmin.deptCatalog.extra.planPlaceholder')}
                type='text'
                value={newPlanName}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.type')}</label>
              <select
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
                onChange={(e) => setNewProvisioningType(e.target.value as any)}
                value={newProvisioningType}
              >
                <option value={t('itAdmin.deptCatalog.extra.account')}>
                  {t('itAdmin.deptCatalog.extra.accountCredentials')}
                </option>
                <option value='API key'>{t('itAdmin.deptCatalog.extra.apiKey')}</option>
                <option value={t('itAdmin.deptCatalog.extra.sso')}>
                  {t('itAdmin.deptCatalog.extra.companySso')}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.features')}</label>
            <textarea
              className='mt-1 w-full rounded-xl border border-border bg-surface-subtle p-3 outline-none focus:border-primary'
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={t('itAdmin.deptCatalog.extra.featuresPlaceholder')}
              rows={2}
              value={newDescription}
            />
          </div>

          {/* Allowed Departments Multi-select */}
          <div>
            <label className='font-bold text-foreground block mb-1'>
              {t('itAdmin.deptCatalog.extra.allowedDepartmentsLabel')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {departments.map((d) => {
                const isChecked = newSelectedDepts.includes(d.name)
                return (
                  <button
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                      isChecked
                        ? 'border-primary bg-primary text-primary-foreground font-bold'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle'
                    }`}
                    key={d.id}
                    onClick={() => {
                      if (isChecked) {
                        setNewSelectedDepts((prev) => prev.filter((n) => n !== d.name))
                      } else {
                        setNewSelectedDepts((prev) => [...prev, d.name])
                      }
                    }}
                    type='button'
                  >
                    {d.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* API Integration Readiness Toggle (IT-AC-15) */}
          <div className='rounded-xl border border-border bg-surface-subtle p-3 space-y-1.5'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground'>{t('itAdmin.deptCatalog.extra.apiReady')}</span>
              <input
                checked={newApiReady}
                className='size-4'
                onChange={(e) => setNewApiReady(e.target.checked)}
                type='checkbox'
              />
            </div>
            <p className='text-[0.68rem] text-muted-foreground leading-relaxed'>
              {t('itAdmin.deptCatalog.extra.draftRuleStart')}{' '}
              <strong>{t('itAdmin.deptCatalog.extra.draft')}</strong> {t('itAdmin.deptCatalog.extra.draftRuleEnd')}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.deptCatalog.extra.cancel')}
          </button>
          <button
            className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={handleSave}
            type='button'
          >
            {t('itAdmin.deptCatalog.extra.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
