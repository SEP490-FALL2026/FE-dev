import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, FileCheck, Search, Wallet } from 'lucide-react'

export interface CommitmentRecord {
  id: string
  commitmentCode: string
  requestRefCode: string
  saasName: string
  costCenter: string
  amount: number
  createdAt: string
  status: 'HELD' | 'RECONCILED' | 'RELEASED'
}

export const MOCK_COMMITMENTS: CommitmentRecord[] = [
  {
    id: 'cmt-01',
    commitmentCode: 'CMT-2026-044',
    requestRefCode: 'REQ-2026-089',
    saasName: 'Figma Enterprise (15 seats)',
    costCenter: 'CC-DESIGN-01',
    amount: 13500000,
    createdAt: '2026-09-28T16:00:00Z',
    status: 'HELD'
  },
  {
    id: 'cmt-02',
    commitmentCode: 'CMT-2026-039',
    requestRefCode: 'REQ-2026-065',
    saasName: 'Jira Service Management',
    costCenter: 'CC-OPS-03',
    amount: 24000000,
    createdAt: '2026-09-20T10:30:00Z',
    status: 'RECONCILED'
  },
  {
    id: 'cmt-03',
    commitmentCode: 'CMT-2026-028',
    requestRefCode: 'REQ-2026-041',
    saasName: 'Miro Team Plan',
    costCenter: 'CC-PRODUCT-02',
    amount: 7500000,
    createdAt: '2026-09-12T14:15:00Z',
    status: 'RELEASED'
  }
]

export function HeldCommitmentsPage() {
  const { t } = useTranslation(['finance', 'common'])
  const [searchTerm, setSearchTerm] = useState('')
  const [commitments, setCommitments] = useState<CommitmentRecord[]>(MOCK_COMMITMENTS)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleReconcile = (id: string) => {
    setCommitments((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'RECONCILED' } : c)))
    setSuccessMsg(t('finance:commitments.reconciledMsg'))
  }

  const filtered = commitments.filter(
    (c) =>
      c.commitmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requestRefCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.saasName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalHeld = commitments.filter((c) => c.status === 'HELD').reduce((acc, c) => acc + c.amount, 0)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('finance:commitments.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:commitments.subtitle')}</p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className='rounded-xl border border-success/40 bg-success/10 p-4 text-sm font-medium text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='h-5 w-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Header Card */}
      <div className='rounded-xl border border-warning/40 bg-surface p-6 shadow-xs flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='rounded-2xl bg-warning/10 p-3 text-warning'>
            <Wallet className='h-8 w-8' />
          </div>
          <div>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('finance:commitments.totalHeldLabel')}
            </span>
            <p className='text-3xl font-extrabold text-warning'>{formatCurrency(totalHeld)}</p>
          </div>
        </div>
        <div className='text-right text-xs text-muted-foreground hidden sm:block'>
          <p className='font-semibold text-foreground'>{t('finance:commitments.subRuleText')}</p>
          <p>{t('finance:commitments.subRuleDesc')}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className='rounded-xl border border-border bg-surface p-4 shadow-xs'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('finance:commitments.searchPlaceholder')}
            className='w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden'
          />
        </div>
      </div>

      {/* Commitments Table */}
      <div className='overflow-hidden rounded-xl border border-border bg-surface shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-foreground'>
            <thead className='border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <tr>
                <th className='px-6 py-4'>{t('finance:commitments.table.commitmentId')}</th>
                <th className='px-6 py-4'>{t('finance:commitments.table.requestRef')}</th>
                <th className='px-6 py-4'>{t('finance:commitments.table.costCenter')}</th>
                <th className='px-6 py-4 text-right'>{t('finance:commitments.table.amount')}</th>
                <th className='px-6 py-4'>{t('finance:commitments.table.status')}</th>
                <th className='px-6 py-4 text-center'>{t('finance:commitments.table.actions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.map((item) => (
                <tr key={item.id} className='transition-colors hover:bg-surface-subtle/60'>
                  <td className='px-6 py-4 font-mono font-bold text-primary'>{item.commitmentCode}</td>
                  <td className='px-6 py-4'>
                    <p className='font-mono text-xs font-semibold text-foreground'>{item.requestRefCode}</p>
                    <p className='text-xs text-muted-foreground'>{item.saasName}</p>
                  </td>
                  <td className='px-6 py-4 text-xs font-medium text-foreground'>{item.costCenter}</td>
                  <td className='px-6 py-4 text-right font-bold text-foreground'>{formatCurrency(item.amount)}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'HELD'
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : item.status === 'RECONCILED'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-muted/10 text-muted-foreground border border-border'
                      }`}
                    >
                      {t(`finance:commitments.statuses.${item.status}`)}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {item.status === 'HELD' && (
                      <button
                        onClick={() => handleReconcile(item.id)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-surface-subtle border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface'
                      >
                        <FileCheck className='h-3.5 w-3.5 text-success' />
                        <span>{t('finance:commitments.reconcileInvoice')}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
