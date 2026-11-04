export const employeeRequestExtras = {
  plan: {
    title: 'Selected plan details',
    sharing: 'Account sharing policy',
    dataLoss: 'Data loss on removal',
    sharingValues: { ALLOWED: 'Sharing allowed by the vendor', NOT_ALLOWED: 'Sharing not allowed' },
    yes: 'Yes',
    no: 'No',
    sharingHint: 'Vendor terms are informational. Each person still needs their own company account and seat.'
  },
  serviceAccount: {
    title: 'Service account',
    hint: 'For non-human subjects such as bots and CI. You are responsible for this account; IT must review it before granting access. Do not enter passwords or secrets.',
    identifier: 'Expected account identifier',
    purpose: 'Automation purpose',
    review: 'Review service account request',
    confirm: 'Confirm service account request',
    blocked: 'Financial setup is incomplete. Sending is currently unavailable.',
    unsupported:
      'This plan cannot be requested as a service account. Choose a subscription seat or an internal software plan.'
  },
  returnHandover: {
    confirm: 'Confirm return data handover',
    hint: 'Confirm that the required data handover is complete. IT may then revoke this access; confirmation does not revoke it immediately.',
    done: 'Data handover confirmed',
    needed: 'Data handover confirmation required',
    dueOn: 'Confirmation due {{date}}',
    flagged: 'Revocation completed without handover confirmation'
  },
  errors: {
    baseline: 'IT must finish the initial seat setup before you can request a service account.',
    plan: 'The selected plan does not support service accounts. Choose another plan.',
    sender: 'Only the person who submitted this return can confirm its data handover.',
    changed: 'The return no longer needs this confirmation. Reload and check its current status.'
  }
} as const
