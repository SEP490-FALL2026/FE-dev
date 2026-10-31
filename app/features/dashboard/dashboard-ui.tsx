import { X, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
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
    formatCompactCurrency: (value: number) =>
      new Intl.NumberFormat(locale, {
        currency: 'VND',
        maximumFractionDigits: 1,
        notation: 'compact',
        style: 'currency'
      }).format(value),
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
  /** Spec reference badge; omitted on screens shown to business users. */
  code?: string
  subtitle: string
  title: string
}) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='min-w-0'>
        {code && (
          <span className='mb-2 inline-flex rounded-md border border-primary/20 bg-primary-soft px-2 py-0.5 font-mono text-[0.7rem] font-bold text-primary'>
            {code}
          </span>
        )}
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{title}</h1>
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

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Modal dialog: focus moves inside, Tab stays inside, Escape or the backdrop closes, focus returns on close. */
export function Dialog({
  children,
  hint,
  onClose,
  presentation,
  size = 'md',
  title
}: {
  children: React.ReactNode
  hint?: string
  onClose: () => void
  presentation?: 'drawer' | 'sheet'
  size?: 'lg' | 'md'
  title: string
}) {
  const { t } = useTranslation('dashboard')
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const first = panelRef.current?.querySelector<HTMLElement>(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    )
    ;(first ?? panelRef.current)?.focus()
    return () => previousFocus?.focus()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('[role="dialog"]') !== panelRef.current) return
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex bg-foreground/45 ${presentation === 'drawer' ? 'items-end justify-end sm:items-stretch' : presentation === 'sheet' ? 'items-end justify-center sm:items-center sm:p-4' : 'items-center justify-center p-4 backdrop-blur-[2px]'}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        aria-labelledby={titleId}
        aria-modal='true'
        className={`${presentation === 'drawer' ? 'max-h-[95dvh] rounded-t-lg sm:max-h-screen sm:max-w-[640px] sm:rounded-none' : presentation === 'sheet' ? 'max-h-[95dvh] rounded-t-lg sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg' : 'max-h-[calc(100dvh-2rem)] rounded-2xl'} w-full overflow-y-auto border border-border bg-surface p-6 shadow-2xl outline-none ${
          size === 'lg' ? 'max-w-3xl' : 'max-w-lg'
        }`}
        onKeyDown={handleKeyDown}
        ref={panelRef}
        role='dialog'
        tabIndex={-1}
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h2 className='text-base font-bold text-foreground' id={titleId}>
              {title}
            </h2>
            {hint && <p className='mt-0.5 text-xs text-muted-foreground'>{hint}</p>}
          </div>
          <button
            aria-label={t('ui.close')}
            className={`grid ${presentation ? 'size-11 sm:size-8' : 'size-8'} shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-surface-subtle`}
            onClick={onClose}
            type='button'
          >
            <X aria-hidden='true' className='size-4' strokeWidth={1.5} />
          </button>
        </div>
        <div className='mt-5'>{children}</div>
      </div>
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
