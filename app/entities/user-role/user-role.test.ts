import { describe, expect, it } from 'vitest'

import { parseUserRole, USER_ROLES } from './user-role'

describe('user role', () => {
  it('accepts exactly the six human roles from the BRD', () => {
    expect(USER_ROLES).toEqual(['super-admin', 'it-admin', 'manager', 'spending-approver', 'finance', 'employee'])
    expect(USER_ROLES.map(parseUserRole)).toEqual(USER_ROLES)
  })

  it('rejects system actors and unknown values', () => {
    expect(parseUserRole('automation-service')).toBeNull()
    expect(parseUserRole('unknown')).toBeNull()
    expect(parseUserRole(undefined)).toBeNull()
  })
})
