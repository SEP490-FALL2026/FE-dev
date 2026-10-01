const assert = require('assert');
const { createUF13Data } = require('./uf13-data');

console.log('--- RUNNING UF-13 DATA UNIT TESTS ---');

const data = createUF13Data();

// 1. Kiểm tra số lượng screens
assert.strictEqual(data.screens.length, 16, 'UF-13 must have exactly 16 screens');

// 2. Kiểm tra Stages
assert.strictEqual(data.stages.length, 6, 'UF-13 must have 6 stages');

// 3. Kiểm tra vai trò Super Admin
const superAdminScreens = data.screens.filter(s => s.role.includes('Super Admin') || s.role.includes('Hệ thống'));
assert.strictEqual(superAdminScreens.length, 16, 'All screens must belong to Super Admin or System security');

// 4. Kiểm tra ledger state transitions
const l01 = data.ledgers['l01'];
const l05 = data.ledgers['l05'];
const l09 = data.ledgers['l09'];
const l15 = data.ledgers['l15'];

assert.strictEqual(l01.auditLogCount, 842, 'Baseline audit logs must be 842');
assert.strictEqual(l05.auditLogCount, 843, 'Audit logs must increment to 843 after SoD block');
assert.strictEqual(l09.noticeVersion, 'v1.3', 'Notice version must increment to v1.3 at frame 09');
assert.strictEqual(l09.auditLogCount, 844, 'Audit logs must increment to 844 after notice update');
assert.strictEqual(l15.policyVersion, 'v2.2', 'Policy version must upgrade to v2.2 at frame 15');
assert.strictEqual(l15.activePolicies, 13, 'Active policies must become 13 at frame 15');
assert.strictEqual(l15.auditLogCount, 845, 'Audit logs must increment to 845 after policy publish');

// 5. Kiểm tra màn hình chặn SYS-04
const sys04Screen = data.screens.find(s => s.id === '05');
assert.strictEqual(sys04Screen.screenCode, 'SYS-04', 'Screen 05 must be SYS-04');
assert(sys04Screen.title.includes('CHẶN PHÂN QUYỀN'), 'Screen 05 must be SoD blocking screen');

// 6. Kiểm tra ngưỡng đa tầng BR-20.1
assert.strictEqual(data.thresholds.length, 4, 'Thresholds must have 4 tiers');
const figmaThreshold = data.thresholds.find(t => t.app.includes('Figma'));
assert.strictEqual(figmaThreshold.inactiveDays, 30, 'Figma threshold must be 30 days');
assert.strictEqual(figmaThreshold.override, true, 'Figma threshold must be override');

console.log('✅ ALL UF-13 DATA UNIT TESTS PASSED (6/6)');
