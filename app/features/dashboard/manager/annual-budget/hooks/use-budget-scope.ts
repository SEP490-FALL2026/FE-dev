import { useSearchParams } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { isResourceId } from '../../shared/manager-identifiers'

export function useBudgetScope() {
  const [params] = useSearchParams()
  const me = useMeGet()
  const user = !me.isError ? me.data?.data : undefined
  const currentId = user?.managerScope?.departmentId ?? ''
  const department = useDepartmentGet(currentId, { query: { enabled: isResourceId(currentId) } })
  const currentDepartment = !department.isError && department.data?.data?.id === currentId ? department.data.data : null
  const units = [
    ...(user?.managerScope
      ? [
          {
            departmentId: currentId,
            departmentName: user.managerScope.departmentName,
            costCenterId: currentDepartment?.costCenter?.id ?? null
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
    isCurrent: !!user?.managerScope && selected?.departmentId === currentId,
    query: me.isPending || me.isError || selected?.departmentId !== currentId ? me : department,
    isPending:
      me.isPending || (isResourceId(currentId) && selected?.departmentId === currentId && department.isPending),
    isError: me.isError || (isResourceId(currentId) && selected?.departmentId === currentId && department.isError)
  }
}
