/**
 * Test suite for uf16-data.js
 */

const assert = require('assert');
const { createUF16Data } = require('./uf16-data.js');

function runTests() {
  const data = createUF16Data();

  // Test 1: Exactly 16 screens
  assert.strictEqual(data.screens.length, 16, 'UF-16 must have exactly 16 screens');

  // Test 2: Screen IDs from 01 to 16
  const screenIds = data.screens.map(s => s.id);
  const expectedIds = Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, '0'));
  assert.deepStrictEqual(screenIds, expectedIds, 'Screen IDs must be 01..16');

  // Test 3: Exactly 6 stages
  assert.strictEqual(data.stages.length, 6, 'UF-16 must have 6 stages');
  data.screens.forEach(s => {
    assert.ok(s.stage >= 1 && s.stage <= 6, `Screen ${s.id} stage must be between 1 and 6`);
    assert.strictEqual(s.totalStages, 6, `Screen ${s.id} totalStages must be 6`);
  });

  // Test 4: Stage progression
  const stagesSequence = data.screens.map(s => s.stage);
  assert.deepStrictEqual(
    stagesSequence,
    [1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6],
    'Stage progression must match the defined flow architecture'
  );

  // Test 5: Every screen has valid ledger key
  data.screens.forEach(s => {
    assert.ok(data.ledgers[s.ledgerKey], `Screen ${s.id} must reference an existing ledgerKey`);
  });

  // Test 6: Ledger progression checks
  // Screen 01: baseline
  assert.deepStrictEqual(data.ledgers.l01, {
    registeredDevices: 24,
    confirmedDevices: 18,
    pendingConfirmation: 6,
    rejectedRecords: 3
  });

  // Screen 02: register device -> registered increases to 25, pending increases to 7
  assert.strictEqual(data.ledgers.l02.registeredDevices, 25);
  assert.strictEqual(data.ledgers.l02.pendingConfirmation, 7);

  // Screen 10: confirmed increases to 19, pending drops to 6
  assert.strictEqual(data.ledgers.l10.confirmedDevices, 19);
  assert.strictEqual(data.ledgers.l10.pendingConfirmation, 6);

  // Screen 12: invalid record rejected -> rejectedRecords increases to 4
  assert.strictEqual(data.ledgers.l12.rejectedRecords, 4);

  // Test 7: Entities validation
  assert.strictEqual(data.entities.device.id, 'DEV-MBP-2026-088');
  assert.strictEqual(data.entities.device.assignedTo, 'Lê Hoàng Long (NV-0255)');
  assert.ok(data.entities.allowlist.some(a => a.domain === 'github.com'));
  assert.ok(data.entities.exclusionList.some(e => e.domain === 'slack.com'));

  console.log('PASS uf16-data: 16 screens, 6 stages, ledger progression, and entity references verified successfully.');
}

runTests();
