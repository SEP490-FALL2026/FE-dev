import { useState } from 'react'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'

export function useEmployeeCatalogSelection() {
  const [plan, setPlan] = useState<RequestablePlanPageResponseDtoDataItemsItem | null>(null)
  const query = useRequestablePlanGet(plan?.id ?? '', { query: { enabled: !!plan } })
  const details = !query.isError ? query.data?.data : null
  const ready = !!plan && !!details && details.id === plan.id && details.application.id === plan.application.id
  return {
    plan,
    setPlan,
    query,
    details: ready ? details : null,
    ready,
    canSubmit: ready && plan.canSubmit && details.canSubmit
  }
}
