import { useTranslation } from 'react-i18next'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { notificationBodyTemplate } from '../notification-copy'

export function NotificationCopy({ notification }: { notification: NotificationListResponseDtoDataItemsItem }) {
  const { t, i18n } = useTranslation('common')
  const { formatDate } = useWorkspaceFormat()
  const code = typeof notification.params.policyCode === 'string' ? notification.params.policyCode : ''
  const policy = usePolicyGet(code, undefined, {
    query: { enabled: notification.code === 'POLICY_PUBLISHED' && /^POL-[A-Z0-9]+$/.test(code) }
  })
  if (notification.code === 'POLICY_PUBLISHED')
    return (
      <p className='mt-1 text-sm leading-6 text-muted-foreground'>
        {t('notifications.policyVersion', {
          policy: policy.data?.data?.title ?? code,
          version: String(notification.params.versionNumber ?? '')
        })}{' '}
        {t(
          notification.params.requiresReacknowledgement === true
            ? 'notifications.policyReadRequired'
            : 'notifications.policyReadOptional'
        )}
      </p>
    )
  const params: Record<string, unknown> = { ...notification.params }
  for (const [key, value] of Object.entries(params)) {
    if (key === 'reasons' && typeof value === 'string') {
      params[key] = value
        .split(',')
        .map((reason) => {
          const translation = `notifications.values.${reason.trim()}`
          return i18n.exists(translation, { ns: 'common' })
            ? t(translation as 'notifications.values.NEED')
            : t('notifications.otherReason')
        })
        .join('; ')
      continue
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) params[key] = formatDate(value)
    else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') continue
    else if (
      typeof value === 'string' &&
      /^[A-Z][A-Z_\d]+$/.test(value) &&
      i18n.exists(`notifications.values.${value}`, { ns: 'common' })
    )
      params[key] = t(`notifications.values.${value}` as 'notifications.values.NEED')
  }
  const key = `notifications.messages.${notification.code}.body`
  const resource: unknown = i18n.getResource(i18n.resolvedLanguage ?? 'vi', 'common', key)
  const raw = typeof resource === 'string' ? resource : ''
  // Select variants with machine values, then substitute localized display values.
  const template = notificationBodyTemplate(notification.code, raw, notification.params)
  const body = template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) =>
    typeof params[name] === 'object' ? '' : String(params[name] ?? '')
  )
  return body ? <p className='mt-1 break-words text-sm leading-6 text-muted-foreground'>{body}</p> : null
}
