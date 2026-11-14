import { useState } from 'react'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'

export function useEmployeeCatalogSelection(initialPlanId = '') {
  const [selected, setSelected] = useState<RequestablePlanPageResponseDtoDataItemsItem | string | null>(
    initialPlanId || null
  )
  const planId = typeof selected === 'string' ? selected : (selected?.id ?? '')
  const query = useRequestablePlanGet(planId, { query: { enabled: !!planId } })
  const details = !query.isError ? query.data?.data : null
  const plan = typeof selected === 'string' ? (details ?? null) : selected
  const ready = !!plan && !!details && details.id === planId && details.application.id === plan.application.id
  return {
    plan,
    setPlan: (plan: RequestablePlanPageResponseDtoDataItemsItem | null) => setSelected(plan),
    setPlanId: (id: string) => setSelected(id || null),
    query,
    details: ready ? details : null,
    ready,
    canSubmit: ready && plan.canSubmit && details.canSubmit
  }
}
