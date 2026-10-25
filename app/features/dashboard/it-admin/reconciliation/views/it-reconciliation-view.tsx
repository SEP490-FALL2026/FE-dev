import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Layers,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { initialItReconciliationRows, type ItReconciliationRow } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ReconciliationConflictModal } from '../components/reconciliation-conflict-modal'
import { ReconciliationInspectionPanel } from '../components/reconciliation-inspection-panel'

type ItReconciliationViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItReconciliationView({ onSelectTab }: ItReconciliationViewProps) {
  const { t } = useTranslation('dashboard')
  const unitLabel = (unit: string) => {
    if (unit === 'Tài khoản') return t('itAdmin.reconciliation.extra.unitAccount')
    if (unit === 'Quyền truy cập SSO') return t('itAdmin.reconciliation.extra.unitSso')
    if (unit === 'API Key') return t('itAdmin.reconciliation.extra.unitApiKey')
    if (unit === 'Seat') return t('itAdmin.reconciliation.extra.unitSeat')
    return unit
  }
  const departmentLabel = (department: string) => {
    if (department === 'Toàn công ty') return t('itAdmin.reconciliation.extra.departmentCompany')
    if (department === 'Kỹ thuật phần mềm') return t('itAdmin.reconciliation.extra.departmentEngineering')
    if (department === 'Thiết kế & Marketing') return t('itAdmin.reconciliation.extra.departmentDesign')
    if (department === 'Tài chính Kế toán') return t('itAdmin.reconciliation.extra.departmentFinance')
    return department
  }

  const [rows, setRows] = useState<ItReconciliationRow[]>(initialItReconciliationRows)
  const [selectedRow, setSelectedRow] = useState<ItReconciliationRow | null>(rows[0])
  const [periodFilter, setPeriodFilter] = useState<'10/2026' | '11/2026'>('10/2026')
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'dept-eng' | 'dept-design'>('all')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'deficit' | 'surplus' | 'matched' | 'insufficientData' | 'needsVerification'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Conflict Resolution Modal (IT-AC-07A)
  const [isResolveConflictOpen, setIsResolveConflictOpen] = useState(false)
  const [resolvedQuantity, setResolvedQuantity] = useState<number>(10)
  const [resolutionReason, setResolutionReason] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtered rows
  const filteredRows = rows.filter((row) => {
    if (departmentFilter !== 'all' && row.departmentId !== 'all' && row.departmentId !== departmentFilter) {
      return false
    }
    if (statusFilter !== 'all' && row.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        row.softwareName.toLowerCase().includes(q) ||
        row.planName.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Handle Resolving Conflicting Contract vs Invoice (IT-AC-07A)
  const handleConfirmResolution = () => {
    if (!selectedRow) return
    if (!resolutionReason.trim()) {
      showToast(t('itAdmin.reconciliation.extra.reasonRequired'))
      return
    }

    setRows((prev) =>
      prev.map((r) => {
        if (r.id === selectedRow.id) {
          const newPurchased = resolvedQuantity
          const newRemaining = Math.max(0, newPurchased - r.grantedValid)
          const newMissing = Math.max(0, r.validDemand - newPurchased)
          const newSurplus = Math.max(0, newPurchased - r.validDemand)
          const newStatus = newMissing > 0 ? 'deficit' : newSurplus > 0 ? 'surplus' : 'matched'

          return {
            ...r,
            purchasedValid: newPurchased,
            availableRemaining: newRemaining,
            missing: newMissing,
            surplus: newSurplus,
            status: newStatus,
            conflictData: r.conflictData
              ? {
                  ...r.conflictData,
                  resolvedQty: resolvedQuantity,
                  resolutionReason: resolutionReason
                }
              : undefined
          }
        }
        return r
      })
    )

    setIsResolveConflictOpen(false)
    showToast(
      t('itAdmin.reconciliation.extra.confirmation', { quantity: resolvedQuantity, unit: unitLabel(selectedRow.unit) })
    )
  }

  const getStatusBadge = (status: ItReconciliationRow['status']) => {
    switch (status) {
      case 'deficit':
        return {
          label: t('itAdmin.reconciliation.extra.statusDeficit'),
          tone: 'border-danger/30 bg-danger/10 text-danger font-bold'
        }
      case 'surplus':
        return {
          label: t('itAdmin.reconciliation.extra.statusSurplus'),
          tone: 'border-warning/30 bg-warning/10 text-warning font-semibold'
        }
      case 'matched':
        return {
          label: t('itAdmin.reconciliation.extra.statusMatched'),
          tone: 'border-success/30 bg-success/10 text-success font-bold'
        }
      case 'needsVerification':
        return {
          label: t('itAdmin.reconciliation.extra.statusVerification'),
          tone: 'border-warning/40 bg-warning/15 text-warning font-bold'
        }
      case 'insufficientData':
        return {
          label: t('itAdmin.reconciliation.extra.statusInsufficientData'),
          tone: 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
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

      {/* Main Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            {t('itAdmin.reconciliation.extra.screen')}
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('itAdmin.reconciliation.extra.heading')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.reconciliation.extra.intro')}</p>
        </div>
        <div>
          <button
            className='flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-surface-subtle'
            onClick={() => onSelectTab && onSelectTab('usage-import')}
            type='button'
          >
            <UploadCloud className='size-4' />
            <span>{t('itAdmin.reconciliation.extra.importDocuments')}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3 text-xs'>
          {/* Period selector */}
          <div className='flex items-center gap-2'>
            <span className='font-bold text-muted-foreground'>{t('itAdmin.reconciliation.extra.period')}</span>
            <select
              className='h-9 rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              value={periodFilter}
            >
              <option value='10/2026'>{t('itAdmin.reconciliation.extra.october')}</option>
              <option value='11/2026'>{t('itAdmin.reconciliation.extra.november')}</option>
            </select>
          </div>

          {/* Department selector */}
          <div className='flex items-center gap-2'>
            <span className='font-bold text-muted-foreground'>{t('itAdmin.reconciliation.extra.scope')}</span>
            <select
              className='h-9 rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
              onChange={(e) => setDepartmentFilter(e.target.value as any)}
              value={departmentFilter}
            >
              <option value='all'>{t('itAdmin.reconciliation.extra.company')}</option>
              <option value='dept-eng'>{t('itAdmin.reconciliation.extra.engineering')}</option>
              <option value='dept-design'>{t('itAdmin.reconciliation.extra.designMarketing')}</option>
            </select>
          </div>

          {/* Status Filter Pills */}
          <div className='flex items-center gap-1.5 border-l border-border pl-3'>
            {(
              [
                { id: 'all', label: t('itAdmin.reconciliation.extra.filterAll') },
                { id: 'deficit', label: t('itAdmin.reconciliation.extra.filterDeficit') },
                { id: 'surplus', label: t('itAdmin.reconciliation.extra.filterSurplus') },
                { id: 'matched', label: t('itAdmin.reconciliation.extra.filterMatched') },
                { id: 'needsVerification', label: t('itAdmin.reconciliation.extra.filterVerification') },
                { id: 'insufficientData', label: t('itAdmin.reconciliation.extra.filterInsufficientData') }
              ] as const
            ).map((st) => (
              <button
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === st.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                type='button'
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-4 text-xs outline-none focus:border-primary'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('itAdmin.reconciliation.extra.search')}
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      {/* Main Grid: Comparison Table (Left) + Detailed Panel (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Comparison Table */}
        <div className='lg:col-span-2 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3'>{t('itAdmin.reconciliation.extra.softwarePlan')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.reconciliation.extra.validDemand')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.reconciliation.extra.purchasedActive')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.reconciliation.extra.provisioned')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.reconciliation.extra.available')}</th>
                  <th className='px-3 py-3 text-center'>{t('itAdmin.reconciliation.extra.difference')}</th>
                  <th className='px-4 py-3 text-right'>{t('itAdmin.reconciliation.extra.status')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                      {t('itAdmin.reconciliation.extra.empty')}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const isSelected = selectedRow?.id === row.id
                    return (
                      <tr
                        className={`cursor-pointer transition hover:bg-primary-soft/30 ${
                          isSelected ? 'bg-primary-soft/50 font-medium' : ''
                        }`}
                        key={row.id}
                        onClick={() => setSelectedRow(row)}
                      >
                        <td className='px-4 py-3.5'>
                          <div className='flex items-center gap-2'>
                            <span className='font-bold text-foreground'>{row.softwareName}</span>
                            <span className='rounded bg-primary-soft px-1.5 py-0.5 text-[0.68rem] font-bold text-primary'>
                              {row.planName}
                            </span>
                          </div>
                          <span className='text-[0.68rem] text-muted-foreground block mt-0.5'>
                            {t('itAdmin.reconciliation.extra.unit')} {unitLabel(row.unit)} ·{' '}
                            {departmentLabel(row.departmentName)}
                          </span>
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>{row.validDemand}</td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {row.status === 'insufficientData' ? (
                            <span className='text-muted-foreground italic text-[0.7rem]'>
                              {t('itAdmin.reconciliation.extra.insufficient')}
                            </span>
                          ) : (
                            row.purchasedValid
                          )}
                        </td>
                        <td className='px-3 py-3.5 text-center text-muted-foreground'>{row.grantedValid}</td>
                        <td className='px-3 py-3.5 text-center font-bold text-success'>
                          {row.status === 'insufficientData' ? '—' : row.availableRemaining}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold'>
                          {row.missing > 0 ? (
                            <span className='text-danger'>- {row.missing}</span>
                          ) : row.surplus > 0 ? (
                            <span className='text-warning'>+ {row.surplus}</span>
                          ) : row.status === 'matched' ? (
                            <span className='text-success'>0</span>
                          ) : (
                            <span className='text-muted-foreground'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] ${
                              getStatusBadge(row.status).tone
                            }`}
                          >
                            {getStatusBadge(row.status).label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection Panel (Section 4 & IT-AC-08) */}
        <ReconciliationInspectionPanel
          departmentLabel={departmentLabel}
          getStatusBadge={getStatusBadge}
          onOpenConflictModal={() => {
            setResolvedQuantity(selectedRow?.conflictData?.invoiceQty || 10)
            setIsResolveConflictOpen(true)
          }}
          onSelectTab={onSelectTab}
          selectedRow={selectedRow}
          t={t}
          unitLabel={unitLabel}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: XÁC MINH HAI CHỨNG TỪ BẤT ĐỒNG SỐ LƯỢNG (IT-AC-07A)               */}
      {/* ========================================================================= */}
      <ReconciliationConflictModal
        isOpen={isResolveConflictOpen}
        onClose={() => setIsResolveConflictOpen(false)}
        onConfirmResolution={handleConfirmResolution}
        resolutionReason={resolutionReason}
        resolvedQuantity={resolvedQuantity}
        selectedRow={selectedRow}
        setResolutionReason={setResolutionReason}
        setResolvedQuantity={setResolvedQuantity}
        unitLabel={unitLabel}
      />
    </div>
  )
}
