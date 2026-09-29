import { Clock, Info, LockKeyhole, RefreshCw, ShieldCheck, ThumbsDown, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const metrics = [
  { key: 'catalog', icon: ShieldCheck, value: 0.87, target: 0.8, change: 0.07, percent: true, up: true },
  { key: 'processing', icon: Clock, value: 2.4, target: 4, change: 0.35, percent: false, up: false },
  { key: 'active', icon: UserRound, value: 0.82, target: 0.75, change: 0.06, percent: true, up: true },
  { key: 'renewals', icon: RefreshCw, value: 2, target: 5, change: 0.6, percent: false, up: false },
  { key: 'rejection', icon: ThumbsDown, value: 0.12, target: 0.15, change: 0.04, percent: true, up: false }
] as const

export function MetricCards() {
  const { t, i18n } = useTranslation()
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {metrics.map(({ key, icon: Icon, value, target, change, percent: isPercent, up }) => {
        const format = (n: number) =>
          isPercent
            ? percent.format(n)
            : key === 'processing'
              ? t('manager.hours', { value: number.format(n) })
              : number.format(n)
        return (
          <section
            key={key}
            className='flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs'
          >
            <div className='flex items-start justify-between'>
              <span
                className={`flex size-9 items-center justify-center rounded-xl text-brand-600 ${up || key === 'rejection' ? 'bg-brand-100' : 'border border-neutral-200 bg-brand-bg'}`}
              >
                <Icon size={20} aria-hidden='true' />
              </span>
              <span title={t(`manager.metrics.${key}Tip`)}>
                <Info size={14} className='text-neutral-500' aria-label={t(`manager.metrics.${key}Tip`)} />
              </span>
            </div>
            <div className='mt-3'>
              <h2 className='text-xs font-medium text-neutral-500'>{t(`manager.metrics.${key}`)}</h2>
              <p className='mt-1 text-2xl font-bold tabular-nums'>{format(value)}</p>
              <p className='mt-0.5 text-[11px] text-neutral-500'>
                {t('manager.target', { operator: up ? '≥' : '≤', value: format(target) })}
              </p>
            </div>
            <div className='mt-3 flex flex-wrap items-center justify-between gap-1 text-xs'>
              <p>
                <span className='font-semibold text-success'>
                  {up ? '↑' : '↓'} {percent.format(change)}
                </span>{' '}
                <span className='text-neutral-500'>{t('manager.previousMonth')}</span>
              </p>
              {key === 'rejection' && (
                <span title={t('manager.adminOnly')} className='flex items-center gap-1 text-[10px] text-neutral-500'>
                  <LockKeyhole size={12} aria-hidden='true' />
                  {t('manager.admin')}
                </span>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
