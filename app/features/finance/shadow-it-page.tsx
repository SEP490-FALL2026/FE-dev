import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, CreditCard, HelpCircle, PlusCircle, Search, X } from 'lucide-react'

export interface ShadowItTransaction {
  id: string
  serviceName: string
  vendor: string
  spenderName: string
  spenderRole: string
  cardLast4: string
  amount: number
  date: string
  status: 'FLAGGED' | 'INQUIRED' | 'LEGALIZED' | 'REJECTED'
}

export const MOCK_SHADOW_IT_TRANSACTIONS: ShadowItTransaction[] = [
  {
    id: 'sit-01',
    serviceName: 'OpenAI ChatGPT Plus',
    vendor: 'OpenAI LLC',
    spenderName: 'Lê Hoàng Anh',
    spenderRole: 'Senior AI Engineer',
    cardLast4: '8812',
    amount: 520000,
    date: '2026-09-27',
    status: 'FLAGGED'
  },
  {
    id: 'sit-02',
    serviceName: 'Canva Pro Annual',
    vendor: 'Canva Pty Ltd',
    spenderName: 'Nguyễn Thị Mai',
    spenderRole: 'Marketing Specialist',
    cardLast4: '3341',
    amount: 2400000,
    date: '2026-09-24',
    status: 'INQUIRED'
  },
  {
    id: 'sit-03',
    serviceName: 'Vercel Pro Team Plan',
    vendor: 'Vercel Inc.',
    spenderName: 'Đỗ Văn Thành',
    spenderRole: 'Frontend Tech Lead',
    cardLast4: '9012',
    amount: 1450000,
    date: '2026-09-18',
    status: 'LEGALIZED'
  }
]

export function ShadowItPage() {
  const { t } = useTranslation(['finance', 'common'])
  const [transactions, setTransactions] = useState<ShadowItTransaction[]>(MOCK_SHADOW_IT_TRANSACTIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTx, setSelectedTx] = useState<ShadowItTransaction | null>(null)
  const [actionType, setActionType] = useState<'LEGALIZE' | 'INQUIRE' | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleLegalizeConfirm = () => {
    if (!selectedTx) return
    setTransactions((prev) => prev.map((t) => (t.id === selectedTx.id ? { ...t, status: 'LEGALIZED' } : t)))
    setSuccessMsg(t('finance:shadowIt.legalizeSuccessMsg'))
    setSelectedTx(null)
    setActionType(null)
  }

  const handleInquireConfirm = () => {
    if (!selectedTx) return
    setTransactions((prev) => prev.map((t) => (t.id === selectedTx.id ? { ...t, status: 'INQUIRED' } : t)))
    setSuccessMsg(t('finance:shadowIt.inquireSuccessMsg'))
    setSelectedTx(null)
    setActionType(null)
  }

  const filtered = transactions.filter(
    (tx) =>
      tx.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.spenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cardLast4.includes(searchTerm)
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance:shadowIt.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:shadowIt.subtitle')}</p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className='rounded-xl border border-success/40 bg-success/10 p-4 text-sm font-medium text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='h-5 w-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className='rounded-xl border border-border bg-surface p-4 shadow-xs'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('finance:shadowIt.searchPlaceholder')}
            className='w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden'
          />
        </div>
      </div>

      {/* Shadow IT Transactions Table */}
      <div className='overflow-hidden rounded-xl border border-border bg-surface shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-foreground'>
            <thead className='border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <tr>
                <th className='px-6 py-4'>{t('finance:shadowIt.table.transaction')}</th>
                <th className='px-6 py-4'>{t('finance:shadowIt.table.spender')}</th>
                <th className='px-6 py-4 text-right'>{t('finance:shadowIt.table.amount')}</th>
                <th className='px-6 py-4'>{t('finance:shadowIt.table.date')}</th>
                <th className='px-6 py-4'>{t('finance:shadowIt.table.status')}</th>
                <th className='px-6 py-4 text-center'>{t('finance:shadowIt.table.actions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.map((item) => (
                <tr key={item.id} className='transition-colors hover:bg-surface-subtle/60'>
                  <td className='px-6 py-4'>
                    <p className='font-bold text-foreground'>{item.serviceName}</p>
                    <p className='text-xs text-muted-foreground'>{item.vendor}</p>
                  </td>

                  <td className='px-6 py-4 text-xs'>
                    <p className='font-semibold text-foreground'>{item.spenderName}</p>
                    <div className='flex items-center gap-1 text-muted-foreground mt-0.5'>
                      <CreditCard className='h-3 w-3 text-warning' />
                      <span>{t('finance:shadowIt.cardLabelFormat', { last4: item.cardLast4 })}</span>
                    </div>
                  </td>

                  <td className='px-6 py-4 text-right font-extrabold text-foreground'>{formatCurrency(item.amount)}</td>

                  <td className='px-6 py-4 text-xs text-muted-foreground font-medium'>{item.date}</td>

                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'FLAGGED'
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : item.status === 'INQUIRED'
                            ? 'bg-info/10 text-info border border-info/20'
                            : item.status === 'LEGALIZED'
                              ? 'bg-success/10 text-success border border-success/20'
                              : 'bg-danger/10 text-danger border border-danger/20'
                      }`}
                    >
                      {t(`finance:shadowIt.statuses.${item.status}`)}
                    </span>
                  </td>

                  <td className='px-6 py-4 text-center'>
                    {item.status === 'FLAGGED' && (
                      <div className='flex items-center justify-center gap-1.5'>
                        <button
                          onClick={() => {
                            setSelectedTx(item)
                            setActionType('LEGALIZE')
                          }}
                          className='inline-flex items-center gap-1 rounded-lg bg-success/10 border border-success/30 px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/20'
                        >
                          <PlusCircle className='h-3.5 w-3.5' />
                          <span>{t('finance:shadowIt.actions.legalize')}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTx(item)
                            setActionType('INQUIRE')
                          }}
                          className='inline-flex items-center gap-1 rounded-lg bg-surface-subtle border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface'
                        >
                          <HelpCircle className='h-3.5 w-3.5 text-primary' />
                          <span>{t('finance:shadowIt.actions.inquire')}</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      {selectedTx && actionType === 'LEGALIZE' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-foreground'>{t('finance:shadowIt.legalizeModalTitle')}</h3>
              <button
                onClick={() => setSelectedTx(null)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>{t('finance:shadowIt.legalizeModalDesc')}</p>
            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setSelectedTx(null)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('common:cancel')}
              </button>
              <button
                onClick={handleLegalizeConfirm}
                className='rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-success/90'
              >
                {t('finance:shadowIt.confirmLegalizeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTx && actionType === 'INQUIRE' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-foreground'>{t('finance:shadowIt.inquireModalTitle')}</h3>
              <button
                onClick={() => setSelectedTx(null)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>{t('finance:shadowIt.inquireModalDesc')}</p>
            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setSelectedTx(null)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('common:cancel')}
              </button>
              <button
                onClick={handleInquireConfirm}
                className='rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover'
              >
                {t('finance:shadowIt.confirmInquireBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
