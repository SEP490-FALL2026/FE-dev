import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Eye,
  FileSpreadsheet,
  FileText,
  Key,
  Laptop,
  Layers,
  PackageCheck,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  UserCheck,
  UserMinus,
  Users,
  UserX,
  WalletCards,
  WifiOff
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryChart, CostChart } from '../../../dashboard-charts'
import {
  initialItDepartments,
  initialItProvisioningItems,
  initialItReconciliationRows,
  initialItPurchaseDocs,
  initialItDeptUsageSummaries,
  initialItOptimizationAlerts,
  initialItExternalRequests
} from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'

type ItOverviewViewProps = {
  formatCompact: (value: number) => string
  formatCurrency: (value: number) => string
  formatMonth: (value: string) => string
  formatNumber: (value: number) => string
  onSelectTab: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItOverviewView({
  formatCompact,
  formatCurrency,
  formatMonth,
  formatNumber,
  onSelectTab
}: ItOverviewViewProps) {
  const { t } = useTranslation('dashboard')

  // Derive counts from our rich spec fixtures
  const readyCount = initialItProvisioningItems.filter((i) => i.status === 'ready').length
  const inProgressCount = initialItProvisioningItems.filter((i) => i.status === 'inProgress').length
  const needsAttentionCount = initialItProvisioningItems.filter(
    (i) => i.status === 'needsCheck' || i.status === 'needsHandover'
  ).length
  const failedCount = initialItProvisioningItems.filter((i) => i.status === 'failed').length

  const deficitReconciliationCount = initialItReconciliationRows.filter((r) => r.status === 'deficit').length
  const surplusReconciliationCount = initialItReconciliationRows.filter((r) => r.status === 'surplus').length
  const verifyReconciliationCount = initialItReconciliationRows.filter((r) => r.status === 'needsVerification').length

  const pendingDocsCount = initialItPurchaseDocs.filter((d) => d.status === 'needsCheck' || d.status === 'draft').length
  const missingUsageDevicesCount = initialItDeptUsageSummaries.reduce((sum, d) => sum + d.missingDataCount, 0)
  const pendingAlertsCount = initialItOptimizationAlerts.filter((a) => a.status === 'pending').length
  const pendingExternalCount = initialItExternalRequests.filter((r) => r.status === 'pendingDecision').length

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

  // 8 specific operational queue groups specified in Section 2 (IT-00)
  const operationalIndicators = [
    {
      title: t('itAdmin.overview.queues.ready.title'),
      code: 'IT-01 – IT-04',
      count: readyCount,
      desc: t('itAdmin.overview.queues.ready.description'),
      icon: PackageCheck,
      tone: 'success' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.ready.action')
    },
    {
      title: t('itAdmin.overview.queues.inProgress.title'),
      code: 'IT-04',
      count: inProgressCount + needsAttentionCount,
      desc: t('itAdmin.overview.queues.inProgress.description', {
        inProgress: inProgressCount,
        needsAttention: needsAttentionCount
      }),
      icon: Clock,
      tone: 'warning' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.inProgress.action')
    },
    {
      title: t('itAdmin.overview.queues.failed.title'),
      code: 'IT-04',
      count: failedCount,
      desc: t('itAdmin.overview.queues.failed.description'),
      icon: AlertCircle,
      tone: 'danger' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.failed.action')
    },
    {
      title: t('itAdmin.overview.queues.reconciliation.title'),
      code: 'IT-05',
      count: t('itAdmin.overview.queues.reconciliation.count', {
        deficit: deficitReconciliationCount,
        surplus: surplusReconciliationCount
      }),
      desc: t('itAdmin.overview.queues.reconciliation.description', { count: verifyReconciliationCount }),
      icon: Scale,
      tone: 'primary' as const,
      tab: 'reconciliation' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.reconciliation.action')
    },
    {
      title: t('itAdmin.overview.queues.documents.title'),
      code: 'IT-06',
      count: pendingDocsCount,
      desc: t('itAdmin.overview.queues.documents.description'),
      icon: FileSpreadsheet,
      tone: 'info' as const,
      tab: 'usage-import' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.documents.action')
    },
    {
      title: t('itAdmin.overview.queues.devices.title'),
      code: 'IT-07 & IT-08',
      count: missingUsageDevicesCount,
      desc: t('itAdmin.overview.queues.devices.description'),
      icon: WifiOff,
      tone: 'danger' as const,
      tab: 'device-collectors' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.devices.action')
    },
    {
      title: t('itAdmin.overview.queues.optimization.title'),
      code: 'IT-09',
      count: pendingAlertsCount,
      desc: t('itAdmin.overview.queues.optimization.description'),
      icon: Sparkles,
      tone: 'warning' as const,
      tab: 'license-optimization' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.optimization.action')
    },
    {
      title: t('itAdmin.overview.queues.external.title'),
      code: 'IT-10',
      count: pendingExternalCount,
      desc: t('itAdmin.overview.queues.external.description'),
      icon: ShieldAlert,
      tone: 'primary' as const,
      tab: 'shadow-it' as ItAdminTabKey,
      actionText: t('itAdmin.overview.queues.external.action')
    }
  ]

  return (
    <div className='space-y-8'>
      {/* Main Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          {t('itAdmin.overview.badge')}
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight sm:text-3xl'>{t('navigation.overview')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.overview.subtitle')}</p>
      </div>

      {/* Primary Top Metrics */}
      <section aria-label={t('metrics.regionLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {metricCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md'
              key={card.key}
            >
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-muted-foreground'>{card.title}</span>
                <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
              </div>
              <p className='mt-3 text-2xl font-bold tracking-tight'>{card.value}</p>
              <div className='mt-2 flex items-center gap-2'>
                <span className={`text-xs font-bold ${card.trendDown ? 'text-danger' : 'text-success'}`}>
                  {card.trend}
                </span>
                <span className='text-[0.7rem] text-muted-foreground'>{t('itAdmin.overview.previousPeriod')}</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Operational Indicators: IT-00 Quick Operational Queues */}
      <section aria-label={t('itAdmin.overview.queuesLabel')} className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>{t('itAdmin.overview.queuesTitle')}</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>{t('itAdmin.overview.queuesDescription')}</p>
          </div>
          <span className='text-xs text-muted-foreground font-mono'>{t('itAdmin.overview.queuesUpdated')}</span>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {operationalIndicators.map((item, idx) => {
            const Icon = item.icon
            const toneColors = {
              success: 'border-success/30 bg-success/5 text-success',
              warning: 'border-warning/30 bg-warning/5 text-warning',
              danger: 'border-danger/30 bg-danger/5 text-danger',
              primary: 'border-primary/30 bg-primary/5 text-primary',
              info: 'border-info/30 bg-info/5 text-info'
            }

            return (
              <div
                className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md'
                key={idx}
              >
                <div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-xs font-semibold text-muted-foreground'>
                      {t('itAdmin.overview.queueLabel')}
                    </span>
                    <span className={`grid size-8 place-items-center rounded-xl border ${toneColors[item.tone]}`}>
                      <Icon className='size-4' />
                    </span>
                  </div>
                  <h3 className='mt-3 text-sm font-bold text-foreground'>{item.title}</h3>
                  <div className='mt-2 flex items-baseline gap-2'>
                    <span className='text-2xl font-black tracking-tight text-foreground'>{item.count}</span>
                    <span className='text-xs text-muted-foreground'>{t('itAdmin.overview.itemCount')}</span>
                  </div>
                  <p className='mt-2 text-xs text-muted-foreground line-clamp-2'>{item.desc}</p>
                </div>

                <div className='mt-5 pt-3 border-t border-border/60'>
                  <button
                    className='group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft'
                    onClick={() => onSelectTab(item.tab)}
                    type='button'
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className='size-3.5 transition group-hover:translate-x-1' />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Analytics Charts & Structural Summary */}
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-base font-bold text-foreground'>{t('itAdmin.overview.costTrendTitle')}</h3>
              <p className='text-xs text-muted-foreground mt-0.5'>{t('itAdmin.overview.costTrendDescription')}</p>
            </div>
            <span className='rounded-lg bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-muted-foreground'>
              {t('itAdmin.overview.costTrendYear')}
            </span>
          </div>
          <div className='mt-6 h-64'>
            <CostChart
              actualLabel={t('itAdmin.overview.actualCost')}
              forecastLabel={t('itAdmin.overview.forecastCost')}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              formatMonth={formatMonth}
              label={t('itAdmin.overview.monthlyCostTrend')}
            />
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between'>
          <div>
            <h3 className='text-base font-bold text-foreground'>{t('itAdmin.overview.departmentAllocation')}</h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('itAdmin.overview.departmentAllocationDescription')}
            </p>
            <div className='mt-6 h-52'>
              <CategoryChart label={t('itAdmin.overview.departmentAllocationChart')} />
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground'>
            <span>{t('itAdmin.overview.engineeringShare')}</span>
            <span>{t('itAdmin.overview.designMarketingShare')}</span>
            <span>{t('itAdmin.overview.otherShare')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
