import { UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GhostSeatLogo } from '~/entities/license/ghost-seat-logo'
import type { GhostSeat } from '~/entities/license/ghost-seats-demo'
import { figmaDetail } from '../ghost-seat-detail-demo'

export function SeatSummary({ seat, detailed }: { seat: GhostSeat; detailed: boolean }) {
  const { t, i18n } = useTranslation()
  const money = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' })
  return (
    <section
      aria-label={t('ghostDetail.summary')}
      className='flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm 2xl:flex-row 2xl:items-center 2xl:justify-between'
    >
      <div className='flex items-start gap-4'>
        <GhostSeatLogo seat={seat} large />
        <div>
          <h2 className='font-bold'>{seat.application}</h2>
          {detailed && (
            <p className='mt-1 max-w-60 text-xs leading-relaxed text-neutral-500'>{t('ghostDetail.appDescription')}</p>
          )}
          <span className='mt-2 inline-block rounded-md border border-neutral-200 bg-brand-bg px-2 py-1 text-xs text-neutral-500'>
            {t(`ghostSeat.categories.${seat.category}`)}
          </span>
        </div>
      </div>
      <div className='flex gap-3 border-t border-neutral-200 pt-4 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-6'>
        <UserRound size={20} aria-hidden='true' className='text-neutral-500' />
        <div>
          <p className='text-xs text-neutral-500'>{t('ghostSeat.columns.employee')}</p>
          <p className='mt-1 text-sm font-bold'>{seat.employee}</p>
          <p className='text-xs text-neutral-500'>{seat.email}</p>
          <p className='mt-3 text-xs'>
            <span className='text-neutral-500'>{t('ghostDetail.department')}</span>{' '}
            {detailed ? figmaDetail.department : t('ghostDetail.notProvided')}
          </p>
          <p className='mt-1 text-xs'>
            <span className='text-neutral-500'>{t('ghostDetail.costCenter')}</span>{' '}
            {detailed ? figmaDetail.costCenter : t('ghostDetail.notProvided')}
          </p>
        </div>
      </div>
      <dl className='border-t border-neutral-200 pt-4 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-6'>
        <dt className='text-xs text-neutral-500'>{t('ghostDetail.plan')}</dt>
        <dd className='mt-1 text-sm font-bold'>{detailed ? figmaDetail.plan : t('ghostDetail.notProvided')}</dd>
        <dt className='mt-3 text-xs text-neutral-500'>{t('ghostDetail.monthlyCost')}</dt>
        <dd className='mt-1 text-sm font-bold text-brand-600'>
          {detailed
            ? t('ghostDetail.perMonth', { value: money.format(figmaDetail.monthlyCost) })
            : t('ghostDetail.notProvided')}
        </dd>
      </dl>
    </section>
  )
}
