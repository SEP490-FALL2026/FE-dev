(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.UF07_RENDERER = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const icons = {
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    apps: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M8 9h8M8 13h5"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3.5 19c.7-3.5 2.5-5 5.5-5s4.8 1.5 5.5 5M14 14.5c3.7-.6 5.8.8 6.5 4.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v5c0 5.2-3.2 8.4-8 10-4.8-1.6-8-4.8-8-10V6l8-3z"/><path d="M9 12l2 2 4-5"/></svg>',
    report: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 16v-3M12 16V8M16 16v-5"/></svg>',
    import: '<svg viewBox="0 0 24 24"><path d="M12 4v11M8 8l4-4 4 4"/><path d="M4 14v5h16v-5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M9 15l6-6M7 17H6a4 4 0 010-8h4M17 7h1a4 4 0 010 8h-4"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 00-1.7-1L14.5 3h-5l-.4 3.1a8 8 0 00-1.7 1l-2.4-1-2 3.4L5.1 11a7 7 0 000 2L3 14.5l2 3.4 2.4-1a8 8 0 001.7 1l.4 3.1h5l.4-3.1a8 8 0 001.7-1l2.4 1 2-3.4-2.1-1.5a7 7 0 00.1-1z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0112 0c0 7 3 7 3 8H3c0-1 3-1 3-8zM10 21h4"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12l4 4L19 6"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2L12 3z"/><path d="M12 9v5M12 18h.01"/></svg>',
    block: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>',
  };

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function icon(name, className = '') {
    return `<span class="icon ${className}" aria-hidden="true">${icons[name] || icons.grid}</span>`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function getScreen(data, id) {
    const screen = data.screens.find((item) => item.id === String(id).padStart(2, '0'));
    if (!screen) throw new Error(`Unknown UF-07 screen: ${id}`);
    return screen;
  }

  function statusBadge(label, tone = 'neutral') {
    return `<span class="badge badge-${tone}"><span class="badge-dot"></span>${esc(label)}</span>`;
  }

  function button(label, kind = 'secondary', attrs = '') {
    return `<button class="button button-${kind}" ${attrs}>${esc(label)}${kind === 'primary' ? icon('arrow', 'button-icon') : ''}</button>`;
  }

  function confidence(value, tone = 'good') {
    return `<div class="confidence"><div class="confidence-head"><span>Confidence Score</span><strong>${value}%</strong></div><div class="confidence-track"><span class="confidence-${tone}" style="width:${value}%"></span></div></div>`;
  }

  function rawPair(record) {
    return `<section class="raw-pair">
      <div><span class="eyebrow">Raw String from Microsoft 365</span><code>${esc(record.raw)}</code></div>
      <span class="normalize-arrow">→</span>
      <div><span class="eyebrow">Normalized String</span><code>${esc(record.normalized)}</code></div>
    </section>`;
  }

  function candidateCard(candidate, options = {}) {
    const tone = candidate.confidence >= 90 ? 'good' : candidate.confidence >= 75 ? 'warn' : 'muted';
    const initials = candidate.name.split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase();
    const action = options.blocked
      ? `<button class="button button-secondary" disabled title="Blocked by BR-18.4">Cannot select</button>`
      : options.primary
        ? button('Review & Confirm', 'primary')
        : button('View Details', 'secondary');
    return `<article class="candidate-card ${options.primary ? 'candidate-primary' : ''} ${options.blocked ? 'candidate-blocked' : ''}">
      <div class="candidate-avatar">${esc(initials)}</div>
      <div class="candidate-body">
        <div class="candidate-title"><div><h3>${esc(candidate.name)}</h3><p>${esc(candidate.employeeId)} · ${esc(candidate.email)}</p></div>${statusBadge(candidate.confidence >= 90 ? 'Best Suggestion' : options.blocked ? 'Ambiguous Match' : 'Needs Review', tone === 'good' ? 'success' : 'warning')}</div>
        <p class="candidate-evidence">${esc(candidate.evidence)}</p>
        <p class="candidate-assignment">${icon('link')} ${esc(candidate.assignment)}</p>
        ${confidence(candidate.confidence, tone)}
      </div>
      <div class="candidate-action">${action}</div>
    </article>`;
  }

  function queueRows(screen, data) {
    const activeId = screen.recordId;
    const rows = [
      { id: 'UQ-0184', value: data.records['UQ-0184'].raw, score: '94%', status: screen.id >= '05' ? 'Matched' : 'Pending', tone: screen.id >= '05' ? 'success' : 'warning' },
      { id: 'UQ-0185', value: data.records['UQ-0185'].raw, score: '—', status: screen.id >= '08' ? 'Dismissed' : 'Pending', tone: screen.id >= '08' ? 'neutral' : 'warning' },
      { id: 'UQ-0186', value: data.records['UQ-0186'].raw, score: '82% / 80%', status: screen.id >= '10' ? 'Conflict' : 'Pending', tone: screen.id >= '10' ? 'danger' : 'warning' },
      { id: 'UQ-0187', value: 'pham.t.h@acmecloud.onmicrosoft.com', score: '71%', status: 'Pending', tone: 'warning' },
      { id: 'UQ-0188', value: 'external.kim@acmecloud.onmicrosoft.com', score: '—', status: 'Pending', tone: 'warning' },
      { id: 'UQ-0189', value: 'le.quang.c@acmecloud.onmicrosoft.com', score: '68%', status: 'Pending', tone: 'warning' },
      { id: 'UQ-0190', value: 'contractor.ha@acmecloud.onmicrosoft.com', score: '—', status: 'Pending', tone: 'warning' },
    ];
    const actionableRows = rows
      .filter((row) => !(screen.id >= '05' && row.id === 'UQ-0184'))
      .filter((row) => !(screen.id >= '08' && row.id === 'UQ-0185'))
      .slice(0, 5);
    return actionableRows.map((row) => `<div class="queue-row ${row.id === activeId ? 'queue-row-active' : ''}">
      <div class="queue-row-top"><strong>${row.id}</strong>${statusBadge(row.status, row.tone)}</div>
      <p title="${esc(row.value)}">${esc(row.value)}</p>
      <div class="queue-row-meta"><span>Best Candidate</span><strong>${row.score}</strong></div>
    </div>`).join('');
  }

  function queuePanel(screen, data) {
    return `<aside class="queue-panel panel">
      <div class="panel-head"><div><span class="eyebrow">Queue</span><h2>${screen.queue} Unmatched</h2></div><button class="icon-button">${icon('search')}</button></div>
      <div class="queue-search">${icon('search')}<span>Search raw string, ID, or user...</span></div>
      <div class="queue-tabs"><span class="active">Pending Action <b>${screen.queue}</b></span><span>Conflict <b>${screen.id >= '10' ? 1 : 0}</b></span></div>
      <div class="queue-list">${queueRows(screen, data)}</div>
      <div class="queue-footer"><span>Showing 5 records</span><span>1 / 29</span></div>
    </aside>`;
  }

  function contextPanel(screen, data) {
    const s = data.session;
    const audits = [];
    if (screen.id >= '05') audits.push(`<li><span class="audit-dot success"></span><div><strong>Matched UQ-0184</strong><p>IT Admin · 10:31 ICT</p></div></li>`);
    if (screen.id >= '08') audits.push(`<li><span class="audit-dot neutral"></span><div><strong>Dismissed UQ-0185</strong><p>IT Admin · 10:32 ICT</p></div></li>`);
    if (screen.id >= '10') audits.push(`<li><span class="audit-dot danger"></span><div><strong>Blocked UQ-0186</strong><p>BR-18.4 · 10:34 ICT</p></div></li>`);
    if (!audits.length) audits.push(`<li><span class="audit-dot info"></span><div><strong>Opened Queue</strong><p>IT Admin · 10:29 ICT</p></div></li>`);
    return `<aside class="context-panel">
      <section class="panel context-card">
        <div class="context-title">${icon('file')}<div><span class="eyebrow">Import Session</span><h3>${esc(s.source)}</h3></div></div>
        <dl class="context-list">
          <div><dt>File</dt><dd>${esc(s.file)}</dd></div>
          <div><dt>Session ID</dt><dd>${esc(s.id)}</dd></div>
          <div><dt>Coverage</dt><dd>${esc(s.coverage)}</dd></div>
          <div><dt>Template</dt><dd>${esc(s.template)}</dd></div>
          <div><dt>Identifier Type</dt><dd>${esc(s.identifierType)}</dd></div>
        </dl>
      </section>
      <section class="panel safety-card">
        <div class="safety-icon">${icon('shield')}</div>
        <div><h3>Safety Policy</h3><p>Unmatched identities must not be used to produce recommendations or draw conclusions about employees.</p><span>BR-18.1 · INV-12</span></div>
      </section>
      <section class="panel audit-card">
        <div class="panel-head compact"><div><span class="eyebrow">Session Log</span><h3>Recent Updates</h3></div>${icon('clock')}</div>
        <ul class="audit-list">${audits.join('')}</ul>
      </section>
    </aside>`;
  }

  function overviewContent(screen, data) {
    const s = data.session;
    return `<div class="detail-stack">
      <section class="metric-grid">
        <article class="metric-card"><span class="metric-icon info">${icon('people')}</span><div><span>Total Identities</span><strong>${formatNumber(s.totalIdentities)}</strong><small>From import file</small></div></article>
        <article class="metric-card"><span class="metric-icon success">${icon('check')}</span><div><span>Matched</span><strong>${formatNumber(s.matchedBeforeQueue)}</strong><small>88.3% of total</small></div></article>
        <article class="metric-card"><span class="metric-icon warning">${icon('warning')}</span><div><span>Unmatched</span><strong>${screen.queue}</strong><small>11.7% pending action</small></div></article>
      </section>
      <section class="panel intro-card">
        <div class="intro-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>${icon('link')}</div>
        <div class="intro-copy"><span class="eyebrow">Start with oldest record</span><h2>Controlled Identity Reconciliation</h2><p>The system provides suggestions only. IT Admin confirms every match, permanently recorded with method, confidence score, and auditor details.</p><div class="intro-rule"><b>UQ-0184</b><span>${esc(data.records['UQ-0184'].raw)}</span>${statusBadge('94% · best suggestion', 'success')}</div>${button('Open Record UQ-0184', 'primary')}</div>
      </section>
      <section class="panel distribution-card"><div><span class="eyebrow">Queue Distribution</span><h3>Prioritize records with clear confidence</h3></div><div class="bar-row"><span>≥ 90% · High confidence</span><div><i style="width:58%"></i></div><b>84</b></div><div class="bar-row"><span>70–89% · Needs review</span><div><i style="width:34%"></i></div><b>49</b></div><div class="bar-row"><span>&lt; 70% or unmapped</span><div><i style="width:9%"></i></div><b>13</b></div></section>
    </div>`;
  }

  function detailHeader(record, tone = 'warning') {
    return `<section class="record-head panel"><div><span class="eyebrow">Active Record</span><div class="record-title"><h2>${record.id}</h2>${statusBadge(record.status, tone)}</div><p>Detected ${esc(record.detectedAt)} · ${record.usageRecords} usage events</p></div><button class="icon-button">•••</button></section>`;
  }

  function candidatesContent(record, blocked = false) {
    return `<div class="detail-stack">${detailHeader(record, blocked ? 'danger' : 'warning')}${rawPair(record)}<section class="candidate-list"><div class="section-title"><div><span class="eyebrow">Internal Candidates</span><h2>${record.candidates.length} suggested candidates</h2></div><span class="method-pill">${esc(record.matchMethod)}</span></div>${record.candidates.map((item, index) => candidateCard(item, { primary: index === 0 && !blocked, blocked })).join('')}</section></div>`;
  }

  function confirmMatchContent(record) {
    return `<div class="detail-stack dimmed">${detailHeader(record)}${rawPair(record)}${candidateCard(record.candidates[0], { primary: true })}</div>
      <div class="dialog-layer"><section class="dialog panel"><div class="dialog-icon info">${icon('link')}</div><span class="eyebrow">BR-18.3 · Manual Match</span><h2>Confirm Manual Match</h2><p>You are about to link this Microsoft 365 identity to an internal employee. This decision will be permanently logged.</p><div class="dialog-map"><code>${esc(record.normalized)}</code><span>→</span><div><strong>${esc(record.candidates[0].name)}</strong><small>${esc(record.candidates[0].employeeId)} · ${esc(record.candidates[0].email)}</small></div></div><dl class="dialog-facts"><div><dt>Method</dt><dd>Manual · from 94% suggestion</dd></div><div><dt>Impact Scope</dt><dd>${record.usageRecords} usage events · ${record.assignments} Assignment</dd></div><div><dt>Confirmed By</dt><dd>${esc(record.confirmedBy)}</dd></div></dl><label class="check-row"><span class="fake-check">${icon('check')}</span><span>I have verified the raw string, target employee, and impact scope.</span></label><div class="dialog-actions">${button('Cancel', 'secondary')}${button('Confirm Manual Match', 'primary')}</div></section></div>`;
  }

  function recomputeContent(record) {
    return `<div class="detail-stack">${detailHeader({ ...record, status: 'Re-aggregating' }, 'info')}<section class="panel progress-card"><div class="progress-mark"><div class="spinner-ring"></div><span>68%</span></div><span class="eyebrow">Do not close this page while task is running</span><h2>Recalculating Usage Data</h2><p>Mapping saved. System is processing ${record.usageRecords} usage events and linking them to active Assignments at event timestamp.</p><div class="progress-bar"><i style="width:68%"></i></div><ol class="progress-steps"><li class="done">${icon('check')}<div><strong>Save IdentityMapping</strong><span>Complete · manual method</span></div></li><li class="active"><span class="step-pulse"></span><div><strong>Link usage to Assignment</strong><span>Processing 16 of ${record.usageRecords} events</span></div></li><li><span class="step-empty"></span><div><strong>Recalculate usage status</strong><span>Queued</span></div></li></ol><div class="inline-note">${icon('shield')} Queue remains <b>146</b> until task completion.</div></section></div>`;
  }

  function successContent(record, kind) {
    const matched = kind === 'match';
    return `<div class="detail-stack">${detailHeader({ ...record, status: matched ? 'Matched' : 'Dismissed' }, matched ? 'success' : 'neutral')}<section class="panel result-card ${matched ? 'result-success' : 'result-neutral'}"><div class="result-icon">${icon(matched ? 'check' : 'block')}</div><span class="eyebrow">${matched ? 'Completed at 10:31 ICT' : 'Logged at 10:32 ICT'}</span><h2>${matched ? 'Identity Matched Successfully' : 'Identity Dismissed'}</h2><p>${matched ? `${record.usageRecords} usage events have been re-aggregated for ${record.assignments} active Assignment.` : 'Record retained for audit compliance but no IdentityMapping created and no employee conclusions drawn.'}</p>${matched ? `<div class="result-map"><code>${esc(record.normalized)}</code><span>→</span><div><strong>${esc(record.candidates[0].name)}</strong><small>${esc(record.candidates[0].employeeId)} · ${esc(record.candidates[0].email)}</small></div></div><div class="result-metrics"><div><b>${record.usageRecords}</b><span>Events Re-aggregated</span></div><div><b>${record.assignments}</b><span>Assignments Recalculated</span></div><div><b>145</b><span>Remaining in Queue</span></div></div>` : `<div class="reason-box"><span class="eyebrow">Dismissal Reason</span><strong>${esc(record.ignoreReason)}</strong><small>${esc(record.ignoredBy)} · ${esc(record.ignoredAt)}</small></div><div class="result-metrics"><div><b>0</b><span>IdentityMappings Created</span></div><div><b>0</b><span>Employee Conclusions</span></div><div><b>144</b><span>Remaining in Queue</span></div></div>`}<div class="result-actions">${button('View Audit Log', 'secondary')}${button('Process Next Record', 'primary')}</div></section></div>`;
  }

  function noCandidateContent(record) {
    return `<div class="detail-stack">${detailHeader(record)}${rawPair(record)}<section class="panel empty-card"><div class="empty-icon">${icon('search')}</div><span class="eyebrow">0 Matching Candidates</span><h2>No Matching Employee Found</h2><p>Searched across email, username, display name, and employee ID with no relevant results.</p><div class="manual-search">${icon('search')}<span>Search by email, name, or employee ID...</span><button>Search</button></div><div class="source-clues"><span>Display Name</span><strong>${esc(record.displayName)}</strong><span>Related Usage</span><strong>${record.usageRecords} events</strong></div><div class="empty-actions">${button('Back to Queue', 'secondary')}${button('Mark as Dismissed', 'primary')}</div></section></div>`;
  }

  function confirmIgnoreContent(record) {
    return `<div class="detail-stack dimmed">${detailHeader(record)}${rawPair(record)}<section class="panel empty-card compact-empty"><h2>No Candidates Found</h2><p>No internal employee matches source string.</p></section></div><div class="dialog-layer"><section class="dialog panel"><div class="dialog-icon warning">${icon('warning')}</div><span class="eyebrow">BR-18.1 · Mandatory Justification</span><h2>Confirm Dismiss Identity</h2><p>This record will be excluded from all employee conclusions but preserved in the audit log.</p><div class="field"><label>Dismissal Reason <b>*</b></label><textarea readonly>${esc(record.ignoreReason)}</textarea><small>58 characters · minimum 10 characters</small></div><div class="warning-strip">${icon('shield')} No IdentityMapping created · No recommendation generated · Raw string preserved</div><div class="dialog-actions">${button('Cancel', 'secondary')}${button('Confirm Dismissal', 'primary')}</div></section></div>`;
  }

  function ambiguousContent(record) {
    return `<div class="detail-stack">${detailHeader(record, 'danger')}${rawPair(record)}<section class="conflict-banner">${icon('warning')}<div><strong>Cannot Resolve Automatically</strong><p>Two candidates share near-identical confidence. Under BR-18.4, system cannot auto-select either candidate.</p></div></section><section class="candidate-list"><div class="section-title"><div><span class="eyebrow">Conflicting Candidates</span><h2>2 employees require manual verification</h2></div><span class="method-pill">${esc(record.matchMethod)}</span></div>${record.candidates.map((item) => candidateCard(item, { blocked: true })).join('')}</section></div>`;
  }

  function conflictBlockedContent(record) {
    return `<div class="detail-stack">${detailHeader(record, 'danger')}<section class="panel blocked-card"><div class="blocked-icon">${icon('block')}</div><span class="eyebrow">BR-18.4 · Mandatory Guard</span><h2>Cannot Arbitrarily Select Employee</h2><p>Identity <code>${esc(record.normalized)}</code> matches two different employees. Neither candidate may be auto-assigned over the other.</p><div class="blocked-candidates">${record.candidates.map((candidate) => `<div><span class="mini-avatar">${candidate.name.split(' ').slice(-2).map((part) => part[0]).join('')}</span><strong>${esc(candidate.name)}</strong><small>${candidate.employeeId} · ${candidate.confidence}%</small></div>`).join('<span class="versus">VS</span>')}</div><div class="blocked-rules"><div>${icon('block')} Candidate selection blocked</div><div>${icon('shield')} Excluded from conclusions</div><div>${icon('file')} All evidence preserved</div></div><div class="result-actions">${button('Back to Details', 'secondary')}${button('Move to Conflict Queue', 'primary')}</div></section></div>`;
  }

  function conflictWaitingContent(record) {
    return `<div class="detail-stack">${detailHeader({ ...record, status: 'Conflict · Pending Resolution' }, 'danger')}<section class="panel waiting-card"><div class="waiting-top"><div class="waiting-icon">${icon('clock')}</div><div><span class="eyebrow">Controlled End State</span><h2>Awaiting Conflict Resolution</h2><p>Record remains in queue. No IdentityMapping or employee conclusions generated.</p></div>${statusBadge('Pending Conflicts: 1', 'danger')}</div><div class="waiting-grid"><div><span>Identifier</span><code>${esc(record.normalized)}</code></div><div><span>Assignee</span><strong>Unassigned</strong></div><div><span>Queue Status</span><strong>144 unmatched</strong></div><div><span>Last Updated</span><strong>${esc(record.blockedAt)}</strong></div></div><div class="candidate-snapshot"><span class="eyebrow">Preserved Evidence</span>${record.candidates.map((candidate) => `<div><strong>${esc(candidate.name)}</strong><span>${candidate.employeeId} · ${candidate.email}</span><b>${candidate.confidence}%</b></div>`).join('')}</div><div class="waiting-note">${icon('shield')} Record will not enter the rule engine until conflict is resolved.</div><div class="result-actions">${button('View Resolution Log', 'secondary')}${button('Return to Queue', 'primary')}</div></section></div>`;
  }

  function mainContent(screen, data) {
    const record = data.records[screen.recordId];
    switch (screen.state) {
      case 'queue': return overviewContent(screen, data);
      case 'candidates': return candidatesContent(record);
      case 'confirm-match': return confirmMatchContent(record);
      case 'recompute': return recomputeContent(record);
      case 'match-success': return successContent(record, 'match');
      case 'no-candidate': return noCandidateContent(record);
      case 'confirm-ignore': return confirmIgnoreContent(record);
      case 'ignore-success': return successContent(record, 'ignore');
      case 'ambiguous': return ambiguousContent(record);
      case 'conflict-blocked': return conflictBlockedContent(record);
      case 'conflict-waiting': return conflictWaitingContent(record);
      default: throw new Error(`Unknown UF-07 state: ${screen.state}`);
    }
  }

  function sidebar() {
    const items = [
      ['grid', 'Dashboard'], ['apps', 'Applications'], ['people', 'Users & Teams'], ['shield', 'Access Control'],
      ['report', 'Reports'], ['warning', 'Recommendations', '12'], ['import', 'Data Import', '', true], ['link', 'Integrations'], ['gear', 'Settings'],
    ];
    return `<aside class="app-sidebar"><div class="brand"><div class="brand-mark">${icon('shield')}</div><div><strong>SaaS-Sentry</strong><span>See SaaS. Control Access.</span></div></div><nav>${items.map(([name, label, badge, active]) => `<a class="nav-item ${active ? 'active' : ''}">${icon(name)}<span>${label}</span>${badge ? `<b>${badge}</b>` : ''}</a>`).join('')}</nav><div class="sidebar-footer"><div class="edition-mark">${icon('shield')}</div><div><strong>SaaS-Sentry</strong><span>Enterprise Edition</span></div></div></aside>`;
  }

  function topbar() {
    return `<header class="topbar"><div class="global-search">${icon('search')}<span>Search apps, users, access permissions...</span><kbd>⌘ K</kbd></div><div class="top-actions"><button class="icon-button has-dot">${icon('bell')}</button><button class="help-button">?</button><div class="account"><span class="account-avatar">IT</span><div><strong>IT Admin</strong><small>it-admin@company.com</small></div><span class="chevron">⌄</span></div></div></header>`;
  }

  function renderScreen(screen, data) {
    const queue = screen.queue;
    return `<div class="app-shell" data-screen="${screen.id}" data-queue="${queue}">${sidebar()}<main class="workspace">${topbar()}<div class="page"><div class="breadcrumb"><span>Data Import</span><b>›</b><span>Session ${esc(data.session.id)}</span><b>›</b><strong>Unmatched Queue</strong></div><header class="page-header"><div><div class="title-line"><span class="screen-number">${screen.id}</span><h1>${esc(screen.title)}</h1></div><p>${esc(screen.subtitle)}</p></div><div class="header-stats"><span>${statusBadge(`${queue} Unmatched`, 'warning')}</span><span class="source-chip">${icon('apps')} Microsoft 365</span></div></header><section class="safety-banner">${icon('shield')}<div><strong>Unmatched data is isolated from rule engine</strong><span>No records in this queue will be used to produce recommendations or draw conclusions about employees.</span></div><b>BR-18.1 · INV-12</b></section><div class="content-grid">${queuePanel(screen, data)}<section class="detail-area">${mainContent(screen, data)}</section>${contextPanel(screen, data)}</div></div></main></div>`;
  }

  function mount() {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme') === 'dark' ? 'dark' : 'light';
    const screen = getScreen(window.UF07_DATA, params.get('screen') || '01');
    document.documentElement.dataset.theme = theme;
    document.title = `UF-07 ${theme} ${screen.id} · ${screen.title}`;
    document.getElementById('app').innerHTML = renderScreen(screen, window.UF07_DATA);
    requestAnimationFrame(() => {
      const overflow = document.documentElement.scrollWidth > 1440 || document.documentElement.scrollHeight > 1024;
      document.documentElement.dataset.overflow = String(overflow);
      document.documentElement.dataset.renderReady = 'true';
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }

  return Object.freeze({ getScreen, renderScreen });
});
