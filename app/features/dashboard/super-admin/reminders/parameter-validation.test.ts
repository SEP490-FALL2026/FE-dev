import { describe, expect, it } from 'vitest'
import { parseParameterValue } from './parameter-validation'

describe('operating parameter constraints from BE', () => {
  it('accepts integers only within the supplied bounds', () => {
    const constraints = { kind: 'int', min: 2, max: 9 } as const
    expect(parseParameterValue('7', constraints)).toBe(7)
    for (const draft of ['', '1', '10', '2.5', 'Infinity'])
      expect(parseParameterValue(draft, constraints)).toBeUndefined()
  })
  it('accepts only enum options supplied by BE', () => {
    const constraints = { kind: 'enum', options: ['DAILY', 'WEEKLY'], optionLabels: {} } as const
    expect(parseParameterValue('WEEKLY', constraints)).toBe('WEEKLY')
    expect(parseParameterValue('MONTHLY', constraints)).toBeUndefined()
  })
  it('validates list length, integer bounds, ordering and empty entries', () => {
    const constraints = { kind: 'int-list', min: 1, max: 180, length: { min: 2, max: 3 }, order: 'descending' } as const
    expect(parseParameterValue('15, 7', constraints)).toEqual([15, 7])
    for (const draft of ['15', '15,15', '7,15', '15,', '15, 2.5', '181,7'])
      expect(parseParameterValue(draft, constraints)).toBeUndefined()
  })
  it('does not allow editing an unrecognized constraint kind', () => {
    expect(parseParameterValue('2', { kind: 'future' })).toBeUndefined()
  })
})
