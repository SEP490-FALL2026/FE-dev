import { LoaderCircle } from 'lucide-react'
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode
} from 'react'
import { useTranslation } from 'react-i18next'
import { getEmployeeError } from '../hooks/employee-errors'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'

export const employeeInputClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-10 md:text-sm'

const InvalidFieldsContext = createContext<readonly string[]>([])
export function EmployeeFormErrors({ fields, children }: { fields: readonly string[]; children: ReactNode }) {
  return <InvalidFieldsContext value={fields}>{children}</InvalidFieldsContext>
}

export function EmployeeButton({
  children,
  primary,
  busy,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; busy?: boolean }) {
  return (
    <button
      type='button'
      {...props}
      aria-busy={busy || undefined}
      disabled={props.disabled || busy}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${primary ? 'bg-primary text-foreground shadow-sm hover:bg-primary-hover' : 'border border-border/80 bg-surface hover:bg-surface-subtle'}`}
    >
      {busy && <LoaderCircle aria-hidden='true' className='size-4 animate-spin' strokeWidth={1.5} />}
      {children}
    </button>
  )
}

export function EmployeeField({ label, children }: { label: string; children: ReactNode }) {
  const fields = useContext(InvalidFieldsContext)
  const id = useId()
  const { t: translate } = useTranslation('employee')
  const input = isValidElement<InputHTMLAttributes<HTMLInputElement>>(children) ? children : null
  const invalid = !!input?.props.name && fields.includes(input.props.name)
  return (
    <label className='grid min-w-0 gap-2 text-sm font-medium'>
      {label}
      {input
        ? cloneElement(input, { 'aria-invalid': invalid || undefined, 'aria-describedby': invalid ? id : undefined })
        : children}
      <span id={id} className='min-h-5 text-xs text-danger'>
        {invalid ? translate('errors.validation') : null}
      </span>
    </label>
  )
}

export function EmployeeInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={employeeInputClass} />
}

export { WorkspaceSection as EmployeeSection } from '~/shared/ui/workspace-section'

export function EmployeeQueryState({
  query,
  empty,
  emptyTitle,
  emptyDescription,
  emptyAction
}: {
  query: { isPending: boolean; isError: boolean; isFetching?: boolean; error: unknown; refetch: () => unknown }
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}) {
  const { t: translate } = useTranslation('employee')
  if (query.isPending)
    return (
      <p role='status' className='flex items-center gap-2 py-8 text-sm text-muted-foreground'>
        <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin' />
        {translate('loading')}
      </p>
    )
  if (query.isError) {
    const failure = getEmployeeError(query.error)
    return (
      <div role='alert' className='space-y-3 py-4'>
        <p>{translate(`errors.${failure.key}`)}</p>
        {failure.requestId && <p className='text-xs font-mono'>{translate('requestId', { id: failure.requestId })}</p>}
        <EmployeeButton busy={query.isFetching} onClick={() => void query.refetch()}>
          {translate('retry')}
        </EmployeeButton>
      </div>
    )
  }
  if (empty)
    return (
      <WorkspaceEmptyState
        title={emptyTitle ?? translate('empty')}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  return query.isFetching ? (
    <p role='status' className='text-xs text-muted-foreground'>
      {translate('refreshing')}
    </p>
  ) : null
}

export function EmployeePagination({
  pagination,
  onPage,
  busy
}: {
  pagination?: { page: number; totalPages: number }
  onPage: (page: number) => void
  busy?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  if (!pagination || pagination.totalPages < 2) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-end gap-3 pt-4'>
      <EmployeeButton disabled={busy || pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>
        {translate('previous')}
      </EmployeeButton>
      <span className='text-right font-mono text-sm tabular-nums'>
        {translate('page', { page: pagination.page, total: pagination.totalPages })}
      </span>
      <EmployeeButton
        disabled={busy || pagination.page >= pagination.totalPages}
        onClick={() => onPage(pagination.page + 1)}
      >
        {translate('next')}
      </EmployeeButton>
    </nav>
  )
}

export function EmployeeStatus({ value }: { value: string }) {
  const { t: translate, i18n } = useTranslation('employee')
  const known = Object.hasOwn(i18n.getResourceBundle(i18n.resolvedLanguage ?? 'vi', 'employee')?.statuses ?? {}, value)
  const tone = !known
    ? 'border-border/60 bg-surface-subtle text-muted-foreground'
    : ['COMPLETED', 'APPROVED', 'CONFIRMED', 'HANDED_OVER', 'HANDLED', 'RESOLVED'].includes(value)
      ? 'border-success/20 bg-success/10 text-success-ink'
      : ['FAILED', 'REJECTED', 'IT_REJECTED', 'SPEND_REJECTED', 'NEED_REJECTED'].includes(value)
        ? 'border-danger/20 bg-danger/10 text-danger-ink'
        : ['PENDING', 'OPEN', 'NEW', 'WAITING_REPORTER', 'AWAITING_REVOCATION'].includes(value)
          ? 'border-warning/25 bg-warning/10 text-warning-ink'
          : 'border-border/60 bg-surface-subtle text-muted-foreground'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${tone}`}>
      <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
      {known ? translate(`statuses.${value}` as 'statuses.PENDING') : translate('unknownStatus')}
    </span>
  )
}
