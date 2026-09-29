'use strict'

const assert = require('node:assert/strict')
const { createUF10Data } = require('./uf10-data.js')

const data = createUF10Data()

assert.equal(Object.isFrozen(data), true)
assert.equal(data.run.id, 'RUN-OPT-20260917-0615')
assert.equal(data.totalStages, 6)
assert.deepEqual(
  data.stages.map((stage) => stage.label),
  ['Overview', 'G1 · Renewal', 'G2 · Offboarded', 'G3/G4 · Usage', 'Resolution', 'Savings']
)

assert.deepEqual(
  data.screens.map((screen) => screen.id),
  Array.from({ length: 18 }, (_, index) => String(index + 1).padStart(2, '0'))
)
assert.deepEqual(
  data.screens.map((screen) => screen.stage),
  [1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6]
)
for (const screen of data.screens) {
  assert.equal(screen.totalStages, 6)
  assert.ok(data.ledgers[screen.ledgerKey], `Missing ledger ${screen.ledgerKey}`)
}

assert.deepEqual(
  data.groups.map((group) => [group.id, group.count, group.managerRequired]),
  [
    ['G1', 12, false],
    ['G2', 3, false],
    ['G3', 9, true],
    ['G4', 14, true]
  ]
)
assert.equal(data.g1.targetType, 'Subscription')
assert.equal(data.g1.proposedReduction, 12)
assert.equal(data.g1.approvedReduction, 8)
assert.deepEqual(data.g1.handoffOrder, ['UF-15', 'UF-11'])
assert.equal(data.g1.financeIsApprover, false)

assert.equal(data.g2.managerRequired, false)
assert.equal(data.g2.typedCountRequired, 3)
assert.equal(data.g2.reasonRequired, true)
assert.deepEqual(
  data.g2.items.map((item) => item.taskId),
  ['PV-2058', 'PV-2059', 'PV-2061']
)
assert.equal(new Set(data.g2.items.map((item) => item.assignmentId)).size, 3)

assert.deepEqual(
  data.usageRecommendations.map((item) => item.managerDecision),
  ['Revoke', 'Keep', 'Temporary Exemption']
)
assert.deepEqual(
  data.usageRecommendations.filter((item) => item.returnsToIT).map((item) => item.id),
  ['REC-2026-331']
)
assert.equal(data.branches.agree.taskId, 'PV-2060')
assert.equal(data.branches.agree.assignmentReleased, false)
assert.equal(data.branches.disagree.taskCreated, false)
assert.equal(data.branches.disagree.reasonRequired, true)

assert.equal(data.savings.immediate.value, '740,000 VND/mo')
assert.equal(data.savings.renewal.value, '48,000,000 VND/yr')
assert.equal(data.savings.combinedTotal, null)
assert.equal(data.savings.notionOpportunity.recorded, false)
assert.equal(data.savings.notionOpportunity.value, '3,600,000 VND/yr')

assert.equal(data.ledgers.g2TasksCreated.tasksOpen, 3)
assert.equal(data.ledgers.g2TasksCreated.seatsReleased, 0)
assert.equal(data.ledgers.branchATaskCreated.tasksOpen, 4)
assert.equal(data.ledgers.branchBReturned.managerPending, 1)
assert.equal(data.ledgers.branchBReturned.tasksOpen, 3)
assert.equal(data.ledgers.summaryA.tasksOpen, 1)
assert.equal(data.ledgers.summaryA.seatsReleased, 3)

const screen05 = data.screens.find((screen) => screen.id === '05')
const screen08 = data.screens.find((screen) => screen.id === '08')
const screen15 = data.screens.find((screen) => screen.id === '15')
const screen17 = data.screens.find((screen) => screen.id === '17')
assert.deepEqual(screen05.handoffOrder, ['UF-15', 'UF-11'])
assert.equal(screen08.managerRequired, false)
assert.equal(screen15.createdTaskId, 'PV-2060')
assert.equal(screen17.createdTaskId, null)

assert.equal(Object.isFrozen(data.screens), true)
assert.equal(Object.isFrozen(data.g2.items), true)
assert.equal(Object.isFrozen(data.ledgers.summaryA), true)

console.log('PASS uf10-data: 18 states preserve branch semantics, handoff order, ledgers, and separated savings')
