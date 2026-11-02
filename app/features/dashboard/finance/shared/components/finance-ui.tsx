import { LoaderCircle, Search } from 'lucide-react'
import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceRetry } from '../hooks/use-finance-retry'

export { FinanceQueryState } from './finance-query-state'
export { FinanceDrawer } from './finance-drawer'

export const financeInputClass =
  'min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 md:min-h-9 md:text-sm'

export function FinancePage({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]'>{title}</h1>
        {actions}
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
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const retrySeconds = useFinanceRetry()
  const { t: translate } = useTranslation('finance')
  const colors =
    variant === 'primary'
      ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary-hover'
      : variant === 'ghost'
        ? 'border-transparent text-muted-foreground hover:bg-surface-subtle'
        : 'border-border bg-surface text-foreground hover:bg-surface-subtle'
  return (
    <button
      {...props}
      type={type}
      aria-busy={pending || undefined}
      disabled={disabled || pending || retrySeconds > 0}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-9 ${colors} ${className}`}
    >
      {pending && <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />}
      {retrySeconds > 0 ? translate('retryAfter', { seconds: retrySeconds }) : children}
    </button>
  )
}

export function FinanceField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className='block min-w-0 space-y-1.5 text-sm font-medium text-foreground'>
      <span>{label}</span>
      {children}
      {hint && <span className='block min-h-5 text-xs font-normal text-muted-foreground'>{hint}</span>}
    </label>
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

export function FinanceEmpty() {
  const { t: translate } = useTranslation('finance')
  return (
    <p
      role='status'
      className='rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground'
    >
      {translate('empty')}
    </p>
  )
}

export function FinanceStatus({ value }: { value?: string | null }) {
  const { t: translate } = useTranslation('finance')
  const positive = ['APPROVED', 'ACTIVE', 'ANSWERED', 'COMPLETED', 'BUDGET_OK', 'DECLARED'].includes(value ?? '')
  const label = value ? translate(`status.${value}`, { defaultValue: translate('unknown') }) : translate('unknown')
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${positive ? 'bg-success/10 text-success' : 'bg-surface-subtle text-muted-foreground'}`}
    >
      <span aria-hidden className='size-1.5 rounded-full bg-current' />
      {label}
    </span>
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
  if (!pagination) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-between gap-3 py-3'>
      <span className='text-sm text-muted-foreground'>
        {translate('page', {
          page: pagination.page,
          pages: Math.max(1, pagination.totalPages),
          count: pagination.totalItems
        })}
      </span>
      <div className='flex gap-2'>
        <FinanceButton disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
          {translate('previous')}
        </FinanceButton>
        <FinanceButton
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          {translate('next')}
        </FinanceButton>
      </div>
    </nav>
  )
}
