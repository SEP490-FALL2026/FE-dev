import { Bell, Check, CheckCheck, LoaderCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '~/shared/lib/format-date-time'
import { useNotificationInbox } from '../hooks/use-notification-inbox'
import { notificationRequestId } from '../notification-request-id'
import { NotificationPersonnelContext } from './notification-personnel-context'

const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-8'

export function NotificationInbox({
  labelId,
  unreadCount,
  onClose,
  onOpenRequest
}: {
  labelId: string
  unreadCount?: number
  onClose: () => void
  onOpenRequest: (id: string) => void
}) {
  const { t: translate, i18n } = useTranslation('common')
  const { query, notifications, mutation, retrySeconds, markRead } = useNotificationInbox()
  const blocked = mutation.isPending || retrySeconds > 0
  const hasUnread = (unreadCount ?? 0) > 0 || notifications.some((notification) => !notification.readAt)
  return (
    <>
      <div className='flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-surface-subtle/70 px-4 py-3 sm:px-5'>
        <h2 id={labelId} className='text-base font-semibold sm:text-lg'>
          {translate('notifications.label')}
        </h2>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            className={`${buttonClass} text-primary-ink`}
            disabled={blocked || !hasUnread}
            aria-busy={mutation.isPending && !mutation.variables?.id}
            onClick={() => markRead()}
          >
            {mutation.isPending && !mutation.variables?.id ? (
              <LoaderCircle aria-hidden strokeWidth={1.5} className='size-4 animate-spin' />
            ) : (
              <CheckCheck aria-hidden strokeWidth={1.5} className='size-4' />
            )}
            {retrySeconds
              ? translate('notifications.retryAfter', { seconds: retrySeconds })
              : translate('notifications.markAllRead')}
          </button>
          <button
            type='button'
            className={`${buttonClass} size-11 min-w-11 px-2 text-muted-foreground sm:size-8 sm:min-w-8`}
            aria-label={translate('notifications.close')}
            onClick={onClose}
          >
            <X aria-hidden strokeWidth={1.5} className='size-4' />
          </button>
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain' aria-busy={query.isFetching}>
        {query.isPending && (
          <div
            role='status'
            aria-label={translate('notifications.loading')}
            className='divide-y divide-border/50 motion-safe:animate-pulse'
          >
            {[0, 1, 2].map((item) => (
              <div key={item} className='space-y-3 px-5 py-6'>
                <div className='h-4 w-2/3 rounded bg-surface-subtle' />
                <div className='h-3 w-4/5 rounded bg-surface-subtle' />
              </div>
            ))}
          </div>
        )}
        {!query.isPending && !query.isError && !notifications.length && (
          <div role='status' className='flex flex-col items-center gap-3 px-6 py-12 text-center'>
            <Bell aria-hidden strokeWidth={1.5} className='size-8 text-muted-foreground' />
            <p className='font-medium'>{translate('notifications.empty')}</p>
            <p className='text-sm text-muted-foreground'>{translate('notifications.emptyHint')}</p>
          </div>
        )}
        <ul className='divide-y divide-border/60'>
          {notifications.map((notification) => {
            const requestId = notificationRequestId(notification)
            const title = translate(
              `notifications.codes.${notification.code}` as 'notifications.codes.REQUEST_SUBMITTED',
              { defaultValue: translate('notifications.fallback') }
            )
            return (
              <li key={notification.id}>
                <article
                  className={`relative px-4 py-4 transition-colors sm:px-5 ${notification.readAt ? 'bg-surface' : 'bg-primary-soft/25'}`}
                >
                  {!notification.readAt && (
                    <span
                      aria-label={translate('notifications.unread')}
                      className='absolute top-6 left-4 size-2 rounded-full bg-primary ring-4 ring-primary/10 sm:left-5'
                    />
                  )}
                  <div className='pl-5'>
                    <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1'>
                      <h3
                        className={`min-w-0 flex-1 basis-48 text-sm leading-6 ${notification.readAt ? 'font-medium' : 'font-semibold'}`}
                      >
                        {title}
                      </h3>
                      <time
                        dateTime={notification.createdAt}
                        className='pt-0.5 text-right font-mono text-xs leading-5 text-muted-foreground tabular-nums'
                      >
                        {formatDateTime(notification.createdAt, i18n.resolvedLanguage)}
                      </time>
                    </div>
                    <p className='mt-1 break-words text-sm leading-6 text-muted-foreground'>
                      {requestId
                        ? translate('notifications.requestReference', { id: requestId })
                        : translate('notifications.updateHint')}
                    </p>
                    <NotificationPersonnelContext notification={notification} />
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                      {!notification.readAt && (
                        <button
                          type='button'
                          className={`${buttonClass} border border-border bg-surface text-muted-foreground`}
                          disabled={blocked}
                          aria-busy={mutation.isPending && mutation.variables?.id === notification.id}
                          onClick={() => markRead(notification.id)}
                        >
                          {mutation.isPending && mutation.variables?.id === notification.id ? (
                            <LoaderCircle aria-hidden strokeWidth={1.5} className='size-3.5 animate-spin' />
                          ) : (
                            <Check aria-hidden strokeWidth={1.5} className='size-3.5' />
                          )}
                          {translate('notifications.markRead')}
                        </button>
                      )}
                      {requestId && (
                        <button
                          type='button'
                          className={`${buttonClass} text-primary-ink`}
                          onClick={() => onOpenRequest(requestId)}
                        >
                          {translate('notifications.openRequest')}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {query.isError && (
          <div role='alert' className='px-5 py-6 text-center text-sm text-muted-foreground'>
            {translate('notifications.loadError')}
          </div>
        )}
      </div>
      {(query.hasNextPage || query.isError) && (
        <div className='shrink-0 border-t border-border/60 bg-surface-subtle/60 p-2'>
          <button
            type='button'
            className={`${buttonClass} w-full text-primary-ink`}
            disabled={query.isFetching}
            aria-busy={query.isFetching}
            onClick={() => {
              if (query.isFetching) return
              if (query.isFetchNextPageError || (!query.isError && query.hasNextPage))
                void query.fetchNextPage({ cancelRefetch: false })
              else void query.refetch()
            }}
          >
            {query.isFetching && <LoaderCircle aria-hidden strokeWidth={1.5} className='size-4 animate-spin' />}
            {translate(
              query.isFetching
                ? 'notifications.loading'
                : query.isError
                  ? 'notifications.retry'
                  : 'notifications.loadMore'
            )}
          </button>
        </div>
      )}
    </>
  )
}
