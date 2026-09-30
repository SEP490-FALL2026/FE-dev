import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, FileCheck, Layers, Search } from 'lucide-react'

import { type CommitmentRecord, MOCK_COMMITMENTS } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceHeldCommitmentsViewProps {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceHeldCommitmentsView({ formatCurrency }: FinanceHeldCommitmentsViewProps) {
  const { t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [commitments, setCommitments] = useState<CommitmentRecord[]>(MOCK_COMMITMENTS)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleReconcile = (id: string) => {
    const item = commitments.find((c) => c.id === id)
    setCommitments((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'RECONCILED' } : c)))
    if (item) {
      setSuccessMsg(t('finance.commitments.reconciledSuccessMsg', { code: item.commitmentCode }))
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  }

  const filtered = commitments.filter(
    (c) =>
      c.commitmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requestRefCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.saasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalHeldAmount = commitments.filter((c) => c.status === 'HELD').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className='space-y-6'>
      {/* Header & Metric Banner */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('finance.commitments.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('finance.commitments.subtitle')}</p>
        </div>

        <div className='rounded-2xl border border-warning/30 bg-warning/10 px-4 py-2 text-right shadow-xs'>
          <span className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>
            {t('finance.snapshot.metricHeld')}
          </span>
          <p className='text-xl font-extrabold text-warning'>{formatCurrency(totalHeldAmount)}</p>
        </div>
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
              placeholder={t('finance.commitments.searchPlaceholder')}
              type='text'
              value={searchTerm}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('finance.commitments.colCode')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.commitments.colRef')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.commitments.colSoftware')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.commitments.colCostCenter')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.commitments.colAmount')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.commitments.colStatus')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.commitments.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    <Layers className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('finance.commitments.empty')}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4 font-mono font-bold text-primary'>{item.commitmentCode}</td>
                    <td className='py-3.5 px-4 font-mono text-muted-foreground'>{item.requestRefCode}</td>
                    <td className='py-3.5 px-4 font-bold text-foreground'>{item.saasName}</td>
                    <td className='py-3.5 px-4 font-mono text-muted-foreground'>{item.costCenter}</td>
                    <td className='py-3.5 px-4 text-right font-bold text-foreground'>{formatCurrency(item.amount)}</td>
                    <td className='py-3.5 px-4 text-center'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.status === 'HELD'
                            ? 'bg-warning/10 text-warning border border-warning/20'
                            : item.status === 'RECONCILED'
                              ? 'bg-success/10 text-success border border-success/20'
                              : 'bg-surface-subtle text-muted-foreground border border-border'
                        }`}
                      >
                        {item.status === 'HELD'
                          ? t('finance.commitments.statusHeld')
                          : item.status === 'RECONCILED'
                            ? t('finance.commitments.statusReconciled')
                            : t('finance.commitments.statusReleased')}
                      </span>
                    </td>
                    <td className='py-3.5 px-4 text-center'>
                      {item.status === 'HELD' ? (
                        <button
                          className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
                          onClick={() => handleReconcile(item.id)}
                          type='button'
                        >
                          <FileCheck className='size-3.5 text-primary' />
                          <span>{t('finance.commitments.actReconcile')}</span>
                        </button>
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
    </div>
  )
}
