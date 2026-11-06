import { getDeviceListQueryKey } from '~/shared/api/generated/operations/devices/device-list'
import { getDeviceGetQueryKey } from '~/shared/api/generated/operations/devices/device-get'
import { getDeviceCredentialListQueryKey } from '~/shared/api/generated/operations/device-credentials/device-credential-list'
import { getMyDeviceListQueryKey } from '~/shared/api/generated/operations/my-devices/my-device-list'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function useDeviceFeedback(id?: string, registrationId?: string | null, onSuccess?: () => void) {
  return useItMutationFeedback(
    [
      getDeviceListQueryKey(),
      getMyDeviceListQueryKey(),
      ...(id ? [getDeviceGetQueryKey(id)] : []),
      ...(registrationId ? [getDeviceCredentialListQueryKey(registrationId)] : [])
    ],
    onSuccess
  )
}
