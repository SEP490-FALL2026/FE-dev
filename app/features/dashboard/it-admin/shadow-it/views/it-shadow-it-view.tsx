import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Info,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  User,
  UserCheck,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

import { initialItExternalRequests, type ItExternalRequestItem } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'

type ItShadowItViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItShadowItView({ onSelectTab }: ItShadowItViewProps) {
  const { t } = useTranslation('dashboard')
  const demoDetail = (request: ItExternalRequestItem, field: 'purpose' | 'cost' | 'duration') =>
    t(`itAdmin.shadowIt.extra.requestDetails.${request.id}.${field}`, {
      defaultValue: field === 'cost' ? request.estimatedCost : request[field]
    })

  const [requests, setRequests] = useState<ItExternalRequestItem[]>(initialItExternalRequests)
  const [selectedReq, setSelectedReq] = useState<ItExternalRequestItem | null>(requests[0])
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pendingDecision' | 'pendingConfig' | 'accepted' | 'rejected'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Decision Modals
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReasonInput, setRejectReasonInput] = useState('')
  const [decisionNotesInput, setDecisionNotesInput] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        r.softwareName.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q) ||
        r.departmentName.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Handle Accept Decision (IT-AC-12)
  const handleConfirmAccept = () => {
    if (!selectedReq) return

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: 'pendingConfig',
              decisionBy: 'Quang Huy (IT Admin)',
              decisionAt: new Date().toLocaleString('vi-VN'),
              decisionNotes: decisionNotesInput || t('itAdmin.shadowIt.extra.acceptedNote')
            }
          : r
      )
    )

    setIsAcceptModalOpen(false)
    setDecisionNotesInput('')
    showToast(t('itAdmin.shadowIt.extra.approvedToast', { software: selectedReq.softwareName }))
  }

  // Handle Reject Decision
  const handleConfirmReject = () => {
    if (!selectedReq) return
    if (!rejectReasonInput.trim()) {
      showToast(t('itAdmin.shadowIt.extra.rejectionRequired'))
      return
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: 'rejected',
              rejectReason: rejectReasonInput,
              decisionBy: 'Quang Huy (IT Admin)',
              decisionAt: new Date().toLocaleString('vi-VN')
            }
          : r
      )
    )

    setIsRejectModalOpen(false)
    setRejectReasonInput('')
    showToast(t('itAdmin.shadowIt.extra.rejectedToast', { software: selectedReq.softwareName }))
  }

  const getStatusBadge = (status: ItExternalRequestItem['status']) => {
    switch (status) {
      case 'pendingDecision':
        return {
          label: t('itAdmin.shadowIt.extra.pendingDecision'),
          tone: 'border-primary/30 bg-primary/10 text-primary font-bold'
        }
      case 'pendingConfig':
        return {
          label: t('itAdmin.shadowIt.extra.pendingConfig'),
          tone: 'border-warning/30 bg-warning/10 text-warning font-bold'
        }
      case 'accepted':
        return { label: t('itAdmin.shadowIt.extra.accepted'), tone: 'border-success/30 bg-success/10 text-success' }
      case 'rejected':
        return {
          label: t('itAdmin.shadowIt.extra.rejected'),
          tone: 'border-danger/30 bg-danger/10 text-danger font-bold'
        }
      case 'ready':
        return {
          label: t('itAdmin.shadowIt.extra.ready'),
          tone: 'border-success/30 bg-success/10 text-success font-bold'
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
          {t('itAdmin.shadowIt.extra.kicker')}
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('itAdmin.shadowIt.extra.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.shadowIt.extra.intro')}</p>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          {(
            [
              { id: 'all', label: t('itAdmin.shadowIt.extra.all') },
              { id: 'pendingDecision', label: t('itAdmin.shadowIt.extra.pendingDecision') },
              { id: 'pendingConfig', label: t('itAdmin.shadowIt.extra.pendingConfig') },
              { id: 'rejected', label: t('itAdmin.shadowIt.extra.rejected') }
            ] as const
          ).map((tab) => (
            <button
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
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
            placeholder={t('itAdmin.shadowIt.extra.search')}
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      {/* Main Grid: Queue List (Left) + Detail Panel (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Requests List */}
        <div className='lg:col-span-2 space-y-3'>
          {filteredRequests.length === 0 ? (
            <div className='rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground'>
              <ShieldAlert className='size-10 mx-auto opacity-40 mb-3' />
              <p className='text-sm font-semibold'>{t('itAdmin.shadowIt.extra.empty')}</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isSelected = selectedReq?.id === req.id

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  }`}
                  key={req.id}
                  onClick={() => setSelectedReq(req)}
                >
                  <div className='flex items-center gap-3.5 min-w-[280px]'>
                    <span className='grid size-10 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs shrink-0'>
                      {req.softwareName[0]}
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold text-foreground'>{req.softwareName}</span>
                        <span className='rounded bg-surface-subtle px-1.5 py-0.5 text-xs font-semibold text-primary border border-border'>
                          {req.planName}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[0.65rem] ${getStatusBadge(req.status).tone}`}
                        >
                          {getStatusBadge(req.status).label}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground'>
                        <span>
                          {t('itAdmin.shadowIt.extra.requester')} {req.requesterName} (
                          {itAdminDepartmentLabel(req.departmentName)})
                        </span>
                        <span>
                          {t('itAdmin.shadowIt.extra.submittedAt')} {req.submittedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 text-xs'>
                    <div className='text-right'>
                      <span className='font-bold text-foreground block'>
                        {req.beneficiaries.length} {t('itAdmin.shadowIt.extra.beneficiaries')}
                      </span>
                      <span className='text-[0.68rem] text-muted-foreground'>{demoDetail(req, 'cost')}</span>
                    </div>
                    <ChevronRight className='size-4 text-muted-foreground' />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail Panel */}
        {selectedReq ? (
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
            <div className='space-y-4'>
              <div className='pb-3 border-b border-border/80'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-xs text-muted-foreground'>{selectedReq.id}</span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[0.65rem] ${getStatusBadge(selectedReq.status).tone}`}
                  >
                    {getStatusBadge(selectedReq.status).label}
                  </span>
                </div>
                <h3 className='text-xl font-bold text-foreground mt-1'>{selectedReq.softwareName}</h3>
                <div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
                  <span>
                    {t('itAdmin.shadowIt.extra.plan')} <strong>{selectedReq.planName}</strong>
                  </span>
                  <span>·</span>
                  <a
                    className='inline-flex items-center gap-1 text-primary hover:underline'
                    href={selectedReq.productUrl}
                    rel='noreferrer'
                    target='_blank'
                  >
                    <span>{t('itAdmin.shadowIt.extra.productPage')}</span>
                    <ExternalLink className='size-3' />
                  </a>
                </div>
              </div>

              {/* Purpose & Cost */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 text-xs'>
                <div>
                  <span className='text-muted-foreground block text-[0.68rem]'>
                    {t('itAdmin.shadowIt.extra.purpose')}
                  </span>
                  <p className='font-semibold text-foreground mt-0.5'>{demoDetail(selectedReq, 'purpose')}</p>
                </div>
                <div className='grid grid-cols-2 gap-2 pt-2 border-t border-border/60'>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>
                      {t('itAdmin.shadowIt.extra.estimatedCost')}
                    </span>
                    <span className='font-bold text-foreground'>{demoDetail(selectedReq, 'cost')}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>
                      {t('itAdmin.shadowIt.extra.term')}
                    </span>
                    <span className='font-bold text-foreground'>{demoDetail(selectedReq, 'duration')}</span>
                  </div>
                </div>
              </div>

              {/* Beneficiaries List (Section 8.1 & 8.4) */}
              <div className='space-y-2 text-xs'>
                <span className='font-bold text-foreground uppercase tracking-wider text-[0.68rem] text-muted-foreground block'>
                  {t('itAdmin.shadowIt.extra.beneficiaryList')}
                  {selectedReq.beneficiaries.length} {t('itAdmin.shadowIt.extra.peopleClose')}
                </span>
                <div className='space-y-1.5 max-h-36 overflow-y-auto'>
                  {selectedReq.beneficiaries.map((b, idx) => (
                    <div
                      className='flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-2'
                      key={idx}
                    >
                      <div>
                        <span className='font-bold text-foreground block'>{b.name}</span>
                        <span className='text-[0.68rem] text-muted-foreground'>{b.email}</span>
                      </div>
                      <span className='text-[0.68rem] text-muted-foreground'>
                        {b.role === 'Kỹ sư Trưởng (Staff Engineer)'
                          ? t('itAdmin.shadowIt.extra.staffEngineer')
                          : b.role === 'Kỹ sư Vận hành'
                            ? t('itAdmin.shadowIt.extra.operationsEngineer')
                            : b.role}
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-[0.68rem] text-muted-foreground italic'>{t('itAdmin.shadowIt.extra.splitNotice')}</p>
              </div>

              {/* Next CTAs if pendingConfig */}
              {selectedReq.status === 'pendingConfig' && (
                <div className='rounded-xl border border-warning/30 bg-warning/10 p-3.5 space-y-2 text-xs'>
                  <span className='font-bold text-warning block'>{t('itAdmin.shadowIt.extra.nextSteps')}</span>
                  <p className='text-muted-foreground leading-relaxed'>{t('itAdmin.shadowIt.extra.nextStepsHelp')}</p>
                  <div className='flex flex-wrap items-center gap-2 pt-1'>
                    <button
                      className='rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                      onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                      type='button'
                    >
                      {t('itAdmin.shadowIt.extra.addPlan')}
                    </button>
                    <button
                      className='rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle'
                      onClick={() => onSelectTab && onSelectTab('usage-import')}
                      type='button'
                    >
                      {t('itAdmin.shadowIt.extra.importPurchase')}
                    </button>
                  </div>
                </div>
              )}

              {/* Rejection Details if rejected */}
              {selectedReq.status === 'rejected' && selectedReq.rejectReason && (
                <div className='rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs space-y-1'>
                  <span className='font-bold text-danger block'>{t('itAdmin.shadowIt.extra.rejectionReason')}</span>
                  <p className='text-foreground'>
                    {selectedReq.id === 'EXT-REQ-104'
                      ? t('itAdmin.shadowIt.extra.priorRejectionReason')
                      : selectedReq.rejectReason}
                  </p>
                  <p className='text-[0.68rem] text-muted-foreground mt-1'>
                    {t('itAdmin.shadowIt.extra.rejectedBy')} {selectedReq.decisionBy}{' '}
                    {t('itAdmin.shadowIt.extra.atTime')} {selectedReq.decisionAt}
                  </p>
                </div>
              )}
            </div>

            {/* Decision Buttons (Section 8.2) */}
            {selectedReq.status === 'pendingDecision' ? (
              <div className='pt-4 border-t border-border flex items-center gap-3'>
                <button
                  className='flex-1 rounded-xl border border-danger/40 bg-danger/10 py-2.5 text-xs font-bold text-danger hover:bg-danger/20'
                  onClick={() => setIsRejectModalOpen(true)}
                  type='button'
                >
                  {t('itAdmin.shadowIt.extra.reject')}
                </button>
                <button
                  className='flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                  onClick={() => setIsAcceptModalOpen(true)}
                  type='button'
                >
                  {t('itAdmin.shadowIt.extra.approve')}
                </button>
              </div>
            ) : (
              <div className='pt-4 border-t border-border text-center text-xs text-muted-foreground font-semibold'>
                {t('itAdmin.shadowIt.extra.decisionMade')}
                {getStatusBadge(selectedReq.status).label}).
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHẤP NHẬN ĐỀ XUẤT (IT-AC-12)                                       */}
      {/* ========================================================================= */}
      {isAcceptModalOpen && selectedReq && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-primary font-bold'>
              <CheckCircle2 className='size-5' />
              <h3 className='text-base font-bold text-foreground'>{t('itAdmin.shadowIt.extra.approveKicker')}</h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('itAdmin.shadowIt.extra.approveTitle')}{' '}
              <strong>
                {selectedReq.softwareName} ({selectedReq.planName})
              </strong>{' '}
              {t('itAdmin.shadowIt.extra.forDepartment')}{' '}
              <strong>{itAdminDepartmentLabel(selectedReq.departmentName)}</strong>.
            </p>

            <div className='space-y-1.5 text-xs'>
              <label className='font-bold text-foreground'>{t('itAdmin.shadowIt.extra.decisionNote')}</label>
              <textarea
                className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
                onChange={(e) => setDecisionNotesInput(e.target.value)}
                placeholder={t('itAdmin.shadowIt.extra.decisionNotePlaceholder')}
                rows={2}
                value={decisionNotesInput}
              />
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsAcceptModalOpen(false)}
                type='button'
              >
                {t('itAdmin.shadowIt.extra.cancel')}
              </button>
              <button
                className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={handleConfirmAccept}
                type='button'
              >
                {t('itAdmin.shadowIt.extra.confirmApprove')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TỪ CHỐI ĐỀ XUẤT (BẮT BUỘC LÝ DO - IT-AC-13)                       */}
      {/* ========================================================================= */}
      {isRejectModalOpen && selectedReq && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-danger font-bold'>
              <AlertCircle className='size-5' />
              <h3 className='text-base font-bold text-foreground'>{t('itAdmin.shadowIt.extra.rejectKicker')}</h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('itAdmin.shadowIt.extra.rejectionHelp')}
              {selectedReq.requesterName}
              {t('itAdmin.shadowIt.extra.rejectionHelpEnd')}
            </p>

            <textarea
              className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder={t('itAdmin.shadowIt.extra.rejectionPlaceholder')}
              rows={3}
              value={rejectReasonInput}
            />

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsRejectModalOpen(false)}
                type='button'
              >
                {t('itAdmin.shadowIt.extra.cancel')}
              </button>
              <button
                className='rounded-xl bg-danger px-5 py-2 text-xs font-bold text-white shadow hover:bg-danger/90'
                onClick={handleConfirmReject}
                type='button'
              >
                {t('itAdmin.shadowIt.extra.confirmReject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
