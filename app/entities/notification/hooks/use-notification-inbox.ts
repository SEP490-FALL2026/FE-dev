import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  notificationList,
  getNotificationListQueryKey
} from '~/shared/api/generated/operations/notifications/notification-list'
import { notificationMarkRead } from '~/shared/api/generated/operations/notifications/notification-mark-read'
import { notificationMarkAllRead } from '~/shared/api/generated/operations/notifications/notification-mark-all-read'
import { getNotificationUnreadCountQueryKey } from '~/shared/api/generated/operations/notifications/notification-unread-count'

export function useNotificationInbox() {
  const client = useQueryClient()
  const { t: translate } = useTranslation('common')
  const [retrySeconds, setRetrySeconds] = useState(0)
  const locked = useRef(false)
  useEffect(() => {
    if (!retrySeconds) return
    const timer = window.setTimeout(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [retrySeconds])

  const query = useInfiniteQuery({
    queryKey: [...getNotificationListQueryKey(), { presentation: 'inbox', pageSize: 10 }],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => notificationList({ page: pageParam, pageSize: 10 }, undefined, signal),
    getNextPageParam: (response) => {
      const pagination = response.data?.pagination
      return pagination && pagination.page < pagination.totalPages ? pagination.page + 1 : undefined
    },
    retry: false
  })
  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: getNotificationListQueryKey() }),
      client.invalidateQueries({ queryKey: getNotificationUnreadCountQueryKey() })
    ])
  const mutation = useMutation({
    mutationFn: async ({ id }: { id?: string }) => {
      if (id) await notificationMarkRead(id)
      else await notificationMarkAllRead()
    },
    retry: false,
    onSuccess: () => {
      toast.success(translate('notifications.saved'), { id: 'notification-read' })
    },
    onError: (error) => {
      const response = axios.isAxiosError(error) ? error.response : undefined
      if (response?.status === 429) {
        const seconds = Number(
          response.headers['retry-after'] ?? response.data?.error?.details?.retryAfterSeconds ?? 60
        )
        setRetrySeconds(Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : 60)
      }
      toast.error(
        translate(!response || response.status >= 500 ? 'notifications.uncertain' : 'notifications.saveError'),
        { id: 'notification-read' }
      )
    },
    onSettled: async () => {
      await refresh()
      locked.current = false
    }
  })

  return {
    query,
    notifications: [
      ...new Map(
        query.data?.pages.flatMap((response) => response.data?.items ?? []).map((item) => [item.id, item])
      ).values()
    ],
    mutation,
    retrySeconds,
    markRead: (id?: string) => {
      if (locked.current || mutation.isPending || retrySeconds) return
      locked.current = true
      mutation.mutate({ id })
    }
  }
}
