import { expect, it } from 'vitest'
import { buildDepartmentUsageSeries } from './components/it-usage-chart-data'
import type { UsageOverviewPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/usage-overview'

it('aligns department usage by week without treating missing coverage as zero', () => {
  const item = (id: string, name: string, start: string, activeDays: number, status: 'HAS_DATA' | 'NO_DATA') =>
    ({
      department: { id, name, code: id },
      period: { start, end: start, days: 7 },
      activeDays,
      coveredDays: status === 'NO_DATA' ? 0 : 7,
      status
    }) as UsageOverviewPageResponseDtoDataItemsItem
  const result = buildDepartmentUsageSeries([
    item('a', 'Engineering', '2026-11-02', 3, 'HAS_DATA'),
    item('b', 'Design', '2026-11-02', 0, 'NO_DATA'),
    item('b', 'Design', '2026-11-09', 0, 'HAS_DATA'),
    item('a', 'Engineering', '2026-11-09', 4, 'HAS_DATA')
  ])
  expect(result.departments).toEqual([
    { id: 'a', name: 'Engineering' },
    { id: 'b', name: 'Design' }
  ])
  expect(result.points).toEqual([
    { start: '2026-11-02', a: 3, b: null },
    { start: '2026-11-09', a: 4, b: 0 }
  ])
})
