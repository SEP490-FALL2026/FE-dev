const assert = require('node:assert/strict')
const data = require('./uf07-data.js')
const renderer = require('./uf07-renderer.js')

for (const screen of data.screens) {
  const html = renderer.renderScreen(screen, data)
  assert.match(html, new RegExp(screen.title))
  assert.match(html, new RegExp(screen.recordId))
  assert.match(html, new RegExp(`data-queue="${screen.queue}"`))
  assert.match(html, /IMP-20250114-7F3A/)
  assert.match(html, /m365_usage_jan2025\.csv/)
}

const unique = renderer.renderScreen(data.screens[1], data)
assert.match(unique, /Nguyen\.Van_A@acmecloud\.onmicrosoft\.com/)
assert.match(unique, /nguyen\.van_a@acmecloud\.onmicrosoft\.com/)
assert.match(unique, /Nguyen Van An/)
assert.match(unique, /94%/)

const confirm = renderer.renderScreen(data.screens[2], data)
assert.match(confirm, /Confirm Manual Match/)
assert.match(confirm, /23 usage events/)
assert.match(confirm, /IT Admin · it-admin@company\.com/)

const processing = renderer.renderScreen(data.screens[3], data)
assert.match(processing, /Recalculating Usage Data/)
assert.doesNotMatch(processing, /Hoàn tất tổng hợp/)

const ignore = renderer.renderScreen(data.screens[6], data)
assert.match(ignore, /External vendor service account, not assigned to employee/)

const conflict = renderer.renderScreen(data.screens[9], data)
assert.match(conflict, /BR-18\.4/)
assert.doesNotMatch(conflict, /Select Nguyen/)

const waiting = renderer.renderScreen(data.screens[10], data)
assert.match(waiting, /Pending Conflicts/)
assert.match(waiting, /Unassigned/)

function queueList(html) {
  const startMarker = '<div class="queue-list">'
  const endMarker = '<div class="queue-footer">'
  const start = html.indexOf(startMarker)
  const end = html.indexOf(endMarker, start)
  assert.notEqual(start, -1)
  assert.notEqual(end, -1)
  return html.slice(start + startMarker.length, end)
}

const afterMatchQueue = queueList(renderer.renderScreen(data.screens[4], data))
assert.doesNotMatch(afterMatchQueue, /UQ-0184/)
assert.match(afterMatchQueue, /UQ-0185/)

const afterIgnoreQueue = queueList(renderer.renderScreen(data.screens[7], data))
assert.doesNotMatch(afterIgnoreQueue, /UQ-0184|UQ-0185/)
assert.match(afterIgnoreQueue, /UQ-0186/)

const conflictQueue = queueList(renderer.renderScreen(data.screens[10], data))
assert.match(conflictQueue, /UQ-0186/)

assert.throws(() => renderer.getScreen(data, '12'), /Unknown UF-07 screen: 12/)

console.log('PASS uf07-renderer: 11 states preserve source, record, queue, and guarded branch content')
