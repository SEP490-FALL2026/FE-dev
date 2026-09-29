;(function initUF09Renderer(globalScope) {
  'use strict'

  const esc = (value) =>
    String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')

  const icon = (name) => `<span class="icon" aria-hidden="true">${name}</span>`
  const badge = (text, tone = 'neutral') => `<span class="badge ${tone}">${esc(text)}</span>`
  const button = (text, kind = 'primary', extra = '') => `<button class="btn ${kind}" ${extra}>${esc(text)}</button>`
  const field = (label, value, extra = '') =>
    `<label class="field"><span>${esc(label)}</span><input value="${esc(value)}" ${extra}></label>`

  function personCard(data) {
    const e = data.employee
    return `<div class="person-row featured">
      <div class="avatar">${esc(e.avatar)}</div>
      <div class="person-copy"><strong>${esc(e.name)}</strong><span>${esc(e.email)}</span><small>${esc(e.title)}</small></div>
      <div class="person-meta"><span>${esc(e.id)}</span><small>${esc(e.costCenter)}</small></div>
      ${badge(e.handoverStatus, 'warning')}
    </div>`
  }

  function stat(label, value, note, tone = '') {
    return `<div class="stat ${tone}"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`
  }

  function table(headers, rows, classes = '') {
    return `<div class="table-wrap ${classes}"><table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
  }

  function assignmentRows(data, mode) {
    return data.assignments.map((a, index) => {
      let status = badge('G2 · 100%', 'info')
      if (mode === 'selected') status = `<span class="check checked">✓</span>`
      if (mode === 'tasks')
        status = badge(index === 4 ? 'Requires Action' : 'Created', index === 4 ? 'warning' : 'success')
      if (mode === 'evidence')
        status = badge(index === 4 ? 'Awaiting Evidence' : 'Seat Released', index === 4 ? 'warning' : 'success')
      if (mode === 'complete') status = badge('Seat Released', 'success')
      return [
        `<div class="app-cell"><span class="app-logo ${esc(a.tone)}">${esc(a.short)}</span><div><strong>${esc(a.app)}</strong><small>${esc(a.subscriptionId)}</small></div></div>`,
        `<span class="mono">${esc(a.assignmentId)}</span>`,
        mode === 'tasks' || mode === 'evidence' || mode === 'complete'
          ? `<span class="mono">${esc(a.taskId)}</span>`
          : esc(a.channel),
        status
      ]
    })
  }

  function screenContent(data, screen) {
    const e = data.employee
    const o = data.offboarding
    const a = data.assignments
    switch (screen.state) {
      case 'employee-list':
        return `<section class="card filters"><div class="search-box">⌕ <span>Search by name, email, or employee ID</span></div>${button('Filters', 'ghost')}</section>
          <section class="metrics">${stat('Offboarding in 30 Days', '08', '2 profiles need review', 'blue')}${stat('Active Seats', '37', '5 assigned to Tran Minh')}${stat('Succession Blockers', '02', 'Manager and Business Owner', 'amber')}</section>
          <section class="card"><div class="section-head"><div><h2>Employee Roster</h2><p>Synced from HRIS · Updated 17/09/2026 08:45</p></div>${badge('8 profiles', 'neutral')}</div>
          ${personCard(data)}
          <div class="person-row muted-row"><div class="avatar muted">PL</div><div class="person-copy"><strong>Pham Linh</strong><span>pham.linh@company.com</span><small>Product Designer</small></div><div class="person-meta"><span>EMP-0298</span><small>Product · CC-PROD-02</small></div>${badge('22/09/2026', 'neutral')}</div>
          <div class="person-row muted-row"><div class="avatar muted">QN</div><div class="person-copy"><strong>Quang Nguyen</strong><span>quang.nguyen@company.com</span><small>Sales Executive</small></div><div class="person-meta"><span>EMP-0331</span><small>Sales · CC-SALE-01</small></div>${badge('28/09/2026', 'neutral')}</div></section>
          <div class="action-bar"><span>Selected <strong>${esc(e.name)}</strong> · ${esc(e.id)}</span>${button('View Impact →')}</div>`
      case 'employee-impact':
        return `${personCard(data)}<section class="metrics">${stat('Seats in Use', '05', '5 paid SaaS apps', 'blue')}${stat('Succession Required', '02', '3 direct reports · 1 owner', 'amber')}${stat('Registered Devices', '01', data.device.label)}${stat('Usage Detail Records', '12,480', 'Purge on Day +30')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>Impact Scope</h2><p>Review before creating offboarding case</p></div></div>
          ${table(
            ['Application', 'Assignment', 'Channel', 'Savings'],
            a.map((x) => [
              `<strong>${esc(x.app)}</strong>`,
              `<span class="mono">${esc(x.assignmentId)}</span>`,
              esc(x.channel),
              esc(x.saving)
            ])
          )}</div>
          <div class="card guard-card"><h2>Mandatory Conditions</h2><div class="guard ok">✓ Valid employee profile</div><div class="guard warn">! Last working date missing</div><div class="guard warn">! 2 succession dependencies pending</div><p>Devices not terminated immediately. Expiration scheduled at end of last working day.</p></div></section>
          <div class="action-bar"><span>No data modified yet</span>${button('Start Offboarding')}</div>`
      case 'start-dialog':
        return `<div class="backdrop"><section class="modal"><div class="modal-mark">↗</div><h2>Set Last Working Date</h2><p>Create offboarding case for <strong>${esc(e.name)}</strong> · ${esc(e.id)}. Governs succession, revocation, and retention.</p>
          <div class="notice info"><strong>5 seats remain active</strong><span>Do not revoke access before handover sign-off.</span></div>
          ${field('Last Working Date *', o.lastWorkingDate)}
          <div class="field"><span>Reason</span><div class="select-like">Employee Offboarding <b>⌄</b></div></div>
          <div class="schedule-grid"><div><span>Handover Deadline</span><strong>${esc(o.handoverDueAt)}</strong></div><div><span>Device Expiration</span><strong>${esc(data.device.effectiveTo)}</strong></div><div><span>Purge Usage Details</span><strong>${esc(o.deletionDueDate)}</strong></div></div>
          <div class="modal-actions">${button('Cancel', 'ghost')}${button('Create Case')}</div></section></div>`
      case 'plan-created':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>Created ${esc(o.id)}</strong><span>System locked scope of 5 seats and scheduled timeline based on last working date.</span></div>${badge('Handover in Progress', 'warning')}</section>
          <section class="metrics">${stat('Seats in Scope', '05', 'None released yet', 'blue')}${stat('Succession Blockers', '02', 'Mandatory completion', 'amber')}${stat('Handover Due', '16/09', '17:00 ICT')}${stat('Last Working Day', '17/09', 'Device expires 18:00')}</section>
          <section class="timeline-card card"><div class="section-head"><div><h2>Control Plan</h2><p>Each milestone has independent gating conditions</p></div>${badge(o.id, 'info')}</div><div class="milestones"><div class="milestone active"><b>1</b><span>Create Case</span><small>10/09 · 09:12</small></div><div class="milestone"><b>2</b><span>Assign Successors</span><small>2 blockers</small></div><div class="milestone"><b>3</b><span>Manager Sign-off</span><small>Due 16/09</small></div><div class="milestone"><b>4</b><span>Revoke & Evidence</span><small>17/09</small></div><div class="milestone"><b>5</b><span>Purge Details</span><small>17/10</small></div></div></section>
          <div class="action-bar"><span>Audit: ${esc(o.createdBy)}</span>${button('Assign Successors →')}</div>`
      case 'successor-assignment':
        return `<section class="metrics">${stat('Initial Blockers', '02', 'Mandatory roles')}${stat('Assigned', '02', 'Effective 18/09', 'green')}${stat('Remaining', '00', 'Ready to advance', 'green')}</section>
          <section class="card"><div class="section-head"><div><h2>Succession Dependencies</h2><p>Previous roles end 17/09; successors take effect 18/09</p></div>${badge('No Overlap', 'success')}</div>
          ${table(
            ['Role Type', 'Scope', 'Current Assignee', 'Successor', 'Effective Date'],
            data.successions.map((s) => [
              esc(s.type),
              `<strong>${esc(s.scope)}</strong>`,
              esc(s.previous),
              `<div class="select-like compact">${esc(s.successor)} <b>⌄</b></div>`,
              esc(s.effectiveFrom)
            ])
          )}</section>
          <section class="card inline-note"><span class="notice-icon">i</span><div><strong>Three direct reports transferred in a single decision</strong><p>${data.directReports.map((x) => esc(x.name)).join(' · ')}</p></div></section>
          <div class="action-bar"><span>2/2 dependencies resolved</span>${button('Save & Proceed to Handover')}</div>`
      case 'handover-waiting':
        return `<section class="notice warning hero-notice"><div class="notice-icon">!</div><div><strong>Awaiting Manager sign-off before ${esc(o.handoverDueAt)}</strong><span>IT tracks and reminds; cannot sign off on behalf of manager.</span></div>${badge('1 blocker', 'warning')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>Handover Checklist</h2><p>Sign-off Authority: Le Thu Ha · EMP-0311</p></div>${badge('Pending', 'warning')}</div>
          <div class="checkline done"><b>✓</b><div><strong>Campaign operations documentation</strong><span>Shared 15/09 · 14:22</span></div></div><div class="checkline done"><b>✓</b><div><strong>Dashboard ownership</strong><span>Transferred 16/09 · 10:04</span></div></div><div class="checkline pending"><b>3</b><div><strong>Confirm handover completion</strong><span>Awaiting Manager action</span></div></div></div>
          <div class="card authority"><div class="lock">⌁</div><h2>Manager Sign-off Authority Only</h2><p>This authority belongs to Le Thu Ha. IT Admin has no sign-off button, preserving segregation of duties.</p><div class="disabled-action">Sign off Handover · Unauthorized</div>${button('Remind Manager', 'primary')}</div></section>
          <div class="action-bar"><span>Last reminder sent: 16/09/2026 · 15:05</span>${button('Remind Manager', 'primary')}</div>`
      case 'handover-confirmed':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>Handover Signed Off</strong><span>${esc(o.handoverConfirmedBy)} · ${esc(o.handoverConfirmedAt)}</span></div>${badge('0 blockers', 'success')}</section>
          <section class="metrics">${stat('Succession', '2/2', 'Complete', 'green')}${stat('Handover', '3/3', 'Manager Signed', 'green')}${stat('Active Seats', '05', 'Waiting for last day', 'blue')}${stat('Device', 'Active', 'Expires 17/09 · 18:00')}</section>
          <section class="card"><div class="section-head"><div><h2>Locked Execution Schedule</h2><p>Devices not terminated immediately after handover</p></div>${badge('Controlled', 'info')}</div>
          <div class="execution-row"><div class="date-box"><strong>17</strong><span>SEP</span></div><div><strong>09:00 · Generate five G2 recommendations</strong><p>Internal signal EMPLOYEE_OFFBOARDED · 100% confidence</p></div>${badge('Scheduled', 'info')}</div>
          <div class="execution-row"><div class="date-box"><strong>17</strong><span>SEP</span></div><div><strong>18:00 · Device registration expiration</strong><p>${esc(data.device.id)} · ${esc(data.device.label)}</p></div>${badge('Scheduled', 'neutral')}</div></section>
          <div class="action-bar"><span>Audit Trail recorded author and timestamp</span>${button('View Audit Trail', 'ghost')}</div>`
      case 'g2-created':
        return `<section class="metrics">${stat('G2 Recommendations', '05', '5/5 apps', 'blue')}${stat('Confidence', '100%', 'Internal signal', 'green')}${stat('Manager Sign-off', 'Not Required', 'G2 rule')}${stat('Active Seats', '05', 'Pending execution', 'amber')}</section>
          <section class="notice info"><strong>Manager approval not required</strong><span>System received EMPLOYEE_OFFBOARDED for ${esc(e.id)}; G2 advances directly to execution.</span></section>
          <section class="card"><div class="section-head"><div><h2>Detected Recommendations</h2><p>Decision source ${esc(o.id)} · Generated 17/09/2026 09:18</p></div>${button('Select All', 'ghost')}</div>${table(['Application', 'Assignment', 'Channel', 'Status'], assignmentRows(data, 'g2'))}</section>
          <div class="action-bar"><span>5 open G2 · 0 pending approval</span>${button('Bulk Revoke Seats →')}</div>`
      case 'bulk-selection':
        return `<section class="selection-summary"><span class="check checked">✓</span><div><strong>Selected 5/5 recommendations</strong><p>Decision scope locked to ${esc(o.id)}</p></div><div class="saving"><span>Immediate</span><strong>${esc(data.savings.immediate)}</strong></div><div class="saving"><span>At Renewal</span><strong>${esc(data.savings.renewal)}</strong></div></section>
          <section class="card">${table(['Application', 'Assignment', 'Execution Channel', 'Selected'], assignmentRows(data, 'selected'))}</section>
          <section class="card inline-note"><span class="notice-icon">i</span><div><strong>Seats are not released at this step</strong><p>Decision only creates Provisioning tasks; seats are released when BR-14.2 evidence is verified.</p></div></section>
          <div class="action-bar"><span>5 items · 2 Connector · 3 Controlled Manual</span>${button('Revoke 5 Seats')}</div>`
      case 'bulk-confirm':
        return `<div class="backdrop"><section class="modal wide"><div class="modal-mark danger">5</div><h2>Confirm Revocation of 5 Seats</h2><p>Operation creates five individual tasks. Each Assignment remains reserved until evidence is verified.</p>
          <div class="confirm-summary"><div><span>Employee</span><strong>${esc(e.name)} · ${esc(e.id)}</strong></div><div><span>Decision Source</span><strong>${esc(o.id)}</strong></div><div><span>Applications</span><strong>5</strong></div></div>
          ${field('Type “5” to confirm *', '5')}${field('Shared Justification *', o.commonReason)}
          <label class="checkbox-line"><span class="check checked">✓</span><span>I understand seats are only released after verified provider evidence.</span></label>
          <div class="modal-actions">${button('Cancel', 'ghost')}${button('Confirm & Create 5 Tasks')}</div></section></div>`
      case 'tasks-created':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>5 Provisioning Tasks Created</strong><span>Decision locked; proceed to UF-08 for provider execution.</span></div>${badge('5 open tasks', 'info')}</section>
          <section class="notice warning"><strong>Assignment retains seat reservation</strong><span>5 Assignments have not been released. Creating tasks is not deprovisioning completion.</span></section>
          <section class="card"><div class="section-head"><div><h2>Task Roster</h2><p>All tasks carry decision_source ${esc(o.id)}</p></div>${badge('UF-08', 'info')}</div>${table(['Application', 'Assignment', 'Task ID', 'Status'], assignmentRows(data, 'tasks'))}</section>
          <div class="action-bar"><span>ProvisioningTask: 5 · SeatReleased: 0</span>${button('Open UF-08 Workflow →')}</div>`
      case 'evidence-overview':
        return `<section class="metrics">${stat('Completed Tasks', '04', 'Verified evidence', 'green')}${stat('Open Tasks', '01', 'Figma · PV-2042', 'amber')}${stat('Seats Released', '04', '1 seat remaining')}${stat('Usage Detail Records', '12,480', 'Purge date pending')}</section>
          <section class="card"><div class="section-head"><div><h2>BR-14.2 Evidence Reconciliation</h2><p>Seat released only when identity, timestamp, and provider result are verified</p></div>${badge('4/5 Complete', 'warning')}</div>${table(['Application', 'Assignment', 'Task ID', 'Evidence'], assignmentRows(data, 'evidence'))}</section>
          <section class="progress-card card"><div><strong>80%</strong><span>4 of 5 seats released</span></div><div class="progress"><i style="width:80%"></i></div><small>Remaining: Figma Professional · ${esc(a[4].assignmentId)} · ${esc(a[4].taskId)}</small></section>
          <div class="action-bar"><span>Open G2: 1 · Open task: 1</span>${button('Open PV-2042')}</div>`
      case 'evidence-insufficient':
        return `<section class="notice danger hero-notice"><div class="notice-icon">!</div><div><strong>Insufficient Evidence to Release Seat</strong><span>${esc(a[4].taskId)} · Figma Professional · ${esc(a[4].assignmentId)}</span></div>${badge('Seat Remains Reserved', 'danger')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>BR-14.2 Compliance Check</h2><p>Cross-reference with original task in UF-08</p></div>${badge('2/4 conditions', 'warning')}</div>
          <div class="evidence-line ok"><b>✓</b><div><strong>Assignment Identifier</strong><span>${esc(a[4].assignmentId)} · ${esc(a[4].subscriptionId)}</span></div></div><div class="evidence-line ok"><b>✓</b><div><strong>Decision Source</strong><span>${esc(o.id)} · ${esc(a[4].taskId)}</span></div></div><div class="evidence-line bad"><b>!</b><div><strong>Human Verification</strong><span>Missing Figma inspection record</span></div></div><div class="evidence-line bad"><b>!</b><div><strong>Provider Result</strong><span>Missing screenshot or valid reference ID</span></div></div></div>
          <div class="card guard-card"><h2>Current State</h2><div class="kv"><span>Assignment</span><strong>Active</strong></div><div class="kv"><span>Seat attached</span><strong>1</strong></div><div class="kv"><span>G2</span><strong>Open</strong></div><div class="kv"><span>ProvisioningTask</span><strong>Waiting evidence</strong></div><p>Manual override not permitted on this screen.</p>${button('Return to PV-2042 in UF-08 →')}</div></section>`
      case 'evidence-complete':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>Evidence Verified — Final Seat Released</strong><span>${esc(a[4].evidenceId)} · ${esc(a[4].evidenceAt)}</span></div>${badge('5/5 seats released', 'success')}</section>
          <section class="metrics">${stat('Active Assignments', '00', 'Decreased from 5', 'green')}${stat('Open G2', '00', '5 closed', 'green')}${stat('Open Tasks', '00', '5 completed', 'green')}${stat('Seats Released', '05', 'Fully verified', 'green')}</section>
          <section class="card"><div class="section-head"><div><h2>Complete Evidence Chain</h2><p>Maintains audit trail from decision to provider event</p></div>${badge('BR-14.2 Satisfied', 'success')}</div>${table(['Application', 'Assignment', 'Task ID', 'Result'], assignmentRows(data, 'complete'))}</section>
          <div class="action-bar"><span>Savings: ${esc(data.savings.immediate)} · ${esc(data.savings.renewal)}</span>${button('View Summary →')}</div>`
      case 'deletion-scheduled':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>All SaaS Access Revoked</strong><span>Zero active Assignments or open tasks for ${esc(e.id)}.</span></div>${badge('Offboarding Complete', 'success')}</section>
          <section class="metrics">${stat('Assigned Seats', '00', '5 released', 'green')}${stat('Usage Detail Records', '12,480', 'Not yet deleted', 'amber')}${stat('Deletion Date', '17/10/2026', 'Day +30')}${stat('Audit Trail', 'Retained', 'Excludes usage details')}</section>
          <section class="card retention"><div class="calendar-mark"><span>OCT</span><strong>17</strong></div><div><h2>Detailed Usage Data Deletion Scheduled</h2><p>${esc(o.usageDetailCount.toLocaleString('en-US'))} activity records will be permanently purged on ${esc(o.deletionDueDate)}. Reports preserve ${esc(o.anonymizedSummaryCount)} anonymized aggregate summaries.</p><div class="retention-line"><span>Today · 17/09</span><i></i><span>Day +30 · 17/10</span></div></div>${badge('Scheduled', 'info')}</section>
          <div class="action-bar"><span>Deletion pending · Protected by retention policy</span>${button('View Retention Schedule', 'ghost')}</div>`
      case 'deletion-complete':
        return `<section class="notice success hero-notice"><div class="notice-icon">✓</div><div><strong>12,480 Usage Detail Records Permanently Purged</strong><span>${esc(o.deletionCompletedAt)} · ${esc(o.deletionJobId)}</span></div>${badge('Verified', 'success')}</section>
          <section class="metrics">${stat('Usage Detail Records', '00', 'Permanently purged', 'green')}${stat('Anonymized Summary', '05', 'Non-identifiable')}${stat('Audit Trail', '07 events', 'Retained')}${stat('Seats Released', '05', 'Unchanged', 'green')}</section>
          <section class="split"><div class="card"><div class="section-head"><div><h2>Data Deletion Receipt</h2><p>Final retention job result</p></div>${badge('Completed', 'success')}</div><div class="receipt"><div><span>Job ID</span><strong class="mono">${esc(o.deletionJobId)}</strong></div><div><span>Completed At</span><strong>${esc(o.deletionCompletedAt)}</strong></div><div><span>Scope</span><strong>${esc(e.id)} · usage_detail</strong></div><div><span>Result</span><strong>12,480 → 0 records</strong></div></div><div class="notice info"><strong>Audit Trail Retained</strong><span>Only retains decision traces and deletion receipts, no activity details.</span></div></div>
          <div class="card"><div class="section-head"><div><h2>Final Audit Trail</h2><p>Immutable audit log</p></div></div><div class="audit-list">${data.audit
            .slice(-4)
            .map(
              (x) =>
                `<div><i></i><span>${esc(x.at)}</span><strong>${esc(x.label)}</strong><small>${esc(x.actor)}</small></div>`
            )
            .join('')}</div></div></section>`
      default:
        return `<section class="card"><h2>Unknown State</h2></section>`
    }
  }

  function stepper(data, screen) {
    return `<section class="stepper" aria-label="7-Step Progress">${data.steps
      .map((step) => {
        const cls = step.id < screen.step ? 'done' : step.id === screen.step ? 'active' : ''
        return `<div class="step ${cls}"><span>${step.id < screen.step ? '✓' : step.id}</span><div><strong>${esc(step.label)}</strong><small>${esc(step.hint)}</small></div></div>`
      })
      .join('')}</section>`
  }

  function sidebar(active) {
    const items = [
      ['⌂', 'Dashboard', 'overview'],
      ['♙', 'Users & Teams', 'people'],
      ['◇', 'Applications', 'apps'],
      ['◎', 'Recommendations', 'recommendations'],
      ['↯', 'Access Control', 'access'],
      ['▥', 'Cost & Licensing', 'cost'],
      ['▤', 'Reports', 'reports'],
      ['◷', 'Audit Logs', 'audit'],
      ['⚙', 'Settings', 'settings']
    ]
    return `<aside class="sidebar"><div class="brand"><span class="brand-mark">S</span><strong>SaaS-Sentry</strong></div><nav>${items.map(([glyph, label, key]) => `<div class="nav-item ${active === key ? 'active' : ''}">${icon(glyph)}<span>${label}</span>${key === 'recommendations' ? '<em>5</em>' : ''}</div>`).join('')}</nav><div class="sidebar-foot"><div class="mini-avatar">IT</div><div><strong>IT Admin</strong><span>System Administrator</span></div><b>···</b></div></aside>`
  }

  function contextPanel(data, screen, ledger) {
    const e = data.employee
    const o = data.offboarding
    const isDraft = Number(screen.id) < 4
    const auditIndexByScreen = {
      '01': 0,
      '02': 0,
      '03': 0,
      '04': 0,
      '05': 2,
      '06': 2,
      '07': 3,
      '08': 4,
      '09': 4,
      10: 4,
      11: 4,
      12: 4,
      13: 4,
      14: 5,
      15: 5,
      16: 6
    }
    const latestAudit = isDraft ? null : data.audit[auditIndexByScreen[screen.id]]
    return `<aside class="context-panel"><div class="context-label">${isDraft ? 'PREPARING CASE' : 'OFFBOARDING CASE'}</div><div class="case-head"><span class="case-icon">↗</span><div><strong>${isDraft ? 'Pending ID' : esc(o.id)}</strong><span>${esc(e.name)} · ${esc(e.id)}</span></div></div>
      <div class="context-status">${badge(isDraft ? 'Draft' : screen.step === 7 ? 'Completed' : 'In Progress', isDraft ? 'neutral' : screen.step === 7 ? 'success' : 'warning')}<span>Step ${screen.step} / 7</span></div>
      <div class="context-kv"><span>Last Working Date</span><strong>${esc(o.lastWorkingDate)}</strong></div><div class="context-kv"><span>Manager</span><strong>Le Thu Ha · EMP-0311</strong></div>
      <div class="ledger"><h3>Control Ledger</h3><div><span>Seats Assigned</span><b>${ledger.seatAttached}</b></div><div><span>Succession Blockers</span><b>${ledger.successionBlockers}</b></div><div><span>Handover Blockers</span><b>${ledger.handoverBlockers}</b></div><div><span>Open G2</span><b>${ledger.g2Open}</b></div><div><span>Open Tasks</span><b>${ledger.tasksOpen}</b></div><div><span>Seats Released</span><b>${ledger.seatReleased}</b></div><div><span>Usage Details</span><b>${ledger.usageDetail.toLocaleString('en-US')}</b></div></div>
      <div class="context-rule"><strong>Active Policy</strong><span>BR-14.2 · Evidence required before releasing seat</span><span>Retention · Permanent purge on Day +30</span></div>
      <div class="context-audit"><span>Latest Audit</span><strong>${latestAudit ? esc(latestAudit.label) : 'No Audit Trail Recorded'}</strong></div></aside>`
  }

  function renderApp(data, screenId) {
    const screen = data.screens.find((item) => item.id === String(screenId).padStart(2, '0'))
    if (!screen) throw new Error(`Unknown UF09 screen: ${screenId}`)
    const ledger = data.ledgers[screen.ledgerKey]
    const attrs = [
      ['screen', screen.id],
      ['step', screen.step],
      ['total-steps', screen.totalSteps],
      ['seat-attached', ledger.seatAttached],
      ['succession-blockers', ledger.successionBlockers],
      ['handover-blockers', ledger.handoverBlockers],
      ['g2-open', ledger.g2Open],
      ['tasks-open', ledger.tasksOpen],
      ['seat-released', ledger.seatReleased],
      ['usage-detail', ledger.usageDetail]
    ]
      .map(([key, value]) => `data-${key}="${esc(value)}"`)
      .join(' ')

    return `<div class="app" ${attrs}>${sidebar(screen.activeNav)}<div class="workspace"><header class="topbar"><div class="global-search">⌕ <span>Search in SaaS-Sentry…</span><kbd>⌘ K</kbd></div><div class="top-actions"><span>?</span><span>♢</span><div class="top-user">IT Admin⌄</div><div class="mini-avatar">IT</div></div></header>
      <div class="content-grid"><main class="main"><div class="breadcrumbs">Users & Teams <b>›</b> Offboarding${Number(screen.id) < 4 ? '' : ` <b>›</b> ${esc(data.offboarding.id)}`}</div>${stepper(data, screen)}<header class="page-head"><div><div class="eyebrow">Step ${screen.step} / 7 · ${esc(data.steps[screen.step - 1].label)}</div><h1>${esc(screen.title)}</h1><p>${esc(screen.subtitle)}</p></div><div class="frame-number">${esc(screen.id)}</div></header><div class="screen-body">${screenContent(data, screen)}</div></main>${contextPanel(data, screen, ledger)}</div></div></div>`
  }

  const api = { renderApp }
  globalScope.UF09Renderer = api
  if (typeof module !== 'undefined' && module.exports) module.exports = api
})(typeof globalThis !== 'undefined' ? globalThis : this)
