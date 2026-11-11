import { ChevronDown, ChevronLeft, ChevronRight, Inbox, LoaderCircle, Search } from 'lucide-react'
import { useId, type ButtonHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceRetry } from '../hooks/use-finance-retry'

export { FinanceQueryState } from './finance-query-state'
export { FinanceDetailPage, FinanceDrawer } from './finance-drawer'
export { FinanceSkeleton } from './finance-skeleton'

export const financeInputClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] outline-none transition-colors duration-150 placeholder:text-muted-foreground/80 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15 md:min-h-10 md:text-sm'

const buttonBase =
  'inline-flex min-h-11 cursor-pointer select-none items-center justify-center gap-2 rounded-md border px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10'

export const financeButtonVariants = {
  primary:
    'border-transparent bg-primary text-primary-foreground shadow-[0_1px_2px_0_rgba(0,0,0,0.08)] hover:bg-primary-hover enabled:active:bg-primary-hover enabled:active:shadow-inner',
  secondary:
    'border-border bg-surface text-foreground shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] hover:border-primary/40 hover:bg-surface-subtle enabled:active:border-primary/50 enabled:active:bg-primary-soft enabled:active:text-primary-ink aria-pressed:border-primary/50 aria-pressed:bg-primary-soft aria-pressed:text-primary-ink aria-expanded:border-primary/50 aria-expanded:bg-primary-soft aria-expanded:text-primary-ink',
  ghost:
    'border-transparent text-muted-foreground hover:bg-surface-subtle hover:text-foreground enabled:active:bg-primary-soft enabled:active:text-primary-ink aria-pressed:bg-primary-soft aria-pressed:text-primary-ink',
  danger:
    'border-danger/40 bg-surface text-danger hover:border-danger hover:bg-danger/10 enabled:active:bg-danger enabled:active:text-white'
} as const

export type FinanceButtonVariant = keyof typeof financeButtonVariants

export function FinancePage({
  title,
  description,
  children,
  actions
}: {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className='space-y-6 [&_button:enabled]:cursor-pointer [&_select:enabled]:cursor-pointer [&_summary]:cursor-pointer'>
      <header className='flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-5'>
        <div className='min-w-0 space-y-1'>
          <h1 className='text-2xl leading-tight font-semibold tracking-tight text-foreground [text-wrap:balance]'>
            {title}
          </h1>
          {description && <p className='max-w-2xl text-sm text-muted-foreground [text-wrap:pretty]'>{description}</p>}
        </div>
        {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
      </header>
      {children}
    </div>
  )
}

export function FinanceButton({
  children,
  pending = false,
  variant = 'secondary',
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; variant?: FinanceButtonVariant }) {
  const retrySeconds = useFinanceRetry()
  const { t: translate } = useTranslation('finance')
  return (
    <button
      {...props}
      type={type}
      aria-busy={pending || undefined}
      disabled={disabled || pending || retrySeconds > 0}
      className={`${buttonBase} ${financeButtonVariants[variant]} ${className}`}
    >
      {pending && <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />}
      {retrySeconds > 0 ? translate('retryAfter', { seconds: retrySeconds }) : children}
    </button>
  )
}

export function FinanceField({
  label,
  children,
  hint,
  required = false,
  error
}: {
  label: string
  children: ReactNode
  hint?: string
  required?: boolean
  error?: string | null
}) {
  return (
    <label className='block min-w-0 space-y-1.5 text-sm font-medium text-foreground'>
      <span className='flex items-center gap-1'>
        {label}
        {required && (
          <span aria-hidden className='text-danger'>
            *
          </span>
        )}
      </span>
      {children}
      {error ? (
        <span role='alert' className='block min-h-5 text-xs font-normal text-danger'>
          {error}
        </span>
      ) : (
        hint && <span className='block min-h-5 text-xs font-normal text-muted-foreground'>{hint}</span>
      )}
    </label>
  )
}

/** Native select with the same height, border states and chevron as the finance inputs. */
export function FinanceSelect({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className='relative min-w-0'>
      <select {...props} className={`${financeInputClass} cursor-pointer appearance-none pr-9 ${className}`}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        strokeWidth={1.5}
        className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground'
      />
    </div>
  )
}

export function FinanceToolbar({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col gap-3 rounded-lg border border-border/70 bg-surface p-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:flex-row sm:flex-wrap sm:items-end'>
      {children}
    </div>
  )
}

export function FinanceSearch({
  label,
  placeholder,
  value,
  onChange,
  hideLabel = false
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  hideLabel?: boolean
}) {
  const id = useId()
  return (
    <div className='min-w-0 flex-1 space-y-1.5'>
      <label className={hideLabel ? 'sr-only' : 'block text-sm font-medium'} htmlFor={id}>
        {label}
      </label>
      <div className='relative'>
        <Search
          aria-hidden
          className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          strokeWidth={1.5}
        />
        <input
          id={id}
          type='search'
          className={`${financeInputClass} pl-9`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}

export function FinanceEmpty({ message }: { message?: string }) {
  const { t: translate } = useTranslation('finance')
  return (
    <div
      role='status'
      className='flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center'
    >
      <span className='grid size-10 place-items-center rounded-lg bg-surface-subtle text-muted-foreground'>
        <Inbox aria-hidden className='size-5' strokeWidth={1.5} />
      </span>
      <p className='text-sm text-muted-foreground'>{message ?? translate('empty')}</p>
    </div>
  )
}

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const statusTones: Record<StatusTone, readonly string[]> = {
  success: [
    'APPROVED',
    'ACTIVE',
    'ANSWERED',
    'COMPLETED',
    'BUDGET_OK',
    'DECLARED',
    'ASSESSED',
    'WITHIN_LIMIT',
    'AVAILABLE',
    'EXPENSED',
    'ATTACHED',
    'RECOMMEND_APPROVE'
  ],
  warning: [
    'SUBMITTED',
    'SENT',
    'PENDING',
    'WAITING',
    'OPEN',
    'HIGH_VALUE',
    'HELD',
    'CHANGES_REQUESTED',
    'NEEDS_BUDGET',
    'BUDGET_REVISION_NEEDED',
    'PLAN_LINE_OVERDUE',
    'STALE_COST_EVIDENCE',
    'OVER_CEILING',
    'MISSING',
    'RECOMMEND_OVERRIDE'
  ],
  danger: [
    'REJECTED',
    'INSUFFICIENT_BUDGET',
    'NO_ACTIVE_BUDGET',
    'OVER_LIMIT',
    'NO_BUDGET',
    'BLOCKED',
    'GRANT_FAILED',
    'RECOMMEND_REJECT',
    'CLOSED_OR_EXPIRED_BUDGET_PERIOD'
  ],
  info: ['DRAFT', 'RETURNED', 'RETURN_TO_HEAD', 'RETURNED_TO_HEAD', 'REVIEWED', 'RELEASED'],
  neutral: []
}

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-success/10 text-success-ink ring-success/25',
  warning: 'bg-warning/15 text-warning-ink ring-warning/30',
  danger: 'bg-danger/10 text-danger-ink ring-danger/25',
  info: 'bg-info/10 text-info-ink ring-info/25',
  neutral: 'bg-surface-subtle text-muted-foreground ring-border'
}

export function financeStatusTone(value?: string | null): StatusTone {
  const tone = (Object.keys(statusTones) as StatusTone[]).find((key) => statusTones[key].includes(value ?? ''))
  return tone ?? 'neutral'
}

export function FinanceStatus({ value, label: customLabel }: { value?: string | null; label?: string }) {
  const { t: translate } = useTranslation('finance')
  const label =
    customLabel ?? (value ? translate(`status.${value}`, { defaultValue: translate('unknown') }) : translate('unknown'))
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${toneClasses[financeStatusTone(value)]}`}
    >
      <span aria-hidden className='size-1.5 rounded-full bg-current' />
      {label}
    </span>
  )
}

/** Labelled key figure used at the top of detail pages. */
export function FinanceStat({
  label,
  value,
  emphasis = false
}: {
  label: string
  value: ReactNode
  emphasis?: boolean
}) {
  return (
    <div className='min-w-0 space-y-1 bg-surface p-4'>
      <dt className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>{label}</dt>
      <dd
        className={`truncate font-mono text-lg font-semibold tabular-nums ${emphasis ? 'text-primary-ink' : 'text-foreground'}`}
      >
        {value}
      </dd>
    </div>
  )
}

export function FinanceStatGrid({ children, columns = 3 }: { children: ReactNode; columns?: 3 | 4 }) {
  return (
    <dl
      className={`grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
    >
      {children}
    </dl>
  )
}

export function FinanceSection({
  title,
  actions,
  children
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 id={headingId} className='text-base font-semibold tracking-tight [text-wrap:balance]'>
          {title}
        </h2>
        {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
      </div>
      {children}
    </section>
  )
}

export interface FinancePaginationData {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export function FinancePagination({
  pagination,
  onPageChange
}: {
  pagination?: FinancePaginationData
  onPageChange: (page: number) => void
}) {
  const { t: translate } = useTranslation('finance')
  if (!pagination || pagination.totalItems === 0) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-between gap-3 pt-1'>
      <span className='text-sm text-muted-foreground tabular-nums'>
        {translate('page', {
          page: pagination.page,
          pages: Math.max(1, pagination.totalPages),
          count: pagination.totalItems
        })}
      </span>
      <div className='flex gap-2'>
        <FinanceButton disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
          <ChevronLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('previous')}
        </FinanceButton>
        <FinanceButton
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          {translate('next')}
          <ChevronRight aria-hidden className='size-4' strokeWidth={1.5} />
        </FinanceButton>
      </div>
    </nav>
  )
}
