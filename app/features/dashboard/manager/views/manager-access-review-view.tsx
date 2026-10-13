import { CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type AccessReviewItem, MOCK_ACCESS_REVIEW } from '../manager-data'
import { ManagerConfirmDialog } from '../manager-confirm-dialog'
import { ManagerIdentityMark } from '../manager-identity-mark'

export function ManagerAccessReviewView() {
  const { t } = useTranslation('dashboard')
  const [items, setItems] = useState<AccessReviewItem[]>(MOCK_ACCESS_REVIEW)
  const [completedNotice, setCompletedNotice] = useState<string | null>(null)
  const [retainConfirmOpen, setRetainConfirmOpen] = useState(false)

  const reviewedCount = items.filter((i) => i.status !== 'PENDING').length
  const pendingCount = items.length - reviewedCount
  const progressPercent = Math.round((reviewedCount / items.length) * 100)

  const handleDecision = (id: string, decision: 'RETAIN' | 'REVOKE') => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: decision } : item)))
  }

  const handleRetainAllActive = () => {
    setRetainConfirmOpen(false)
    setItems((prev) => prev.map((item) => (item.status === 'PENDING' ? { ...item, status: 'RETAIN' } : item)))
    setCompletedNotice(t('manager.accessReview.retainedAllMsg'))
    setTimeout(() => setCompletedNotice(null), 3000)
  }

  const handleCompleteCampaign = () => {
    setCompletedNotice(t('manager.accessReview.campaignCompletedMsg'))
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.accessReview.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.accessReview.subtitle')}</p>
        </div>

        <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
            disabled={pendingCount === 0}
            onClick={() => setRetainConfirmOpen(true)}
            type='button'
          >
            <CheckCircle2 className='size-3.5 text-success' />
            <span>{t('manager.accessReview.retainActiveBtn')}</span>
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50'
            disabled={reviewedCount < items.length}
            onClick={handleCompleteCampaign}
            type='button'
          >
            <FileCheck2 className='size-3.5' />
            <span>{t('manager.accessReview.submitCampaignBtn')}</span>
          </button>
        </div>
      </div>

      {retainConfirmOpen && (
        <ManagerConfirmDialog
          cancelLabel={t('manager.accessReview.cancelBtn')}
          confirmLabel={t('manager.accessReview.retainActiveBtn')}
          description={t('manager.accessReview.retainConfirmDesc', { count: pendingCount })}
          onCancel={() => setRetainConfirmOpen(false)}
          onConfirm={handleRetainAllActive}
          title={t('manager.accessReview.retainConfirmTitle')}
        />
      )}

      {completedNotice && (
        <div
          role='status'
          className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs font-medium text-success shadow-xs'
        >
          <ShieldCheck className='size-5 shrink-0' />
          <span>{completedNotice}</span>
        </div>
      )}

      {/* Progress Bar Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3'>
        <div className='flex items-center justify-between text-xs'>
          <div>
            <span className='font-bold text-foreground'>{t('manager.accessReview.progressTitle')}</span>
            <span className='text-muted-foreground ml-2'>
              {t('manager.accessReview.progressStats', { reviewed: reviewedCount, total: items.length })}
            </span>
          </div>
          <span className='font-mono font-bold text-foreground'>{progressPercent}%</span>
        </div>
        <div
          aria-label={t('manager.accessReview.progressTitle')}
          aria-valuemax={items.length}
          aria-valuemin={0}
          aria-valuenow={reviewedCount}
          className='h-2 w-full overflow-hidden rounded-full bg-border'
          role='progressbar'
        >
          <div
            className='h-full rounded-full bg-primary transition-all duration-300'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Access Review Table */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <h2 className='text-sm font-bold text-foreground'>{t('manager.accessReview.tableTitle')}</h2>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <caption className='sr-only'>{t('manager.accessReview.tableTitle')}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.accessReview.colEmployee')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.accessReview.colSoftware')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.accessReview.colPlan')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.accessReview.colLastActive')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.accessReview.colStatus')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.accessReview.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {items.map((item) => (
                <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                  <td className='py-3.5 px-4'>
                    <p className='font-bold text-foreground'>{item.employeeName}</p>
                    <p className='text-[11px] text-muted-foreground'>{item.jobTitle}</p>
                  </td>

                  <td className='py-3.5 px-4'>
                    <div className='flex items-center gap-2'>
                      <ManagerIdentityMark className='size-8 rounded-lg' name={item.softwareName} />
                      <span className='font-bold text-foreground'>{item.softwareName}</span>
                    </div>
                  </td>

                  <td className='py-3.5 px-4 text-muted-foreground'>{item.plan}</td>

                  <td className='py-3.5 px-4 font-mono text-muted-foreground'>{item.lastActiveDate}</td>

                  <td className='py-3.5 px-4 text-center'>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        item.status === 'PENDING'
                          ? 'bg-warning/10 text-warning'
                          : item.status === 'RETAIN'
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {item.status === 'PENDING'
                        ? t('manager.accessReview.statusPending')
                        : item.status === 'RETAIN'
                          ? t('manager.accessReview.statusRetained')
                          : t('manager.accessReview.statusRevoked')}
                    </span>
                  </td>

                  <td className='py-3.5 px-4 text-right'>
                    <div className='flex items-center justify-end gap-1.5'>
                      <button
                        aria-pressed={item.status === 'RETAIN'}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          item.status === 'RETAIN'
                            ? 'bg-success text-white shadow-xs'
                            : 'border border-border bg-surface text-foreground hover:bg-success/10 hover:text-success'
                        }`}
                        onClick={() => handleDecision(item.id, 'RETAIN')}
                        type='button'
                      >
                        {t('manager.accessReview.actRetain')}
                      </button>
                      <button
                        aria-pressed={item.status === 'REVOKE'}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          item.status === 'REVOKE'
                            ? 'bg-danger text-white shadow-xs'
                            : 'border border-border bg-surface text-foreground hover:bg-danger/10 hover:text-danger'
                        }`}
                        onClick={() => handleDecision(item.id, 'REVOKE')}
                        type='button'
                      >
                        {t('manager.accessReview.actRevoke')}
                      </button>
                    </div>
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
