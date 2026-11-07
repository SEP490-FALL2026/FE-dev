import axios from 'axios'
import type { devicePrivacy } from '~/shared/i18n/locales/en/device-privacy'

const deviceErrors = {
  'DEVICE_REGISTRATION.SIGNATURE_RECORD_MISSING': 'signature',
  'DEVICE_REGISTRATION.ENDED': 'ended',
  'DEVICE_ACKNOWLEDGEMENT.NOTICE_NOT_CURRENT': 'conflict',
  'DEVICE_ACKNOWLEDGEMENT.ALREADY_ACKNOWLEDGED': 'already'
} as const

export function getDevicePrivacyError(error: unknown, writing = false) {
  const response = axios.isAxiosError<{ error?: { code?: string; requestId?: string } }>(error)
    ? error.response
    : undefined
  const status = response?.status
  const code = response?.data?.error?.code ?? ''
  const key: keyof typeof devicePrivacy.errors = Object.hasOwn(deviceErrors, code)
    ? deviceErrors[code as keyof typeof deviceErrors]
    : status === 403
      ? 'forbidden'
      : status === 404
        ? 'missing'
        : status === 409
          ? 'conflict'
          : status === 422
            ? 'validation'
            : status === 429
              ? 'rateLimit'
              : writing && (!response || (status && status >= 500))
                ? 'uncertain'
                : 'unavailable'
  return { key, status }
}
