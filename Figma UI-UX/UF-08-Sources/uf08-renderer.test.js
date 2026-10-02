const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('./uf08-data.js');
const renderer = require('./uf08-renderer.js');

const css = fs.readFileSync(path.join(__dirname, 'uf08.css'), 'utf8');
assert.match(
  css,
  /\.error-hero\s*\{[^}]*grid-template-columns:\s*48px minmax\(0,\s*1fr\) max-content;/s,
  'The authentication guard badge must keep its full BR-12.1 label inside the error hero.',
);
assert.match(
  css,
  /\.error-hero\s*>\s*span:first-child\s*\{/,
  'Only the leading error icon may receive the fixed icon dimensions.',
);

for (const screen of data.screens) {
  const html = renderer.renderScreen(screen, data);
  const ledger = data.ledgers[screen.ledgerKey];

  assert.match(html, new RegExp(screen.title));
  assert.match(html, new RegExp(screen.taskId));
  assert.match(html, new RegExp(`data-screen="${screen.id}"`));
  assert.match(html, new RegExp(`data-manual="${ledger.manual}"`));
  assert.match(html, new RegExp(`data-automatic="${ledger.automatic}"`));
  assert.match(html, new RegExp(`data-pending="${ledger.pending}"`));
  assert.match(html, new RegExp(`data-failed="${ledger.failed}"`));
  assert.match(html, new RegExp(`data-completed="${ledger.completedToday}"`));
  assert.match(html, /Assignment retains seat reservation/);
  assert.match(html, /IT Admin/);
}

const pending = renderer.renderScreen(renderer.getScreen(data, '04'), data);
assert.match(pending, /membership.*pending/is);
assert.match(pending, /NOT Completed/);
assert.match(pending, /UF-14/);
assert.doesNotMatch(pending, /Completed Provisioning/);

const handoff = renderer.renderScreen(renderer.getScreen(data, '05'), data);
assert.match(handoff, /Open UF-14 Reconciliation/);
assert.match(handoff, /Seat remains reserved/);

const manualDialog = renderer.renderScreen(renderer.getScreen(data, '08'), data);
assert.match(manualDialog, /Completion Evidence/);
assert.match(manualDialog, /FIG-EVT-772904/);
assert.match(manualDialog, /IT Admin · it-admin@company\.com/);

const manualSuccess = renderer.renderScreen(renderer.getScreen(data, '09'), data);
assert.match(manualSuccess, /Seat Returned to Available Pool/);
assert.match(manualSuccess, /FIG-EVT-772904/);

const failures = renderer.renderScreen(renderer.getScreen(data, '10'), data);
assert.match(failures, /Transient/);
assert.match(failures, /Permanent/);
assert.match(failures, /Authentication/);
assert.match(failures, /Capacity Limit/);
assert.match(failures, /Technical Details/);

const retrying = renderer.renderScreen(renderer.getScreen(data, '11'), data);
assert.match(retrying, /3\/6/);
assert.match(retrying, /10:36 ICT/);

const exhausted = renderer.renderScreen(renderer.getScreen(data, '12'), data);
assert.match(exhausted, /6\/6/);
assert.match(exhausted, /No Further Automatic Retries/);
assert.doesNotMatch(exhausted, /Next Retry at/);

const switched = renderer.renderScreen(renderer.getScreen(data, '13'), data);
assert.match(switched, /Preserves PV-2037/);
assert.match(switched, /6 connector retry logs/);

const authentication = renderer.renderScreen(renderer.getScreen(data, '14'), data);
assert.match(authentication, /FIGMA_TOKEN_EXPIRED/);
assert.doesNotMatch(authentication, />Retry</);
assert.match(authentication, /Repair Connection/);

const capacity = renderer.renderScreen(renderer.getScreen(data, '15'), data);
assert.match(capacity, /49 \/ 50/);
assert.match(capacity, /50 \/ 50/);
assert.match(capacity, /Finance does not approve/);

const resumed = renderer.renderScreen(renderer.getScreen(data, '16'), data);
assert.match(resumed, /50 \/ 51/);
assert.match(resumed, /Finance recording in parallel/);
assert.match(resumed, /Task Returned to IT Queue/);
assert.doesNotMatch(resumed, /Completed Provisioning/);

assert.throws(
  () => renderer.getScreen(data, '17'),
  /Unknown UF-08 screen: 17/,
);

console.log('PASS uf08-renderer: 16 states render guarded provisioning behavior and synchronized ledgers');
