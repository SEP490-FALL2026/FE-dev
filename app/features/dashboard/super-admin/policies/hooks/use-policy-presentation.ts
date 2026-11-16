import { useTranslation } from 'react-i18next'

const policyKeys = {
  'POL-GEN': 'policies.names.POL-GEN',
  'POL-MF1': 'policies.names.POL-MF1',
  'POL-MF2': 'policies.names.POL-MF2',
  'POL-MF3': 'policies.names.POL-MF3',
  'POL-MF4': 'policies.names.POL-MF4',
  'POL-MF5': 'policies.names.POL-MF5',
  'POL-USAGE': 'policies.names.POL-USAGE',
  'POL-SAAS': 'policies.names.POL-SAAS'
} as const
const stepKeys = {
  '1.2': 'policies.stepNames.need',
  '1.6': 'policies.stepNames.reserve',
  '1.7': 'policies.stepNames.spend',
  '1.3': 'policies.stepNames.assessment',
  '4.7': 'policies.stepNames.budget',
  '5.3': 'policies.stepNames.recommendation',
  '5.4': 'policies.stepNames.unused'
} as const
const roleKeys = {
  EMPLOYEE: 'roles.EMPLOYEE',
  MANAGER: 'roles.MANAGER',
  IT_ADMIN: 'roles.IT_ADMIN',
  FINANCE: 'roles.FINANCE',
  SPENDING_APPROVER: 'roles.SPENDING_APPROVER',
  SUPER_ADMIN: 'roles.SUPER_ADMIN'
} as const
export function usePolicyPresentation() {
  const { t } = useTranslation('admin')
  const { t: roles } = useTranslation('adminAccounts')
  return {
    policyName: (code: string, title?: string) =>
      Object.hasOwn(policyKeys, code)
        ? t(policyKeys[code as keyof typeof policyKeys])
        : title?.trim() && title !== code
          ? title
          : t('policies.unnamed'),
    stepName: (code: string) =>
      Object.hasOwn(stepKeys, code) ? t(stepKeys[code as keyof typeof stepKeys]) : t('policies.unknownStep'),
    roleName: (role: string) =>
      Object.hasOwn(roleKeys, role) ? roles(roleKeys[role as keyof typeof roleKeys]) : t('unknown')
  }
}
