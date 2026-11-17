// Copy from the documented in-app notification catalogue.
export const notificationMessages = {
  REQUEST_SUBMITTED: {
    title: 'Request sent',
    body: 'WAITING_NEED_DECISION: "Your request {{requestId}} was sent and is waiting for the need approver." · WAITING_CONTROLLED: "Your request {{requestId}} was sent but nobody can approve the need yet. An administrator has been told; nothing more is needed from you." · CONFIRMED: "Your request {{requestId}} was sent and its need was confirmed on sending."'
  },
  REQUEST_NEED_APPROVED: {
    title: 'Need approved',
    body: '"The need for your request {{requestId}} was approved. Next step: {{next}}."'
  },
  REQUEST_REJECTED: {
    title: 'Request rejected',
    body: '"Your request {{requestId}} was rejected at the {{by}} step.[ Reason: {{reason}}.][ A similar plan in the catalogue: {{suggestedPlanId}}.]"'
  },
  REQUEST_RETURNED: {
    title: 'Request returned for changes',
    body: '"Your request {{requestId}} was returned at the {{by}} step.[ Reason: {{reason}}.] Please add what is missing and send it again."'
  },
  REQUEST_IT_REJECTED: {
    title: 'Request rejected by IT',
    body: '"The IT Admin rejected your request {{requestId}}: {{kind}}.[ Reason: {{reason}}.][ Alternative plan: {{alternativePlanId}}.][ Suggestion: {{alternativeNote}}.] [No alternative was offered.]"'
  },
  REQUEST_SPEND_APPROVED: {
    title: 'Spend approved',
    body: '"The spend for your request {{requestId}} was approved. The IT Admin will now grant access."'
  },
  REQUEST_GRANTED: {
    title: 'Access granted',
    body: '"Access to {{requestId}} has been granted. {{accessGuide}}.[ Homepage: {{homepageUrl}}.]"'
  },
  REQUEST_FAILED: {
    title: 'Access could not be granted',
    body: '"Access for your request {{requestId}} could not be granted. Please contact {{contact}} for help."'
  },
  REQUEST_WITHDRAWN: {
    title: 'Request withdrawn',
    body: 'byRequester = true: "Request {{requestId}} was withdrawn by the requester." · byRequester = false: "Request {{requestId}} was withdrawn by the head of department.[ Reason: {{reason}}.]"'
  },
  REQUEST_WITHDRAWAL_PENDING: {
    title: 'Request not closed yet',
    body: '"The head of department withdrew your request {{requestId}}, but it is not closed yet: it is waiting for the IT Admin to close the grant task."'
  },
  REQUEST_CANCELLED: {
    title: 'Request closed',
    body: '"Request {{requestId}} was closed because {{reasonKind}}."'
  },
  STEP_ASSIGNED: {
    title: 'You have a task to handle',
    body: '"You have been assigned the {{stepKind}} step of request {{requestId}} ({{cause}})."'
  },
  STEP_CLOSED_BY_WITHDRAWAL: {
    title: 'A step you held was closed',
    body: '"Request {{requestId}} was withdrawn, so the {{stepKind}} step you held is closed. You do not need to act on it any more."'
  },
  WITHDRAWAL_AWAITING_IT_CLOSE: {
    title: 'A grant task needs to be closed',
    body: '"Request {{requestId}} was withdrawn but its grant had failed. Please check and close the task to finish the request."'
  },
  COMMITMENT_RELEASED_BY_WITHDRAWAL: {
    title: 'Reserved budget released',
    body: '"Request {{requestId}} was withdrawn, so the budget held for it has been released."'
  },
  GRANT_TASK_CANCELLED: {
    title: 'Grant task cancelled',
    body: '"The grant task for request {{requestId}} was cancelled; you do not need to work on it any more."'
  },
  SERVICE_ACCOUNT_BOUNDARY_ACCEPTED: {
    title: 'Service account accepted',
    body: '"The IT Admin accepted your service-account request {{requestId}}; it now moves on to the grant step."'
  },
  RETURN_REQUESTED: {
    title: 'Your access is about to be revoked',
    body: 'HEAD_CONFIRMATION: "Your head of department confirmed you no longer need {{planId}}. The IT Admin will revoke it." · EMPLOYEE_RETURN: "Your request to return {{planId}} was sent; the IT Admin will revoke it."'
  },
  RETURN_COMPLETED: {
    title: 'Access revoked',
    body: '"The IT Admin has finished revoking the access you returned. It is no longer valid."'
  },
  RETURN_FAILED: {
    title: 'Access could not be revoked',
    body: '"The IT Admin could not revoke the access you asked to return; it is still valid. Please contact the IT Admin."'
  },
  REQUEST_RENEWAL_APPLIED: {
    title: 'Access renewed',
    body: '"Your access to {{requestId}} has been renewed[ until {{newExpectedEndDate}}]."'
  },
  REQUEST_RENEWAL_NOT_APPLIED: {
    title: 'Renewal could not be applied',
    body: '"Renewal request {{requestId}} was approved but could not be applied: {{problem}}. The access keeps its old end date."'
  },
  REQUEST_FINANCE_REVIEW_OPENED: {
    title: 'Request sent to Finance for review',
    body: '"Request {{requestId}} was sent to Finance for a budget review."'
  },
  REQUEST_RETURNED_BY_FINANCE: {
    title: 'Request returned by Finance',
    body: '"Finance returned request {{requestId}} to you.[ Reason: {{reason}}.]"'
  },
  REQUEST_AWAITING_BUDGET: {
    title: 'Request is waiting for budget',
    body: '"Request {{requestId}} is waiting for the {{year}} budget of {{costCenterId}} to be made or revised."'
  },
  REQUEST_BUDGET_VERSION_ENDED: {
    title: 'The budget version a request waited for has ended',
    body: '"The {{year}} budget version of {{costCenterId}} that request {{requestId}} was waiting for has ended ({{decision}})."'
  },
  REQUEST_RESERVE_CONFIRMATION_NEEDED: {
    title: 'Reserve use needs your confirmation',
    body: '"Request {{requestId}} goes beyond the department\'s base budget and would use the reserve. Please confirm before sending it for spend approval."'
  },
  REQUEST_BUDGET_BLOCKED: {
    title: 'Request blocked by the budget check',
    body: '"Request {{requestId}} cannot go on because: {reasons:list}."'
  },
  REQUEST_RETURNED_AT_DECISION: {
    title: 'Request sent back at spend approval',
    body: '"Request {{requestId}} was sent back before the spend decision because: {reasons:list}."'
  },
  REQUEST_CANCELLED_BENEFICIARY_GONE: {
    title: 'Request closed by the system',
    body: 'DEPARTURE: "Request {{requestId}} for {{beneficiaryEmployeeId}} was closed by the system because the person has left the company. Any budget held was released." · TRANSFER: "Request {{requestId}} for {{beneficiaryEmployeeId}} was closed by the system because the person moved to another department. If it is still needed, please send a new request in the new department."'
  },
  REQUEST_BENEFICIARY_GONE_IT_CHECK: {
    title: 'A request being granted needs a check',
    body: 'DEPARTURE: "{{beneficiaryEmployeeId}} has left but request {{requestId}} is being granted, so the system did not close it. Please check with the vendor, take back any invitation and close the request." · TRANSFER: "{{beneficiaryEmployeeId}} has moved departments but request {{requestId}} is being granted, so the system did not close it. Please check with the vendor, take back any invitation and close the request."'
  },
  IT_ADMIN_SELF_EXECUTED: {
    title: 'IT Admin handled their own access',
    body: 'IT Admin {{employeeId}} handled a grant or revocation task for their own access because no other IT Admin was available. Please review it.'
  },
  REQUEST_WAITING_CONTROLLED: {
    title: 'Request is waiting for an assignee',
    body: '"The {{stepKind}} step of your request {{requestId}} has nobody to handle it right now and is waiting. An administrator has been told; nothing more is needed from you."'
  },
  REQUEST_WAITING_ENDED: {
    title: 'Request has an assignee again',
    body: '"The {{stepKind}} step of your request {{requestId}} now has someone in charge and is moving on."'
  },
  STEP_SLA_REMINDER: {
    title: 'A step is overdue',
    body: '"The {{stepKind}} step of request {{requestId}} is overdue[ by {{overdueWorkingDays}} working days] (reminder {{reminderNumber}}). Please handle it soon."'
  },
  STEP_SLA_ESCALATION: {
    title: 'A step handled by your report is late',
    body: '"The {{stepKind}} step of request {{requestId}}, handled by {{holderEmployeeId}}, is overdue[ by {{overdueWorkingDays}} working days] (reminder {{reminderNumber}}). You are told because you are their superior."'
  },
  STEP_SLA_NO_SUPERIOR: {
    title: 'Overdue step needs the Super Admin',
    body: '"The {{stepKind}} step of request {{requestId}} is overdue[ by {{overdueWorkingDays}} working days] (reminder {{reminderNumber}}): {{cause}}."'
  },
  SPEND_QUEUE_REMINDER: {
    title: 'A request has waited too long to be sent for spend approval',
    body: 'cause = null: "Request {{requestId}} has waited in your queue past its limit[ by {{overdueWorkingDays}} working days] (reminder {{reminderNumber}}). Please send it for spend approval." · cause = NO_HOLDER: "Request {{requestId}} has waited to be sent for spend approval past its limit[ by {{overdueWorkingDays}} working days], but the department has no head at work. Please appoint one."'
  },
  FINANCE_QUESTION_REMINDER: {
    title: 'A question to Finance is unanswered',
    body: '"The question to Finance about request {{requestId}} is overdue[ by {{overdueWorkingDays}} working days] (reminder {{reminderNumber}})."'
  },
  STEP_BACKLOG_ALERT: {
    title: 'Someone has a backlog of steps',
    body: '"{{holderEmployeeId}} has {{openCount}} steps waiting (threshold {{threshold}}); the oldest has waited {{oldestAgeWorkingDays}} working days."'
  },
  CONTROLLED_WAIT_ALERT: {
    title: 'Work is waiting for someone to be in charge',
    body: '(1) "The {{stepKind}} step of request {{requestId}} is waiting because {{waitingReason}}. Needed: {{configurationHint}}." (2) "The {{year}} budget version of {{costCenterId}} is waiting because {{waitingReason}}. Needed: {{configurationHint}}." (3) "The renewal case for subscription {{subscriptionId}} is waiting because {{waitingReason}}. Needed: {{configurationHint}}."'
  },
  ABRUPT_DEPARTURE_RECORDED: {
    title: 'Abrupt departure',
    body: '{{employeeId}} is leaving abruptly, effective {{effectiveOn}}. Their access has been blocked; the company account must be locked and software access revoked.'
  },
  LEAVER_K1_ACCESS_RUNS_ON: {
    title: 'Former employee keeps access until the paid period ends',
    body: 'The renewal of {{planId}} for {{employeeId}} has been cancelled, but the person can still use the software until {{accessUntil}} (end of the paid period).'
  },
  REVOCATION_OVERDUE: {
    title: 'Revocation overdue for a former employee',
    body: '{{employeeId}} has left but {{rightCount}} software rights are still not revoked, past the deadline of {{dueOn}}. Please act now.'
  },
  DEPARTURE_ACCESS_BLOCKED: {
    title: 'Access of a departing employee has been blocked',
    body: 'SUPER_ADMIN: {{employeeId}} is refused access from {{blockedOn}}. Please mark this person as left. · IT_ADMIN: {{employeeId}} is refused access from {{blockedOn}}. Please block the company email account (reset the mailbox password and sign out every session) and open the software revocation by {{revocationDueOn}}.'
  },
  ACCOUNT_LOCK_OVERDUE: {
    title: 'Account of a former employee is not locked yet',
    body: '{{employeeId}} has been blocked since {{blockedOn}}, but locking the company account (reset the mailbox password, sign out every session) is still not recorded. Please do it and record it now.'
  },
  DEPARTURE_REVOCATION_IT_CLOSE: {
    title: 'In-progress revocations need closing by hand',
    body: 'The departure of {{employeeId}} was cancelled but {{taskCount}} revocation tasks are still in progress. Please check with the vendor and close the tasks according to what actually happened.'
  },
  TRANSFER_REVIEW_DUE: {
    title: "Review due for a transferred employee's tools",
    body: '{{employeeId}} moved to {{departmentId}}. The tool review was due on {{dueOn}}. (Old notice; this feature has been retired.)'
  },
  TRANSFER_GRACE_STARTED: {
    title: 'Department transfer: grace period for old access',
    body: 'MOVER: You moved from {{fromDepartmentId}} to {{toDepartmentId}}. You keep the software access of your old department until {{graceEndsOn}}; after that it will be revoked. · HEAD/IT_ADMIN: {{employeeId}} moved from {{fromDepartmentId}} to {{toDepartmentId}}. Software access from the old department is kept until {{graceEndsOn}}, then it will be revoked.'
  },
  TRANSFER_GRACE_ENDING: {
    title: 'Access from your old department ends soon',
    body: 'The software access from your old department will be revoked after {{graceEndsOn}}. If you still need any of it, send an access request for your new department before then.'
  },
  TRANSFER_RIGHTS_REVOKING: {
    title: 'Revoking access from the old department',
    body: 'The grace period is over; {{rightCount}} software rights of {{employeeId}} from the old department are being revoked. (When the recipient is employeeId: "{{rightCount}} software rights from your old department are being revoked.")'
  },
  BUDGET_VERSION_AWAITING_DECISION: {
    title: 'A budget is waiting for your decision',
    body: 'Finance sent the {{year}} budget version of {{costCenterId}} for your review and decision.'
  },
  BUDGET_PROPOSAL_SUBMITTED: {
    title: 'New budget proposal',
    body: '{{costCenterId}} submitted a budget proposal for {{year}}. Please review it.'
  },
  BUDGET_PROPOSAL_RETURNED: {
    title: 'Budget proposal returned',
    body: 'Finance returned the {{year}} budget proposal of {{costCenterId}}. Reason: {{reason}}. Please revise and resubmit before the deadline.'
  },
  BUDGET_VERSION_DECIDED: {
    title: 'Budget decision made',
    body: 'The {{year}} budget version of {{costCenterId}} was {{decision}}. Reason: {{reason}}.'
  },
  BUDGET_VERSION_CLOSED_UNAPPROVED: {
    title: 'Budget version closed',
    body: 'The {{year}} fiscal year has ended and the budget version of {{costCenterId}} was never approved, so it has been closed.'
  },
  BUDGET_PROPOSAL_CLOSED_YEAR_END: {
    title: 'Budget proposal closed',
    body: 'The {{year}} fiscal year has ended and the budget proposal of {{costCenterId}} was never used, so it has been closed.'
  },
  BUDGET_PROPOSAL_TASK_ASSIGNED: {
    title: 'A budget proposal needs your action',
    body: 'The {{year}} budget proposal of {{costCenterId}} ({{departmentId}}) was returned by Finance. You are now the department head; please revise and resubmit it, or withdraw it.'
  },
  BUDGET_PROPOSAL_TASK_WAITING: {
    title: 'Budget proposal waiting for a department head',
    body: 'The {{year}} budget proposal of {{costCenterId}} was returned but the department has no head. The task will go to the first head appointed.'
  },
  BUDGET_CYCLE_OPENED: {
    title: 'Budget cycle {{year}} is open',
    body: "Please prepare and submit your department's {{year}} budget proposal by {{submissionDeadline}}. The proposal form is available to download."
  },
  BUDGET_CYCLE_DEADLINE_MOVED: {
    title: 'Budget submission deadline changed',
    body: 'The {{year}} budget proposal deadline moved from {{previousSubmissionDeadline}} to {{submissionDeadline}}.'
  },
  BUDGET_DEPARTMENT_CEILING_PUBLISHED: {
    title: 'Department ceiling published',
    body: 'The {{year}} budget ceiling of {{departmentId}} was published.'
  },
  BUDGET_PROPOSAL_DEADLINE_REMINDER: {
    title: 'Budget proposal overdue',
    body: '{{costCenterId}} has not submitted its {{year}} budget proposal; the deadline was {{submissionDeadline}}. Please contact Finance for guidance.'
  },
  BUDGET_NO_HEAD_AT_DEADLINE: {
    title: 'Department without a head at the budget deadline',
    body: '{{departmentId}} has not submitted its {{year}} budget proposal (deadline {{submissionDeadline}}) and has no head. Finance will build its budget from the baseline; the Super Admin should appoint a head.'
  },
  BUDGET_SUBMISSION_DEADLINE_PASSED: {
    title: 'Budget submission deadline has passed',
    body: 'The {{year}} budget submission deadline ({{submissionDeadline}}) has passed; {{departmentCount}} department(s) have not submitted.'
  },
  BUDGET_DECISION_DEADLINE_REMINDER: {
    title: 'Budget decision deadline passed',
    body: 'The {{year}} budget decision deadline ({{decisionDeadline}}) has passed; {{versionCount}} version(s) are still waiting for a decision.'
  },
  BUDGET_COST_CENTER_SETUP_DUE: {
    title: 'Department has no Cost Center',
    body: '{{departmentId}} has no Cost Center in use for the {{year}} budget cycle. Please set one up before the submission deadline.'
  },
  BUDGET_BASELINE_VERSION_HEAD_ASSIGNED: {
    title: 'A budget version exists for your department',
    body: 'Finance built the {{year}} budget version of {{costCenterId}} from the baseline before you took the role. Please review it.'
  },
  BUDGET_NEXT_YEAR_MISSING: {
    title: 'No approved budget for {{year}}',
    body: '{{costCenterId}} has no approved budget for {{year}}. Spending requests will wait until a budget is approved.'
  },
  BUDGET_REVIEW_DUE: {
    title: 'Month {{month}}/{{year}} close is due',
    body: 'Please close the costs of {{month}}/{{year}} so the budget review can proceed.'
  },
  BUDGET_REVIEW_SUMMARY: {
    title: 'Budget review summary {{month}}/{{year}}',
    body: 'Finance signed the {{kind}} review for {{month}}/{{year}}: {{greenCount}} green, {{yellowCount}} yellow, {{redCount}} red, {{underCount}} under-used Cost Centers.'
  },
  BUDGET_SHARED_POOL_OVER_RESERVE: {
    title: 'Shared pool above its reserve',
    body: 'As of the end of {{month}}/{{year}}, the unallocated shared pool exceeds the reserve of the budget cycle. Please review it.'
  },
  BUDGET_THRESHOLD_REACHED: {
    title: 'Budget reached {{threshold}}%',
    body: 'The {{year}} budget use of {{costCenterId}} has reached {{threshold}}% of its base budget.'
  },
  BUDGET_REVIEW_EXPLANATION_DUE: {
    title: 'Budget explanation reminder',
    body: 'Please explain the budget use of {{costCenterId}} for the quarter ending {{month}}/{{year}}. Due: {{dueOn}}.'
  },
  BUDGET_REVIEW_EXPLANATION_REQUESTED: {
    title: 'Budget explanation requested',
    body: '{{costCenterId}} has a {{light}} light in the quarterly review ending {{month}}/{{year}}. Please provide an explanation by {{dueOn}}.'
  },
  BUDGET_ADJUSTMENT_REQUESTED: {
    title: 'A budget adjustment awaits your decision',
    body: 'Finance requested a budget adjustment ({{kind}}) for {{year}}. Please review and decide.'
  },
  BUDGET_ADJUSTMENT_DECIDED: {
    title: 'Budget adjustment decided',
    body: 'The {{kind}} adjustment for {{year}}{{costCenterId}} was {{decision}}.'
  },
  GHOST_SEAT_G2_DETECTED: {
    title: 'Seat still held by a former employee',
    body: '{{employeeId}} has left but still holds a seat in {{applicationId}}. Please review and reclaim it.'
  },
  GHOST_SEAT_NEW: {
    title: 'Software seats need your decision',
    body: '{{departmentId}} has recommendations to reclaim rarely used software seats waiting for your decision. Open the queue to see the details.'
  },
  GHOST_SEAT_ACTION_TIER: {
    title: 'Seats to reclaim in your department',
    body: '{{departmentId}} has action-level recommendations to reclaim software seats. The department head will decide; you can review the details in advance.'
  },
  GHOST_SEAT_DECISION_OVERDUE: {
    title: 'Seat decision overdue',
    body: 'The recommendation to reclaim the {{applicationId}} seat of {{employeeId}} is past its decision date ({{decisionDueOn}}). Please handle it. (When employeeId is empty, drop "of {{employeeId}}".)'
  },
  GHOST_SEAT_WAITING_FOR_HEAD: {
    title: 'Department has no head; work is waiting',
    body: '{{departmentId}} has no department head, so seat-reclaim recommendations are waiting. Please appoint a head.'
  },
  GHOST_SEAT_RETURNED: {
    title: 'Seat reclaim returned by IT Admin',
    body: 'IT Admin could not carry out the reclaim of the {{applicationId}} seat of {{employeeId}} and sent it back to you. Please review and decide again.'
  },
  GHOST_SEAT_EXEMPTION_ENDING: {
    title: 'Reclaim exemption ending soon',
    body: 'The exemption from reclaiming the {{applicationId}} seat of {{employeeId}} ends on {{exemptUntil}}. After that date the seat will be assessed again.'
  },
  REVOCATION_UPCOMING: {
    title: 'Your software access will be revoked',
    body: 'Your access to {{applicationId}} (plan {{planId}}) is due to be revoked on {{notBefore}} at the earliest because it is rarely used.'
  },
  REVOCATION_CANCELLED: {
    title: 'Access revocation cancelled',
    body: 'The revocation of your access to {{applicationId}} (plan {{planId}}) has been cancelled. You can keep using it as before.'
  },
  USAGE_TRACKING_NOTICE: {
    title: 'Your use of {{applicationId}} will be tracked',
    body: 'What counts as activity: {{activityDefinition}}. Data recorded: days with activity per application account; no volume, content or location. Purpose: to compare the access you hold with actual use in order to optimise software costs; it is not used to score individuals. Data is kept for {{retentionMonths}} months.'
  },
  USAGE_SOURCE_STALE: {
    title: 'Usage report is out of date',
    body: 'The source "{{source}}" for {{applicationId}} only covers data up to {{coverageTo}} ({{freshnessDays}} days old), so unused seats cannot be determined yet. Please import a newer report.'
  },
  LICENSE_EXPIRY_REMINDER: {
    title: 'Software access ending soon',
    body: "EMPLOYEE: Your access to {{planId}} ends on {{expectedEndDate}}. Send a renewal request if you still need it. · HEAD: {{holderEmployeeId}}'s access to {{planId}} ends on {{expectedEndDate}}. · IT_ADMIN: {{holderEmployeeId}}'s access to {{planId}} ends on {{expectedEndDate}}; it will be revoked unless renewed."
  },
  RENEWAL_WINDOW_OPENED: {
    title: 'Software access can now be renewed',
    body: "EMPLOYEE: Your access to {{planId}} ends on {{expectedEndDate}}. You can send a renewal request from {{opensOn}}. · HEAD: {{holderEmployeeId}}'s access to {{planId}} ends on {{expectedEndDate}}; the window to send a renewal request opens on {{opensOn}}."
  },
  HANDOVER_CONFIRMATION_DUE: {
    title: 'Access handover needs confirmation',
    body: 'The software access handover for {{employeeId}} needs confirmation by {{dueOn}}. (Old notice; this feature has been retired.)'
  },
  HANDOVER_CONFIRMATION_OVERDUE: {
    title: 'Access handover confirmation overdue',
    body: 'Confirmation of the software access handover for {{employeeId}} was due on {{dueOn}} and is overdue. (Old notice; this feature has been retired.)'
  },
  SERVICE_ACCOUNT_RESPONSIBLE_DUE: {
    title: 'Service account owner needs replacing',
    body: '{{employeeId}} is responsible for {{accountCount}} service accounts and has a personnel change effective {{dueOn}}. (Old notice; this feature has been retired.)'
  },
  SERVICE_ACCOUNT_RESPONSIBLE_OVERDUE: {
    title: 'Service account still has no new owner',
    body: 'As of {{dueOn}}, the service account of {{employeeId}} still has no new owner. (Old notice; this feature has been retired.)'
  },
  SUBSCRIPTION_RENEWAL_ALERT: {
    title: 'Subscription renewal approaching',
    body: '{{milestoneDays}} days left until {{baseDate}} ({{noticeBasis}}) for subscription {{subscriptionId}}. {{Status}}: decisionRecorded false → "No renewal decision yet."; decisionRecorded true and outcomeRecorded false → "A decision was made; the outcome with the vendor is not recorded yet."; both true → "A decision and its outcome are recorded." Then usageData AVAILABLE → "Usage data is available for reference."; NOT_AVAILABLE → "No usage data yet."'
  },
  SUBSCRIPTION_RENEWAL_DATA_QUALITY: {
    title: 'Subscription is missing contract data',
    body: 'Subscription {{subscriptionId}} has no cancellation deadline or end date, so renewal reminders cannot be sent. Please complete the contract details.'
  },
  SUBSCRIPTION_RENEWAL_PROPOSED: {
    title: 'Subscription renewal proposal awaits your confirmation',
    body: 'IT Admin proposed to {{choice}} subscription {{subscriptionId}}. Please review and confirm.'
  },
  SUBSCRIPTION_RENEWAL_DECIDED: {
    title: 'Subscription renewal decided',
    body: 'The option to {{choice}} subscription {{subscriptionId}} was confirmed and will be carried out {{executionPoint}}.'
  },
  SUBSCRIPTION_RENEWAL_LATE: {
    title: 'Subscription renewal not carried out on time',
    body: '{{baseDate}} has arrived but the renewal decision for subscription {{subscriptionId}} still has no outcome recorded with the vendor. Please carry it out and record the result.'
  },
  SUBSCRIPTION_AUTO_RENEWAL_INCIDENT: {
    title: 'Subscription may have auto-renewed unintentionally',
    body: '{{baseDate}} has passed and subscription {{subscriptionId}}, which renews automatically, has no decision. It may have renewed on its own. Please check with the vendor.'
  },
  SUBSCRIPTION_EXPIRY_MARKED: {
    title: 'Subscription marked to end',
    body: '{{baseDate}} has passed with no renewal decision for subscription {{subscriptionId}}, so it is marked to end on {{endDate}}. When endDate is null, drop "on {{endDate}}".'
  },
  SUBSCRIPTION_SEATS_INCREASED: {
    title: 'Seats added to a subscription',
    body: '{{changedByEmployeeId}} increased the seats of subscription {{subscriptionId}} from {{fromQuantity}} to {{toQuantity}}.'
  },
  PURCHASE_INVOICE_SUBMITTED: {
    title: 'An invoice awaits your confirmation',
    body: '"A purchase invoice for {{linkKind}}, service month {{servicePeriodMonth}}, is waiting for you to confirm the payment."'
  },
  PURCHASE_INVOICE_CONFIRMED: {
    title: 'Invoice confirmed',
    body: '"Finance confirmed the payment for your purchase invoice for {{linkKind}}, service month {{servicePeriodMonth}}."'
  },
  PURCHASE_INVOICE_RETURNED: {
    title: 'Invoice returned',
    body: '"Finance returned your purchase invoice for {{linkKind}}, service month {{servicePeriodMonth}}. Open it to read the reason, fix it and submit it again."'
  },
  DEPARTMENT_SOFTWARE_PROPOSED: {
    title: 'Software proposed for a department',
    body: '{{departmentId}} proposes adding {{applicationId}} (plan {{planId}}) to its software list. Please review it. When planId is null, drop "(plan {{planId}})".'
  },
  DEPARTMENT_SOFTWARE_PROPOSAL_DECIDED: {
    title: 'Software proposal decided',
    body: 'Your proposal to add {{applicationId}} to the software list of {{departmentId}} was {{decision}}. When rejected and reason is set, add "Reason: {{reason}}."'
  },
  DEPARTMENT_WITHOUT_HEAD: {
    title: 'Department has no head',
    body: '"Department {{departmentId}} has no head of department right now[; {{waitingCount}} requests are waiting]. Please appoint one."'
  },
  EMPLOYEE_PROFILE_CREATED: {
    title: 'New employee in the department',
    body: '{{employeeId}} has been added to {{departmentId}}. Please prepare the software access this employee needs.'
  },
  EMPLOYEE_PROFILE_UPDATED: {
    title: 'Employee profile updated',
    body: 'The official details in {{employeeId}}\'s profile were updated. Open the profile to see the new details. (When the recipient is employeeId: "Your profile\'s official details were just updated.")'
  },
  PERSONNEL_EVENT_RECORDED: {
    title: 'Personnel change',
    body: '{{employeeId}}: {{eventKind}}. (When the recipient is employeeId, replace "{{employeeId}}" with "You".)'
  },
  PERSONNEL_NOTICE_RECEIVED: {
    title: 'New personnel notice',
    body: 'The head of {{departmentId}} sent a notice: {{eventKind}} for {{employeeId}}. Please review and handle it.'
  },
  PERSONNEL_NOTICE_OVERDUE: {
    title: 'Personnel notice overdue',
    body: 'The "{{eventKind}}" notice for {{employeeId}} (sent by the head of {{departmentId}}) is past its due date and has not been handled.'
  },
  ROLE_HOLDER_LEAVING: {
    title: 'Key role holder is leaving',
    body: '{{employeeId}} holds the role {{roleFlag}} and leaves on {{effectiveOn}}. Someone needs to take over this role.'
  },
  VENDOR_ADMINS_BELOW_MINIMUM: {
    title: 'Plan is about to have no vendor admin',
    body: 'The last vendor-side admin of plan {{planId}} ({{applicationId}}) is leaving and nobody else administers it. Please arrange a new admin.'
  },
  IT_ADMIN_HANDOVER_PENDING: {
    title: 'An IT Admin is leaving; handover needed',
    body: 'IT Admin {{employeeId}} {{sourceKind}} from {{dueOn}} but still answers for subscriptions or applications. An IT Admin needs to take over.'
  },
  IT_ADMIN_HANDOVER_RECEIVED: {
    title: 'You received an IT Admin handover',
    body: '{{fromEmployeeId}} handed over {{subscriptions}} subscriptions and {{applications}} applications to you.'
  },
  POLICY_PUBLISHED: {
    title: 'New policy version in force',
    body: 'Policy {{policyCode}} now has version {{versionNumber}}. When requiresReacknowledgement is true: "You need to read and acknowledge it again." When false: "You do not need to acknowledge it again."'
  }
} as const
