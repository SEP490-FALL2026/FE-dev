import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/notifications/notificationListResponseDtoDataItemsItem'

export function notificationRequestId(notification: NotificationListResponseDtoDataItemsItem) {
  const value = notification.params.requestId
  return typeof value === 'string' && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value)
    ? value
    : undefined
}
