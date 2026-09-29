'use strict'

const assert = require('node:assert/strict')
const { createUF12Data } = require('./uf12-data.js')

const data = createUF12Data()
assert.equal(data.screens.length, 20)
assert.deepEqual(
  data.screens.map((screen) => screen.id),
  Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, '0'))
)
assert.deepEqual(
  data.screens.map((screen) => screen.stage),
  [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6, 6, 6, 6, 6]
)
assert.equal(data.sources.length, 3)
assert.equal(data.sources.find((source) => source.id === 'collector').prohibited.includes('URL đầy đủ'), true)
assert.equal(data.primaryEvidence.raw, 'PAYPAL*CANVA PRO 0926')
assert.equal(data.primaryEvidence.method, 'AI suggestion')
assert.equal(data.primaryEvidence.requiresHumanConfirmation, true)
assert.equal(data.finding.status, 'Cần xem xét')
assert.equal(data.finding.id, 'FND-2026-045')
assert.equal(data.dedupe.createsNewFinding, false)
assert.equal(data.falsePositive.reopensWhenSeenAgain, true)
assert.equal(data.branches.approved.purchaseRequest, 'REQ-2026-212')
assert.equal(data.branches.unapproved.autoRevokes, false)
assert.equal(Object.isFrozen(data), true)

console.log('PASS uf12-data: 20 states preserve evidence handling, dedupe, decision semantics, and audit facts')
