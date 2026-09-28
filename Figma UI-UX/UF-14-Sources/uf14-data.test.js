/**
 * Test suite for uf14-data.js
 */

const assert = require('assert');
const { createUF14Data } = require('./uf14-data.js');

function runTests() {
  const data = createUF14Data();

  // Test 1: Exactly 16 screens
  assert.strictEqual(data.screens.length, 16, 'UF-14 must have exactly 16 screens');

  // Test 2: Screen IDs from 01 to 16
  const screenIds = data.screens.map(s => s.id);
  const expectedIds = Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, '0'));
  assert.deepStrictEqual(screenIds, expectedIds, 'Screen IDs must be 01..16');

  // Test 3: Exactly 6 stages
  assert.strictEqual(data.stages.length, 6, 'UF-14 must have 6 stages');
  data.screens.forEach(s => {
    assert.ok(s.stage >= 1 && s.stage <= 6, `Screen ${s.id} stage must be between 1 and 6`);
    assert.strictEqual(s.totalStages, 6, `Screen ${s.id} totalStages must be 6`);
  });

  // Test 4: Stage progression
  const stagesSequence = data.screens.map(s => s.stage);
  assert.deepStrictEqual(
    stagesSequence,
    [1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6],
    'Stage progression must match the defined flow architecture'
  );

  // Test 5: Every screen has valid ledger key
  data.screens.forEach(s => {
    assert.ok(data.ledgers[s.ledgerKey], `Screen ${s.id} must reference an existing ledgerKey`);
  });

  // Test 6: Ledger progression checks
  // Screen 01: openMember=3, openInvoice=1, pendingAcceptance=2, resolvedToday=4
  assert.deepStrictEqual(data.ledgers.l01, {
    openMember: 3,
    openInvoice: 1,
    pendingAcceptance: 2,
    resolvedToday: 4
  });

  // Screen 03: pending task completed -> pendingAcceptance drops to 1, resolvedToday increases to 5
  assert.strictEqual(data.ledgers.l03.pendingAcceptance, 1);
  assert.strictEqual(data.ledgers.l03.resolvedToday, 5);

  // Screen 07: DISC-2026-081 closed -> openMember drops from 3 to 2, resolvedToday increases to 6
  assert.strictEqual(data.ledgers.l07.openMember, 2);
  assert.strictEqual(data.ledgers.l07.resolvedToday, 6);

  // Screen 12: Invoice recon closed -> openInvoice drops from 1 to 0, resolvedToday increases to 7
  assert.strictEqual(data.ledgers.l12.openInvoice, 0);
  assert.strictEqual(data.ledgers.l12.resolvedToday, 7);

  // Screen 16: Final master ledger -> openMember=1, openInvoice=0, pendingAcceptance=1, resolvedToday=8
  assert.deepStrictEqual(data.ledgers.l16, {
    openMember: 1,
    openInvoice: 0,
    pendingAcceptance: 1,
    resolvedToday: 8
  });

  // Test 7: Entities validation
  assert.strictEqual(data.entities.github.pendingTask.id, 'PV-2041');
  assert.strictEqual(data.entities.figma.discrepancyId, 'DISC-2026-081');
  assert.strictEqual(data.entities.slack.threeNumbers.invoiceSeats, 55);
  assert.strictEqual(data.entities.slack.threeNumbers.subscriptionSeatsOld, 50);
  assert.strictEqual(data.entities.slack.threeNumbers.activeSeats, 48);
  assert.strictEqual(data.entities.github.shadowAccount.id, 'DISC-2026-094');

  console.log('PASS uf14-data: 16 screens, 6 stages, ledger progression, and entity references verified successfully.');
}

runTests();
