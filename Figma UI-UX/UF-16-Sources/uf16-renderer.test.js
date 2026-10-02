/**
 * Test suite for uf16-renderer.js
 */

const assert = require('assert');
const { createUF16Data } = require('./uf16-data.js');
const { renderApp } = require('./uf16-renderer.js');

function runTests() {
  const data = createUF16Data();

  data.screens.forEach(screen => {
    const html = renderApp(data, screen.id);

    // Verify root attributes
    assert.ok(html.includes(`data-screen="${screen.id}"`), `Screen ${screen.id} must include data-screen`);
    assert.ok(html.includes(`data-stage="${screen.stage}"`), `Screen ${screen.id} must include data-stage`);
    assert.ok(html.includes('data-total-stages="6"'), `Screen ${screen.id} must include data-total-stages="6"`);
    assert.ok(html.includes('data-render-ready="true"'), `Screen ${screen.id} must include data-render-ready="true"`);
    assert.ok(html.includes('data-overflow="false"'), `Screen ${screen.id} must include data-overflow="false"`);

    // Verify ledger values are present
    const ledger = data.ledgers[screen.ledgerKey];
    assert.ok(html.includes(`data-registered-devices="${ledger.registeredDevices}"`), `Screen ${screen.id} must include data-registered-devices`);
    assert.ok(html.includes(`data-confirmed-devices="${ledger.confirmedDevices}"`), `Screen ${screen.id} must include data-confirmed-devices`);
    assert.ok(html.includes(`data-pending-confirmation="${ledger.pendingConfirmation}"`), `Screen ${screen.id} must include data-pending-confirmation`);
    assert.ok(html.includes(`data-rejected-records="${ledger.rejectedRecords}"`), `Screen ${screen.id} must include data-rejected-records`);

    // Verify title and screenCode
    const escapedTitle = screen.title.replace(/&/g, '&amp;');
    assert.ok(html.includes(escapedTitle), `Screen ${screen.id} markup must contain title`);
    assert.ok(html.includes(screen.screenCode), `Screen ${screen.id} markup must contain screenCode`);
  });

  // Test specific business rule guards
  // Screen 03: BR-45.4 exclusion of communication apps
  const screen03Html = renderApp(data, '03');
  assert.ok(screen03Html.includes('BR-45.4'), 'Screen 03 must explicitly mention BR-45.4');
  assert.ok(screen03Html.includes('slack.com'), 'Screen 03 must exclude slack.com');
  assert.ok(screen03Html.includes('teams.microsoft.com'), 'Screen 03 must exclude teams.microsoft.com');

  // Screen 06: BR-42.4 & Luật 91/2025
  const screen06Html = renderApp(data, '06');
  assert.ok(screen06Html.includes('Luật 91/2025'), 'Screen 06 must mention Luật 91/2025');
  assert.ok(screen06Html.includes('BR-42.4'), 'Screen 06 must mention BR-42.4');
  assert.ok(screen06Html.includes('KHÔNG THU GÌ'), 'Screen 06 must mention KHÔNG THU GÌ');

  // Screen 08: BR-45.1 Gateway locked
  const screen08Html = renderApp(data, '08');
  assert.ok(screen08Html.includes('BR-45.1'), 'Screen 08 must mention BR-45.1');
  assert.ok(screen08Html.includes('CHƯA XÁC NHẬN'), 'Screen 08 must mention CHƯA XÁC NHẬN');

  // Screen 11: BR-45.2 & BR-45.3 Payload
  const screen11Html = renderApp(data, '11');
  assert.ok(screen11Html.includes('BR-45.2'), 'Screen 11 must mention BR-45.2');
  assert.ok(screen11Html.includes('BR-45.3'), 'Screen 11 must mention BR-45.3');

  // Screen 15: BR-45.6 No ranking by people
  const screen15Html = renderApp(data, '15');
  assert.ok(screen15Html.includes('BR-45.6'), 'Screen 15 must mention BR-45.6');
  assert.ok(screen15Html.includes('KHÔNG HIỂN THỊ BẢNG XẾP HẠNG THỜI GIAN THEO CON NGƯỜI'), 'Screen 15 must forbid ranking by people');

  console.log('PASS uf16-renderer: All 16 screens render valid markup, metadata, ledger consistency, and rule guards.');
}

runTests();
