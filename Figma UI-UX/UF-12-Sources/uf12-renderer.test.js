'use strict';

const assert = require('node:assert/strict');
const { createUF12Data } = require('./uf12-data.js');
const { renderApp } = require('./uf12-renderer.js');
const data = createUF12Data();
const contains = (html, value) => assert.ok(html.includes(value), `Missing rendered value: ${value}`);

for (const screen of data.screens) {
  const html = renderApp(data, screen.id);
  contains(html, `data-screen="${screen.id}"`);
  contains(html, `data-stage="${screen.stage}"`);
  contains(html, data.run.id);
  contains(html, screen.title);
}
const frame03 = renderApp(data, '03');
contains(frame03, data.primaryEvidence.raw);
contains(frame03, data.primaryEvidence.id);
const frame05 = renderApp(data, '05');
contains(frame05, 'Không URL');
contains(frame05, 'Tên miền lạ');
const frame08 = renderApp(data, '08');
contains(frame08, 'Bắt buộc IT Admin xác nhận');
contains(frame08, 'Thấp');
const frame10 = renderApp(data, '10');
contains(frame10, 'Không tạo finding');
const frame11 = renderApp(data, '11');
contains(frame11, data.finding.id);
contains(frame11, 'Không tạo finding thứ hai');
const frame15 = renderApp(data, '15');
contains(frame15, 'Báo nhầm');
contains(frame15, 'Đã duyệt');
contains(frame15, 'Chưa duyệt');
const frame16 = renderApp(data, '16');
contains(frame16, 'Mở lại');
const frame18 = renderApp(data, '18');
contains(frame18, data.branches.approved.purchaseRequest);
contains(frame18, 'chưa đồng nghĩa đã duyệt chi');
const frame19 = renderApp(data, '19');
contains(frame19, data.branches.unapproved.handoff);
contains(frame19, 'chưa có thay đổi quyền');
console.log('PASS uf12-renderer: 20 frames render governed evidence, outcomes, and audit boundaries');
