import {
  Boxes,
  ChevronRight,
  CircleDollarSign,
  Lightbulb,
  PackageCheck,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  WalletCards,
  type LucideIcon,
  BellRing
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CategoryChart, CostChart } from '../dashboard-charts'
import { alerts, categoryCosts, recentSoftware, topSoftware } from '../dashboard-data'

const alertIcons: Record<(typeof alerts)[number]['key'], LucideIcon> = {
  expiring: ShieldAlert,
  inactive: BellRing,
  overLimit: CircleDollarSign,
  unclassified: Boxes
}

const alertToneClasses: Record<(typeof alerts)[number]['tone'], string> = {
  danger: 'bg-danger/12 text-danger',
  info: 'bg-info/12 text-info',
  warning: 'bg-warning/15 text-warning'
}

export function DashboardCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>{children}</div>
}

export interface DefaultDashboardViewProps {
  displayName: string
  formatCompact: (value: number) => string
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
  formatMonth: (value: string) => string
  formatNumber: (value: number) => string
}

export function DefaultDashboardView({
  displayName,
  formatCompact,
  formatCurrency,
  formatDate,
  formatMonth,
  formatNumber
}: DefaultDashboardViewProps) {
  const { t } = useTranslation('dashboard')

  const metricCards = [
    {
      icon: Boxes,
      key: 'software',
      trendDown: false,
      value: formatNumber(128)
    },
    {
      icon: PackageCheck,
      key: 'licenses',
      trendDown: false,
      value: formatNumber(1_245)
    },
    {
      icon: CircleDollarSign,
      key: 'cost',
      trendDown: true,
      value: formatCurrency(1_245_800_000)
    },
    {
      icon: WalletCards,
      key: 'savings',
      trendDown: false,
      value: formatCurrency(245_800_000)
    }
  ] as const

  return (
    <>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-semibold text-primary'>{t('header.greeting', { name: displayName })}</p>
          <h1 className='mt-1 text-3xl font-bold tracking-[-0.035em]'>{t('header.title')}</h1>
          <p className='mt-2 text-sm text-muted-foreground'>{t('header.subtitle')}</p>
        </div>
        <span className='rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary'>
          {t('demoNotice')}
        </span>
      </div>

      <section aria-label={t('metrics.regionLabel')} className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {metricCards.map(({ icon: Icon, key, trendDown, value }) => {
          const TrendIcon = trendDown ? TrendingDown : TrendingUp

          return (
            <DashboardCard key={key}>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-muted-foreground'>{t(`metrics.${key}.title`)}</p>
                  <p className='mt-3 truncate text-2xl font-bold tracking-[-0.03em] text-primary'>{value}</p>
                </div>
                <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary'>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
              </div>
              <p className='mt-4 flex items-center gap-1.5 text-xs text-muted-foreground'>
                <TrendIcon aria-hidden='true' className='size-3.5 text-success' />
                {t(`metrics.${key}.trend`)}
              </p>
            </DashboardCard>
          )
        })}
      </section>

      <div className='mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,0.8fr)]'>
        <section aria-label={t('charts.costTitle')}>
          <DashboardCard className='h-full'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h2 className='text-base font-bold'>{t('charts.costTitle')}</h2>
              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                <span className='flex items-center gap-2'>
                  <span className='h-0.5 w-5 rounded bg-primary' />
                  {t('charts.actual')}
                </span>
                <span className='flex items-center gap-2'>
                  <span className='w-5 border-t-2 border-dashed border-info' />
                  {t('charts.forecast')}
                </span>
              </div>
            </div>
            <CostChart
              actualLabel={t('charts.actual')}
              forecastLabel={t('charts.forecast')}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              formatMonth={formatMonth}
              label={t('charts.costTitle')}
            />
          </DashboardCard>
        </section>

        <DashboardCard>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-base font-bold'>{t('alerts.title')}</h2>
            <button className='text-xs font-bold text-primary hover:underline' type='button'>
              {t('alerts.viewAll')}
            </button>
          </div>
          <ul className='mt-4 divide-y divide-border'>
            {alerts.map((alert) => {
              const Icon = alertIcons[alert.key]

              return (
                <li className='flex items-center gap-3 py-3' key={alert.key}>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${alertToneClasses[alert.tone]}`}
                  >
                    <Icon aria-hidden='true' className='size-[1.125rem]' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold'>{t(`alerts.${alert.key}.title`)}</p>
                    <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                      {t(`alerts.${alert.key}.description`)}
                    </p>
                  </div>
                  <span className='text-lg font-bold text-primary'>{String(alert.count).padStart(2, '0')}</span>
                  <ChevronRight aria-hidden='true' className='size-4 text-muted-foreground' />
                </li>
              )
            })}
          </ul>
        </DashboardCard>
      </div>

      <div className='mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        <section aria-label={t('charts.categoryTitle')}>
          <DashboardCard className='h-full'>
            <h2 className='text-base font-bold'>{t('charts.categoryTitle')}</h2>
            <div className='grid items-center gap-2 sm:grid-cols-[0.9fr_1.1fr]'>
              <CategoryChart label={t('charts.categoryTitle')} />
              <ul className='space-y-2'>
                {categoryCosts.map((category) => (
                  <li className='flex items-center gap-2 text-xs' key={category.key}>
                    <span className='size-2.5 shrink-0 rounded-full' style={{ backgroundColor: category.color }} />
                    <span className='min-w-0 flex-1 truncate text-muted-foreground'>
                      {t(`categories.${category.key}`)}
                    </span>
                    <span className='font-semibold'>{formatCurrency(category.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DashboardCard>
        </section>

        <DashboardCard>
          <h2 className='text-base font-bold'>{t('lists.topSoftware')}</h2>
          <ol className='mt-4 space-y-3'>
            {topSoftware.map((software, index) => (
              <li className='flex items-center gap-3' key={software.name}>
                <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary'>
                  {index + 1}
                </span>
                <span className='min-w-0 flex-1 truncate text-sm font-semibold'>{software.name}</span>
                <span className='text-xs font-semibold text-muted-foreground'>{formatCurrency(software.cost)}</span>
              </li>
            ))}
          </ol>
        </DashboardCard>

        <DashboardCard className='lg:col-span-2 xl:col-span-1'>
          <h2 className='text-base font-bold'>{t('lists.recentSoftware')}</h2>
          <ul className='mt-4 space-y-3'>
            {recentSoftware.map((software) => (
              <li className='flex items-center gap-3' key={software.name}>
                <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-surface-subtle text-sm font-black text-primary'>
                  {software.name.charAt(0)}
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-sm font-semibold'>{software.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {t('lists.licenseCount', { count: software.seats })}
                  </span>
                </span>
                <span className='text-xs text-muted-foreground'>{formatDate(software.addedAt)}</span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      <div className='mt-4 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-soft/60 p-5 sm:flex-row sm:items-center'>
        <span className='grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground'>
          <Lightbulb aria-hidden='true' className='size-5' />
        </span>
        <div className='min-w-0 flex-1'>
          <h2 className='font-bold'>{t('optimization.title')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>{t('optimization.description')}</p>
          <p className='mt-1 text-sm font-semibold text-primary'>
            {t('optimization.savings', { amount: formatCurrency(245_800_000) })}
          </p>
        </div>
        <button
          className='inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-surface px-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground'
          type='button'
        >
          {t('optimization.action')}
        </button>
      </div>
    </>
  )
}
