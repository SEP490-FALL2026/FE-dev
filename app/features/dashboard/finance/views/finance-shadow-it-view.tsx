import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, CreditCard, HelpCircle, Layers, PlusCircle, Search, X } from 'lucide-react'

import { MOCK_SHADOW_IT_TRANSACTIONS, type ShadowItTransaction } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceShadowItViewProps {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceShadowItView({ formatCurrency }: FinanceShadowItViewProps) {
  const { t } = useTranslation('dashboard')
  const [transactions, setTransactions] = useState<ShadowItTransaction[]>(MOCK_SHADOW_IT_TRANSACTIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTx, setSelectedTx] = useState<ShadowItTransaction | null>(null)
  const [actionType, setActionType] = useState<'LEGALIZE' | 'INQUIRE' | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleActionConfirm = () => {
    if (!selectedTx || !actionType) return

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === selectedTx.id
          ? {
              ...tx,
              status: actionType === 'LEGALIZE' ? 'LEGALIZED' : 'INQUIRED'
            }
          : tx
      )
    )

    setSuccessMsg(
      actionType === 'LEGALIZE' ? t('finance.shadowIt.legalizeSuccessMsg') : t('finance.shadowIt.inquireSuccessMsg')
    )
    setSelectedTx(null)
    setActionType(null)
  }

  const filtered = transactions.filter(
    (tx) =>
      tx.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.spenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cardLast4.includes(searchTerm) ||
      tx.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance.shadowIt.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance.shadowIt.subtitle')}</p>
      </div>

      {successMsg && (
        <div className='rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-bold text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('finance.shadowIt.searchPlaceholder')}
              type='text'
              value={searchTerm}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('finance.shadowIt.colService')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.shadowIt.colSpender')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.shadowIt.colCard')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.shadowIt.colAmount')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.shadowIt.colDate')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.shadowIt.colStatus')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.shadowIt.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    <Layers className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('approvals.queue.empty')}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4'>
                      <p className='font-bold text-foreground'>{tx.serviceName}</p>
                      <p className='text-[11px] text-muted-foreground'>{tx.vendor}</p>
                    </td>
                    <td className='py-3.5 px-4'>
                      <p className='font-bold text-foreground'>{tx.spenderName}</p>
                      <p className='text-[11px] text-muted-foreground'>{tx.spenderRole}</p>
                    </td>
                    <td className='py-3.5 px-4 font-mono'>
                      <div className='flex items-center gap-1.5 text-muted-foreground'>
                        <CreditCard className='size-3.5' />
                        <span>•••• {tx.cardLast4}</span>
                      </div>
                    </td>
                    <td className='py-3.5 px-4 text-right font-bold text-foreground'>{formatCurrency(tx.amount)}</td>
                    <td className='py-3.5 px-4 text-muted-foreground'>{tx.date}</td>
                    <td className='py-3.5 px-4 text-center'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          tx.status === 'FLAGGED'
                            ? 'bg-danger/10 text-danger border border-danger/20'
                            : tx.status === 'INQUIRED'
                              ? 'bg-warning/10 text-warning border border-warning/20'
                              : 'bg-success/10 text-success border border-success/20'
                        }`}
                      >
                        {tx.status === 'FLAGGED'
                          ? t('finance.shadowIt.statusFlagged')
                          : tx.status === 'INQUIRED'
                            ? t('finance.shadowIt.statusInquired')
                            : t('finance.shadowIt.statusLegalized')}
                      </span>
                    </td>
                    <td className='py-3.5 px-4 text-center'>
                      {tx.status === 'FLAGGED' ? (
                        <div className='flex items-center justify-center gap-1.5'>
                          <button
                            className='inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
                            onClick={() => {
                              setSelectedTx(tx)
                              setActionType('INQUIRE')
                            }}
                            type='button'
                          >
                            <HelpCircle className='size-3 text-warning' />
                            <span>{t('finance.shadowIt.actInquire')}</span>
                          </button>
                          <button
                            className='inline-flex items-center gap-1 rounded-xl bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90'
                            onClick={() => {
                              setSelectedTx(tx)
                              setActionType('LEGALIZE')
                            }}
                            type='button'
                          >
                            <PlusCircle className='size-3' />
                            <span>{t('finance.shadowIt.actLegalize')}</span>
                          </button>
                        </div>
                      ) : (
                        <span className='text-[11px] text-muted-foreground'>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedTx && actionType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>
                {actionType === 'LEGALIZE' ? t('finance.shadowIt.actLegalize') : t('finance.shadowIt.actInquire')}
              </h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => {
                  setSelectedTx(null)
                  setActionType(null)
                }}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>

            <div className='rounded-2xl border border-border bg-surface-subtle p-3 text-xs space-y-1'>
              <p className='font-bold text-foreground'>{selectedTx.serviceName}</p>
              <p className='text-muted-foreground'>
                {selectedTx.spenderName} · •••• {selectedTx.cardLast4}
              </p>
              <p className='text-sm font-extrabold text-foreground pt-1'>{formatCurrency(selectedTx.amount)}</p>
            </div>

            <p className='text-xs text-muted-foreground'>
              {actionType === 'LEGALIZE'
                ? t('finance.shadowIt.legalizeSuccessMsg')
                : t('finance.shadowIt.inquireSuccessMsg')}
            </p>

            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => {
                  setSelectedTx(null)
                  setActionType(null)
                }}
                type='button'
              >
                {t('finance.snapshot.modalCloseBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleActionConfirm}
                type='button'
              >
                {actionType === 'LEGALIZE' ? t('finance.shadowIt.actLegalize') : t('finance.shadowIt.actInquire')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
