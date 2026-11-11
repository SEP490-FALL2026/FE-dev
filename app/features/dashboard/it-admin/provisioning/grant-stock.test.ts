import { describe, expect, it } from 'vitest'
import { grantStockDecision } from './grant-stock'

describe('grant stock decisions', () => {
  it('uses existing shared stock without a purchase', () => {
    expect(grantStockDecision({ kind: 'SEATS', free: 2, inRevocation: 1 }, '')).toEqual({ allowed: true })
  })

  it('requires a purchase when pooled stock is empty', () => {
    expect(grantStockDecision({ kind: 'KEYS', free: 0, inRevocation: 0 }, '')).toEqual({
      allowed: true,
      purchase: {}
    })
  })

  it('requires a reason for purchasing while rights are being revoked', () => {
    expect(grantStockDecision({ kind: 'SEATS', free: 0, inRevocation: 1 }, '  ')).toEqual({ allowed: false })
    expect(grantStockDecision({ kind: 'SEATS', free: 0, inRevocation: 1 }, '  urgent  ')).toEqual({
      allowed: true,
      purchase: { reason: 'urgent' }
    })
  })

  it('does not send purchase for plans without a shared pool', () => {
    expect(grantStockDecision({ kind: 'NONE', free: 0, inRevocation: 0 }, 'urgent')).toEqual({ allowed: true })
  })
})
