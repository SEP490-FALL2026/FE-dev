import { useSearchParams } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'

export function useBudgetScope() {
  const [params] = useSearchParams()
  const me = useMeGet()
  const user = !me.isError ? me.data?.data : undefined
  const currentId = user?.managerScope?.departmentId ?? ''
  const department = useDepartmentGet(currentId, { query: { enabled: !!currentId } })
  const units = [
    ...(user?.managerScope
      ? [
          {
            departmentId: currentId,
            departmentName: user.managerScope.departmentName,
            costCenterId: department.data?.data?.costCenter?.id ?? null
          }
        ]
      : []),
    ...(user?.upcomingUnits ?? [])
  ]
  const selected =
    units.find((unit) => unit.departmentId === params.get('departmentId')) ??
    units.find((unit) => unit.costCenterId === params.get('costCenterId')) ??
    units[0]
  return {
    units,
    departmentId: selected?.departmentId ?? '',
    costCenterId: selected?.costCenterId ?? undefined,
    isPending: me.isPending || (!!currentId && selected?.departmentId === currentId && department.isPending),
    isError: me.isError || (!!currentId && selected?.departmentId === currentId && department.isError)
  }
}
