import { CalendarDays, Database, FileText, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GhostSeat } from '~/entities/license/ghost-seats-demo'
import { figmaDetail } from '../ghost-seat-detail-demo'

export function SeatFacts({ seat, detailed }: { seat: GhostSeat; detailed: boolean }) {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const money = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' })
  const missing = t('ghostDetail.notProvided')
  const facts = [
    {
      key: 'lastActivity',
      value: t('ghostDetail.activityValue', {
        date: date.format(new Date(`${seat.lastActivity}T00:00:00Z`)),
        count: seat.inactiveDays
      }),
      icon: CalendarDays
    },
    { key: 'definition', value: detailed ? t('ghostDetail.meaningful') : missing, icon: FileText },
    {
      key: 'source',
      value: detailed ? t('ghostDetail.integration', { source: figmaDetail.source }) : missing,
      icon: Database
    },
    { key: 'identity', value: detailed ? t('ghostDetail.exactMatch') : missing, icon: ShieldCheck },
    {
      key: 'coverage',
      value: detailed ? t('ghostSeat.days', { count: figmaDetail.coverage }) : missing,
      icon: Database
    },
    { key: 'savings', value: detailed ? money.format(figmaDetail.savings) : missing, icon: ShieldCheck },
    {
      key: 'confidence',
      value: new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent' }).format(seat.confidence),
      icon: ShieldCheck
    }
  ] as const
  return (
    <section
      aria-label={t('ghostDetail.details')}
      className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'
    >
      <h2 className='mb-5 flex items-center gap-2 text-sm font-bold'>
        <FileText size={17} aria-hidden='true' className='text-brand-600' />
        {t('ghostDetail.details')}
      </h2>
      <dl className='grid gap-x-8 gap-y-5 sm:grid-cols-2'>
        {facts.map(({ key, value, icon: Icon }) => (
          <div key={key} className='flex items-start gap-3'>
            <Icon size={17} aria-hidden='true' className='mt-0.5 shrink-0 text-neutral-500' />
            <div>
              <dt className='text-xs text-neutral-500'>{t(`ghostDetail.facts.${key}`)}</dt>
              <dd
                className={`mt-1 text-xs font-semibold ${key === 'savings' ? 'text-brand-600' : key === 'confidence' ? 'text-success' : ''}`}
              >
                {value}
              </dd>
              {key === 'definition' && detailed && (
                <p className='mt-2 text-xs leading-relaxed text-neutral-500'>{t('ghostDetail.definitionHint')}</p>
              )}
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
