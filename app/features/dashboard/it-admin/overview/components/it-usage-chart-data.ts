import type { UsageOverviewPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/usage-overview'

type Point = { start: string; [departmentId: string]: string | number | null }
export function buildDepartmentUsageSeries(items: UsageOverviewPageResponseDtoDataItemsItem[]) {
  const departments = new Map<string, string>()
  const periods = new Map<string, Point>()
  for (const item of items) {
    if (!item.department) continue
    departments.set(item.department.id, item.department.name)
    const point = periods.get(item.period.start) ?? { start: item.period.start }
    point[item.department.id] = item.status === 'NO_DATA' ? null : item.activeDays
    periods.set(item.period.start, point)
  }
  return {
    departments: Array.from(departments, ([id, name]) => ({ id, name })),
    points: Array.from(periods.values()).sort((a, b) => a.start.localeCompare(b.start))
  }
}
