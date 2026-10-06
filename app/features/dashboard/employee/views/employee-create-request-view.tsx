import { ArrowRightLeft, CalendarPlus, ChevronRight, Info, PackagePlus, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeCreateRequestViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeCreateRequestView({ onSelectTab }: EmployeeCreateRequestViewProps) {
  const { t } = useTranslation('dashboard')

  const requestOptions = [
    {
      descriptionKey: 'newSoftwareDesc',
      icon: PackagePlus,
      key: 'new-software',
      onClick: () => onSelectTab('request-new-software'),
      titleKey: 'newSoftwareTitle',
      tone: 'primary'
    },
    {
      descriptionKey: 'changePlanDesc',
      icon: ArrowRightLeft,
      key: 'change-plan',
      onClick: () => onSelectTab('request-new-software', { type: 'changePlan' }),
      titleKey: 'changePlanTitle',
      tone: 'info'
    },
    {
      descriptionKey: 'renewalDesc',
      icon: CalendarPlus,
      key: 'renewal',
      onClick: () => onSelectTab('temporary-renewal'),
      titleKey: 'renewalTitle',
      tone: 'warning'
    },
    {
      descriptionKey: 'returnDesc',
      icon: RotateCcw,
      key: 'return',
      onClick: () => onSelectTab('return-license'),
      titleKey: 'returnTitle',
      tone: 'danger'
    }
  ] as const

  return (
    <div className='space-y-8'>
      {/* Heading */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.createRequest.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.createRequest.subtitle')}</p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.request')}</EmployeePreviewNotice>

      {/* 2x2 Request Cards Grid */}
      <div className='grid gap-6 sm:grid-cols-2'>
        {requestOptions.map((opt) => {
          const Icon = opt.icon
          const toneBadge =
            opt.tone === 'primary'
              ? 'bg-primary-soft text-primary-ink border-primary/20'
              : opt.tone === 'info'
                ? 'bg-info/10 text-info-ink border-info/20'
                : opt.tone === 'warning'
                  ? 'bg-warning/15 text-warning-ink border-warning/25'
                  : 'bg-danger/10 text-danger-ink border-danger/25'

          return (
            <div
              className='group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md'
              key={opt.key}
            >
              <div>
                <span className={`inline-grid size-12 place-items-center rounded-2xl border ${toneBadge}`}>
                  <Icon aria-hidden='true' className='size-6' />
                </span>
                <h2 className='mt-4 text-base font-bold text-foreground group-hover:text-primary-ink transition-colors'>
                  {t(`employee.createRequest.${opt.titleKey}`)}
                </h2>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {t(`employee.createRequest.${opt.descriptionKey}`)}
                </p>
              </div>

              <div className='mt-6 pt-4 border-t border-border/70 flex justify-end'>
                <button
                  className='inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-surface-subtle px-3.5 py-2 text-sm font-bold text-foreground transition group-hover:bg-primary-action group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
                  onClick={opt.onClick}
                  type='button'
                >
                  <span>{t('employee.createRequest.selectWorkflow')}</span>
                  <ChevronRight aria-hidden='true' className='size-4' />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Policy Notice Box */}
      <div className='flex items-start gap-3.5 rounded-2xl border border-primary/20 bg-primary-soft/40 p-5'>
        <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-primary-action text-white'>
          <Info aria-hidden='true' className='size-5' />
        </span>
        <div>
          <h3 className='text-sm font-bold text-foreground'>{t('employee.createRequest.policyNoticeTitle')}</h3>
          <p className='mt-1 text-sm text-muted-foreground leading-relaxed'>
            {t('employee.createRequest.policyNoticeDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}
