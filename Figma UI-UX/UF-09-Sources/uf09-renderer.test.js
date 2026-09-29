'use strict'

const assert = require('node:assert/strict')
const { createUF09Data } = require('./uf09-data.js')
const { renderApp } = require('./uf09-renderer.js')

const data = createUF09Data()

function contains(html, value, message) {
  assert.ok(html.includes(value), message || `Expected rendered HTML to contain: ${value}`)
}

for (const screen of data.screens) {
  const html = renderApp(data, screen.id)
  const ledger = data.ledgers[screen.ledgerKey]

  contains(html, `data-screen="${screen.id}"`)
  contains(html, `data-step="${screen.step}"`)
  contains(html, 'data-total-steps="7"')
  contains(html, `data-seat-attached="${ledger.seatAttached}"`)
  contains(html, `data-succession-blockers="${ledger.successionBlockers}"`)
  contains(html, `data-handover-blockers="${ledger.handoverBlockers}"`)
  contains(html, `data-g2-open="${ledger.g2Open}"`)
  contains(html, `data-tasks-open="${ledger.tasksOpen}"`)
  contains(html, `data-seat-released="${ledger.seatReleased}"`)
  contains(html, `data-usage-detail="${ledger.usageDetail}"`)
  contains(html, screen.title)
  contains(html, `Step ${screen.step} / 7`)
  if (Number(screen.id) < 4) {
    contains(html, 'Pending ID')
    assert.ok(
      !html.includes(data.offboarding.id),
      `Frame ${screen.id} must not expose an offboarding ID before creation`
    )
  } else {
    contains(html, data.offboarding.id)
  }
  contains(html, data.employee.name)
  contains(html, data.employee.id)

  for (const step of data.steps) contains(html, step.label)
}

const frame06 = renderApp(data, '06')
contains(frame06, 'Manager Sign-off Authority Only')
contains(frame06, 'Remind Manager')
assert.ok(!frame06.includes('>Sign off Handover<'), 'IT must not receive a handover-confirm action')

const frame03 = renderApp(data, '03')
contains(frame03, 'No Audit Trail Recorded')

const frame08 = renderApp(data, '08')
contains(frame08, '100%')
contains(frame08, 'Manager approval not required')

const frame10 = renderApp(data, '10')
contains(frame10, 'value="5"')
contains(frame10, data.offboarding.commonReason)
contains(frame10, 'Generated 5 G2 recs and deprovisioning tasks')
assert.ok(
  !frame10.includes('Deleted 12,480 usage detail records'),
  'A future day +30 deletion event must not appear in frame 10 audit context'
)

const frame11 = renderApp(data, '11')
for (const assignment of data.assignments) contains(frame11, assignment.taskId)
contains(frame11, 'Assignment retains seat reservation')

const frame13 = renderApp(data, '13')
contains(frame13, 'PV-2042')
contains(frame13, 'Insufficient Evidence to Release Seat')
contains(frame13, 'ASN-3872')

const frame15 = renderApp(data, '15')
contains(frame15, data.offboarding.deletionDueDate)
contains(frame15, 'Scheduled')
assert.ok(
  !frame15.includes(data.offboarding.deletionCompletedAt),
  'Deletion must not be marked complete before day +30'
)

const frame16 = renderApp(data, '16')
contains(frame16, data.offboarding.deletionJobId)
contains(frame16, data.offboarding.deletionCompletedAt)
contains(frame16, 'Audit Trail Retained')
contains(frame16, 'data-usage-detail="0"')

console.log('PASS uf09-renderer: 16 screens render canonical content, controls, and continuity guards')
