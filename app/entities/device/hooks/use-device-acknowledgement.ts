import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useMyDeviceAcknowledgementCreate } from '~/shared/api/generated/operations/my-devices/my-device-acknowledgement-create'
import { getMyDeviceListQueryKey } from '~/shared/api/generated/operations/my-devices/my-device-list'
import { getMonitoringNoticeCurrentGetQueryKey } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import { getDeviceGetQueryKey } from '~/shared/api/generated/operations/devices/device-get'
import { getDeviceListQueryKey } from '~/shared/api/generated/operations/devices/device-list'
import { getItAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/it-admin-dashboard-get'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { recordAdminRetryDelay, useAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getDevicePrivacyError } from '../device-privacy-errors'

export function useDeviceAcknowledgement(deviceId: string, onSuccess: () => void) {
  const client = useQueryClient()
  const { t: translate } = useTranslation('devicePrivacy')
  const [uncertain, setUncertain] = useState(false)
  const [checking, setChecking] = useState(false)
  const retrySeconds = useAdminRetryDelay()
  const submitting = useRef(false)
  const refresh = () =>
    Promise.all(
      [
        getMyDeviceListQueryKey(),
        getMonitoringNoticeCurrentGetQueryKey(),
        getDeviceGetQueryKey(deviceId),
        getDeviceListQueryKey(),
        getItAdminDashboardGetQueryKey()
      ].map((queryKey) => client.invalidateQueries({ queryKey }))
    )
  const mutation = useMyDeviceAcknowledgementCreate({
    mutation: {
      retry: false,
      onSuccess: async (result, variables) => {
        // A missing acknowledgement is an uncertain write, never a fabricated success.
        if (!result.data?.id || result.data.registrationId !== variables.id) {
          setUncertain(true)
          toast.error(translate('errors.uncertain'), { id: 'device-acknowledgement' })
          await refresh()
          return
        }
        await refresh()
        toast.success(translate('acknowledged'), { id: 'device-acknowledgement' })
        onSuccess()
      },
      onError: async (error) => {
        const failure = getDevicePrivacyError(error, true)
        setUncertain(failure.key === 'uncertain')
        recordAdminRetryDelay(client, error)
        toast.error(translate(`errors.${failure.key}`), { id: 'device-acknowledgement' })
        if (failure.status === 403)
          await client.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
        if (failure.status !== 429) await refresh()
      },
      onSettled: () => {
        submitting.current = false
      }
    }
  })
  return {
    mutation,
    uncertain,
    checking,
    retrySeconds,
    submit: (registrationId: string, noticeVersionId: string) => {
      if (submitting.current || mutation.isPending || uncertain || checking || retrySeconds) return
      submitting.current = true
      mutation.mutate({ id: registrationId, data: { noticeVersionId } })
    },
    recheck: async () => {
      if (checking || retrySeconds) return
      setChecking(true)
      try {
        await Promise.all(
          [getMyDeviceListQueryKey(), getMonitoringNoticeCurrentGetQueryKey()].map((queryKey) =>
            client.refetchQueries({ queryKey, type: 'active' }, { throwOnError: true })
          )
        )
        setUncertain(false)
      } catch {
        toast.error(translate('errors.unavailable'), { id: 'device-acknowledgement' })
      } finally {
        setChecking(false)
      }
    }
  }
}
