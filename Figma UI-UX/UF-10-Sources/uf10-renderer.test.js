'use strict';

const assert = require('node:assert/strict');
const { createUF10Data } = require('./uf10-data.js');
const { renderApp } = require('./uf10-renderer.js');

const data = createUF10Data();
const contains = (html, value, message) => assert.ok(html.includes(value), message || `Missing rendered value: ${value}`);

for (const screen of data.screens) {
  const html = renderApp(data, screen.id);
  const ledger = data.ledgers[screen.ledgerKey];
  contains(html, `data-screen="${screen.id}"`);
  contains(html, `data-stage="${screen.stage}"`);
  contains(html, 'data-total-stages="6"');
  contains(html, `data-g1-open="${ledger.g1Open}"`);
  contains(html, `data-g2-open="${ledger.g2Open}"`);
  contains(html, `data-manager-pending="${ledger.managerPending}"`);
  contains(html, `data-it-review="${ledger.itReview}"`);
  contains(html, `data-tasks-open="${ledger.tasksOpen}"`);
  contains(html, `data-seats-released="${ledger.seatsReleased}"`);
  contains(html, `data-renewal-reduction-approved="${ledger.renewalReductionApproved}"`);
  contains(html, screen.title);
  contains(html, `Stage ${screen.stage} / 6`);
  contains(html, data.run.id);
  contains(html, screen.branch);
  for (const stage of data.stages) contains(html, stage.label);
}

const frame04 = renderApp(data, '04');
contains(frame04, data.g1.subscriptionId);
contains(frame04, 'Proposed Reduction');
contains(frame04, '12 seats');
contains(frame04, data.g1.estimatedSaving);
assert.ok(!frame04.includes('Revoke employee'), 'G1 must target subscription quantity, not an employee');

const frame05 = renderApp(data, '05');
contains(frame05, 'Finance is not the approver');
assert.ok(frame05.indexOf('UF-15') < frame05.indexOf('UF-11'), 'UF-15 must appear before UF-11');

const frame08 = renderApp(data, '08');
contains(frame08, 'value="3"');
contains(frame08, data.g2.reason);
contains(frame08, 'Manager approval not required');

const frame09 = renderApp(data, '09');
for (const item of data.g2.items) contains(frame09, item.taskId);
contains(frame09, 'Assignment retains seat reservation');
contains(frame09, 'data-seats-released="0"');

const frame11 = renderApp(data, '11');
contains(frame11, 'Immutable Snapshot');
contains(frame11, '120-day');
contains(frame11, 'Created or edited file; logins excluded');

const frame13 = renderApp(data, '13');
contains(frame13, 'Keep');
contains(frame13, 'Revoke');
contains(frame13, 'Temporary Exemption');
contains(frame13, 'Only “Revoke” decisions return to IT');

const frame15 = renderApp(data, '15');
contains(frame15, 'PV-2060');
contains(frame15, '<span class="branch-letter">A</span>', 'Branch marker must have a dedicated class so badge styles are not overridden');
contains(frame15, 'Assignment retains seat reservation');

const frame16 = renderApp(data, '16');
contains(frame16, data.branches.disagree.reason);
contains(frame16, '<span class="branch-letter">B</span>', 'Branch marker must have a dedicated class so badge styles are not overridden');
contains(frame16, 'Disagreement Justification *');

const frame17 = renderApp(data, '17');
contains(frame17, 'Not created');
assert.ok(!frame17.includes('PV-2060'), 'Branch B must not create or reference PV-2060');

const frame18 = renderApp(data, '18');
contains(frame18, data.savings.immediate.value);
contains(frame18, data.savings.renewal.value);
contains(frame18, data.savings.notionOpportunity.value);
contains(frame18, 'Unrecorded');
assert.ok(!frame18.includes('Total Savings'), 'Savings with different units must not be combined');

console.log('PASS uf10-renderer: 18 screens render guarded branches, immutable evidence, and separated savings');
