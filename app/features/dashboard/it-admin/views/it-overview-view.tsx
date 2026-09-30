import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Laptop,
  PackageCheck,
  Scale,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  UserMinus,
  UserX,
  WalletCards
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { CategoryChart, CostChart } from '../../dashboard-charts'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItOverviewViewProps = {
  formatCompact: (value: number) => string
  formatCurrency: (value: number) => string
  formatMonth: (value: string) => string
  formatNumber: (value: number) => string
  onSelectTab: (tab: ItAdminTabKey) => void
}

export function ItOverviewView({
  formatCompact,
  formatCurrency,
  formatMonth,
  formatNumber,
  onSelectTab
}: ItOverviewViewProps) {
  const { t } = useTranslation('dashboard')

  const metricCards = [
    {
      icon: Boxes,
      key: 'software',
      title: t('metrics.software.title'),
      trend: t('metrics.software.trend'),
      trendDown: false,
      value: formatNumber(128)
    },
    {
      icon: PackageCheck,
      key: 'licenses',
      title: t('metrics.licenses.title'),
      trend: t('metrics.licenses.trend'),
      trendDown: false,
      value: formatNumber(1_245)
    },
    {
      icon: CircleDollarSign,
      key: 'cost',
      title: t('metrics.cost.title'),
      trend: t('metrics.cost.trend'),
      trendDown: true,
      value: formatCurrency(1_245_800_000)
    },
    {
      icon: WalletCards,
      key: 'savings',
      title: t('metrics.savings.title'),
      trend: t('metrics.savings.trend'),
      trendDown: false,
      value: formatCurrency(245_800_000)
    }
  ] as const

  const quickQueues: {
    count: number
    desc: string
    icon: typeof PackageCheck
    key: ItAdminTabKey
    title: string
    tone: 'danger' | 'warning' | 'info' | 'primary'
  }[] = [
    {
      count: 3,
      desc: t('itAdmin.provisioning.subtitle'),
      icon: PackageCheck,
      key: 'provisioning',
      title: t('itAdmin.nav.provisioning'),
      tone: 'danger'
    },
    {
      count: 146,
      desc: t('itAdmin.unmatchedIdentities.subtitle'),
      icon: UserX,
      key: 'unmatched-identities',
      title: t('itAdmin.nav.unmatchedIdentities'),
      tone: 'warning'
    },
    {
      count: 3,
      desc: t('itAdmin.usageImport.subtitle'),
      icon: UploadCloud,
      key: 'usage-import',
      title: t('itAdmin.nav.usageImport'),
      tone: 'info'
    },
    {
      count: 38,
      desc: t('itAdmin.licenseOptimization.subtitle'),
      icon: Sparkles,
      key: 'license-optimization',
      title: t('itAdmin.nav.licenseOptimization'),
      tone: 'primary'
    },
    {
      count: 1,
      desc: t('itAdmin.offboarding.subtitle'),
      icon: UserMinus,
      key: 'offboarding',
      title: t('itAdmin.nav.offboarding'),
      tone: 'warning'
    },
    {
      count: 6,
      desc: t('itAdmin.shadowIt.subtitle'),
      icon: ShieldAlert,
      key: 'shadow-it',
      title: t('itAdmin.nav.shadowIt'),
      tone: 'danger'
    },
    {
      count: 4,
      desc: t('itAdmin.reconciliation.subtitle'),
      icon: Scale,
      key: 'reconciliation',
      title: t('itAdmin.nav.reconciliation'),
      tone: 'info'
    },
    {
      count: 24,
      desc: t('itAdmin.deviceCollectors.subtitle'),
      icon: Laptop,
      key: 'device-collectors',
      title: t('itAdmin.nav.deviceCollectors'),
      tone: 'primary'
    }
  ]

  const toneClasses = {
    danger: 'bg-danger/10 text-danger border-danger/25',
    info: 'bg-info/10 text-info border-info/25',
    primary: 'bg-primary-soft text-primary border-primary/25',
    warning: 'bg-warning/15 text-warning border-warning/30'
  }

  return (
    <div className='space-y-8'>
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          {t('itAdmin.overview.badge')}
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight sm:text-3xl'>{t('navigation.overview')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.overview.subtitle')}</p>
      </div>

      <section aria-label={t('metrics.regionLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {metricCards.map((card) => {
          const Icon = card.icon

          return (
            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm' key={card.key}>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-muted-foreground'>{card.title}</span>
                <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
                  <Icon aria-hidden='true' className='size-4' />
                </span>
              </div>
              <p className='mt-4 text-2xl font-bold tracking-tight'>{card.value}</p>
              <p className='mt-1 text-xs text-muted-foreground'>{card.trend}</p>
            </div>
          )
        })}
      </section>

      <div className='grid gap-6 xl:grid-cols-[1.55fr_1fr]'>
        <section
          aria-label={t('charts.costTitle')}
          className='rounded-2xl border border-border bg-surface p-6 shadow-sm'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-base font-bold'>{t('charts.costTitle')}</h2>
              <p className='mt-0.5 text-xs text-muted-foreground'>{t('charts.totalCost')}</p>
            </div>
          </div>
          <div className='mt-4'>
            <CostChart
              actualLabel={t('charts.actual')}
              forecastLabel={t('charts.forecast')}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              formatMonth={formatMonth}
              label={t('charts.costTitle')}
            />
          </div>
        </section>

        <section
          aria-label={t('charts.categoryTitle')}
          className='rounded-2xl border border-border bg-surface p-6 shadow-sm'
        >
          <h2 className='text-base font-bold'>{t('charts.categoryTitle')}</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>{t('charts.totalCost')}</p>
          <div className='mt-4'>
            <CategoryChart label={t('charts.categoryTitle')} />
          </div>
        </section>
      </div>

      <section className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div>
          <h2 className='text-lg font-bold'>{t('itAdmin.overview.quickActionsTitle')}</h2>
          <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.overview.quickActionsDesc')}</p>
        </div>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {quickQueues.map((item) => {
            const Icon = item.icon

            return (
              <div
                className='flex flex-col justify-between rounded-xl border border-border bg-background/60 p-4 transition hover:border-primary/50'
                key={item.key}
              >
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='grid size-9 place-items-center rounded-lg bg-surface border border-border text-foreground'>
                      <Icon aria-hidden='true' className='size-4' />
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${toneClasses[item.tone]}`}
                    >
                      {item.count}
                    </span>
                  </div>
                  <h3 className='mt-3 text-sm font-bold text-foreground'>{item.title}</h3>
                  <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>{item.desc}</p>
                </div>

                <button
                  className='mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline'
                  onClick={() => onSelectTab(item.key)}
                  type='button'
                >
                  <span>{t('itAdmin.overview.viewQueue')}</span>
                  <ArrowRight aria-hidden='true' className='size-3' />
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
