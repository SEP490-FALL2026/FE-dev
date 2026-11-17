import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'

export interface FinanceDepartment {
  id: string
  code: string
  name: string
}

/**
 * Departments Finance can pick from. Finance cannot read `/departments` (Super Admin and IT Admin only), so they come
 * from the department Cost Centers (kind UNIT), which carry the department they belong to.
 */
export function useFinanceDepartments() {
  const query = useCostCenterList({ kind: 'UNIT', pageSize: 100 })
  const departments: FinanceDepartment[] = []
  const seen = new Set<string>()
  for (const costCenter of query.data?.data?.items ?? []) {
    const department = costCenter.department
    if (!department || seen.has(department.id)) continue
    seen.add(department.id)
    departments.push({ id: department.id, code: department.code, name: department.name })
  }
  departments.sort((left, right) => left.name.localeCompare(right.name))
  return { departments, isPending: query.isPending, isError: query.isError }
}
