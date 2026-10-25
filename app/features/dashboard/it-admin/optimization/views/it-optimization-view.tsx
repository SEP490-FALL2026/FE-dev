import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  History,
  Info,
  Layers,
  Package,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingDown,
  UserCheck,
  UserMinus,
  Users,
  WifiOff,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

import { initialItOptimizationAlerts, type ItOptimizationAlertItem } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { OptimizationInspectionCard } from '../components/optimization-inspection-card'
import { OptimizationModals } from '../components/optimization-modals'

type ItOptimizationViewProps = {
  formatCurrency?: (value: number) => string
  initialAlertId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItOptimizationView({
  formatCurrency = (v) => `${v.toLocaleString('vi-VN')} ₫`,
  initialAlertId,
  onSelectTab
}: ItOptimizationViewProps) {
  const { t } = useTranslation('dashboard')
  const demoEvidence = (
    alert: ItOptimizationAlertItem,
    field: 'threshold' | 'observationPeriod' | 'lastUsed' | 'usageStats' | 'tokens' | 'dataSource'
  ) => t(`itAdmin.licenseOptimization.extra.demoAlerts.${alert.id}.${field}`, { defaultValue: alert.evidence[field] })

  const [alerts, setAlerts] = useState<ItOptimizationAlertItem[]>(initialItOptimizationAlerts)
  const [selectedAlert, setSelectedAlert] = useState<ItOptimizationAlertItem | null>(() => {
    if (initialAlertId) {
      const match = initialItOptimizationAlerts.find((a) => a.id === initialAlertId)
      if (match) return match
    }
    return initialItOptimizationAlerts[0] || null
  })
  const [filterType, setFilterType] = useState<'all' | 'lowUsage' | 'idleLong' | 'delayedReclaim' | 'missingData'>(
    'all'
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isReclaimModalOpen, setIsReclaimModalOpen] = useState(false)
  const [isKeepModalOpen, setIsKeepModalOpen] = useState(false)
  const [keepReasonInput, setKeepReasonInput] = useState('')
  const [isReclaimProcessing, setIsReclaimProcessing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredAlerts = alerts.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        item.employeeName.toLowerCase().includes(q) ||
        item.softwareName.toLowerCase().includes(q) ||
        item.planName.toLowerCase().includes(q) ||
        item.departmentName.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Handle Reclaim Decision
  const handleConfirmReclaim = () => {
    if (!selectedAlert) return
    setIsReclaimProcessing(true)

    setTimeout(() => {
      setIsReclaimProcessing(false)
      setIsReclaimModalOpen(false)

      const canReuse = selectedAlert.reclaimImpact.canReuse

      setAlerts((prev) => prev.map((a) => (a.id === selectedAlert.id ? { ...a, status: 'reclaimed' } : a)))

      if (canReuse) {
        showToast(t('itAdmin.licenseOptimization.extra.reclaimedToast', { software: selectedAlert.softwareName }))
      } else {
        showToast(t('itAdmin.licenseOptimization.extra.nonReusableToast'))
      }
    }, 1000)
  }

  // Handle Keep Decision
  const handleConfirmKeep = () => {
    if (!selectedAlert) return
    if (!keepReasonInput.trim()) {
      showToast(t('itAdmin.licenseOptimization.extra.reasonRequired'))
      return
    }

    setAlerts((prev) =>
      prev.map((a) => (a.id === selectedAlert.id ? { ...a, status: 'kept', keepReason: keepReasonInput } : a))
    )

    setIsKeepModalOpen(false)
    setKeepReasonInput('')
    showToast(t('itAdmin.licenseOptimization.extra.retainedToast', { employee: selectedAlert.employeeName }))
  }

  const getAlertBadge = (type: ItOptimizationAlertItem['type']) => {
    switch (type) {
      case 'lowUsage':
        return {
          label: t('itAdmin.licenseOptimization.extra.lowUsage'),
          tone: 'border-warning/30 bg-warning/10 text-warning font-bold'
        }
      case 'idleLong':
        return {
          label: t('itAdmin.licenseOptimization.extra.longIdle'),
          tone: 'border-danger/30 bg-danger/10 text-danger font-bold'
        }
      case 'delayedReclaim':
        return {
          label: t('itAdmin.licenseOptimization.extra.pendingOffboarding'),
          tone: 'border-primary/30 bg-primary/10 text-primary font-bold'
        }
      case 'missingData':
        return {
          label: t('itAdmin.licenseOptimization.extra.missingData'),
          tone: 'border-border bg-surface-subtle text-muted-foreground'
        }
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

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          {t('itAdmin.licenseOptimization.extra.kicker')}
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('itAdmin.licenseOptimization.extra.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.intro')}</p>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          {(
            [
              { id: 'all', label: t('itAdmin.licenseOptimization.extra.allAlerts') },
              { id: 'lowUsage', label: t('itAdmin.licenseOptimization.extra.lowUsage') },
              { id: 'idleLong', label: t('itAdmin.licenseOptimization.extra.longIdleFilter') },
              { id: 'delayedReclaim', label: t('itAdmin.licenseOptimization.extra.delayedFilter') },
              { id: 'missingData', label: t('itAdmin.licenseOptimization.extra.missingFilter') }
            ] as const
          ).map((tab) => (
            <button
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                filterType === tab.id
                  ? 'bg-primary text-primary-foreground font-bold shadow'
                  : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
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
            placeholder={t('itAdmin.licenseOptimization.extra.search')}
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      {/* Main Grid: Alerts List (Left) + Evidence & Actions Panel (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Alerts List */}
        <div className='lg:col-span-2 space-y-3'>
          {filteredAlerts.length === 0 ? (
            <div className='rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground'>
              <Sparkles className='size-10 mx-auto opacity-40 mb-3' />
              <p className='text-sm font-semibold'>{t('itAdmin.licenseOptimization.extra.empty')}</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isSelected = selectedAlert?.id === item.id
              const isHandled = item.status === 'reclaimed' || item.status === 'kept'

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  } ${isHandled ? 'opacity-65' : ''}`}
                  key={item.id}
                  onClick={() => setSelectedAlert(item)}
                >
                  <div className='flex items-center gap-3.5 min-w-[280px]'>
                    <span className='grid size-10 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs shrink-0'>
                      {item.employeeName.split(' ').slice(-1)[0][0]}
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold text-foreground'>{item.employeeName}</span>
                        <span className='text-xs text-muted-foreground'>
                          ({itAdminDepartmentLabel(item.departmentName)})
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[0.65rem] ${getAlertBadge(item.type).tone}`}
                        >
                          {getAlertBadge(item.type).label}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 mt-1 text-xs'>
                        <span className='font-bold text-primary'>
                          {item.softwareName} — {item.planName}
                        </span>
                        <span className='text-muted-foreground'>
                          {t('itAdmin.licenseOptimization.extra.lastUsed')} {demoEvidence(item, 'lastUsed')}
                        </span>
                      </div>
                      <div className='mt-2'>
                        <button
                          className='inline-flex items-center gap-1 text-[0.72rem] font-bold text-primary hover:underline'
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectTab?.('device-collectors', {
                              employeeId: item.employeeId || 'emp-tuan',
                              deptId: item.departmentId,
                              from: 'license-optimization',
                              alertId: item.id
                            })
                          }}
                          type='button'
                        >
                          <span>{t('itAdmin.licenseOptimization.extra.viewUsage')}</span>
                          <ArrowRight className='size-3' />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right text-xs'>
                      <span className='font-bold text-danger block'>
                        {t('itAdmin.licenseOptimization.extra.savings')} {formatCurrency(item.evidence.costPerMonth)}
                        {t('itAdmin.licenseOptimization.extra.perMonth')}
                      </span>
                      <span className='text-[0.68rem] text-muted-foreground'>
                        {item.status === 'reclaimed'
                          ? t('itAdmin.licenseOptimization.extra.reclaimed')
                          : item.status === 'kept'
                            ? t('itAdmin.licenseOptimization.extra.retained')
                            : t('itAdmin.licenseOptimization.extra.pending')}
                      </span>
                    </div>
                    <ChevronRight className='size-4 text-muted-foreground' />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Evidence & Action Drawer (Right) */}
        <OptimizationInspectionCard
          demoEvidence={demoEvidence}
          formatCurrency={formatCurrency}
          onOpenKeepModal={() => setIsKeepModalOpen(true)}
          onOpenReclaimModal={() => setIsReclaimModalOpen(true)}
          onSelectTab={onSelectTab}
          selectedAlert={selectedAlert}
          t={t}
        />
      </div>

      {/* Optimization Modals (Reclaim + Keep) */}
      <OptimizationModals
        formatCurrency={formatCurrency}
        isKeepModalOpen={isKeepModalOpen}
        isReclaimModalOpen={isReclaimModalOpen}
        isReclaimProcessing={isReclaimProcessing}
        keepReasonInput={keepReasonInput}
        onCloseKeepModal={() => setIsKeepModalOpen(false)}
        onCloseReclaimModal={() => setIsReclaimModalOpen(false)}
        onConfirmKeep={handleConfirmKeep}
        onConfirmReclaim={handleConfirmReclaim}
        selectedAlert={selectedAlert}
        setKeepReasonInput={setKeepReasonInput}
        t={t}
      />
    </div>
  )
}
