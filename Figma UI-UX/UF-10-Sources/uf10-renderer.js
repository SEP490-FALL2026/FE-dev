(function initUF10Renderer(globalScope) {
  'use strict';

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const badge = (text, tone = 'neutral') => `<span class="badge ${tone}">${esc(text)}</span>`;
  const button = (text, kind = 'primary', attrs = '') => `<button class="btn ${kind}" ${attrs}>${esc(text)}</button>`;
  const stat = (label, value, note, tone = '') => `<div class="stat ${tone}"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
  const field = (label, value) => `<label class="field"><span>${esc(label)}</span><input value="${esc(value)}"></label>`;

  function table(headers, rows, className = '') {
    return `<div class="table-wrap ${className}"><table><thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function appCell(short, name, sub, tone = 'blue') {
    return `<div class="app-cell"><span class="app-logo ${esc(tone)}">${esc(short)}</span><div><strong>${esc(name)}</strong><small>${esc(sub)}</small></div></div>`;
  }

  function groupBadge(group) {
    const tone = group === 'G1' ? 'info' : group === 'G2' ? 'danger' : group === 'G3' ? 'warning' : group === 'G4' ? 'purple' : 'neutral';
    return badge(group, tone);
  }

  function groupCards(data) {
    return data.groups.map((group) => `<article class="group-card ${group.tone}"><div class="group-top"><span>${esc(group.id)}</span>${badge(group.confidence, group.id === 'G2' ? 'danger' : group.id === 'G3' ? 'warning' : 'info')}</div><strong>${esc(group.count)}</strong><h3>${esc(group.name)}</h3><p>${esc(group.source)}</p><footer><span>${group.managerRequired ? 'Manager Required' : 'No Manager Required'}</span><b>${esc(group.action)} →</b></footer></article>`).join('');
  }

  function g2Rows(data, mode) {
    return data.g2.items.map((item) => {
      const last = mode === 'tasks'
        ? badge('Created ' + item.taskId, 'info')
        : mode === 'selected' ? '<span class="check checked">✓</span>' : badge('G2 · 100%', 'danger');
      return [
        appCell(item.short, item.app, item.subscriptionId, item.tone),
        `<div><strong>${esc(item.user)}</strong><small class="cell-note">${esc(item.employeeId)}</small></div>`,
        `<span class="mono">${esc(item.assignmentId)}</span>`,
        last,
      ];
    });
  }

  function usageRows(data, mode = 'list') {
    return data.usageRecommendations.map((item) => {
      let last = badge(`${item.confidence}%`, item.confidence >= 90 ? 'success' : 'warning');
      if (mode === 'results') {
        const tone = item.managerDecision === 'Revoke' ? 'danger' : item.managerDecision === 'Keep' ? 'success' : 'warning';
        last = badge(item.managerDecision, tone);
      }
      return [
        `<div><strong>${esc(item.id)}</strong><small class="cell-note">${groupBadge(item.group)} ${esc(item.app)}</small></div>`,
        `<div><strong>${esc(item.user)}</strong><small class="cell-note">${esc(item.employeeId)} · ${esc(item.assignmentId)}</small></div>`,
        `<div><strong>${esc(item.evidence)}</strong><small class="cell-note">Coverage ${esc(item.coverageDays)} days</small></div>`,
        last,
      ];
    });
  }

  function screenContent(data, screen) {
    const g1 = data.g1;
    const rec = data.usageRecommendations[0];
    const batch = data.managerBatch;
    switch (screen.state) {
      case 'optimization-dashboard':
        return `<section class="metrics">${stat('Total Detections', '38', 'Not processed together', 'blue')}${stat('Internal Rule', '15', 'G1 + G2 · 100%')}${stat('Manager Gate', '23', 'G3 + G4', 'amber')}${stat('Rule Run', '06:15', '17/09/2026')}</section>
          <section class="group-grid">${groupCards(data)}</section>
          <section class="savings-strip"><div><span>Immediate Savings</span><strong>0 VND/mo</strong><small>Recorded only after seats released</small></div><i></i><div><span>Savings at Renewal</span><strong>0 VND/yr</strong><small>Recorded only after approved decision</small></div><em>Do not combine both units</em></section>
          <div class="action-bar"><span>Rule engine locked snapshot · ${esc(data.run.generatedAt)}</span>${button('Compare Four Categories →')}</div>`;
      case 'group-comparison':
        return `<section class="card"><div class="section-head"><div><h2>G1–G4 Processing Matrix</h2><p>Shared license waste, distinct evidence standards and decision authorities</p></div>${badge('BR-19 · BR-20', 'info')}</div>
          ${table(['Category', 'Target Scope', 'Source & Confidence', 'Decision Gate', 'Action'], data.groups.map((group) => [groupBadge(group.id), `<strong>${group.id === 'G1' ? 'Subscription' : 'Assignment'}</strong>`, `<div><strong>${esc(group.source)}</strong><small class="cell-note">${esc(group.confidence)}</small></div>`, group.managerRequired ? badge('Manager · UF-05', 'warning') : badge('Direct IT Execution', 'success'), esc(group.action)]), 'compare-table')}</section>
          <section class="notice info"><strong>No “Process All 38” button</strong><span>G1 adjusts renewal quantity; G2 revokes immediately; G3/G4 require usage snapshot and human sign-off.</span></section>
          <div class="action-bar"><span>Select a category to enter dedicated mini-flow</span>${button('Open G1 · Renewal →')}</div>`;
      case 'g1-list':
        return `<section class="notice info"><strong>G1 targets subscriptions, not individual employees</strong><span>Decision entity is the purchased quantity of each Subscription.</span></section>
          <section class="metrics">${stat('Subscriptions with G1', '04', '12 seats total', 'blue')}${stat('Proposed Reduction', '12 seats', 'At renewal')}${stat('Earliest Deadline', '15/11', 'Microsoft 365', 'amber')}${stat('Manager Gate', 'None', 'Cost Approver decides')}</section>
          <section class="card"><div class="section-head"><div><h2>Subscriptions Requiring Optimization</h2><p>Prioritized by cancellation notice deadline, not employee name</p></div>${badge('12 G1 seats', 'info')}</div>
          ${table(['Subscription', 'Purchased / Assigned', 'Unassigned Seats', 'Notice Deadline', 'Estimated Renewal Savings'], [
            [appCell('M365', 'Microsoft 365 E3', g1.subscriptionId), '<strong>120 / 108</strong>', '<strong>12</strong>', `<strong>${esc(g1.noticeDeadline)}</strong>`, `<strong>${esc(g1.estimatedSaving)}</strong>`],
            [appCell('AD', 'Adobe Creative Cloud', 'SUB-ADO-CC-02', 'red'), '42 / 40', '2', '01/12/2026', '16,800,000 VND/yr'],
            [appCell('NT', 'Notion Enterprise', 'SUB-NOT-ENT-01', 'black'), '55 / 54', '1', '20/12/2026', '3,600,000 VND/yr'],
          ])}</section>
          <div class="action-bar"><span>Prioritizing Subscription with earliest notice deadline</span>${button('Open SUB-M365-E3-01')}</div>`;
      case 'g1-renewal-detail':
        return `<section class="metrics">${stat('Purchased', '120', 'Current seats')}${stat('Assigned', '108', 'Active assignments')}${stat('Proposed Reduction', '12 seats', 'G1 · 100%', 'blue')}${stat('Buffer Retained', '0', 'Approver determines', 'amber')}</section>
          <section class="split renewal-detail"><div class="card"><div class="section-head"><div><h2>${esc(g1.app)}</h2><p>${esc(g1.subscriptionId)} · Renewal ${esc(g1.renewalDate)}</p></div>${groupBadge('G1')}</div>
          <div class="quantity-viz"><div><span>120</span><small>Purchased</small></div><i><b style="width:90%"></b></i><div><span>108</span><small>Assigned</small></div></div>
          <div class="recommend-box"><span>Proposed Reduction</span><strong>12 seats</strong><small>Estimated ${esc(g1.estimatedSaving)}</small></div>
          <div class="notice warning"><strong>This is an estimate, not realized savings</strong><span>Requires renewal decision and actual contract quantity reduction.</span></div></div>
          <div class="card guard-card"><h2>Contract Milestones</h2><div class="kv"><span>Notice Deadline</span><strong>${esc(g1.noticeDeadline)}</strong></div><div class="kv"><span>Renewal Date</span><strong>${esc(g1.renewalDate)}</strong></div><div class="kv"><span>Unit Cost</span><strong>${esc(g1.unitCost)}</strong></div><div class="kv"><span>Decision Entity</span><strong>Subscription</strong></div>${button('Route to Cost Approver')}</div></section>`;
      case 'g1-approval-handoff':
        return `<section class="handoff-flow"><article class="handoff-card done"><span>1</span><div><small>ITA-04 · Preparation</small><strong>${esc(g1.decisionId)}</strong><p>Proposed 12 seat reduction · ${esc(g1.estimatedSaving)}</p></div>${badge('Sent', 'success')}</article><b>→</b>
          <article class="handoff-card active"><span>2</span><div><small>UF-15 · Decision</small><strong>Cost Approver</strong><p>Select reduction quantity and retained buffer</p></div>${badge('In Progress', 'warning')}</article><b>→</b>
          <article class="handoff-card"><span>3</span><div><small>UF-11 · Post-Approval</small><strong>Finance Recording</strong><p>Cannot alter decision</p></div>${badge('Not Started')}</article></section>
          <section class="notice danger"><strong>Finance is not the approver</strong><span>Current workflow is UF-15 → UF-11. Finance records post-decision only.</span></section>
          <section class="card"><div class="section-head"><div><h2>Handoff Snapshot</h2><p>Data locked at submission timestamp so approver sees verified baseline</p></div>${badge(g1.decisionId, 'info')}</div><div class="receipt"><div><span>Subscription</span><strong>${esc(g1.subscriptionId)}</strong></div><div><span>Proposal</span><strong>Reduce 12 seats</strong></div><div><span>Notice Deadline</span><strong>${esc(g1.noticeDeadline)}</strong></div><div><span>Estimate</span><strong>${esc(g1.estimatedSaving)}</strong></div></div></section>`;
      case 'g1-approved-recorded':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>Approved 8 Seat Reduction, 4 Buffer Retained</strong><span>${esc(g1.approvalId)} · ${esc(g1.approvedBy)} · ${esc(g1.approvedAt)}</span></div>${badge('UF-15 Completed', 'success')}</section>
          <section class="metrics">${stat('Original Proposal', '12 seats', '72,000,000 VND/yr')}${stat('Approved', '8 seats', '48,000,000 VND/yr', 'green')}${stat('Buffer Retained', '4 seats', 'Per decision')}${stat('Finance', 'Recorded', g1.financeRecordId, 'green')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>Renewal Decision</h2><p>Does not record 72M as realized cash</p></div>${badge(g1.approvalId, 'success')}</div><div class="decision-chart"><div style="width:66.67%"><span>8 seats reduced</span></div><div style="width:33.33%"><span>4 seats buffer</span></div></div><div class="notice info"><strong>Approved cost reduction at renewal</strong><span>${esc(g1.approvedSaving)} · Effective ${esc(g1.renewalDate)}</span></div></div>
          <div class="card"><div class="section-head"><div><h2>UF-11 · Finance Recording</h2><p>Post-approval, not on approval path</p></div></div><div class="receipt one-col"><div><span>Record ID</span><strong>${esc(g1.financeRecordId)}</strong></div><div><span>Timestamp</span><strong>${esc(g1.recordedAt)}</strong></div><div><span>Decision Reference</span><strong>${esc(g1.approvalId)}</strong></div></div></div></section>`;
      case 'g2-list':
        return `<section class="metrics">${stat('G2 Pending', '03', '3 Assignments', 'red')}${stat('Confidence', '100%', 'HRIS + Internal', 'green')}${stat('Manager Gate', 'None', 'BR-05.2')}${stat('Execution', 'Immediate', 'Bypasses threshold', 'amber')}</section>
          <section class="notice danger"><strong>Manager approval not required</strong><span>Terminated employees have no ongoing business justification; G2 routes directly to IT.</span></section>
          <section class="card"><div class="section-head"><div><h2>Seats of Offboarded Employees</h2><p>Source ${esc(data.g2.decisionSource)} · Snapshot ${esc(data.run.generatedAt)}</p></div>${button('Select All 3', 'ghost')}</div>${table(['Application', 'Employee', 'Assignment', 'Status'], g2Rows(data, 'list'))}</section>
          <div class="action-bar"><span>Selected 3/3 G2 · Not routed to UF-05</span>${button('Revoke 3 Seats Immediately →')}</div>`;
      case 'g2-bulk-confirm':
        return `<div class="backdrop"><section class="modal wide"><div class="modal-mark danger">3</div><h2>Confirm Immediate Revocation of 3 Seats</h2><p>G2 does not require manager sign-off. Each Assignment creates a ProvisioningTask in UF-08.</p>
          <div class="notice info"><strong>Manager approval not required</strong><span>Internal signal · 100% confidence · BR-05.2.</span></div>
          ${field('Type “3” to confirm *', '3')}${field('Shared Justification *', data.g2.reason)}
          <label class="checkbox-line"><span class="check checked">✓</span><span>I understand creating tasks does not mean seats are released.</span></label>
          <div class="modal-actions">${button('Cancel', 'ghost')}${button('Confirm & Create 3 Tasks')}</div></section></div>`;
      case 'g2-tasks-created':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>3 G2 Revocation Tasks Created</strong><span>Decision source ${esc(data.g2.decisionSource)} · Handed off to UF-08.</span></div>${badge('3 open tasks', 'info')}</section>
          <section class="notice warning"><strong>Assignment retains seat reservation</strong><span>ProvisioningTask is an execution request; Assignment awaits evidence before release.</span></section>
          <section class="card">${table(['Application', 'Employee', 'Assignment', 'UF-08 Task'], g2Rows(data, 'tasks'))}</section>
          <div class="action-bar"><span>TasksOpen 3 · SeatsReleased 0</span>${button('Open UF-08 Queue →')}</div>`;
      case 'usage-list':
        return `<section class="metrics">${stat('G3', '09', 'Never active', 'amber')}${stat('G4', '14', 'Dormant / Inactive', 'blue')}${stat('Awaiting Manager', '23', 'Weekly batch')}${stat('Valid Coverage', '3/3', 'Threshold met', 'green')}</section>
          <section class="notice info"><strong>Conclusions drawn only with adequate data</strong><span>Missing data or unmatched identities will not produce G3/G4.</span></section>
          <section class="card"><div class="section-head"><div><h2>Usage-based Recommendations</h2><p>Three demo profiles in Week 38 batch</p></div>${badge('Immutable Snapshot', 'info')}</div>${table(['Recommendation', 'User', 'Evidence', 'Confidence'], usageRows(data))}</section>`;
      case 'usage-evidence':
        return `<section class="notice info hero-notice"><div class="notice-icon">◇</div><div><strong>Immutable Snapshot</strong><span>Evidence below belongs to ${esc(rec.id)} generated at ${esc(data.run.generatedAt)}, never re-read from current source.</span></div>${badge('G3 · 92%', 'success')}</section>
          <section class="split evidence-layout"><div class="card"><div class="section-head"><div><h2>Evidence Chain</h2><p>${esc(rec.user)} · ${esc(rec.employeeId)} · ${esc(rec.assignmentId)}</p></div>${badge(rec.id, 'info')}</div>
          <div class="evidence-line ok"><b>✓</b><div><strong>120-day coverage window</strong><span>Sufficient duration to conclude no activity</span></div></div><div class="evidence-line ok"><b>✓</b><div><strong>Identity match</strong><span>${esc(rec.identityMatch)}</span></div></div><div class="evidence-line ok"><b>✓</b><div><strong>Activity definition</strong><span>${esc(rec.activityDefinition)}</span></div></div><div class="evidence-line ok"><b>✓</b><div><strong>Source import</strong><span>${esc(rec.sourceImportedAt)}</span></div></div></div>
          <div class="card guard-card"><h2>Conclusion at Time of Run</h2><div class="confidence-ring"><strong>92%</strong><span>High confidence</span></div><div class="kv"><span>Category</span><strong>G3</strong></div><div class="kv"><span>Conclusion</span><strong>${esc(rec.evidence)}</strong></div><div class="kv"><span>Manager</span><strong>${esc(rec.manager)}</strong></div>${button('Add to Weekly Batch')}</div></section>`;
      case 'manager-batch-send':
        return `<section class="metrics">${stat('Batch', 'W38-009', '3 recommendations', 'blue')}${stat('Managers', '02', 'Two organizational scopes')}${stat('Cadence', 'Weekly', 'Prevents notification fatigue')}${stat('Response SLA', '2 days', 'Per UF-05')}</section>
          <section class="card"><div class="section-head"><div><h2>${esc(batch.id)}</h2><p>Weekly batch · Dispatched ${esc(batch.sentAt)}</p></div>${badge('Ready to Dispatch', 'warning')}</div>
          ${table(['Manager', 'Recommendations', 'G3 / G4', 'Assigned Profiles'], [
            ['<strong>Le Thu Ha · EMP-0311</strong>', '<strong>2</strong>', `${groupBadge('G3')} ${groupBadge('G4')}`, 'Pham Quang · Nguyen Mai Anh'],
            ['<strong>Nguyen Hoang Long · EMP-0216</strong>', '<strong>1</strong>', groupBadge('G4'), 'Vu Duc Long'],
          ])}</section>
          <section class="notice info"><strong>Each Manager receives complete evidence for immediate decision</strong><span>30–59 day monitoring tier excluded; only Review Required and above sent.</span></section>
          <div class="action-bar"><span>3 recommendations · 2 recipients · Handoff UF-05</span>${button('Dispatch Review Batch')}</div>`;
      case 'manager-results':
        return `<section class="notice success"><strong>UF-05 Results Returned</strong><span>${esc(batch.returnedAt)} · Three decisions with justifications and auditor IDs.</span></section>
          <section class="card"><div class="section-head"><div><h2>Batch Results: ${esc(batch.id)}</h2><p>Keep and Exemption close at Manager level</p></div>${badge('3/3 Responded', 'success')}</div>${table(['Recommendation', 'User', 'Evidence', 'Decision'], usageRows(data, 'results'))}</section>
          <section class="route-summary"><div class="route closed"><strong>2 Decisions Closed</strong><span>Keep · Temporary Exemption</span><small>Does not enter IT queue</small></div><b>+</b><div class="route open"><strong>1 Decision Returned</strong><span>Revoke · ${esc(rec.id)}</span><small>Awaiting final IT review</small></div></section>
          <div class="action-bar"><span>Only “Revoke” decisions return to IT</span>${button('Review REC-2026-331 →')}</div>`;
      case 'it-review':
        return `<section class="split review-layout"><div class="card"><div class="section-head"><div><h2>Decision from Manager</h2><p>${esc(rec.id)} · Returned ${esc(batch.returnedAt)}</p></div>${badge('Revoke', 'danger')}</div>
          <div class="review-person"><div class="avatar">PQ</div><div><strong>${esc(rec.user)}</strong><span>${esc(rec.employeeId)} · ${esc(rec.app)}</span></div></div>
          <div class="quote-box"><span>Manager Justification</span><strong>“${esc(rec.decisionReason)}”</strong><small>${esc(rec.manager)}</small></div>
          <div class="evidence-mini"><div><span>Snapshot</span><strong>${esc(rec.evidence)}</strong></div><div><span>Coverage</span><strong>${esc(rec.coverageDays)} days</strong></div><div><span>Confidence</span><strong>${esc(rec.confidence)}%</strong></div></div></div>
          <div class="card decision-panel"><h2>Final IT Decision</h2><p>Agreeing creates UF-08 task. Disagreeing requires justification and returns to Manager.</p><div class="branch-choice agree"><span>A</span><div><strong>Agree with Revocation</strong><small>Creates task, seat remains reserved</small></div></div><div class="branch-choice disagree"><span>B</span><div><strong>Disagree</strong><small>Mandatory reason · No task created</small></div></div><div class="dual-actions">${button('Disagree', 'ghost')}${button('Agree with Revocation')}</div></div></section>`;
      case 'it-agree':
        return `<section class="branch-banner branch-a"><span class="branch-letter">A</span><div><strong>Branch A · IT Agrees</strong><p>Revocation decision converted to execution task.</p></div>${badge('Continuing Walkthrough', 'success')}</section>
          <section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>Created PV-2060</strong><span>${esc(rec.app)} · ${esc(rec.assignmentId)} · Created ${esc(data.branches.agree.taskCreatedAt)}</span></div>${badge('Handoff UF-08', 'info')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>ProvisioningTask</h2><p>Retains links to recommendation and snapshot</p></div></div><div class="receipt"><div><span>Task</span><strong class="mono">PV-2060</strong></div><div><span>Assignment</span><strong class="mono">${esc(rec.assignmentId)}</strong></div><div><span>Decision Source</span><strong>${esc(rec.id)}</strong></div><div><span>Channel</span><strong>Manual · Figma</strong></div></div></div><div class="card authority"><div class="lock">!</div><h2>Assignment retains seat reservation</h2><p>Only UF-08 verifies provider evidence and releases seat.</p>${button('Open PV-2060 in UF-08 →')}</div></section>`;
      case 'it-disagree-dialog':
        return `<div class="branch-banner branch-b"><span class="branch-letter">B</span><div><strong>Branch B · IT Disagrees</strong><p>Alternative branch from Frame 14; does not execute concurrently with Branch A.</p></div>${badge('No task created', 'warning')}</div><div class="backdrop branch-backdrop"><section class="modal"><div class="modal-mark danger">!</div><h2>Return to Manager for Re-evaluation</h2><p>BR-22.1 requires IT to provide explicit justification when disagreeing with Manager.</p>${field('Disagreement Justification *', data.branches.disagree.reason)}<div class="notice warning"><strong>Access permissions unchanged</strong><span>Assignment remains active; recommendation reopens in UF-05.</span></div><div class="modal-actions">${button('Cancel', 'ghost')}${button('Return to Manager')}</div></section></div>`;
      case 'returned-to-manager':
        return `<section class="branch-banner branch-b"><span class="branch-letter">B</span><div><strong>Branch B · Returned to Manager</strong><p>Terminal state for disagreement branch.</p></div>${badge('Awaiting Re-evaluation', 'warning')}</section>
          <section class="notice success hero-notice"><div class="notice-icon">↩</div><div><strong>Returned ${esc(rec.id)} to UF-05</strong><span>${esc(data.branches.disagree.returnedAt)} · Action by IT Admin.</span></div>${badge('Audit Logged', 'success')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>Justification Log</h2><p>Preserved verbatim in decision history</p></div></div><div class="quote-box"><strong>“${esc(data.branches.disagree.reason)}”</strong><small>IT Admin · ${esc(data.actor.email)}</small></div><div class="notice info"><strong>Snapshot preserved</strong><span>Coverage 120 days · Exact email match · 92% confidence.</span></div></div><div class="card guard-card"><h2>Branch B State</h2><div class="kv"><span>Recommendation</span><strong>Reopened</strong></div><div class="kv"><span>Manager pending</span><strong>1</strong></div><div class="kv"><span>ProvisioningTask</span><strong>Not created</strong></div><div class="kv"><span>Assignment</span><strong>Active</strong></div><p>No ProvisioningTask created and no savings recorded.</p></div></section>`;
      case 'savings-summary':
        return `<section class="branch-banner branch-a"><span class="branch-letter">A</span><div><strong>Branch A · Walkthrough Summary</strong><p>Three G2 seats deprovisioned; Figma task from G3 remains open.</p></div>${badge('Do Not Combine Categories', 'info')}</section>
          <section class="savings-final"><article class="saving-card immediate"><span>IMMEDIATE REALIZED SAVINGS</span><strong>${esc(data.savings.immediate.value)}</strong><p>Slack ${esc(data.savings.immediate.components[0].split(' ')[1])} + GitHub ${esc(data.savings.immediate.components[1].split(' ')[1])}</p><footer>${badge('3 G2 seats released', 'success')}</footer></article><div class="not-plus">≠ Σ</div><article class="saving-card renewal"><span>APPROVED AT NEXT RENEWAL</span><strong>${esc(data.savings.renewal.value)}</strong><p>Microsoft 365 · 8 seats reduced · Effective ${esc(g1.renewalDate)}</p><footer>${badge(g1.approvalId, 'info')}</footer></article></section>
          <section class="card"><div class="section-head"><div><h2>Unrecorded Opportunities</h2><p>Do not convert unassigned seats or open tasks into realized cash</p></div>${badge('Transparent Accounting', 'warning')}</div><div class="opportunity-grid"><div><span>Notion Enterprise</span><strong>${esc(data.savings.notionOpportunity.value)}</strong><small>Unrecorded · Awaits future G1 decision</small></div><div><span>Figma Professional</span><strong>${esc(data.savings.figmaOpportunity.value)}</strong><small>Unrecorded · Awaits verified task evidence</small></div></div></section>
          <div class="action-bar"><span>Seats released: 3 · New G1: 1 · Open tasks: 1</span>${button('View Optimization Report')}</div>`;
      default:
        return `<section class="card"><h2>Unknown State</h2></section>`;
    }
  }

  function tracker(data, screen) {
    return `<section class="stepper stage-map" aria-label="6-Stage Walkthrough Map">${data.stages.map((stage) => {
      const cls = stage.id < screen.stage ? 'done' : stage.id === screen.stage ? 'active' : '';
      return `<div class="step ${cls}"><span>${stage.id < screen.stage ? '✓' : stage.id}</span><div><strong>${esc(stage.label)}</strong><small>${esc(stage.hint)}</small></div></div>`;
    }).join('')}</section>`;
  }

  function sidebar(active) {
    const items = [
      ['⌂', 'Dashboard', 'overview'], ['♙', 'Users & Teams', 'people'], ['◇', 'Applications', 'apps'],
      ['◎', 'Recommendations', 'recommendations'], ['↯', 'Access Control', 'access'], ['▥', 'Cost & Licensing', 'cost'],
      ['▤', 'Reports', 'reports'], ['◷', 'Audit Logs', 'audit'], ['⚙', 'Settings', 'settings'],
    ];
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">S</span><strong>SaaS-Sentry</strong></div><nav>${items.map(([glyph, label, key]) => `<div class="nav-item ${active === key ? 'active' : ''}"><span class="icon">${glyph}</span><span>${label}</span>${key === 'recommendations' ? '<em>38</em>' : ''}</div>`).join('')}</nav><div class="sidebar-foot"><div class="mini-avatar">IT</div><div><strong>IT Admin</strong><span>System Administrator</span></div><b>···</b></div></aside>`;
  }

  function contextPanel(data, screen, ledger) {
    const auditIndex = {
      '01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 3,
      '07': 0, '08': 0, '09': 0, '10': 0, '11': 0, '12': 1,
      '13': 4, '14': 4, '15': 5, '16': 4, '17': 6, '18': 5,
    };
    const audit = data.audit[auditIndex[screen.id]];
    return `<aside class="context-panel"><div class="context-label">OPTIMIZATION RUN</div><div class="case-head"><span class="case-icon">◎</span><div><strong>${esc(data.run.id)}</strong><span>${esc(data.run.generatedAt)}</span></div></div>
      <div class="context-status">${groupBadge(screen.branch)}<span>Stage ${screen.stage} / 6</span></div>
      <div class="context-kv"><span>G1/G2 Schedule</span><strong>${esc(data.run.g12Schedule)}</strong></div><div class="context-kv"><span>G3/G4 Schedule</span><strong>${esc(data.run.g34Schedule)}</strong></div>
      <div class="ledger"><h3>Control Ledger</h3><div><span>G1 Open</span><b>${ledger.g1Open}</b></div><div><span>G2 Open</span><b>${ledger.g2Open}</b></div><div><span>Awaiting Manager</span><b>${ledger.managerPending}</b></div><div><span>Awaiting IT Review</span><b>${ledger.itReview}</b></div><div><span>Open UF-08 Tasks</span><b>${ledger.tasksOpen}</b></div><div><span>Seats Released</span><b>${ledger.seatsReleased}</b></div><div><span>Approved at Renewal</span><b>${ledger.renewalReductionApproved}</b></div></div>
      <div class="context-savings"><div><span>Immediate</span><strong>${ledger.immediateSaving ? '740,000 VND/mo' : '0 VND/mo'}</strong></div><div><span>At Renewal</span><strong>${ledger.renewalSaving ? '48,000,000 VND/yr' : '0 VND/yr'}</strong></div><small>Categories must not be combined</small></div>
      <div class="context-audit"><span>Latest Audit</span><strong>${esc(audit.label)}</strong></div></aside>`;
  }

  function renderApp(data, screenId) {
    const id = String(screenId).padStart(2, '0');
    const screen = data.screens.find((item) => item.id === id);
    if (!screen) throw new Error(`Unknown UF10 screen: ${screenId}`);
    const ledger = data.ledgers[screen.ledgerKey];
    const attrs = [
      ['screen', screen.id], ['stage', screen.stage], ['total-stages', screen.totalStages],
      ['g1-open', ledger.g1Open], ['g2-open', ledger.g2Open], ['manager-pending', ledger.managerPending],
      ['it-review', ledger.itReview], ['tasks-open', ledger.tasksOpen], ['seats-released', ledger.seatsReleased],
      ['renewal-reduction-approved', ledger.renewalReductionApproved], ['immediate-saving', ledger.immediateSaving], ['renewal-saving', ledger.renewalSaving],
    ].map(([key, value]) => `data-${key}="${esc(value)}"`).join(' ');

    return `<div class="app" ${attrs}>${sidebar(screen.activeNav)}<div class="workspace"><header class="topbar"><div class="global-search">⌕ <span>Search in SaaS-Sentry…</span><kbd>⌘ K</kbd></div><div class="top-actions"><span>?</span><span>♢</span><div class="top-user">IT Admin⌄</div><div class="mini-avatar">IT</div></div></header><div class="content-grid"><main class="main"><div class="breadcrumbs">Recommendations <b>›</b> Optimization Dashboard <b>›</b> ${esc(data.run.id)}</div>${tracker(data, screen)}<header class="page-head"><div><div class="eyebrow">Stage ${screen.stage} / 6 · ${esc(data.stages[screen.stage - 1].label)} · ${esc(screen.branch)}</div><h1>${esc(screen.title)}</h1><p>${esc(screen.subtitle)}</p></div><div class="frame-number">${esc(screen.id)}</div></header><div class="screen-body">${screenContent(data, screen)}</div></main>${contextPanel(data, screen, ledger)}</div></div></div>`;
  }

  const api = { renderApp };
  globalScope.UF10Renderer = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
