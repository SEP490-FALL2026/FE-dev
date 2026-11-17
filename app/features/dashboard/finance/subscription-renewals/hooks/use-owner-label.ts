import { useTranslation } from 'react-i18next'
import { useFinanceDepartments } from '../../shared/hooks/use-finance-departments'

/** Who owns a subscription: a department by name, or the shared pool when no department owns it. */
export function useOwnerLabel() {
  const { t: translate } = useTranslation('financeSettings')
  const { departments } = useFinanceDepartments()
  return (departmentId: string | null | undefined) => {
    if (!departmentId) return translate('renewals.sharedPool')
    return departments.find((department) => department.id === departmentId)?.name ?? translate('renewals.department')
  }
}
