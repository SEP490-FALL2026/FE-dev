import { CircleCheck, Clock, Ghost, Laptop, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TeamSummary() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const items = [
    {
      key: 'members',
      value: 18,
      icon: UsersRound,
      footer: t('managerTeam.memberSummary', { active: number.format(12), inactive: number.format(6) }),
      color: 'bg-brand-100 text-brand-500'
    },
    {
      key: 'totalLicenses',
      value: 31,
      icon: Laptop,
      footer: t('managerTeam.acrossSoftware', { count: 8 }),
      color: 'bg-brand-100 text-brand-600'
    },
    {
      key: 'activeLicenses',
      value: 28,
      icon: CircleCheck,
      footer: t('managerTeam.licenseRatio', {
        percentage: new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 }).format(
          28 / 31
        )
      }),
      color: 'bg-success-bg text-success'
    },
    {
      key: 'pendingRequests',
      value: 4,
      icon: Clock,
      footer: t('managerTeam.awaitingApproval'),
      color: 'bg-brand-100 text-brand-500'
    },
    {
      key: 'ghostSeats',
      value: 3,
      icon: Ghost,
      footer: t('managerTeam.needsReview'),
      color: 'bg-brand-100 text-danger'
    }
  ] as const
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
      {items.map(({ key, value, icon: Icon, footer, color }) => (
        <section
          key={key}
          className='flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs'
        >
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${color}`}>
            <Icon size={20} aria-hidden='true' />
          </span>
          <div>
            <h2 className='mb-1 text-sm text-neutral-500'>{t(`managerTeam.${key}`)}</h2>
            <p className='mb-1 text-2xl font-bold tabular-nums'>{number.format(value)}</p>
            <p className={`text-xs ${key === 'ghostSeats' ? 'font-medium text-danger' : 'text-neutral-500'}`}>
              {footer}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}
