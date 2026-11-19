export const policyAcknowledgement = {
  title: 'Confirm that you have read the policies',
  intro: 'Before you use your workspace, read the policies that apply to your role and confirm each one.',
  progress: 'Policy {{current}} of {{total}}',
  actionsLabel: 'Confirm this policy',
  version: 'Version {{version}}',
  publishedAt: 'In force since {{date}}',
  changeNote: 'What changed: {{note}}',
  reacknowledge: 'A new version was published. Please read and confirm it again.',
  stepsTitle: 'Decision steps this policy governs',
  checklistTitle: 'Checklist',
  check: {
    SYSTEM: 'Checked by the system',
    PERSON: 'Answered by the person deciding'
  },
  confirm: 'I have read and understood',
  confirming: 'Recording…',
  loading: 'Loading the policy…',
  loadError: 'The policy could not be loaded.',
  retry: 'Try again',
  logout: 'Log out',
  errors: {
    network: 'No connection to the server. Check your network and try again.',
    forbidden: 'You are not allowed to confirm this policy.',
    notFound: 'This policy is no longer available. Reload the page to see the current list.',
    rateLimit: 'Too many attempts. Wait a moment and try again.',
    generic: 'The confirmation could not be recorded. Try again.'
  }
}
