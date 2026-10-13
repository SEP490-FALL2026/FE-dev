import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Layers,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
  UserMinus,
  Zap
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ItAdminTabKey } from '../it-admin-nav'

type ItOptimizationViewProps = {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItOptimizationView({ formatCurrency, onSelectTab }: ItOptimizationViewProps) {
  const { t } = useTranslation('dashboard')
  const [activeGroup, setActiveGroup] = useState<'g1' | 'g2' | 'g3' | 'g4'>('g2')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [processedStatus, setProcessedStatus] = useState<Record<string, string>>({})

  const immediateSavings = 54_200_000
  const renewalSavings = 191_600_000

  const handleGroupAction = () => {
    if (activeGroup === 'g2') {
      setProcessedStatus((prev) => ({ ...prev, g2: 'Đã tạo tác vụ thu hồi sang Hàng đợi cấp phát' }))
      setToastMessage('Đã tạo 3 tác vụ thu hồi tài khoản AI người nghỉ việc sang Hàng đợi cấp phát!')
    } else if (activeGroup === 'g3') {
      setProcessedStatus((prev) => ({ ...prev, g3: 'Đã gửi Trưởng phòng thẩm tra' }))
      setToastMessage('Đã chuyển 2 khuyến nghị lãng phí sang Trưởng phòng xác nhận tiếp tục cấp hay thu hồi!')
    } else if (activeGroup === 'g1') {
      setProcessedStatus((prev) => ({ ...prev, g1: 'Đã đưa vào hồ sơ gia hạn hợp đồng' }))
      setToastMessage('Đã ghi nhận đề xuất giảm 14 tài khoản thừa vào hồ sơ đàm phán hợp đồng AI!')
    } else {
      setToastMessage('Nhóm này thuộc diện chỉ theo dõi nội bộ IT (30–59 ngày) — Không gửi cảnh báo vi mô.')
    }
    setTimeout(() => setToastMessage(null), 3500)
  }

  const groups = [
    {
      actionIcon: ExternalLink,
      actionLabel: 'Đưa vào hồ sơ gia hạn hợp đồng',
      badge: '14 tài khoản thừa',
      cost: 191_600_000,
      desc: 'Tài khoản AI doanh nghiệp đã mua gói năm nhưng chưa gán cho nhân sự nào, đề xuất giảm số lượng khi tái ký.',
      icon: Layers,
      id: 'g1' as const,
      items: [
        { app: 'ChatGPT Enterprise (OpenAI)', cost: 112_000_000, deadline: '15/04/2026', seats: 8 },
        { app: 'Claude Enterprise (Anthropic)', cost: 79_600_000, deadline: '30/05/2026', seats: 6 }
      ],
      title: 'Tài khoản mua chưa sử dụng',
      tone: 'border-info/30 text-info'
    },
    {
      actionIcon: Trash2,
      actionLabel: 'Thu hồi toàn bộ tài khoản ngay',
      badge: '5 tài khoản',
      cost: 28_400_000,
      desc: 'Tài khoản AI vẫn đang được gán cho nhân sự đã nghỉ việc, cần thu hồi ngay về kho để cấp cho người khác.',
      icon: UserMinus,
      id: 'g2' as const,
      items: [
        { app: 'ChatGPT Enterprise (OpenAI)', cost: 12_000_000, employee: 'Trần Minh (NV-0174)', seats: 1 },
        { app: 'GitHub Copilot (OpenAI Codex)', cost: 6_400_000, employee: 'Đỗ Hoàng Long (NV-0082)', seats: 1 },
        { app: 'Cursor AI Pro', cost: 10_000_000, employee: 'Lê Thu Hà (NV-0099)', seats: 1 }
      ],
      title: 'Tài khoản nhân sự đã nghỉ việc',
      tone: 'border-danger/30 text-danger'
    },
    {
      actionIcon: Send,
      actionLabel: 'Gửi Trưởng phòng thẩm tra',
      badge: '7 tài khoản',
      cost: 15_800_000,
      desc: 'Tài khoản AI được cấp nhưng nhân sự không đăng nhập hoặc không phát sinh thao tác trong hơn 60 ngày.',
      icon: AlertTriangle,
      id: 'g3' as const,
      items: [
        { app: 'Google Gemini Business', cost: 3_800_000, daysUnused: 105, employee: 'Phạm Thanh Thảo', seats: 1 },
        { app: 'Claude Enterprise (Anthropic)', cost: 12_000_000, daysUnused: 94, employee: 'Vũ Quốc Bảo', seats: 2 }
      ],
      title: 'Tài khoản không dùng (>60 ngày)',
      tone: 'border-warning/30 text-warning'
    },
    {
      actionIcon: CheckCircle2,
      actionLabel: 'Theo dõi nội bộ IT',
      badge: '12 tài khoản',
      cost: 10_000_000,
      desc: 'Tài khoản AI có mức độ sử dụng giảm trong 30–59 ngày. Chỉ lưu để IT theo dõi, không gửi cảnh báo nhân viên.',
      icon: Clock,
      id: 'g4' as const,
      items: [
        { app: 'ChatGPT Team (OpenAI)', cost: 5_200_000, daysInactive: 48, department: 'Marketing', seats: 4 },
        { app: 'Perplexity Pro Enterprise', cost: 4_800_000, daysInactive: 52, department: 'Nghiên cứu thị trường', seats: 2 }
      ],
      title: 'Tài khoản ít hoạt động (30–59 ngày)',
      tone: 'border-primary/30 text-primary'
    }
  ]

  const currentGroup = groups.find((g) => g.id === activeGroup) ?? groups[0]

  return (
    <div className='space-y-6'>
      {/* Toast */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-5 py-3.5 shadow-xl backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success' />
          <div>
            <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
            {activeGroup === 'g2' && onSelectTab && (
              <button
                className='ml-3 text-xs font-bold text-primary underline'
                onClick={() => onSelectTab('provisioning')}
                type='button'
              >
                Xem Hàng đợi cấp phát →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Bảng tối ưu tài khoản & Chi phí AI
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.licenseOptimization.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Phát hiện lãng phí tài khoản AI (ChatGPT, Claude, Gemini, Copilot) và thu hồi ghế không sử dụng để tiết kiệm ngân sách
        </p>
      </div>

      {/* KPI Cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='rounded-2xl border border-success/30 bg-success/5 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success'>
              <Zap aria-hidden='true' className='size-3.5' />
              <span>Tiết kiệm thực tế tức thì (Đã thu hồi)</span>
            </span>
            <TrendingDown aria-hidden='true' className='size-5 text-success' />
          </div>
          <p className='mt-4 text-3xl font-extrabold text-foreground'>{formatCurrency(immediateSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Thu hồi trực tiếp 5 tài khoản AI của nhân sự đã nghỉ việc về kho dùng chung
          </p>
        </div>

        <div className='rounded-2xl border border-info/30 bg-info/5 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-3 py-1 text-xs font-bold text-info'>
              <Sparkles aria-hidden='true' className='size-3.5' />
              <span>Tiết kiệm ước tính tại kỳ gia hạn</span>
            </span>
            <TrendingDown aria-hidden='true' className='size-5 text-info' />
          </div>
          <p className='mt-4 text-3xl font-extrabold text-foreground'>{formatCurrency(renewalSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Giảm số lượng 14 ghế dư thừa khi tái ký hợp đồng năm với OpenAI và Anthropic
          </p>
        </div>
      </div>

      {/* 4 Groups Navigation Tabs */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {groups.map((group) => {
          const Icon = group.icon
          const isActive = group.id === activeGroup

          return (
            <button
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? 'border-primary bg-primary-soft/40 shadow-sm ring-1 ring-primary'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              type='button'
            >
              <div className='flex items-center justify-between'>
                <span className={`grid size-9 place-items-center rounded-xl border bg-surface ${group.tone}`}>
                  <Icon aria-hidden='true' className='size-4' />
                </span>
                <span className='rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-xs font-bold text-foreground'>
                  {group.badge}
                </span>
              </div>
              <h2 className='mt-3 text-sm font-bold text-foreground'>{group.title}</h2>
              <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>{group.desc}</p>
              <p className='mt-3 text-xs font-semibold text-primary'>{formatCurrency(group.cost)}</p>
            </button>
          )
        })}
      </div>

      {/* Detail Pane for Current Group */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-base font-bold text-foreground'>{currentGroup.title}</h2>
              {processedStatus[activeGroup] && (
                <span className='rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success border border-success/30'>
                  {processedStatus[activeGroup]}
                </span>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>{currentGroup.desc}</p>
          </div>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
            onClick={handleGroupAction}
            type='button'
          >
            <currentGroup.actionIcon aria-hidden='true' className='size-3.5' />
            <span>{currentGroup.actionLabel}</span>
          </button>
        </div>

        {activeGroup === 'g4' && (
          <div className='mt-4 rounded-xl border border-primary/20 bg-primary-soft/30 p-3.5'>
            <div className='flex items-start gap-2.5'>
              <Info className='mt-0.5 size-4 shrink-0 text-primary' />
              <p className='text-xs text-muted-foreground leading-relaxed'>
                <strong>Chính sách giám sát nhân văn:</strong> Khoảng thời gian ít hoạt động 30–59 ngày chỉ hiển thị cho IT Admin theo dõi nội bộ. Không gửi cảnh báo làm phiền nhân viên và không gửi Trưởng phòng để tránh giám sát vi mô năng suất lao động.
              </p>
            </div>
          </div>
        )}

        <div className='mt-4 divide-y divide-border'>
          {currentGroup.items.map((item, index) => (
            <div className='flex items-center justify-between py-3.5' key={index}>
              <div>
                <span className='font-semibold text-foreground text-sm'>{item.app}</span>
                <div className='mt-0.5 flex items-center gap-3 text-xs text-muted-foreground'>
                  {'employee' in item && item.employee && <span>Nhân viên: {item.employee}</span>}
                  {'department' in item && item.department && <span>Phòng ban: {item.department}</span>}
                  {'deadline' in item && item.deadline && <span>Hạn tái ký: {item.deadline}</span>}
                  {'daysUnused' in item && item.daysUnused && (
                    <span className='font-semibold text-danger'>
                      Không phát sinh yêu cầu {item.daysUnused} ngày (Vượt ngưỡng 60 ngày)
                    </span>
                  )}
                  {'daysInactive' in item && item.daysInactive && (
                    <span className='text-warning'>
                      Ít hoạt động {item.daysInactive} ngày (Ngưỡng theo dõi)
                    </span>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <span className='font-bold text-sm text-foreground'>{formatCurrency(item.cost)}</span>
                <span className='block text-xs text-muted-foreground'>
                  {item.seats} tài khoản
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
