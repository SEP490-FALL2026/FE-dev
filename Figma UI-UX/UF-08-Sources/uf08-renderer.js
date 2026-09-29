;(function initUF08Renderer(root, factory) {
  const api = factory()
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  if (root) root.UF08_RENDERER = api
})(typeof window !== 'undefined' ? window : globalThis, function buildUF08Renderer() {
  const icons = {
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    apps: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M8 9h8M8 13h5"/></svg>',
    users:
      '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-4 2.5-6 5.5-6s5 2 5.5 6M16 7.5a2.5 2.5 0 0 1 0 5M17 14c2.3.4 3.5 2 4 5"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="m12 3 9 17H3L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M8 8l4-4 4 4M5 14v5h14v-5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.7-1.7.9-2-2.2-2.2-2 .9-1.7-.7-.8-2h-3l-.7 2-1.7.7-2-.9L1 6.1l.9 2-.7 1.7-2 .7v3l2 .7.7 1.7-.9 2L3.1 20l2-.9 1.7.7.7 2h3l.8-2 1.7-.7 2 .9 2.2-2.1-.9-2 .7-1.7 2-.7Z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg>',
    usercheck:
      '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c.6-4.5 2.7-7 6-7 2 0 3.6.8 4.7 2.3M15 18l2 2 4-5"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
  }

  function icon(name) {
    return `<span class="icon" aria-hidden="true">${icons[name] || icons.apps}</span>`
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  function getScreen(data, id) {
    const normalized = String(id).padStart(2, '0')
    const screen = data.screens.find((item) => item.id === normalized)
    if (!screen) throw new Error(`Unknown UF-08 screen: ${id}`)
    return screen
  }

  function badge(label, tone = 'neutral') {
    return `<span class="badge badge-${tone}"><span class="badge-dot"></span>${esc(label)}</span>`
  }

  function button(label, style = 'primary', disabled = false, iconName = null) {
    return `<button class="button button-${style}"${disabled ? ' disabled aria-disabled="true"' : ''}>${iconName ? icon(iconName) : ''}<span>${esc(label)}</span></button>`
  }

  function sidebar() {
    const nav = [
      ['grid', 'Dashboard'],
      ['apps', 'Applications'],
      ['users', 'Users & Teams'],
      ['shield', 'Access Control'],
      ['chart', 'Reports'],
      ['warning', 'Recommendations'],
      ['upload', 'Data Import'],
      ['link', 'Integrations'],
      ['settings', 'Settings']
    ]
    return `<aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon('shield')}</span><div><strong>SaaS-Sentry</strong><small>See SaaS. Control Access.</small></div></div>
      <nav>${nav.map(([name, label]) => `<div class="nav-item${label === 'Access Control' ? ' active' : ''}">${icon(name)}<span>${label}</span>${label === 'Recommendations' ? '<em>12</em>' : ''}</div>`).join('')}</nav>
      <div class="sidebar-foot"><span class="mini-mark">${icon('shield')}</span><div><strong>SaaS-Sentry</strong><small>Enterprise Edition</small></div></div>
    </aside>`
  }

  function topbar(data) {
    return `<header class="topbar">
      <div class="global-search">${icon('search')}<span>Search tasks, users, apps...</span><kbd>⌘ K</kbd></div>
      <div class="top-actions"><span class="notice">${icon('bell')}<i></i></span><span class="help">?</span><span class="avatar">${esc(data.actor.initials)}</span><div class="account"><strong>${esc(data.actor.name)}</strong><small>${esc(data.actor.email)}</small></div><span class="chevron">⌄</span></div>
    </header>`
  }

  const metricConfig = [
    ['manual', 'Manual Action', 'usercheck', 'manual'],
    ['automatic', 'Auto Processing', 'play', 'info'],
    ['pending', 'Pending Acceptance', 'clock', 'warning'],
    ['failed', 'Failed', 'warning', 'danger']
  ]

  function metrics(ledger) {
    return `<section class="metrics">${metricConfig
      .map(
        ([key, label, iconName, tone]) => `
      <article class="metric metric-${tone}"><span class="metric-icon">${icon(iconName)}</span><div><small>${label}</small><strong>${ledger[key]}</strong></div></article>`
      )
      .join('')}
      <article class="metric metric-complete"><span class="metric-icon">${icon('check')}</span><div><small>Completed Today</small><strong>${ledger.completedToday}</strong></div></article>
    </section>`
  }

  function queueState(screen, taskId) {
    const n = Number(screen.id)
    if (taskId === 'PV-2041') return n >= 4 ? ['Pending Acceptance', 'pending'] : ['Automated', 'info']
    if (taskId === 'PV-2042') {
      if (n >= 9) return ['Completed', 'success']
      if (n >= 7) return ['In Progress', 'info']
      return ['Manual Action', 'manual']
    }
    if (taskId === 'PV-2037') {
      if (n === 11) return ['Retrying', 'info']
      if (n >= 13) return ['Manual Action', 'manual']
      return ['Transient Error', 'danger']
    }
    if (taskId === 'PV-2038') return ['Auth Error', 'danger']
    if (taskId === 'PV-2039') return n >= 16 ? ['Resumed Auto', 'info'] : ['Capacity Limit', 'warning']
    return ['Pending', 'neutral']
  }

  function queuePanel(screen, data) {
    const rows = data.queueRows
      .map((row) => {
        const task = data.tasks[row.id]
        const [label, tone] = queueState(screen, row.id)
        return `<article class="queue-row${screen.taskId === row.id ? ' selected' : ''}">
        <div class="queue-row-top"><strong>${esc(task.id)}</strong>${badge(label, tone)}</div>
        <p>${esc(task.app)} · ${esc(task.operation)}</p>
        <small>${esc(task.user)} · ${esc(task.channel)}</small>
      </article>`
      })
      .join('')

    return `<aside class="queue-panel panel">
      <div class="queue-head"><div><span class="eyebrow">Queue</span><h2>17 Open Tasks</h2></div><button class="icon-button">${icon('search')}</button></div>
      <div class="queue-search">${icon('search')}<span>Search task ID, app...</span></div>
      <div class="queue-tabs"><span class="active">All</span><span>Provision</span><span>Deprovision</span></div>
      <div class="queue-list">${rows}</div>
      <div class="queue-footer"><span>Showing 5 tasks</span><strong>1 / 4</strong></div>
    </aside>`
  }

  function keyValue(label, value, options = {}) {
    return `<div class="kv${options.full ? ' full' : ''}"><span>${esc(label)}</span><strong${options.mono ? ' class="mono"' : ''}>${esc(value)}</strong></div>`
  }

  function contextPanel(screen, data) {
    const task = data.tasks[screen.taskId]
    const subscription = data.subscriptions[task.subscriptionId]
    const audit = [
      `<li><span class="audit-dot"></span><div><strong>ProvisioningTask Created</strong><p>${esc(task.createdAt)}</p></div></li>`
    ]
    if (Number(screen.id) >= 3 && task.id === 'PV-2041')
      audit.push(
        '<li><span class="audit-dot info"></span><div><strong>Worker Claimed Task</strong><p>17/09/2026 · 10:03 ICT</p></div></li>'
      )
    if (Number(screen.id) >= 4 && task.id === 'PV-2041')
      audit.push(
        '<li><span class="audit-dot warning"></span><div><strong>Invitation Pending</strong><p>17/09/2026 · 10:04 ICT</p></div></li>'
      )
    if (Number(screen.id) >= 7 && task.id === 'PV-2042')
      audit.push(
        '<li><span class="audit-dot info"></span><div><strong>IT Admin Claimed Task</strong><p>17/09/2026 · 10:21 ICT</p></div></li>'
      )
    if (screen.id === '09')
      audit.push(
        '<li><span class="audit-dot success"></span><div><strong>Deprovisioned with Evidence</strong><p>17/09/2026 · 10:29 ICT</p></div></li>'
      )

    return `<aside class="context-stack">
      <section class="context-card panel">
        <div class="context-title">${icon('apps')}<div><span class="eyebrow">Task Context</span><h3>${esc(task.app)}</h3></div></div>
        <div class="context-grid">
          ${keyValue('Task', task.id, { mono: true })}
          ${keyValue('Operation', task.operation)}
          ${keyValue('Beneficiary', `${task.user} · ${task.employeeId}`, { full: true })}
          ${keyValue('Decision Source', task.decisionSource, { mono: true, full: true })}
          ${keyValue('Assignment', task.assignmentId, { mono: true })}
          ${keyValue('Channel', task.channel)}
          ${keyValue('Subscription', task.subscriptionId, { mono: true, full: true })}
          ${keyValue('Capacity', `${subscription.occupied} / ${subscription.purchased}`)}
          ${keyValue('SLA', task.sla)}
        </div>
      </section>
      <section class="reservation-card"><span class="reservation-icon">${icon('lock')}</span><div><strong>Assignment retains seat reservation</strong><p>Does not release seat while running, pending acceptance, or failed.</p><b>BR-10.4 · INV-01</b></div></section>
      <section class="audit-card panel"><div class="card-heading"><div><span class="eyebrow">Recent Audit Log</span><h3>Audit Timeline</h3></div>${icon('clock')}</div><ul>${audit.join('')}</ul><div class="correlation"><span>Correlation ID</span><code>${esc(task.correlationId)}</code></div></section>
    </aside>`
  }

  function taskHeader(task, statusLabel, tone, description) {
    return `<section class="task-head panel"><div><span class="eyebrow">Active Task</span><div class="task-title"><h2>${esc(task.id)}</h2>${badge(statusLabel, tone)}</div><p>${esc(task.operation)} ${esc(task.app)} for ${esc(task.user)} · ${esc(task.employeeId)}</p></div><div class="task-head-side"><span>${esc(description)}</span><button class="icon-button">•••</button></div></section>`
  }

  function evidenceStrip(task) {
    return `<section class="evidence-strip panel"><div>${icon('shield')}<span><small>Decision Source</small><strong>${esc(task.decisionSource)}</strong></span></div><div>${icon('lock')}<span><small>Reserved Assignment</small><strong>${esc(task.assignmentId)}</strong></span></div><div>${icon('link')}<span><small>Execution Channel</small><strong>${esc(task.channel)}</strong></span></div></section>`
  }

  function overviewContent(screen, data) {
    return `<div class="detail-stack">
      <section class="overview-hero panel"><div class="hero-visual">${icon('play')}<span></span><i></i></div><div><span class="eyebrow">ONE QUEUE · TWO EXECUTION CHANNELS</span><h2>Granting access is not proof that the account exists</h2><p>Select a task to review connector details, manual checklist, evidence, retry backoff, and error remediation.</p>${button('Open Task PV-2041', 'primary', false, 'arrow')}</div></section>
      <section class="distribution panel"><div class="card-heading"><div><span class="eyebrow">Open Task Distribution</span><h3>By channel and verified state</h3></div><span class="updated">Updated 10:03 ICT</span></div>
        <div class="bars"><div><span>Manual Action</span><i><b style="width:47%"></b></i><strong>8</strong></div><div><span>Automated</span><i><b style="width:24%"></b></i><strong>4</strong></div><div><span>Pending Acceptance</span><i><b style="width:12%"></b></i><strong>2</strong></div><div><span>Failed</span><i><b style="width:18%"></b></i><strong>3</strong></div></div>
      </section>
    </div>`
  }

  function autoReadyContent(task) {
    return `<div class="detail-stack">${taskHeader(task, 'Ready', 'info', 'GitHub Connector')}${evidenceStrip(task)}
      <section class="execution-card panel"><div class="section-title"><div><span class="eyebrow">Pre-flight Verification</span><h2>Connector Ready to Execute</h2></div>${badge('0 attempts', 'neutral')}</div>
        <div class="check-grid"><div>${icon('check')}<span><strong>Request fully approved</strong><small>${esc(task.decisionSource)}</small></span></div><div>${icon('check')}<span><strong>Seat reserved in advance</strong><small>${esc(task.assignmentId)}</small></span></div><div>${icon('check')}<span><strong>Valid permissions</strong><small>Members: write</small></span></div><div>${icon('check')}<span><strong>Idempotency lock verified</strong><small>${esc(task.idempotencyKey)}</small></span></div></div>
        <div class="technical-box"><span>Endpoint</span><code>${esc(task.endpoint)}</code></div>
        <div class="action-row">${button('View Request', 'secondary')}${button('Execute Now', 'primary', false, 'play')}</div>
      </section>
    </div>`
  }

  function connectorRunningContent(task, screen) {
    return `<div class="detail-stack">${taskHeader(task, 'Executing', 'info', `Attempt ${screen.attempt}/${screen.maxAttempts}`)}${evidenceStrip(task)}
      <section class="execution-card panel"><div class="progress-heading"><span class="spinner"></span><div><span class="eyebrow">WORKER EXECUTING</span><h2>Calling GitHub Organization API</h2><p>Do not close this page or trigger duplicate tasks.</p></div><strong>46%</strong></div><div class="progress-track"><i style="width:46%"></i></div>
        <div class="technical-grid">${keyValue('Attempt', `${screen.attempt} / ${screen.maxAttempts}`)}${keyValue('Started', '10:03:14 ICT')}${keyValue('Idempotency key', task.idempotencyKey, { full: true, mono: true })}${keyValue('Endpoint', task.endpoint, { full: true, mono: true })}</div>
        <div class="action-row">${button('Executing...', 'primary', true)}</div>
      </section>
    </div>`
  }

  function pendingContent(task, handoff = false) {
    const body = handoff
      ? `<div class="handoff-steps"><div class="done">${icon('check')}<span><strong>API Request Accepted</strong><small>10:04:02 ICT</small></span></div><div class="active">${icon('clock')}<span><strong>Membership Pending</strong><small>Seat remains reserved</small></span></div><div>${icon('link')}<span><strong>UF-14 Reconciliation</strong><small>Awaiting active member status</small></span></div></div><div class="action-row">${button('View Audit Trail', 'secondary')}${button('Open UF-14 Reconciliation', 'primary', false, 'arrow')}</div>`
      : `<div class="provider-response"><div class="response-head"><span>${icon('code')} Provider Response</span>${badge('HTTP 200', 'success')}</div><code>{ "state": "pending", "role": "member", "user": "minhanh-dev" }</code></div><div class="pending-warning">${icon('clock')}<div><strong>Membership = pending · NOT Completed</strong><p>GitHub only generated an invitation. Assignment ${esc(task.assignmentId)} remains reserved until reconciliation confirms active member.</p></div></div><div class="action-row">${button('View Technical Details', 'secondary')}${button('Handoff to UF-14', 'primary', false, 'arrow')}</div>`
    return `<div class="detail-stack">${taskHeader(task, handoff ? 'Awaiting Reconciliation' : 'Pending Acceptance', 'warning', 'Membership pending')}${evidenceStrip(task)}<section class="execution-card panel"><div class="section-title"><div><span class="eyebrow">CONTROLLED END STATE</span><h2>${handoff ? 'Membership Reconciliation Handoff' : 'Invitation Sent — Actual Access Not Active'}</h2></div>${badge('Not counted as complete', 'warning')}</div>${body}</section></div>`
  }

  function manualDetailContent(task, claimed = false) {
    return `<div class="detail-stack">${taskHeader(task, claimed ? 'In Progress' : 'Unclaimed', claimed ? 'info' : 'manual', claimed ? 'IT Admin · 10:21 ICT' : 'Manual Channel')}${evidenceStrip(task)}
      <section class="execution-card panel"><div class="section-title"><div><span class="eyebrow">MANUAL EXECUTION CHECKLIST</span><h2>Deprovision Figma Account for Target User</h2></div>${badge(claimed ? 'Claimed' : 'Awaiting Claim', claimed ? 'info' : 'manual')}</div>
        <ol class="instruction-list">${task.instructions.map((item, index) => `<li class="${claimed && index === 0 ? 'complete' : claimed && index === 1 ? 'active' : ''}"><span>${claimed && index === 0 ? icon('check') : index + 1}</span><div><strong>${esc(item)}</strong><small>${index === 0 ? 'Organization admin console' : index === 1 ? 'Verify email before removal' : 'Mandatory audit evidence'}</small></div></li>`).join('')}</ol>
        <div class="manual-owner"><span>${icon('usercheck')}</span><div><small>Assignee</small><strong>${claimed ? 'IT Admin · it-admin@company.com' : 'Unassigned'}</strong></div></div>
        <div class="action-row">${button('Open Figma Admin Console', 'secondary')}${claimed ? button('Confirm Completed', 'primary', false, 'check') : button('I Am Handling This', 'primary', false, 'usercheck')}</div>
      </section>
    </div>`
  }

  function manualConfirmContent(task, data) {
    return `<div class="detail-stack dimmed">${taskHeader(task, 'In Progress', 'info', 'IT Admin · 10:21 ICT')}${evidenceStrip(task)}<section class="execution-card panel placeholder-card"></section></div>
      <div class="scrim"><section class="dialog"><div class="dialog-icon success">${icon('check')}</div><div class="dialog-copy"><span class="eyebrow">BR-10.1 · HUMAN VERIFICATION</span><h2>Completion Evidence</h2><p>Confirm Figma account for Tran Minh has been deprovisioned at provider.</p></div>
        <div class="dialog-fields"><label><span>Evidence Type</span><strong>Provider Admin Event</strong></label><label><span>Reference ID</span><strong class="mono">FIG-EVT-772904</strong></label><label class="full"><span>Audit Note</span><strong>Verified email and confirmed member is no longer in organization.</strong></label><label class="full"><span>Auditor</span><strong>${esc(data.actor.name)} · ${esc(data.actor.email)}</strong></label></div>
        <div class="dialog-note">${icon('lock')} Seat is only released to available pool after this confirmation is logged in Audit Trail.</div>
        <div class="dialog-actions">${button('Back', 'secondary')}${button('Confirm Revocation', 'primary', false, 'check')}</div>
      </section></div>`
  }

  function manualSuccessContent(task) {
    return `<div class="detail-stack">${taskHeader(task, 'Completed', 'success', '10:29 ICT')}
      <section class="success-hero panel"><span class="success-mark">${icon('check')}</span><div><span class="eyebrow">EVIDENCE-VERIFIED COMPLETION</span><h2>Seat Returned to Available Pool</h2><p>Figma account for Tran Minh deprovisioned and Assignment ${esc(task.assignmentId)} terminated.</p></div>${badge('Completed Today: 13', 'success')}</section>
      <section class="evidence-card panel"><div class="card-heading"><div><span class="eyebrow">Preserved Evidence</span><h3>FIG-EVT-772904</h3></div>${icon('shield')}</div><div class="technical-grid">${keyValue('Auditor', 'IT Admin')}${keyValue('Timestamp', '17/09/2026 · 10:29 ICT')}${keyValue('Result', 'Member deprovisioned')}${keyValue('Seat', 'Returned to pool')}</div><div class="action-row">${button('View Audit Trail', 'secondary')}${button('Back to Queue', 'primary', false, 'arrow')}</div></section>
    </div>`
  }

  function failureOverviewContent(screen, data) {
    const cards = [
      ['Transient', 'PV-2037', 'Provider slow response', '3 / 6 attempts', 'warning'],
      ['Permanent', 'PV-2028', 'Invalid provider user email', 'Requires human action', 'danger'],
      ['Authentication', 'PV-2038', 'Figma connection token expired', 'No retry', 'danger'],
      ['Capacity Limit', 'PV-2039', 'Slack licenses fully allocated', 'Awaiting purchase approval', 'warning']
    ]
    return `<div class="detail-stack"><section class="failure-summary panel"><div class="section-title"><div><span class="eyebrow">CLASSIFY BEFORE ACTION</span><h2>Four Error Classes, Four Remediation Paths</h2></div>${badge('3 failed tasks', 'danger')}</div><div class="failure-grid">${cards.map(([type, id, message, action, tone]) => `<article class="failure-card failure-${tone}"><span class="failure-symbol">${icon(type === 'Transient' ? 'clock' : 'warning')}</span><div><small>${type}</small><strong>${id}</strong><p>${message}</p><b>${action}</b></div></article>`).join('')}</div></section>
      <section class="technical-disclosure panel"><div>${icon('code')}<span><strong>Technical Details</strong><small>Error codes are internal to IT; requesters receive clear user notifications.</small></span></div><span class="chevron">⌄</span></section>
      <section class="requester-note">${icon('bell')}<div><strong>Requesters are also notified</strong><p>Do not leave users waiting indefinitely when provisioning fails · BR-12.5.</p></div></section>
    </div>`
  }

  function retryingContent(task, screen, exhausted = false) {
    const attempts = exhausted ? task.attempts : task.attempts.slice(0, 3)
    return `<div class="detail-stack">${taskHeader(task, exhausted ? 'Auto Stopped' : 'Retrying', exhausted ? 'danger' : 'info', `${screen.attempt}/${screen.maxAttempts}`)}
      <section class="retry-card panel"><div class="retry-progress"><div class="retry-ring"><strong>${screen.attempt}</strong><span>/ ${screen.maxAttempts}</span></div><div><span class="eyebrow">${exhausted ? 'RETRY LIMIT REACHED' : 'TRANSIENT ERROR'}</span><h2>${exhausted ? 'No Further Automatic Retries' : 'Next Retry at 10:36 ICT'}</h2><p>${exhausted ? 'All six attempts failed. Task awaits human decision to switch to manual or close with reason.' : 'Exponential backoff active; Assignment remains reserved throughout.'}</p></div></div>
        <div class="attempt-list">${attempts.map((item) => `<div><span>${item.number}</span><strong>${esc(item.at.split(' · ')[1])}</strong><p>${esc(item.result)}</p><code>${esc(item.code)}</code></div>`).join('')}</div>
        <div class="action-row">${button('View Technical Details', 'secondary')}${exhausted ? button('Close with Reason', 'secondary') + button('Switch to Manual', 'primary', false, 'arrow') : button('Awaiting Next Retry', 'primary', true)}</div>
      </section>
    </div>`
  }

  function switchManualContent(task, data) {
    return `<div class="detail-stack dimmed">${taskHeader(task, 'Retries Exhausted', 'danger', '6/6 attempts')}</div><div class="scrim"><section class="dialog"><div class="dialog-icon warning">${icon('usercheck')}</div><div class="dialog-copy"><span class="eyebrow">CHANGE CHANNEL, PRESERVE TASK</span><h2>Switch to Manual Execution?</h2><p>Preserves ${esc(task.id)}, Assignment, and all 6 connector retry logs.</p></div>
      <div class="transition-visual"><div>${badge('Connector · Failed 6/6', 'danger')}<code>${esc(task.id)}</code></div>${icon('arrow')}<div>${badge('Manual · Awaiting Claim', 'manual')}<code>${esc(task.id)}</code></div></div>
      <div class="dialog-note">${icon('shield')} Audit Trail preserves all six responses; no new task created and SLA is not reset.</div>
      <div class="dialog-fields"><label class="full"><span>Authorized Auditor</span><strong>${esc(data.actor.name)} · ${esc(data.actor.email)}</strong></label></div>
      <div class="dialog-actions">${button('Back', 'secondary')}${button('Confirm Switch to Manual', 'primary', false, 'arrow')}</div></section></div>`
  }

  function authenticationFailureContent(task) {
    return `<div class="detail-stack">${taskHeader(task, 'Authentication Error', 'danger', 'No automated retry')}
      <section class="auth-error panel"><div class="error-hero"><span>${icon('lock')}</span><div><span class="eyebrow">HUMAN INTERVENTION REQUIRED</span><h2>Figma Connection Expired</h2><p>Retries cannot fix an expired token. Task remains queued until remediation.</p></div>${badge('No Retry · BR-12.1', 'danger')}</div>
        <div class="technical-box"><span>Technical Error Code</span><code>${esc(task.errorCode)}</code></div>
        <div class="decision-grid"><article>${icon('link')}<div><strong>Repair Connection</strong><p>Update credentials and test connection.</p></div></article><article>${icon('usercheck')}<div><strong>Switch to Manual</strong><p>Preserve task and current failure history.</p></div></article><article>${icon('warning')}<div><strong>Close with Reason</strong><p>Mandatory audit log entry required.</p></div></article></div>
        <div class="action-row">${button('Close with Reason', 'secondary')}${button('Switch to Manual', 'secondary')}${button('Repair Connection', 'primary', false, 'link')}</div>
      </section>
    </div>`
  }

  function capacityContent(task, subscription, resumed = false) {
    const snapshot = resumed ? subscription.afterPurchase : subscription.beforeApproval
    return `<div class="detail-stack">${taskHeader(task, resumed ? 'Resumed Auto' : 'Awaiting Seat Approval', resumed ? 'info' : 'warning', task.approvalId)}
      <section class="capacity-card panel"><div class="section-title"><div><span class="eyebrow">${resumed ? 'CAPACITY INCREASED' : 'PROVIDER LICENSE LIMIT REACHED'}</span><h2>${resumed ? 'Task Returned to IT Queue' : 'Cannot Provision Beyond Purchased Seats'}</h2></div>${badge(resumed ? 'Pending Provisioning' : 'Awaiting Cost Approver', resumed ? 'info' : 'warning')}</div>
        <div class="capacity-compare"><article><small>Internal</small><strong>${snapshot.internalUsed} / ${snapshot.purchased}</strong><p>${resumed ? 'Assignment reserving one seat' : 'Expected one available seat'}</p></article><span>≠</span><article><small>Provider</small><strong>${snapshot.providerUsed} / ${snapshot.purchased}</strong><p>${resumed ? 'Capacity expanded, account pending' : 'All provider seats occupied'}</p></article></div>
        ${resumed ? `<div class="parallel-flow"><article>${icon('play')}<div><small>IT TRACK</small><strong>ProvisioningTask returned to queued state</strong><p>Can execute immediately without waiting for Finance.</p></div>${badge('Ready', 'info')}</article><article>${icon('chart')}<div><small>FINANCE TRACK</small><strong>Finance recording in parallel</strong><p>Financial commitment being logged; does not block provisioning.</p></div>${badge('Logging', 'neutral')}</article></div>` : `<div class="approval-flow"><div>${badge('PV-2039 · Failed', 'danger')}<small>Limit reached</small></div>${icon('arrow')}<div>${badge(task.approvalId, 'warning')}<small>Cost Approver decides</small></div>${icon('arrow')}<div>${badge('Return to IT', 'neutral')}<small>If purchase approved</small></div></div><div class="finance-rule">${icon('shield')}<div><strong>Finance does not approve and does not block</strong><p>Approver decides against budget snapshot; Finance records post-approval.</p></div></div>`}
        <div class="technical-box"><span>Technical Error Code</span><code>${esc(task.errorCode)}</code></div>
        <div class="action-row">${resumed ? button('View Parallel Activity', 'secondary') + button('Re-execute Provisioning', 'primary', false, 'play') : button('Open Purchase Decision', 'primary', false, 'arrow')}</div>
      </section>
    </div>`
  }

  function mainContent(screen, data) {
    const task = data.tasks[screen.taskId]
    switch (screen.state) {
      case 'overview':
        return overviewContent(screen, data)
      case 'auto-ready':
        return autoReadyContent(task)
      case 'connector-running':
        return connectorRunningContent(task, screen)
      case 'pending-invite':
        return pendingContent(task, false)
      case 'reconciliation-handoff':
        return pendingContent(task, true)
      case 'manual-detail':
        return manualDetailContent(task, false)
      case 'manual-claimed':
        return manualDetailContent(task, true)
      case 'manual-confirm':
        return manualConfirmContent(task, data)
      case 'manual-success':
        return manualSuccessContent(task)
      case 'failure-overview':
        return failureOverviewContent(screen, data)
      case 'retrying':
        return retryingContent(task, screen, false)
      case 'retry-exhausted':
        return retryingContent(task, screen, true)
      case 'switch-manual':
        return switchManualContent(task, data)
      case 'authentication-failure':
        return authenticationFailureContent(task)
      case 'capacity-wait':
        return capacityContent(task, data.subscriptions[task.subscriptionId], false)
      case 'capacity-returned':
        return capacityContent(task, data.subscriptions[task.subscriptionId], true)
      default:
        throw new Error(`Unknown UF-08 state: ${screen.state}`)
    }
  }

  function renderScreen(screen, data) {
    const ledger = data.ledgers[screen.ledgerKey]
    return `<div class="app-shell" data-screen="${screen.id}" data-task="${screen.taskId}" data-manual="${ledger.manual}" data-automatic="${ledger.automatic}" data-pending="${ledger.pending}" data-failed="${ledger.failed}" data-completed="${ledger.completedToday}">
      ${sidebar()}
      <main class="workspace">${topbar(data)}<div class="page">
        <div class="breadcrumb"><span>Access Control</span><b>›</b><span>Execution Queue</span><b>›</b><strong>${esc(screen.taskId)}</strong></div>
        <header class="page-header"><div><div class="title-line"><span class="screen-number">${screen.id}</span><h1>${esc(screen.title)}</h1></div><p>${esc(screen.subtitle)}</p></div><div class="header-tools">${badge('ITA-05', 'neutral')}<span class="updated">Updated 17/09/2026 · 12:18 ICT</span></div></header>
        ${metrics(ledger)}
        <section class="safety-banner">${icon('lock')}<div><strong>Assignment retains seat reservation throughout execution</strong><span>Even if task fails or user invitation is pending acceptance.</span></div><b>BR-10.4 · INV-01</b></section>
        <div class="content-grid">${queuePanel(screen, data)}<section class="detail-area">${mainContent(screen, data)}</section>${contextPanel(screen, data)}</div>
      </div></main>
    </div>`
  }

  return { getScreen, renderScreen }
})
