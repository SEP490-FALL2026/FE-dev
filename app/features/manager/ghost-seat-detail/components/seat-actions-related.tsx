import { CalendarDays, CircleCheck, Link2, RotateCcw, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { figmaDetail } from '../ghost-seat-detail-demo'

export function SeatRelated({ detailed, onRequests }: { detailed: boolean; onRequests?: () => void }) {
  const { t } = useTranslation()
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-4 flex items-center gap-2 text-sm font-bold'>
        <Link2 size={17} aria-hidden='true' className='text-brand-600' />
        {t('ghostDetail.relatedTitle')}
      </h2>
      <div className='divide-y divide-neutral-200 text-xs'>
        <div className='flex items-center justify-between gap-2 py-3'>
          <span className='text-neutral-500'>{t('ghostDetail.appDetails')}</span>
          <button
            type='button'
            disabled
            title={t('manager.unavailable')}
            className='font-semibold text-brand-600 disabled:cursor-not-allowed'
          >
            {t('ghostSeat.view')}
          </button>
        </div>
        <div className='flex items-center justify-between gap-2 py-3'>
          <div>
            <p className='text-neutral-500'>{t('ghostDetail.assignedBy')}</p>
            <p className='mt-1 font-medium'>{detailed ? t('ghostDetail.hrSystem') : t('ghostDetail.notProvided')}</p>
          </div>
          <button
            type='button'
            disabled
            title={t('manager.unavailable')}
            className='font-semibold text-brand-600 disabled:cursor-not-allowed'
          >
            {t('ghostSeat.view')}
          </button>
        </div>
        <div className='flex items-center justify-between gap-2 py-3'>
          <div>
            <p className='text-neutral-500'>{t('ghostDetail.tabs.requests')}</p>
            <p className='mt-1 font-medium'>{detailed ? figmaDetail.relatedRequest : t('ghostDetail.notProvided')}</p>
          </div>
          {onRequests && (
            <button type='button' onClick={onRequests} className='font-semibold text-brand-600 hover:underline'>
              {t('ghostSeat.view')}
            </button>
          )}
        </div>
      </div>
      {detailed && <p className='mt-3 text-xs leading-relaxed text-neutral-500'>{t('ghostDetail.requestMismatch')}</p>}
    </section>
  )
}

export function SeatActions() {
  const { t } = useTranslation()
  const actions = [
    { key: 'reclaim', icon: RotateCcw },
    { key: 'keep', icon: CircleCheck },
    { key: 'exempt', icon: CalendarDays }
  ] as const
  return (
    <section id='ghost-seat-actions' className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-4 flex items-center gap-2 text-sm font-bold'>
        <Zap size={17} aria-hidden='true' className='text-brand-600' />
        {t('ghostSeat.columns.actions')}
      </h2>
      <div className='space-y-3'>
        {actions.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type='button'
            disabled
            title={t('ghostSeat.actionsUnavailable')}
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-xs font-semibold disabled:cursor-not-allowed ${key === 'reclaim' ? 'border-brand-500 bg-brand-500 text-white' : 'border-neutral-200 text-neutral-900'}`}
          >
            <Icon size={17} aria-hidden='true' />
            {t(`ghostDetail.actions.${key}`)}
          </button>
        ))}
      </div>
      <p className='mt-4 text-xs leading-relaxed text-neutral-500'>{t('ghostSeat.actionsUnavailable')}</p>
    </section>
  )
}

export function SeatRecommendation({
  recommendation,
  detailed
}: {
  recommendation: 'reclaim' | 'keep' | 'exempt'
  detailed: boolean
}) {
  const { t } = useTranslation()
  return (
    <section className='rounded-xl border border-neutral-200 bg-brand-bg p-5'>
      <h2 className='mb-3 text-sm font-bold'>{t('ghostSeat.columns.recommendation')}</h2>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3'>
        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-3'>
          <span
            className={`rounded-md px-3 py-1 text-xs font-bold ${recommendation === 'reclaim' ? 'bg-danger/10 text-danger' : 'bg-brand-100 text-brand-600'}`}
          >
            {t(`ghostSeat.recommendations.${recommendation}`)}
          </span>
          <p className='text-xs text-neutral-500'>
            {detailed ? t(`ghostDetail.recommendation.${recommendation}`) : t('ghostDetail.noReason')}
          </p>
        </div>
        <button
          type='button'
          disabled
          title={t('ghostSeat.actionsUnavailable')}
          className='rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed'
        >
          {t('ghostDetail.takeAction')}
        </button>
      </div>
      {detailed && (
        <p className='mt-2 text-[11px] text-neutral-500'>{t('ghostDetail.rule', { rule: figmaDetail.rule })}</p>
      )}
    </section>
  )
}
