import { LoaderCircle } from 'lucide-react'
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { adminButtonClass } from '~/shared/ui/form-dialog'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { recordAdminRetryDelay, useAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getDevicePrivacyError } from '../device-privacy-errors'

export function DeviceButton({
  busy,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      type='button'
      {...props}
      className={adminButtonClass}
      disabled={busy || props.disabled}
      aria-busy={busy || undefined}
    >
      {busy && <LoaderCircle aria-hidden strokeWidth={1.5} className='size-4 animate-spin' />}
      {children}
    </button>
  )
}

export function DeviceValue({ value, blocked = false }: { value: string; blocked?: boolean }) {
  const { t: translate } = useTranslation('devicePrivacy')
  return <>{translate(`${blocked ? 'blocked' : 'values'}.${value}`, { defaultValue: translate('unknown') })}</>
}

export function DeviceQueryState({
  query,
  children,
  empty,
  emptyTitle,
  emptyHint
}: {
  query: { isPending: boolean; isError: boolean; isFetching: boolean; error: unknown; refetch: () => unknown }
  children?: ReactNode
  empty?: boolean
  emptyTitle?: string
  emptyHint?: string
}) {
  const { t: translate } = useTranslation('devicePrivacy')
  const retrySeconds = useAdminRetryDelay()
  const client = useQueryClient()
  useEffect(() => {
    if (query.isError) recordAdminRetryDelay(client, query.error)
  }, [client, query.isError, query.error])
  if (query.isPending)
    return (
      <p role='status' className='flex items-center gap-2 py-6 text-sm text-muted-foreground'>
        <LoaderCircle aria-hidden strokeWidth={1.5} className='size-4 animate-spin' />
        {translate('loading')}
      </p>
    )
  if (query.isError)
    return (
      <div role='alert' className='space-y-3 py-4'>
        <p className='text-sm'>{translate(`errors.${getDevicePrivacyError(query.error).key}`)}</p>
        <DeviceButton busy={query.isFetching} disabled={retrySeconds > 0} onClick={() => void query.refetch()}>
          {retrySeconds ? translate('retryIn', { count: retrySeconds }) : translate('retry')}
        </DeviceButton>
      </div>
    )
  return (
    <>
      {query.isFetching && (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate('refreshing')}
        </p>
      )}
      {empty ? (
        <WorkspaceEmptyState title={emptyTitle ?? translate('unavailableValue')} description={emptyHint} />
      ) : (
        children
      )}
    </>
  )
}

export function DevicePagination({
  pagination,
  busy,
  onPage
}: {
  pagination?: { page: number; totalPages: number }
  busy: boolean
  onPage: (page: number) => void
}) {
  const { t: translate } = useTranslation('devicePrivacy')
  if (!pagination || pagination.totalPages < 2) return null
  return (
    <nav aria-label={translate('pagination')} className='flex flex-wrap items-center justify-end gap-3 pt-4'>
      <DeviceButton disabled={busy || pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>
        {translate('previous')}
      </DeviceButton>
      <span className='text-right font-mono text-sm tabular-nums'>
        {translate('page', { page: pagination.page, total: pagination.totalPages })}
      </span>
      <DeviceButton
        disabled={busy || pagination.page >= pagination.totalPages}
        onClick={() => onPage(pagination.page + 1)}
      >
        {translate('next')}
      </DeviceButton>
    </nav>
  )
}
