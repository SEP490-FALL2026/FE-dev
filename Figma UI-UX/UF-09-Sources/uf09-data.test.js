const assert = require('node:assert/strict');
const { createUF09Data } = require('./uf09-data.js');

const data = createUF09Data();

assert.equal(Object.isFrozen(data), true, 'root data must be frozen');
assert.equal(data.actor.role, 'IT Admin');
assert.equal(data.employee.id, 'EMP-0174');
assert.equal(data.offboarding.id, 'OFF-2026-044');
assert.equal(data.offboarding.lastWorkingDate, '17/09/2026');
assert.equal(data.device.id, 'DEV-LT-0174');
assert.equal(data.totalSteps, 7);

assert.deepEqual(
  data.steps.map((step) => step.id),
  [1, 2, 3, 4, 5, 6, 7],
);
assert.deepEqual(
  data.steps.map((step) => step.label),
  ['Profile', 'Succession', 'Handover', 'Revocation', 'Execution', 'Evidence', 'Completion'],
);

assert.deepEqual(
  data.screens.map((screen) => screen.id),
  Array.from({ length: 16 }, (_, index) => String(index + 1).padStart(2, '0')),
);
assert.deepEqual(
  data.screens.map((screen) => screen.step),
  [1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 7],
);

assert.equal(data.assignments.length, 5);
assert.equal(new Set(data.assignments.map((item) => item.assignmentId)).size, 5);
assert.equal(new Set(data.assignments.map((item) => item.taskId)).size, 5);

const figma = data.assignments.find((item) => item.taskId === 'PV-2042');
assert.ok(figma, 'UF-08 task PV-2042 must be present');
assert.equal(figma.assignmentId, 'ASN-3872');
assert.equal(figma.subscriptionId, 'SUB-FIG-PRO-02');
assert.equal(figma.evidenceId, 'FIG-EVT-772904');
assert.equal(figma.employeeId, 'EMP-0174');
assert.equal(figma.decisionSource, 'OFF-2026-044');

const expectedLedgers = {
  baseline: [5, 2, 1, 0, 0, 0, 12480],
  successionDone: [5, 0, 1, 0, 0, 0, 12480],
  readyForLastDay: [5, 0, 0, 0, 0, 0, 12480],
  g2Open: [5, 0, 0, 5, 0, 0, 12480],
  tasksCreated: [5, 0, 0, 5, 5, 0, 12480],
  evidencePartial: [1, 0, 0, 1, 1, 4, 12480],
  seatsReleased: [0, 0, 0, 0, 0, 5, 12480],
  deletionComplete: [0, 0, 0, 0, 0, 5, 0],
};

for (const [ledgerKey, expected] of Object.entries(expectedLedgers)) {
  const ledger = data.ledgers[ledgerKey];
  assert.ok(ledger, `missing ledger ${ledgerKey}`);
  assert.deepEqual(
    [
      ledger.seatAttached,
      ledger.successionBlockers,
      ledger.handoverBlockers,
      ledger.g2Open,
      ledger.tasksOpen,
      ledger.seatReleased,
      ledger.usageDetail,
    ],
    expected,
    `ledger ${ledgerKey} must match the approved continuity table`,
  );
}

for (const screen of data.screens) {
  assert.ok(data.ledgers[screen.ledgerKey], `screen ${screen.id} must reference a known ledger`);
  assert.equal(screen.totalSteps, 7);
}

for (const screen of data.screens.filter((item) => Number(item.id) < 8)) {
  assert.equal(data.ledgers[screen.ledgerKey].g2Open, 0, `screen ${screen.id} cannot show G2 early`);
}

const screen06 = data.screens.find((screen) => screen.id === '06');
assert.deepEqual(screen06.actions, ['remind-manager']);
assert.equal(screen06.actions.includes('confirm-handover-as-it'), false);
assert.equal(screen06.actions.includes('bulk-revoke'), false);

const screen10 = data.screens.find((screen) => screen.id === '10');
assert.equal(screen10.typedCountRequired, 5);
assert.equal(screen10.reasonRequired, true);

const screen11 = data.screens.find((screen) => screen.id === '11');
assert.equal(screen11.provisioningCreated, true);
assert.equal(data.ledgers[screen11.ledgerKey].seatAttached, 5);
assert.equal(data.ledgers[screen11.ledgerKey].tasksOpen, 5);

const screen13 = data.screens.find((screen) => screen.id === '13');
assert.equal(screen13.openTaskId, 'PV-2042');
assert.equal(data.ledgers[screen13.ledgerKey].seatAttached, 1);
assert.equal(data.ledgers[screen13.ledgerKey].seatReleased, 4);

console.log('PASS uf09-data: 16 states preserve canonical offboarding ledgers and guards');
