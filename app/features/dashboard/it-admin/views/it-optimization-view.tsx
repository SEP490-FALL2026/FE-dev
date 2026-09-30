import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
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

type ItOptimizationViewProps = {
  formatCurrency: (value: number) => string
}

export function ItOptimizationView({ formatCurrency }: ItOptimizationViewProps) {
  const { t } = useTranslation('dashboard')
  const [activeGroup, setActiveGroup] = useState<'g1' | 'g2' | 'g3' | 'g4'>('g2')

  const immediateSavings = 54_200_000
  const renewalSavings = 191_600_000

  const groups = [
    {
      actionIcon: ExternalLink,
      actionLabel: t('itAdmin.licenseOptimization.actRenewalHandoff'),
      badge: '14 seats',
      cost: 191_600_000,
      desc: t('itAdmin.licenseOptimization.groupG1Desc'),
      icon: Layers,
      id: 'g1' as const,
      items: [
        { app: 'Microsoft 365 E5', cost: 112_000_000, deadline: '15/04/2026', seats: 8 },
        { app: 'Zoom Enterprise', cost: 79_600_000, deadline: '30/05/2026', seats: 6 }
      ],
      title: t('itAdmin.licenseOptimization.groupG1Title'),
      tone: 'border-info/30 text-info'
    },
    {
      actionIcon: Trash2,
      actionLabel: t('itAdmin.licenseOptimization.actBatchRevoke'),
      badge: '5 seats',
      cost: 28_400_000,
      desc: t('itAdmin.licenseOptimization.groupG2Desc'),
      icon: UserMinus,
      id: 'g2' as const,
      items: [
        { app: 'Figma Professional', cost: 12_000_000, employee: 'Trần Minh (NV-0174)', seats: 1 },
        { app: 'GitHub Business', cost: 6_400_000, employee: 'Đỗ Hoàng Long (NV-0082)', seats: 1 },
        { app: 'JetBrains All Products', cost: 10_000_000, employee: 'Lê Thu Hà (NV-0099)', seats: 1 }
      ],
      title: t('itAdmin.licenseOptimization.groupG2Title'),
      tone: 'border-danger/30 text-danger'
    },
    {
      actionIcon: Send,
      actionLabel: t('itAdmin.licenseOptimization.actSendManager'),
      badge: '7 seats',
      cost: 15_800_000,
      desc: t('itAdmin.licenseOptimization.groupG3Desc'),
      icon: AlertTriangle,
      id: 'g3' as const,
      items: [
        { app: 'Canva Pro', cost: 3_800_000, daysUnused: 105, employee: 'Phạm Thanh Thảo', seats: 1 },
        { app: 'Notion Plus', cost: 12_000_000, daysUnused: 94, employee: 'Vũ Quốc Bảo', seats: 2 }
      ],
      title: t('itAdmin.licenseOptimization.groupG3Title'),
      tone: 'border-warning/30 text-warning'
    },
    {
      actionIcon: CheckCircle2,
      actionLabel: t('itAdmin.licenseOptimization.actReview'),
      badge: '12 seats',
      cost: 10_000_000,
      desc: t('itAdmin.licenseOptimization.groupG4Desc'),
      icon: Clock,
      id: 'g4' as const,
      items: [
        { app: 'Slack Business+', cost: 5_200_000, daysInactive: 68, department: 'Marketing', seats: 4 },
        { app: 'Miro Enterprise', cost: 4_800_000, daysInactive: 72, department: 'Operations', seats: 2 }
      ],
      title: t('itAdmin.licenseOptimization.groupG4Title'),
      tone: 'border-primary/30 text-primary'
    }
  ]

  const currentGroup = groups.find((g) => g.id === activeGroup) ?? groups[0]

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.licenseOptimization.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.licenseOptimization.subtitle')}</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='rounded-2xl border border-success/30 bg-success/5 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success'>
              <Zap aria-hidden='true' className='size-3.5' />
              <span>{t('itAdmin.licenseOptimization.savingsImmediate')}</span>
            </span>
            <TrendingDown aria-hidden='true' className='size-5 text-success' />
          </div>
          <p className='mt-4 text-3xl font-extrabold text-foreground'>{formatCurrency(immediateSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.licenseOptimization.groupG2Desc')}</p>
        </div>

        <div className='rounded-2xl border border-info/30 bg-info/5 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-3 py-1 text-xs font-bold text-info'>
              <Sparkles aria-hidden='true' className='size-3.5' />
              <span>{t('itAdmin.licenseOptimization.savingsRenewal')}</span>
            </span>
            <TrendingDown aria-hidden='true' className='size-5 text-info' />
          </div>
          <p className='mt-4 text-3xl font-extrabold text-foreground'>{formatCurrency(renewalSavings)}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.licenseOptimization.groupG1Desc')}</p>
        </div>
      </div>

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

      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4'>
          <div>
            <h2 className='text-base font-bold text-foreground'>{currentGroup.title}</h2>
            <p className='text-xs text-muted-foreground'>{currentGroup.desc}</p>
          </div>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
            type='button'
          >
            <currentGroup.actionIcon aria-hidden='true' className='size-3.5' />
            <span>{currentGroup.actionLabel}</span>
          </button>
        </div>

        <div className='mt-4 divide-y divide-border'>
          {currentGroup.items.map((item, index) => (
            <div className='flex items-center justify-between py-3.5' key={index}>
              <div>
                <span className='font-semibold text-foreground text-sm'>{item.app}</span>
                <div className='mt-0.5 flex items-center gap-3 text-xs text-muted-foreground'>
                  {'employee' in item && item.employee && <span>{item.employee}</span>}
                  {'department' in item && item.department && <span>{item.department}</span>}
                  {'deadline' in item && item.deadline && <span>{item.deadline}</span>}
                  {'daysUnused' in item && item.daysUnused && (
                    <span>
                      {item.daysUnused} {t('itAdmin.licenseOptimization.daysUnit')}
                    </span>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <span className='font-bold text-sm text-foreground'>{formatCurrency(item.cost)}</span>
                <span className='block text-xs text-muted-foreground'>
                  {item.seats} {t('itAdmin.licenseOptimization.seatsUnit')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
