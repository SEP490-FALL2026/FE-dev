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

import { CategoryChart, CostChart } from '../../dashboard-charts'
import {
  initialItDepartments,
  initialItProvisioningItems,
  initialItReconciliationRows,
  initialItPurchaseDocs,
  initialItDeptUsageSummaries,
  initialItOptimizationAlerts,
  initialItExternalRequests
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

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
      title: 'Sẵn sàng cấp gói',
      code: 'IT-01 – IT-04',
      count: readyCount,
      desc: 'Đã phê duyệt, có gói hợp lệ, đủ số lượng đã mua và API sẵn sàng thực thi',
      icon: PackageCheck,
      tone: 'success' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: 'Vào cấp phát'
    },
    {
      title: 'Đang cấp / Timeout / Bàn giao',
      code: 'IT-04',
      count: inProgressCount + needsAttentionCount,
      desc: `${inProgressCount} đang gọi API, ${needsAttentionCount} cần kiểm tra timeout mạng hoặc khôi phục bàn giao Vault`,
      icon: Clock,
      tone: 'warning' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: 'Xử lý ngay'
    },
    {
      title: 'Cấp thất bại (Cần thử lại)',
      code: 'IT-04',
      count: failedCount,
      desc: 'Lỗi API từ vendor (hết hạn mức, lỗi thẻ), chưa tạo credential',
      icon: AlertCircle,
      tone: 'danger' as const,
      tab: 'provisioning' as ItAdminTabKey,
      actionText: 'Xem lỗi & Thử lại'
    },
    {
      title: 'Đối chiếu: Mua thiếu & Mua dư',
      code: 'IT-05',
      count: `${deficitReconciliationCount} thiếu / ${surplusReconciliationCount} dư`,
      desc: `So sánh nhu cầu và chứng từ mua. ${verifyReconciliationCount} hợp đồng/hóa đơn lệch số lượng cần xác minh`,
      icon: Scale,
      tone: 'primary' as const,
      tab: 'reconciliation' as ItAdminTabKey,
      actionText: 'Mở đối chiếu'
    },
    {
      title: 'Nhập chứng từ cần kiểm tra',
      code: 'IT-06',
      count: pendingDocsCount,
      desc: 'Hóa đơn & hợp đồng tải lên đang chờ ánh xạ gói và đối soát tổng tiền',
      icon: FileSpreadsheet,
      tone: 'info' as const,
      tab: 'usage-import' as ItAdminTabKey,
      actionText: 'Kiểm tra chứng từ'
    },
    {
      title: 'Thiết bị ngắt kết nối đo lường',
      code: 'IT-07 & IT-08',
      count: missingUsageDevicesCount,
      desc: 'Tool máy trạm gián đoạn gửi telemetry; phân biệt rõ với ít sử dụng',
      icon: WifiOff,
      tone: 'danger' as const,
      tab: 'device-collectors' as ItAdminTabKey,
      actionText: 'Xem tình trạng tool'
    },
    {
      title: 'Cảnh báo lãng phí & Thu hồi',
      code: 'IT-09',
      count: pendingAlertsCount,
      desc: 'Tài khoản ít dùng, không thao tác >60 ngày hoặc nghỉ việc chờ thu hồi',
      icon: Sparkles,
      tone: 'warning' as const,
      tab: 'license-optimization' as ItAdminTabKey,
      actionText: 'Thẩm tra thu hồi'
    },
    {
      title: 'Yêu cầu phần mềm bên ngoài',
      code: 'IT-10',
      count: pendingExternalCount,
      desc: 'Đề xuất công cụ AI ngoài danh mục chờ IT Admin Chấp nhận hoặc Từ chối',
      icon: ShieldAlert,
      tone: 'primary' as const,
      tab: 'shadow-it' as ItAdminTabKey,
      actionText: 'Duyệt đề xuất'
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
            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md' key={card.key}>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-muted-foreground'>{card.title}</span>
                <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
              </div>
              <p className='mt-3 text-2xl font-bold tracking-tight'>{card.value}</p>
              <div className='mt-2 flex items-center gap-2'>
                <span
                  className={`text-xs font-bold ${
                    card.trendDown ? 'text-danger' : 'text-success'
                  }`}
                >
                  {card.trend}
                </span>
                <span className='text-[0.7rem] text-muted-foreground'>so với chu kỳ trước</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Operational Indicators: IT-00 Quick Operational Queues */}
      <section aria-label='Hàng đợi tác vụ vận hành IT' className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>Chỉ số vận hành & Hàng đợi tác vụ</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Giám sát trực tiếp trạng thái cấp phát, đối chiếu bản quyền, thu thập telemetry và đề xuất phần mềm
            </p>
          </div>
          <span className='text-xs text-muted-foreground font-mono'>Cập nhật tự động · 8 luồng nghiệp vụ</span>
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
                    <span className='text-xs font-semibold text-muted-foreground'>Hàng đợi tác vụ</span>
                    <span className={`grid size-8 place-items-center rounded-xl border ${toneColors[item.tone]}`}>
                      <Icon className='size-4' />
                    </span>
                  </div>
                  <h3 className='mt-3 text-sm font-bold text-foreground'>{item.title}</h3>
                  <div className='mt-2 flex items-baseline gap-2'>
                    <span className='text-2xl font-black tracking-tight text-foreground'>{item.count}</span>
                    <span className='text-xs text-muted-foreground'>mục</span>
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
              <h3 className='text-base font-bold text-foreground'>Xu hướng chi phí phần mềm & bản quyền AI</h3>
              <p className='text-xs text-muted-foreground mt-0.5'>So sánh chi phí thực tế với ngân sách dự kiến qua các kỳ</p>
            </div>
            <span className='rounded-lg bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-muted-foreground'>
              Năm 2026
            </span>
          </div>
          <div className='mt-6 h-64'>
            <CostChart
              actualLabel='Chi phí thực tế'
              forecastLabel='Dự kiến'
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              formatMonth={formatMonth}
              label='Xu hướng chi phí phần mềm theo tháng'
            />
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between'>
          <div>
            <h3 className='text-base font-bold text-foreground'>Phân bổ theo phòng ban</h3>
            <p className='text-xs text-muted-foreground mt-0.5'>Tỷ trọng phần mềm & AI agent theo đơn vị</p>
            <div className='mt-6 h-52'>
              <CategoryChart label='Tỷ trọng phần mềm theo phòng ban' />
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground'>
            <span>Kỹ thuật phần mềm: 58%</span>
            <span>Thiết kế & MKT: 32%</span>
            <span>Khác: 10%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
