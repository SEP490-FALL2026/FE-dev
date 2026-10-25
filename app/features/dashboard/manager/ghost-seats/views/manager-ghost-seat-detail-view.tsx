import { AppWindow, ArrowLeft, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MOCK_GHOST_SEATS } from '../../manager-data'
import type { ManagerTabKey } from '../../manager-nav'

interface Props {
  formatCurrency: (value: number) => string
  ghostId?: string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerGhostSeatDetailView({ formatCurrency, ghostId = 'ghost-01', onSelectTab }: Props) {
  const { t, i18n } = useTranslation('dashboard')
  const seat = MOCK_GHOST_SEATS.find((item) => item.id === ghostId)

  if (!seat) {
    return (
      <div className='space-y-4'>
        <h1 className='text-2xl font-bold'>{t('manager.ghostDetail.notFound')}</h1>
        <button
          className='rounded-xl border border-border px-4 py-2'
          onClick={() => onSelectTab('ghost-seat-review')}
          type='button'
        >
          {t('manager.ghostDetail.backToList')}
        </button>
      </div>
    )
  }

  const activity = t(seat.inactiveDays >= 90 ? 'manager.ghostSeat.activityNever' : 'manager.ghostSeat.activityInactive')

  return (
    <div className='max-w-4xl space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          aria-label={t('manager.ghostDetail.backToList')}
          className='rounded-xl border border-border p-2 text-muted-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('ghost-seat-review')}
          type='button'
        >
          <ArrowLeft className='size-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-foreground sm:text-3xl'>{t('manager.ghostDetail.title')}</h1>
          <p className='text-sm text-muted-foreground'>{t('manager.ghostDetail.subtitle')}</p>
        </div>
      </div>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'>
        <section
          className='space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm'
          aria-labelledby='ghost-tool-heading'
        >
          <div className='flex items-center gap-3 border-b border-border pb-4'>
            <AppWindow
              aria-hidden='true'
              className='size-12 rounded-xl border border-primary/20 bg-primary-soft/60 p-3 text-primary'
            />
            <div>
              <h2 className='font-bold text-foreground' id='ghost-tool-heading'>
                {seat.softwareName}
              </h2>
              <p className='text-sm text-muted-foreground'>{seat.plan}</p>
            </div>
          </div>
          <dl className='grid gap-4 sm:grid-cols-2'>
            <div className='rounded-xl bg-surface-subtle p-4'>
              <dt className='text-sm text-muted-foreground'>{t('manager.ghostDetail.labelEmployee')}</dt>
              <dd className='mt-1 font-semibold text-foreground'>{seat.employeeName}</dd>
              <dd className='text-sm text-muted-foreground'>{seat.employeeJob}</dd>
            </div>
            <div className='rounded-xl bg-surface-subtle p-4'>
              <dt className='text-sm text-muted-foreground'>{t('manager.ghostDetail.labelCostCenter')}</dt>
              <dd className='mt-1 font-semibold text-foreground'>{seat.costCenter}</dd>
              <dd className='text-sm text-muted-foreground'>{seat.employeeEmail}</dd>
            </div>
            <div className='rounded-xl bg-surface-subtle p-4'>
              <dt className='text-sm text-muted-foreground'>{t('manager.ghostDetail.labelActivity')}</dt>
              <dd className='mt-1 font-semibold text-foreground'>{activity}</dd>
              <dd className='text-sm text-muted-foreground'>
                {t('manager.ghostDetail.inactiveDaysCount', { count: seat.inactiveDays })}
              </dd>
            </div>
            <div className='rounded-xl bg-surface-subtle p-4'>
              <dt className='text-sm text-muted-foreground'>{t('manager.ghostDetail.labelAssignedDate')}</dt>
              <dd className='mt-1 font-semibold text-foreground'>
                {new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'vi-VN').format(
                  new Date(`${seat.assignedDate}T00:00:00`)
                )}
              </dd>
            </div>
          </dl>
          <p className='text-sm text-muted-foreground'>{t('manager.ghostDetail.usageCaveat')}</p>
        </section>
        <aside className='h-fit space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <h2 className='font-bold text-foreground'>{t('manager.ghostDetail.requestCardTitle')}</h2>
          <p className='text-sm text-muted-foreground'>{t('manager.ghostDetail.requestCardSub')}</p>
          <div className='border-t border-border pt-4'>
            <p className='text-sm text-muted-foreground'>{t('manager.ghostDetail.labelMonthlyWaste')}</p>
            <p className='mt-1 text-xl font-bold text-foreground'>{formatCurrency(seat.monthlyCost)}</p>
          </div>
          <button
            className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60'
            disabled
            type='button'
          >
            <Send className='size-4' />
            {t('manager.ghostDetail.sendRequest')}
          </button>
          <p className='text-xs text-muted-foreground'>{t('manager.ghostDetail.requestUnavailable')}</p>
        </aside>
      </div>
    </div>
  )
}
