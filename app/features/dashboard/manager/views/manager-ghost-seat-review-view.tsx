import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type GhostSeatItem, MOCK_GHOST_SEATS } from '../manager-data'
import { ManagerConfirmDialog } from '../manager-confirm-dialog'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerGhostSeatReviewViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerGhostSeatReviewView({ formatCurrency, onSelectTab }: ManagerGhostSeatReviewViewProps) {
  const { t } = useTranslation('dashboard')
  const [ghostSeats, setGhostSeats] = useState<GhostSeatItem[]>(MOCK_GHOST_SEATS)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [ruleFilter, setRuleFilter] = useState<'ALL' | 'G3' | 'G4'>('ALL')
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false)

  const totalWaste = ghostSeats.filter((g) => g.status === 'FLAGGED').reduce((sum, g) => sum + g.monthlyCost, 0)
  const flaggedG3Count = ghostSeats.filter((seat) => seat.flagRule === 'G3' && seat.status === 'FLAGGED').length

  const handleBatchRevokeG3 = () => {
    setBatchConfirmOpen(false)
    setGhostSeats((prev) =>
      prev.map((g) => (g.flagRule === 'G3' && g.status === 'FLAGGED' ? { ...g, status: 'REVOKED' } : g))
    )
    setSuccessMsg(t('manager.ghostSeat.batchRevokedMsg'))
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  const filtered = ghostSeats.filter((g) => {
    if (ruleFilter === 'ALL') return true
    return g.flagRule === ruleFilter
  })

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.ghostSeat.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.ghostSeat.subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-danger px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-danger/90 disabled:opacity-50'
            disabled={flaggedG3Count === 0}
            onClick={() => setBatchConfirmOpen(true)}
            type='button'
          >
            <RotateCcw className='size-3.5' />
            <span>{t('manager.ghostSeat.batchRevokeG3Btn')}</span>
          </button>
        </div>
      </div>

      {batchConfirmOpen && (
        <ManagerConfirmDialog
          cancelLabel={t('manager.ghostSeat.cancelBtn')}
          confirmLabel={t('manager.ghostSeat.batchRevokeG3Btn')}
          description={t('manager.ghostSeat.batchConfirmDesc', { count: flaggedG3Count })}
          onCancel={() => setBatchConfirmOpen(false)}
          onConfirm={handleBatchRevokeG3}
          title={t('manager.ghostSeat.batchConfirmTitle')}
          tone='danger'
        />
      )}

      {successMsg && (
        <div
          role='status'
          className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs font-medium text-success shadow-xs'
        >
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metric summary banner */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.totalFlagged')}
          </span>
          <p className='mt-2 text-2xl font-extrabold text-danger'>
            {ghostSeats.filter((g) => g.status === 'FLAGGED').length}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('manager.ghostSeat.totalFlaggedSub')}</p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.monthlyWaste')}
          </span>
          <p className='mt-2 text-2xl font-extrabold text-foreground'>{formatCurrency(totalWaste)}</p>
          <p className='mt-1 text-xs text-success font-medium'>{t('manager.ghostSeat.recoverableNotice')}</p>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.rulesBreakdown')}
          </span>
          <p className='mt-2 text-sm font-bold text-foreground'>
            {t('manager.ghostSeat.ruleG3Label', {
              count: ghostSeats.filter((g) => g.flagRule === 'G3').length
            })}
          </p>
          <p className='mt-0.5 text-sm font-bold text-foreground'>
            {t('manager.ghostSeat.ruleG4Label', {
              count: ghostSeats.filter((g) => g.flagRule === 'G4').length
            })}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        {/* Filter bar */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            {[
              { id: 'ALL' as const, label: t('manager.ghostSeat.filterAll') },
              { id: 'G3' as const, label: t('manager.ghostSeat.filterG3') },
              { id: 'G4' as const, label: t('manager.ghostSeat.filterG4') }
            ].map((opt) => (
              <button
                aria-pressed={ruleFilter === opt.id}
                key={opt.id}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  ruleFilter === opt.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                onClick={() => setRuleFilter(opt.id)}
                type='button'
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <caption className='sr-only'>{t('manager.ghostSeat.title')}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.ghostSeat.colEmployee')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.ghostSeat.colSoftware')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.ghostSeat.colRule')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.ghostSeat.colInactiveDays')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.ghostSeat.colWasteCost')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.ghostSeat.colStatus')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.ghostSeat.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.map((item) => (
                <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                  <td className='py-3.5 px-4'>
                    <p className='font-bold text-foreground'>{item.employeeName}</p>
                    <p className='text-[11px] text-muted-foreground'>{item.employeeJob}</p>
                  </td>

                  <td className='py-3.5 px-4'>
                    <div className='flex items-center gap-2'>
                      <ManagerIdentityMark className='size-8 rounded-lg' name={item.softwareName} />
                      <div>
                        <p className='font-bold text-foreground'>{item.softwareName}</p>
                        <p className='text-[10px] text-muted-foreground'>{item.plan}</p>
                      </div>
                    </div>
                  </td>

                  <td className='py-3.5 px-4'>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                        item.flagRule === 'G3' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {item.flagRule}
                    </span>
                  </td>

                  <td className='py-3.5 px-4 text-center font-mono font-bold text-danger'>
                    {t('manager.ghostSeat.inactiveDaysCount', { count: item.inactiveDays })}
                  </td>

                  <td className='py-3.5 px-4 text-right font-bold text-foreground'>
                    {formatCurrency(item.monthlyCost)}
                  </td>

                  <td className='py-3.5 px-4 text-center'>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        item.status === 'FLAGGED'
                          ? 'bg-warning/10 text-warning'
                          : item.status === 'REVOKED'
                            ? 'bg-danger/10 text-danger'
                            : 'bg-success/10 text-success'
                      }`}
                    >
                      {item.status === 'FLAGGED'
                        ? t('manager.ghostSeat.statusFlagged')
                        : item.status === 'REVOKED'
                          ? t('manager.ghostSeat.statusRevoked')
                          : t('manager.ghostSeat.statusKept')}
                    </span>
                  </td>

                  <td className='py-3.5 px-4 text-right'>
                    <button
                      className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-surface-subtle shadow-xs'
                      onClick={() => onSelectTab('ghost-seat-detail', { id: item.id })}
                      type='button'
                    >
                      {t('manager.ghostSeat.actHandle')}
                    </button>
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
