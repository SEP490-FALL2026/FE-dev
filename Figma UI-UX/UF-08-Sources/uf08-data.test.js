const assert = require('node:assert/strict')
const data = require('./uf08-data.js')

assert.deepEqual(
  data.screens.map((screen) => screen.id),
  Array.from({ length: 16 }, (_, index) => String(index + 1).padStart(2, '0')),
  'screen registry must contain every UF-08 state exactly once'
)

assert.deepEqual(data.ledgers, {
  baseline: { manual: 8, automatic: 4, pending: 2, failed: 3, completedToday: 12 },
  pendingInvite: { manual: 8, automatic: 3, pending: 3, failed: 3, completedToday: 12 },
  manualCompleted: { manual: 7, automatic: 3, pending: 3, failed: 3, completedToday: 13 },
  retrying: { manual: 7, automatic: 4, pending: 3, failed: 2, completedToday: 13 },
  retryExhausted: { manual: 7, automatic: 3, pending: 3, failed: 3, completedToday: 13 },
  manualTransferred: { manual: 8, automatic: 3, pending: 3, failed: 2, completedToday: 13 },
  purchaseReturned: { manual: 8, automatic: 4, pending: 3, failed: 1, completedToday: 13 }
})

assert.deepEqual(
  Object.keys(data.tasks).sort(),
  ['PV-2037', 'PV-2038', 'PV-2039', 'PV-2041', 'PV-2042'],
  'the storyboard must use the five approved task identities'
)

const screen = (id) => data.screens.find((item) => item.id === id)

assert.equal(screen('04').taskId, 'PV-2041')
assert.equal(screen('04').taskStatus, 'pending-acceptance')
assert.equal(screen('04').provisioned, false, 'a pending invitation is not completed provisioning')
assert.equal(screen('05').handoff, 'UF-14')

assert.equal(screen('09').taskId, 'PV-2042')
assert.equal(screen('09').taskStatus, 'completed')
assert.equal(screen('09').seatReleased, true, 'manual revoke releases the seat only after evidence')

assert.equal(screen('12').taskId, 'PV-2037')
assert.equal(screen('12').attempt, 6)
assert.equal(screen('12').maxAttempts, 6)
assert.equal(screen('12').nextAttemptAt, null, 'the sixth failure must stop automatic retry')
assert.equal(screen('13').taskId, 'PV-2037')
assert.equal(screen('13').preservedAttempts, 6, 'switching channel must preserve connector history')

assert.equal(screen('14').taskId, 'PV-2038')
assert.equal(screen('14').errorClass, 'authentication')
assert.equal(screen('14').actions.includes('retry'), false, 'authentication failures must not offer retry')

assert.equal(screen('16').taskId, 'PV-2039')
assert.equal(screen('16').taskStatus, 'queued')
assert.equal(screen('16').financeStatus, 'recording-in-parallel')
assert.equal(screen('16').provisioned, false, 'purchase approval is not provisioning completion')
assert.deepEqual(data.subscriptions['SUB-SLK-BP-01'].afterPurchase, {
  internalUsed: 50,
  providerUsed: 50,
  purchased: 51
})

for (const item of data.screens) {
  assert.ok(data.tasks[item.taskId], `screen ${item.id} references a known task`)
  assert.ok(data.ledgers[item.ledgerKey], `screen ${item.id} references a known ledger`)
}

console.log('PASS uf08-data: 16 states preserve canonical tasks, ledgers, and guarded transitions')
