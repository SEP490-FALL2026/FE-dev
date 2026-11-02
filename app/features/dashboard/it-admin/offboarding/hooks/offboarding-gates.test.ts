import { describe, expect, it } from 'vitest'
import { canCloseOffboarding } from './offboarding-gates'

describe('offboarding closure', () => {
  const ready = {
    state: 'LEFT',
    closed: false,
    accountLock: { note: 'verified' },
    heldRights: 0,
    blockers: {},
    checklist: {
      dataHandover: { state: 'DONE' },
      accountLock: { state: 'DONE' },
      revokeAccess: { state: 'DONE' },
      seatsReleased: { state: 'DONE' }
    }
  }
  it('requires every backend prerequisite', () => {
    expect(canCloseOffboarding(ready)).toBe(true)
    expect(canCloseOffboarding({ ...ready, blockers: { OPEN_REQUESTS: 1 } })).toBe(false)
    expect(canCloseOffboarding({ ...ready, accountLock: null })).toBe(false)
    expect(canCloseOffboarding({ ...ready, heldRights: 1 })).toBe(false)
    expect(canCloseOffboarding({ ...ready, state: 'HANDING_OVER' })).toBe(false)
    expect(canCloseOffboarding({ ...ready, checklist: null })).toBe(false)
  })
})
