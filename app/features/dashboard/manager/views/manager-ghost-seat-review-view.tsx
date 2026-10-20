import { AppWindow } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_GHOST_SEATS } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'

interface Props {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerGhostSeatReviewView({ formatCurrency, onSelectTab }: Props) {
  const { t } = useTranslation('dashboard')
  const [filter, setFilter] = useState<'ALL' | 'LONG' | 'RECENT'>('ALL')
  const seats = MOCK_GHOST_SEATS.filter((seat) =>
    filter === 'ALL' ? true : filter === 'LONG' ? seat.inactiveDays >= 90 : seat.inactiveDays < 90
  )
  const activityLabel = (days: number) =>
    t(days >= 90 ? 'manager.ghostSeat.activityNever' : 'manager.ghostSeat.activityInactive')

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('manager.ghostSeat.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('manager.ghostSeat.subtitle')}</p>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.totalFlagged')}
          </p>
          <p className='mt-2 text-2xl font-extrabold text-foreground'>{MOCK_GHOST_SEATS.length}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('manager.ghostSeat.totalFlaggedSub')}</p>
        </div>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.monthlyWaste')}
          </p>
          <p className='mt-2 text-2xl font-extrabold text-foreground'>
            {formatCurrency(MOCK_GHOST_SEATS.reduce((sum, seat) => sum + seat.monthlyCost, 0))}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('manager.ghostSeat.recoverableNotice')}</p>
        </div>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('manager.ghostSeat.rulesBreakdown')}
          </p>
          <p className='mt-2 text-sm font-semibold text-foreground'>
            {t('manager.ghostSeat.ruleG3Label', {
              count: MOCK_GHOST_SEATS.filter((seat) => seat.inactiveDays >= 90).length
            })}
          </p>
          <p className='mt-1 text-sm font-semibold text-foreground'>
            {t('manager.ghostSeat.ruleG4Label', {
              count: MOCK_GHOST_SEATS.filter((seat) => seat.inactiveDays < 90).length
            })}
          </p>
        </div>
      </div>
      <div className='space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-sm'>
        <div aria-label={t('manager.ghostSeat.filterLabel')} className='flex flex-wrap gap-2' role='group'>
          {(['ALL', 'LONG', 'RECENT'] as const).map((value) => (
            <button
              aria-pressed={filter === value}
              className={`rounded-xl px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === value ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-surface-subtle hover:text-foreground'}`}
              key={value}
              onClick={() => setFilter(value)}
              type='button'
            >
              {t(
                value === 'ALL'
                  ? 'manager.ghostSeat.filterAll'
                  : value === 'LONG'
                    ? 'manager.ghostSeat.filterG3'
                    : 'manager.ghostSeat.filterG4'
              )}
            </button>
          ))}
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[850px] text-left text-sm'>
            <caption className='sr-only'>{t('manager.ghostSeat.title')}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='px-4 py-3 font-semibold'>{t('manager.ghostSeat.colEmployee')}</th>
                <th className='px-4 py-3 font-semibold'>{t('manager.ghostSeat.colSoftware')}</th>
                <th className='px-4 py-3 font-semibold'>{t('manager.ghostSeat.colRule')}</th>
                <th className='px-4 py-3 text-center font-semibold'>{t('manager.ghostSeat.colInactiveDays')}</th>
                <th className='px-4 py-3 text-right font-semibold'>{t('manager.ghostSeat.colWasteCost')}</th>
                <th className='px-4 py-3 text-right font-semibold'>{t('manager.ghostSeat.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {seats.map((seat) => (
                <tr className='hover:bg-surface-subtle/50' key={seat.id}>
                  <td className='px-4 py-4'>
                    <p className='font-semibold text-foreground'>{seat.employeeName}</p>
                    <p className='text-xs text-muted-foreground'>{seat.employeeJob}</p>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-2'>
                      <AppWindow
                        aria-hidden='true'
                        className='size-9 rounded-lg border border-primary/20 bg-primary-soft/60 p-2 text-primary'
                      />
                      <div>
                        <p className='font-semibold text-foreground'>{seat.softwareName}</p>
                        <p className='text-xs text-muted-foreground'>{seat.plan}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-foreground'>{activityLabel(seat.inactiveDays)}</td>
                  <td className='px-4 py-4 text-center font-semibold text-foreground'>
                    {t('manager.ghostSeat.inactiveDaysCount', { count: seat.inactiveDays })}
                  </td>
                  <td className='px-4 py-4 text-right font-semibold text-foreground'>
                    {formatCurrency(seat.monthlyCost)}
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <button
                      className='rounded-lg border border-border px-3 py-2 font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      onClick={() => onSelectTab('ghost-seat-detail', { id: seat.id })}
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
