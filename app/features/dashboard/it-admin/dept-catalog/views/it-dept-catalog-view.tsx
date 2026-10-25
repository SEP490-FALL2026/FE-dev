import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Info,
  Key,
  Layers,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Unlock,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

import { initialItDepartments, initialItCatalogItems, type ItCatalogItem } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { DeptCatalogCreateModal } from '../components/dept-catalog-modals'
import { DeptCatalogItemDetail } from '../components/dept-catalog-item-detail'

type ItDeptCatalogViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItDeptCatalogView({ onSelectTab }: ItDeptCatalogViewProps) {
  const { t } = useTranslation('dashboard')
  const provisioningTypeLabel = (value: string) =>
    value === 'Tài khoản'
      ? t('itAdmin.deptCatalog.extra.account')
      : value === 'Quyền truy cập SSO'
        ? t('itAdmin.deptCatalog.extra.sso')
        : value === 'API key'
          ? t('itAdmin.deptCatalog.extra.apiKey')
          : value
  const descriptionLabel = (item: ItCatalogItem) =>
    item.id.startsWith('CAT-') && Number(item.id.slice(4)) <= 6
      ? t(`itAdmin.deptCatalog.extra.catalogDescriptions.${item.id}`, { defaultValue: item.description })
      : item.description

  const [departments] = useState(initialItDepartments)
  const [selectedDeptName, setSelectedDeptName] = useState<string>('Kỹ thuật phần mềm')
  const [catalogItems, setCatalogItems] = useState<ItCatalogItem[]>(initialItCatalogItems)
  const [selectedItem, setSelectedItem] = useState<ItCatalogItem | null>(catalogItems[0])

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter items for selected department
  const deptItems = catalogItems.filter((item) => item.departments.includes(selectedDeptName))

  // Handle Toggle Allowed / Stopped (IT-AC-14)
  const handleToggleStatus = (item: ItCatalogItem) => {
    // If draft without API ready, cannot turn on directly
    if (item.status === 'draft' && !item.apiReady) {
      showToast(t('itAdmin.deptCatalog.extra.apiRequired'))
      return
    }

    setCatalogItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) {
          const nextStatus = i.status === 'allowed' ? 'stopped' : 'allowed'
          if (nextStatus === 'stopped') {
            showToast(t('itAdmin.deptCatalog.extra.stoppedToast', { software: i.softwareName }))
          } else {
            showToast(t('itAdmin.deptCatalog.extra.allowedToast', { software: i.softwareName }))
          }
          return { ...i, status: nextStatus }
        }
        return i
      })
    )
  }

  // Handle Delete or Stop
  const handleDeleteOrStop = (item: ItCatalogItem) => {
    if (item.hasHistory) {
      // If has history, cannot delete permanently, switch to "Ngừng cho xin"
      setCatalogItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'stopped' } : i)))
      showToast(t('itAdmin.deptCatalog.extra.historyPreventsDeletion', { software: item.softwareName }))
    } else {
      // No history: delete permanently
      setCatalogItems((prev) => prev.filter((i) => i.id !== item.id))
      if (selectedItem?.id === item.id) {
        setSelectedItem(null)
      }
      showToast(t('itAdmin.deptCatalog.extra.deletedToast', { software: item.softwareName }))
    }
  }

  // Handle Create New Item
  const handleCreateItem = (formData: {
    softwareName: string
    vendor: string
    planName: string
    provisioningType: 'Tài khoản' | 'API key' | 'Quyền truy cập SSO'
    description: string
    departments: string[]
    apiReady: boolean
  }) => {
    if (!formData.softwareName.trim() || !formData.planName.trim()) {
      showToast(t('itAdmin.deptCatalog.extra.missingNames'))
      return
    }

    const initialStatus: ItCatalogItem['status'] = formData.apiReady ? 'allowed' : 'draft'

    const newItem: ItCatalogItem = {
      id: `CAT-${Date.now()}`,
      softwareName: formData.softwareName.trim(),
      vendor: formData.vendor.trim() || t('itAdmin.deptCatalog.extra.defaultVendor'),
      planName: formData.planName.trim(),
      provisioningType: formData.provisioningType,
      status: initialStatus,
      departments: formData.departments.length > 0 ? formData.departments : [selectedDeptName],
      openRequests: 0,
      purchasedCount: 0,
      availableCount: 0,
      apiReady: formData.apiReady,
      description: formData.description.trim() || t('itAdmin.deptCatalog.extra.defaultDescription'),
      hasHistory: false,
    }

    setCatalogItems((prev) => [...prev, newItem])
    setSelectedItem(newItem)
    setIsCreateModalOpen(false)

    if (initialStatus === 'draft') {
      showToast(t('itAdmin.deptCatalog.extra.draftSaved'))
    } else {
      showToast(t('itAdmin.deptCatalog.extra.createdToast', { software: newItem.softwareName }))
    }
  }

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            {t('itAdmin.deptCatalog.extra.kicker')}
          </div>
          <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('itAdmin.deptCatalog.extra.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.deptCatalog.extra.intro')}</p>
        </div>

        <button
          className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
          onClick={() => setIsCreateModalOpen(true)}
          type='button'
        >
          <Plus className='size-4' />
          <span>{t('itAdmin.deptCatalog.extra.addNew')}</span>
        </button>
      </div>

      {/* Department Tabs */}
      <div className='flex flex-wrap items-center gap-2 border-b border-border pb-3'>
        {departments.map((dept) => (
          <button
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedDeptName === dept.name
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            }`}
            key={dept.id}
            onClick={() => setSelectedDeptName(dept.name)}
            type='button'
          >
            <span>{itAdminDepartmentLabel(dept.name)}</span>
            <span className='ml-2 rounded-md bg-white/20 px-1.5 py-0.5 text-[0.65rem]'>
              {catalogItems.filter((i) => i.departments.includes(dept.name)).length}{' '}
              {t('itAdmin.deptCatalog.extra.plans')}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Catalog Table (Left) + Selected Item Detail (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Table of items */}
        <div className='lg:col-span-2 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3'>{t('itAdmin.deptCatalog.extra.softwareVendor')}</th>
                  <th className='px-3 py-3'>{t('itAdmin.deptCatalog.extra.plan')}</th>
                  <th className='px-3 py-3'>{t('itAdmin.deptCatalog.extra.provisioningType')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.deptCatalog.extra.openRequests')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.deptCatalog.extra.provisioningApi')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.deptCatalog.extra.requestStatus')}</th>
                  <th className='px-4 py-3 text-right'>{t('itAdmin.deptCatalog.extra.actions')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {deptItems.length === 0 ? (
                  <tr>
                    <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                      {t('itAdmin.deptCatalog.extra.empty')}
                    </td>
                  </tr>
                ) : (
                  deptItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id

                    return (
                      <tr
                        className={`cursor-pointer transition hover:bg-primary-soft/30 ${
                          isSelected ? 'bg-primary-soft/40 font-medium' : ''
                        }`}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className='px-4 py-3.5'>
                          <span className='font-bold text-foreground block'>{item.softwareName}</span>
                          <span className='text-[0.68rem] text-muted-foreground'>{item.vendor}</span>
                        </td>
                        <td className='px-3 py-3.5 font-bold text-primary'>{item.planName}</td>
                        <td className='px-3 py-3.5 text-muted-foreground'>
                          {provisioningTypeLabel(item.provisioningType)}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>{item.openRequests}</td>
                        <td className='px-3 py-3.5 text-center'>
                          {item.apiReady ? (
                            <span className='inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-success border border-success/20'>
                              {t('itAdmin.deptCatalog.extra.ready')}
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 rounded bg-warning/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning border border-warning/20'>
                              {t('itAdmin.deptCatalog.extra.unavailable')}
                            </span>
                          )}
                        </td>
                        <td className='px-3 py-3.5 text-center'>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-bold ${
                              item.status === 'allowed'
                                ? 'border-success/30 bg-success/10 text-success'
                                : item.status === 'stopped'
                                  ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                                  : 'border-warning/30 bg-warning/10 text-warning'
                            }`}
                          >
                            {item.status === 'allowed'
                              ? t('itAdmin.deptCatalog.extra.allowed')
                              : item.status === 'stopped'
                                ? t('itAdmin.deptCatalog.extra.stopped')
                                : t('itAdmin.deptCatalog.extra.draft')}
                          </span>
                        </td>
                        <td className='px-4 py-3.5 text-right' onClick={(e) => e.stopPropagation()}>
                          <div className='flex items-center justify-end gap-1.5'>
                            <button
                              className='rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:text-foreground'
                              onClick={() => handleToggleStatus(item)}
                              title={
                                item.status === 'allowed'
                                  ? t('itAdmin.deptCatalog.extra.stopTitle')
                                  : t('itAdmin.deptCatalog.extra.enableTitle')
                              }
                              type='button'
                            >
                              {item.status === 'allowed' ? (
                                <ToggleRight className='size-4 text-success' />
                              ) : (
                                <ToggleLeft className='size-4' />
                              )}
                            </button>
                            <button
                              className='rounded-lg border border-border bg-surface p-1.5 text-danger hover:bg-danger/10'
                              onClick={() => handleDeleteOrStop(item)}
                              title={
                                item.hasHistory
                                  ? t('itAdmin.deptCatalog.extra.stopKeepHistory')
                                  : t('itAdmin.deptCatalog.extra.deletePermanently')
                              }
                              type='button'
                            >
                              <Trash2 className='size-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Item Detail Card */}
        <DeptCatalogItemDetail
          descriptionLabel={descriptionLabel}
          onDeleteOrStop={handleDeleteOrStop}
          onToggleStatus={handleToggleStatus}
          provisioningTypeLabel={provisioningTypeLabel}
          selectedItem={selectedItem}
          t={t}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: THÊM PHẦN MỀM / GÓI MỚI                                            */}
      {/* ========================================================================= */}
      <DeptCatalogCreateModal
        departments={departments}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateItem}
        t={t}
      />
    </div>
  )
}
