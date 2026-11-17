import { describe, expect, it } from 'vitest'
import { isReservedCostCenterName, normalizeCostCenterName, suggestCostCenterCode } from './cost-center-naming'

describe('Cost Center naming', () => {
  it('recognises the names kept for unallocated costs without case or accents', () => {
    for (const name of ['Chưa phân loại', 'CHƯA PHÂN BỔ', ' chua phan bo  cost center ', 'Unclassified', 'unallocated'])
      expect(isReservedCostCenterName(name)).toBe(true)
    expect(isReservedCostCenterName('Phòng Kỹ thuật')).toBe(false)
  })

  it('shows a name with single spaces and none at either end', () => {
    expect(normalizeCostCenterName('  Phòng   Kỹ  thuật ')).toBe('Phòng Kỹ thuật')
  })

  it('suggests a code from the department code that BE accepts', () => {
    expect(suggestCostCenterCode('p-eng')).toBe('CC-P-ENG')
    expect(suggestCostCenterCode('KT 01/A')).toBe('CC-KT-01-A')
    expect(suggestCostCenterCode('x'.repeat(80))).toHaveLength(50)
  })
})
