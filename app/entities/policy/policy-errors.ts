import axios from 'axios'

const policyErrors = {
  'POLICY.VERSION_CHANGED': 'errors.versionChanged',
  'POLICY.CHECKLIST_INCOMPLETE': 'errors.incomplete',
  'POLICY.CHECKLIST_HAS_NO': 'errors.hasNo',
  'POLICY.NOT_IN_FORCE': 'errors.notInForce'
} as const

function errorCode(error: unknown) {
  return axios.isAxiosError<{ error?: { code?: string } }>(error) ? error.response?.data.error?.code : undefined
}

/** i18n key (namespace `policy`) for a checklist error of a decision route, if it is one. */
export function policyErrorKey(error: unknown) {
  const code = errorCode(error)
  return code && Object.hasOwn(policyErrors, code) ? policyErrors[code as keyof typeof policyErrors] : undefined
}

/** The policy was republished while the person answered: the questions must be loaded and answered again. */
export function isPolicyVersionChanged(error: unknown) {
  return errorCode(error) === 'POLICY.VERSION_CHANGED'
}
