import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, DollarSign, PieChart, Send, Wallet, X } from 'lucide-react'

import { type BudgetInquiry, financeSnapshotData, MOCK_BUDGET_INQUIRIES } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceBudgetSnapshotViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceBudgetSnapshotView({ formatCurrency }: FinanceBudgetSnapshotViewProps) {
  const { t } = useTranslation('dashboard')

  const [inquiries, setInquiries] = useState<BudgetInquiry[]>(MOCK_BUDGET_INQUIRIES)
  const [selectedInquiry, setSelectedInquiry] = useState<BudgetInquiry | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'WITHIN_LIMIT' | 'EXCEEDS_LIMIT' | 'NO_BUDGET'>('WITHIN_LIMIT')
  const [responseNote, setResponseNote] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSendResponse = () => {
    if (!selectedInquiry) return

    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === selectedInquiry.id
          ? {
              ...inq,
              financeNote: responseNote,
              financeResponse: selectedStatus,
              status: 'RESPONDED'
            }
          : inq
      )
    )

    setSuccessMsg(t('finance.snapshot.respondedMsg'))
    setSelectedInquiry(null)
    setResponseNote('')
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance.snapshot.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance.snapshot.subtitle')}</p>
      </div>

      {successMsg && (
        <div className='rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-bold text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Snapshot Cards Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.snapshot.metricTotalBudget')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>
            {formatCurrency(financeSnapshotData.totalBudget)}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{financeSnapshotData.period}</p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.snapshot.metricActualSpend')}
            </span>
            <div className='rounded-lg bg-info/10 p-2 text-info'>
              <PieChart className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>
            {formatCurrency(financeSnapshotData.actualSpend)}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            {Math.round((financeSnapshotData.actualSpend / financeSnapshotData.totalBudget) * 100)}%
          </p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.snapshot.metricHeld')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Wallet className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-foreground'>
            {formatCurrency(financeSnapshotData.heldCommitments)}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            {Math.round((financeSnapshotData.heldCommitments / financeSnapshotData.totalBudget) * 100)}%
          </p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance.snapshot.metricRemaining')}
            </span>
            <div className='rounded-lg bg-success/10 p-2 text-success'>
              <DollarSign className='size-5' />
            </div>
          </div>
          <p className='mt-3 text-2xl font-extrabold text-success'>
            {formatCurrency(financeSnapshotData.remainingBudget)}
          </p>
          <p className='mt-1 text-xs text-success font-medium'>
            {t('finance.snapshot.availablePct', {
              percent: Math.round((financeSnapshotData.remainingBudget / financeSnapshotData.totalBudget) * 100)
            })}
          </p>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <h2 className='text-sm font-bold text-foreground'>{t('finance.snapshot.inquiriesTitle')}</h2>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('finance.snapshot.colRequest')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.snapshot.colSoftware')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.snapshot.colRequester')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.snapshot.colAmount')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.snapshot.colCostCenter')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.snapshot.colStatus')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.snapshot.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {inquiries.map((inq) => (
                <tr key={inq.id} className='transition hover:bg-surface-subtle/50'>
                  <td className='py-3.5 px-4 font-mono font-bold text-primary'>{inq.requestCode}</td>
                  <td className='py-3.5 px-4 font-bold text-foreground'>{inq.saasName}</td>
                  <td className='py-3.5 px-4 text-muted-foreground'>{inq.requesterName}</td>
                  <td className='py-3.5 px-4 text-right font-bold text-foreground'>{formatCurrency(inq.amount)}</td>
                  <td className='py-3.5 px-4 font-mono text-muted-foreground'>{inq.costCenter}</td>
                  <td className='py-3.5 px-4 text-center'>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        inq.status === 'RESPONDED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {inq.status === 'RESPONDED'
                        ? t('finance.snapshot.statusResponded')
                        : t('finance.snapshot.statusPending')}
                    </span>
                  </td>
                  <td className='py-3.5 px-4 text-center'>
                    <button
                      className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                      onClick={() => setSelectedInquiry(inq)}
                      type='button'
                    >
                      <Send className='size-3.5' />
                      <span>{t('finance.snapshot.actRespond')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Modal */}
      {selectedInquiry && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>
                {t('finance.snapshot.modalTitle', { code: selectedInquiry.requestCode })}
              </h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setSelectedInquiry(null)}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>

            <div className='rounded-2xl border border-border bg-surface-subtle p-3 text-xs space-y-1'>
              <p className='font-bold text-foreground'>{selectedInquiry.saasName}</p>
              <p className='text-muted-foreground'>
                {selectedInquiry.requesterName} · {selectedInquiry.costCenter}
              </p>
              <p className='text-sm font-extrabold text-foreground pt-1'>{formatCurrency(selectedInquiry.amount)}</p>
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-2'>
                {t('finance.snapshot.modalDecisionLabel')}
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { id: 'WITHIN_LIMIT' as const, label: t('finance.snapshot.responseWithin') },
                  { id: 'EXCEEDS_LIMIT' as const, label: t('finance.snapshot.responseExceeds') },
                  { id: 'NO_BUDGET' as const, label: t('finance.snapshot.responseNoBudget') }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    className={`rounded-xl border p-2 text-xs font-bold transition text-center ${
                      selectedStatus === opt.id
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                    }`}
                    onClick={() => setSelectedStatus(opt.id)}
                    type='button'
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-2'>
                {t('finance.snapshot.modalNoteLabel')}
              </label>
              <textarea
                className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder={t('finance.snapshot.modalNotePlaceholder')}
                rows={3}
                value={responseNote}
              />
            </div>

            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => setSelectedInquiry(null)}
                type='button'
              >
                {t('finance.snapshot.modalCloseBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleSendResponse}
                type='button'
              >
                {t('finance.snapshot.modalSubmitBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
