import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type Tone = 'danger' | 'info' | 'neutral' | 'primary' | 'success' | 'warning'

const pillToneClasses: Record<Tone, string> = {
  danger: 'border-danger/25 bg-danger/10 text-danger',
  info: 'border-info/25 bg-info/10 text-info',
  neutral: 'border-border bg-surface-subtle text-muted-foreground',
  primary: 'border-primary/25 bg-primary-soft text-primary',
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/15 text-warning'
}

const iconToneClasses: Record<Tone, string> = {
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
  neutral: 'bg-surface-subtle text-muted-foreground',
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning'
}

export function useDashboardFormat() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'

  return {
    formatDate: (value: string) =>
      new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(value.length === 10 ? `${value}T00:00:00` : value)
      ),
    formatDateTime: (value: string) =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(value)),
    formatMonthYear: (value: string) =>
      new Intl.DateTimeFormat(locale, { month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`)),
    formatNumber: (value: number) => new Intl.NumberFormat(locale).format(value),
    formatPercent: (value: number) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: 0, style: 'percent' }).format(value)
  }
}

export function PageHeader({
  actions,
  code,
  subtitle,
  title
}: {
  actions?: React.ReactNode
  code: string
  subtitle: string
  title: string
}) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='min-w-0'>
        <span className='inline-flex rounded-md border border-primary/20 bg-primary-soft px-2 py-0.5 font-mono text-[0.7rem] font-bold text-primary'>
          {code}
        </span>
        <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{title}</h1>
        <p className='mt-1 max-w-3xl text-sm text-muted-foreground'>{subtitle}</p>
      </div>
      {actions}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>{children}</section>
  )
}

export function PanelTitle({ action, hint, title }: { action?: React.ReactNode; hint?: string; title: string }) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div className='min-w-0'>
        <h2 className='text-sm font-bold text-foreground'>{title}</h2>
        {hint && <p className='mt-0.5 text-xs text-muted-foreground'>{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-bold whitespace-nowrap ${pillToneClasses[tone]}`}
    >
      {children}
    </span>
  )
}

export function StatTile({
  action,
  hint,
  icon: Icon,
  label,
  onClick,
  tone = 'primary',
  value
}: {
  action?: string
  hint?: string
  icon: LucideIcon
  label: string
  onClick?: () => void
  tone?: Tone
  value: string
}) {
  const content = (
    <>
      <div className='flex items-start justify-between gap-3'>
        <span className='text-xs font-semibold text-muted-foreground'>{label}</span>
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconToneClasses[tone]}`}>
          <Icon aria-hidden='true' className='size-4' />
        </span>
      </div>
      <p className='mt-2 text-2xl font-extrabold tracking-tight text-foreground'>{value}</p>
      {hint && <p className='mt-1 text-xs text-muted-foreground'>{hint}</p>}
      {action && <p className='mt-2 text-xs font-bold text-primary'>{action}</p>}
    </>
  )

  if (!onClick) {
    return <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>{content}</div>
  }

  return (
    <button
      className='rounded-2xl border border-border bg-surface p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md focus-visible:ring-3 focus-visible:ring-primary-soft focus-visible:outline-none'
      onClick={onClick}
      type='button'
    >
      {content}
    </button>
  )
}

export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 py-1.5 text-xs'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='text-right font-semibold text-foreground'>{value}</span>
    </div>
  )
}

export function Notice({
  children,
  icon: Icon,
  tone = 'info'
}: {
  children: React.ReactNode
  icon: LucideIcon
  tone?: Tone
}) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${pillToneClasses[tone]}`}>
      <Icon aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
      <div className='min-w-0 font-medium'>{children}</div>
    </div>
  )
}

export function FilterChips<T extends string>({
  label,
  onChange,
  options,
  value
}: {
  label: string
  onChange: (value: T) => void
  options: readonly { count?: number; label: string; value: T }[]
  value: T
}) {
  return (
    <div aria-label={label} className='flex flex-wrap gap-2' role='group'>
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            aria-pressed={isActive}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type='button'
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`rounded px-1 text-[0.65rem] font-bold ${isActive ? 'bg-white/20' : 'bg-surface-subtle'}`}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export const inputClassName =
  'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary-soft'

export const primaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'

export const secondaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50'

export const dangerButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
