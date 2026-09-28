const assert = require('node:assert/strict');
const data = require('./uf07-data.js');

assert.equal(data.session.id, 'IMP-20250114-7F3A');
assert.equal(data.session.file, 'm365_usage_jan2025.csv');
assert.equal(data.session.source, 'Microsoft 365');

assert.deepEqual(data.ledger, {
  queueStart: 146,
  afterMatch: 145,
  afterIgnore: 144,
  afterConflict: 144,
  conflictWaiting: 1,
});

assert.deepEqual(
  data.screens.map(({ id, queue, recordId }) => ({ id, queue, recordId })),
  [
    { id: '01', queue: 146, recordId: 'UQ-0184' },
    { id: '02', queue: 146, recordId: 'UQ-0184' },
    { id: '03', queue: 146, recordId: 'UQ-0184' },
    { id: '04', queue: 146, recordId: 'UQ-0184' },
    { id: '05', queue: 145, recordId: 'UQ-0184' },
    { id: '06', queue: 145, recordId: 'UQ-0185' },
    { id: '07', queue: 145, recordId: 'UQ-0185' },
    { id: '08', queue: 144, recordId: 'UQ-0185' },
    { id: '09', queue: 144, recordId: 'UQ-0186' },
    { id: '10', queue: 144, recordId: 'UQ-0186' },
    { id: '11', queue: 144, recordId: 'UQ-0186' },
  ],
);

assert.equal(data.records['UQ-0184'].candidates[0].confidence, 94);
assert.equal(data.records['UQ-0185'].candidates.length, 0);
assert.equal(data.records['UQ-0186'].candidates.length, 2);
assert.equal(data.records['UQ-0186'].blocked, true);
assert.equal(data.records['UQ-0185'].ignoreReason.length >= 10, true);

console.log('PASS uf07-data: canonical session, records, and 11-screen ledger');
