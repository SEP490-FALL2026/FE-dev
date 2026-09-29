import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Info, Send, X } from 'lucide-react'

export interface BudgetInquiry {
  id: string
  requestCode: string
  saasName: string
  requesterName: string
  amount: number
  costCenter: string
  askedAt: string
  status: 'PENDING' | 'RESPONDED'
  financeResponse?: 'WITHIN_LIMIT' | 'EXCEEDS_LIMIT' | 'NO_BUDGET'
  financeNote?: string
}

export function BudgetSnapshotPage() {
  const { t } = useTranslation(['finance', 'common'])
  const [inquiries, setInquiries] = useState<BudgetInquiry[]>([
    {
      id: 'inq-01',
      requestCode: 'REQ-2026-089',
      saasName: 'Figma Enterprise (15 seats)',
      requesterName: 'Trần Vũ Bảo',
      amount: 13500000,
      costCenter: 'CC-DESIGN-01',
      askedAt: '2026-09-28T15:10:00Z',
      status: 'PENDING'
    },
    {
      id: 'inq-02',
      requestCode: 'REQ-2026-078',
      saasName: 'Cursor AI Pro (10 seats)',
      requesterName: 'Phạm Hoàng Nam',
      amount: 8200000,
      costCenter: 'CC-EXEC-01',
      askedAt: '2026-09-25T12:00:00Z',
      status: 'RESPONDED',
      financeResponse: 'WITHIN_LIMIT',
      financeNote: 'Ngân sách Q3 còn đủ chi trả. Không chặn quy trình duyệt chi.'
    }
  ])

  const [selectedInquiry, setSelectedInquiry] = useState<BudgetInquiry | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'WITHIN_LIMIT' | 'EXCEEDS_LIMIT' | 'NO_BUDGET'>('WITHIN_LIMIT')
  const [responseNote, setResponseNote] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const snapshot = {
    period: 'Q3-2026',
    totalBudget: 500000000,
    actualSpend: 312000000,
    heldCommitments: 45000000,
    remainingBudget: 143000000,
    pendingApprovals: 68000000
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleSendResponse = () => {
    if (!selectedInquiry) return

    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === selectedInquiry.id
          ? {
              ...inq,
              status: 'RESPONDED',
              financeResponse: selectedStatus,
              financeNote: responseNote
            }
          : inq
      )
    )

    setSuccessMsg(t('finance:snapshot.respondedMsg'))
    setSelectedInquiry(null)
    setResponseNote('')
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance:snapshot.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:snapshot.subtitle')}</p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className='rounded-xl border border-success/40 bg-success/10 p-4 text-sm font-medium text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='h-5 w-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Snapshot Cards Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs'>
          <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('finance:snapshot.metrics.totalBudget')}
          </span>
          <p className='mt-3 text-xl font-bold text-foreground'>{formatCurrency(snapshot.totalBudget)}</p>
          <span className='mt-1 inline-block font-mono text-[11px] text-muted-foreground'>
            {t('finance:snapshot.periodFormat', { period: snapshot.period })}
          </span>
        </div>

        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs'>
          <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('finance:snapshot.metrics.actualSpend')}
          </span>
          <p className='mt-3 text-xl font-bold text-foreground'>{formatCurrency(snapshot.actualSpend)}</p>
          <span className='mt-1 inline-block text-[11px] text-muted-foreground'>
            {t('finance:snapshot.actualSpendNote')}
          </span>
        </div>

        <div className='rounded-xl border border-warning/40 bg-surface p-5 shadow-xs'>
          <span className='text-xs font-semibold uppercase tracking-wider text-warning'>
            {t('finance:snapshot.metrics.heldCommitment')}
          </span>
          <p className='mt-3 text-xl font-bold text-warning'>{formatCurrency(snapshot.heldCommitments)}</p>
          <span className='mt-1 inline-block text-[11px] text-muted-foreground'>{t('finance:snapshot.heldNote')}</span>
        </div>

        <div className='rounded-xl border border-success/40 bg-surface p-5 shadow-xs'>
          <span className='text-xs font-semibold uppercase tracking-wider text-success'>
            {t('finance:snapshot.metrics.remaining')}
          </span>
          <p className='mt-3 text-xl font-bold text-success'>{formatCurrency(snapshot.remainingBudget)}</p>
          <span className='mt-1 inline-block text-[11px] text-muted-foreground'>
            {t('finance:snapshot.remainingNote')}
          </span>
        </div>

        <div className='rounded-xl border border-info/40 bg-surface p-5 shadow-xs'>
          <span className='text-xs font-semibold uppercase tracking-wider text-info'>
            {t('finance:snapshot.metrics.pendingApproval')}
          </span>
          <p className='mt-3 text-xl font-bold text-info'>{formatCurrency(snapshot.pendingApprovals)}</p>
          <span className='mt-1 inline-block text-[11px] text-muted-foreground'>
            {t('finance:snapshot.pendingNote')}
          </span>
        </div>
      </div>

      {/* Inquiries List & Response Panel */}
      <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-6'>
        <div className='flex items-center justify-between border-b border-border pb-4'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>{t('finance:snapshot.inquiries.title')}</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>{t('finance:snapshot.inquiries.subtitle')}</p>
          </div>
        </div>

        <div className='space-y-4'>
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className='rounded-xl border border-border bg-background p-4 shadow-xs flex flex-col gap-4 md:flex-row md:items-center md:justify-between'
            >
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-xs font-bold text-primary'>{inq.requestCode}</span>
                  <span className='font-semibold text-foreground text-sm'>{inq.saasName}</span>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {t('finance:snapshot.requesterText', {
                    name: inq.requesterName,
                    costCenter: inq.costCenter,
                    amount: formatCurrency(inq.amount)
                  })}
                </p>
              </div>

              <div>
                {inq.status === 'PENDING' ? (
                  <button
                    onClick={() => setSelectedInquiry(inq)}
                    className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover'
                  >
                    <Send className='h-3.5 w-3.5' />
                    <span>{t('finance:snapshot.inquiries.respond')}</span>
                  </button>
                ) : (
                  <div className='flex items-center gap-2 text-xs'>
                    <span
                      className={`rounded-full px-2.5 py-1 font-bold ${
                        inq.financeResponse === 'WITHIN_LIMIT'
                          ? 'bg-success/10 text-success'
                          : inq.financeResponse === 'EXCEEDS_LIMIT'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {inq.financeResponse === 'WITHIN_LIMIT'
                        ? t('finance:snapshot.inquiries.statusOptions.withinLimit')
                        : inq.financeResponse === 'EXCEEDS_LIMIT'
                          ? t('finance:snapshot.inquiries.statusOptions.exceedsLimit')
                          : t('finance:snapshot.inquiries.statusOptions.noBudget')}
                    </span>
                    <span className='text-muted-foreground text-[11px]'>{t('finance:snapshot.respondedBadge')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Modal */}
      {selectedInquiry && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-5'>
            <div className='flex items-center justify-between border-b border-border pb-3'>
              <h3 className='text-lg font-bold text-foreground'>
                {t('finance:snapshot.modalTitle', { requestCode: selectedInquiry.requestCode })}
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-xs font-semibold text-foreground'>
                  {t('finance:snapshot.selectStatusLabel')}
                </label>
                <div className='grid grid-cols-3 gap-2 mt-2'>
                  <button
                    type='button'
                    onClick={() => setSelectedStatus('WITHIN_LIMIT')}
                    className={`rounded-lg border p-3 text-xs font-bold text-center transition-all ${
                      selectedStatus === 'WITHIN_LIMIT'
                        ? 'border-success bg-success/10 text-success ring-2 ring-success/20'
                        : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle'
                    }`}
                  >
                    {t('finance:snapshot.inquiries.statusOptions.withinLimit')}
                  </button>
                  <button
                    type='button'
                    onClick={() => setSelectedStatus('EXCEEDS_LIMIT')}
                    className={`rounded-lg border p-3 text-xs font-bold text-center transition-all ${
                      selectedStatus === 'EXCEEDS_LIMIT'
                        ? 'border-warning bg-warning/10 text-warning ring-2 ring-warning/20'
                        : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle'
                    }`}
                  >
                    {t('finance:snapshot.inquiries.statusOptions.exceedsLimit')}
                  </button>
                  <button
                    type='button'
                    onClick={() => setSelectedStatus('NO_BUDGET')}
                    className={`rounded-lg border p-3 text-xs font-bold text-center transition-all ${
                      selectedStatus === 'NO_BUDGET'
                        ? 'border-danger bg-danger/10 text-danger ring-2 ring-danger/20'
                        : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle'
                    }`}
                  >
                    {t('finance:snapshot.inquiries.statusOptions.noBudget')}
                  </button>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-foreground'>{t('finance:snapshot.inquiries.note')}</label>
                <textarea
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder={t('finance:snapshot.notePlaceholder')}
                  rows={3}
                  className='mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-hidden'
                />
              </div>

              <div className='rounded-lg bg-surface-subtle p-3 text-xs text-muted-foreground border border-border space-y-1'>
                <div className='flex items-center gap-1.5 font-semibold text-foreground'>
                  <Info className='h-4 w-4 text-primary' />
                  <span>{t('finance:snapshot.ruleInfoTitle')}</span>
                </div>
                <p className='text-[11px] leading-relaxed'>{t('finance:snapshot.ruleInfoDesc')}</p>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setSelectedInquiry(null)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('finance:snapshot.cancelBtn')}
              </button>
              <button
                onClick={handleSendResponse}
                className='rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover'
              >
                {t('finance:snapshot.confirmSendBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
