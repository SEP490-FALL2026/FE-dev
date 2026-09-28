/**
 * Test suite for uf14-renderer.js
 */

const assert = require('assert');
const { createUF14Data } = require('./uf14-data.js');
const { renderApp } = require('./uf14-renderer.js');

function runTests() {
  const data = createUF14Data();

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
    assert.ok(html.includes(`data-open-member="${ledger.openMember}"`), `Screen ${screen.id} must include data-open-member`);
    assert.ok(html.includes(`data-open-invoice="${ledger.openInvoice}"`), `Screen ${screen.id} must include data-open-invoice`);
    assert.ok(html.includes(`data-pending-acceptance="${ledger.pendingAcceptance}"`), `Screen ${screen.id} must include data-pending-acceptance`);
    assert.ok(html.includes(`data-resolved-today="${ledger.resolvedToday}"`), `Screen ${screen.id} must include data-resolved-today`);

    // Verify title and screenCode
    const escapedTitle = screen.title.replace(/&/g, '&amp;');
    assert.ok(html.includes(escapedTitle), `Screen ${screen.id} markup must contain title`);
    assert.ok(html.includes(screen.screenCode), `Screen ${screen.id} markup must contain screenCode`);
  });

  // Test specific business rule guards
  // Screen 04: BR-28.1 Canva no false discrepancies
  const screen04Html = renderApp(data, '04');
  assert.ok(screen04Html.includes('BR-28.1'), 'Screen 04 must explicitly mention BR-28.1');

  // Screen 05: BR-43.1 hold both values
  const screen05Html = renderApp(data, '05');
  assert.ok(screen05Html.includes('DISC-2026-081'), 'Screen 05 must render DISC-2026-081');

  // Screen 09: BR-35.1 three numbers
  const screen09Html = renderApp(data, '09');
  assert.ok(screen09Html.includes('BR-35.1'), 'Screen 09 must mention BR-35.1');
  assert.ok(screen09Html.includes('55'), 'Screen 09 must display 55 seats');
  assert.ok(screen09Html.includes('50'), 'Screen 09 must display 50 seats');
  assert.ok(screen09Html.includes('48'), 'Screen 09 must display 48 seats');

  // Screen 13: BR-28.3 Shadow Access very high severity
  const screen13Html = renderApp(data, '13');
  assert.ok(screen13Html.includes('BR-28.3'), 'Screen 13 must mention BR-28.3');
  assert.ok(screen13Html.includes('MỨC RẤT CAO'), 'Screen 13 must include MỨC RẤT CAO badge');

  // Screen 16: BR-43.2 & BR-43.3
  const screen16Html = renderApp(data, '16');
  assert.ok(screen16Html.includes('BR-43.2'), 'Screen 16 must mention BR-43.2');
  assert.ok(screen16Html.includes('BR-43.3'), 'Screen 16 must mention BR-43.3');

  console.log('PASS uf14-renderer: All 16 screens render valid markup, metadata, ledger consistency, and rule guards.');
}

runTests();
