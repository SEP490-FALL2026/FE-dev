import { LoaderCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode
} from 'react'
import { useTranslation } from 'react-i18next'
import { formatDecimalMoney } from '~/shared/lib/format-decimal-money'
import { getManagerError } from '../hooks/manager-errors'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { ManagerEmptyState } from './manager-empty-state'

export const managerInputClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-10 md:text-sm'
const InvalidFields = createContext<readonly string[]>([])
export function ManagerFormErrors({ fields, children }: { fields: readonly string[]; children: ReactNode }) {
  return <InvalidFields value={fields}>{children}</InvalidFields>
}
export function ManagerField({ label, children }: { label: string; children: ReactNode }) {
  const fields = useContext(InvalidFields)
  const id = useId()
  const { t: translate } = useTranslation('manager')
  const input = isValidElement<InputHTMLAttributes<HTMLInputElement>>(children) ? children : null
  const invalid =
    !!input?.props.name &&
    fields.some((field) => field === input.props.name || field.startsWith(`${input.props.name}.`))
  return (
    <label className='grid min-w-0 gap-2 text-sm font-medium'>
      {label}
      {input
        ? cloneElement(input, { 'aria-invalid': invalid || undefined, 'aria-describedby': invalid ? id : undefined })
        : children}
      <span id={id} className='min-h-5 text-xs text-danger'>
        {invalid ? translate('validation') : null}
      </span>
    </label>
  )
}
export function ManagerButton({
  primary,
  busy,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; busy?: boolean }) {
  return (
    <button
      type='button'
      {...props}
      disabled={props.disabled || busy}
      aria-busy={busy || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${primary ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover' : 'border border-border/80 bg-surface hover:bg-surface-subtle'}`}
    >
      {busy && <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin' />}
      {children}
    </button>
  )
}
export { WorkspaceSection as ManagerSection } from '~/shared/ui/workspace-section'
export function ManagerQueryState({
  query,
  empty,
  syncPermissions = true,
  emptyTitle,
  emptyDescription,
  emptyAction
}: {
  query: { isPending: boolean; isError: boolean; isFetching?: boolean; error: unknown; refetch: () => unknown }
  empty?: boolean
  syncPermissions?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}) {
  const { t: translate } = useTranslation('manager')
  const client = useQueryClient()
  useEffect(() => {
    if (syncPermissions && query.isError && getManagerError(query.error).key === 'forbidden') {
      void client
        .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
        .catch(() => undefined)
    }
  }, [client, query.isError, query.error, syncPermissions])
  if (query.isPending)
    return (
      <p role='status' className='flex items-center gap-2 py-6 text-sm text-muted-foreground'>
        <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin' />
        {translate('loading')}
      </p>
    )
  if (query.isError) {
    const failure = getManagerError(query.error)
    return (
      <div role='alert' className='space-y-3 py-4'>
        <p>{translate(`errors.${failure.key}`)}</p>
        {failure.requestId && <p className='font-mono text-xs'>{translate('requestId', { id: failure.requestId })}</p>}
        <ManagerButton busy={query.isFetching} onClick={() => void query.refetch()}>
          {translate('retry')}
        </ManagerButton>
      </div>
    )
  }
  if (empty)
    return (
      <ManagerEmptyState title={emptyTitle ?? translate('empty')} description={emptyDescription} action={emptyAction} />
    )
  return query.isFetching ? (
    <p role='status' className='text-xs text-muted-foreground'>
      {translate('refreshing')}
    </p>
  ) : null
}
export function ManagerPagination({
  pagination,
  onPage,
  busy
}: {
  pagination?: { page: number; totalPages: number }
  onPage: (page: number) => void
  busy?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  if (!pagination || pagination.totalPages < 2) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-end gap-3 pt-4'>
      <ManagerButton disabled={busy || pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>
        {translate('previous')}
      </ManagerButton>
      <span className='text-right font-mono text-sm tabular-nums'>
        {translate('page', { page: pagination.page, total: pagination.totalPages })}
      </span>
      <ManagerButton
        disabled={busy || pagination.page >= pagination.totalPages}
        onClick={() => onPage(pagination.page + 1)}
      >
        {translate('next')}
      </ManagerButton>
    </nav>
  )
}
export function ManagerStatus({ value }: { value: string }) {
  const { t: translate, i18n } = useTranslation('manager')
  const known = Object.hasOwn(i18n.getResourceBundle(i18n.resolvedLanguage ?? 'vi', 'manager')?.statuses ?? {}, value)
  const tone = !known
    ? 'border-border/60 bg-surface-subtle text-muted-foreground'
    : ['ACTIVE', 'WORKING', 'APPROVED', 'RECORDED', 'COMPLETED', 'HANDLED', 'HANDED_OVER', 'NEED_CONFIRMED'].includes(
          value
        )
      ? 'border-success/20 bg-success/10 text-success-ink'
      : ['REJECTED', 'FAILED', 'BLOCKED', 'SPEND_REJECTED', 'IT_REJECTED'].includes(value)
        ? 'border-danger/20 bg-danger/10 text-danger-ink'
        : [
              'PENDING',
              'OPEN',
              'PENDING_VERIFICATION',
              'RETURNED',
              'AWAITING_SPEND_SUBMISSION',
              'AWAITING_NEED',
              'RETURNED_BY_FINANCE'
            ].includes(value)
          ? 'border-warning/25 bg-warning/10 text-warning-ink'
          : 'border-border/60 bg-surface-subtle text-muted-foreground'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${tone}`}>
      <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
      {known ? translate(`statuses.${value}` as 'statuses.PENDING') : translate('unknownStatus')}
    </span>
  )
}
export function ManagerMoney({ money }: { money?: { amount: string; currency: string } | null }) {
  const { i18n, t: translate } = useTranslation('manager')
  return (
    <span className='text-right font-mono tabular-nums'>
      {money
        ? (formatDecimalMoney(money, i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN') ?? translate('empty'))
        : translate('empty')}
    </span>
  )
}
export function ManagerActionState({ action }: { action: { uncertain: boolean } }) {
  const { t: translate } = useTranslation('manager')
  return action.uncertain ? (
    <div className='space-y-3'>
      <p role='status' className='text-sm text-warning'>
        {translate('uncertain')}
      </p>
      <ManagerButton onClick={() => window.location.reload()}>{translate('refreshOutcome')}</ManagerButton>
    </div>
  ) : null
}
