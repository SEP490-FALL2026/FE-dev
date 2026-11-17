export const policy = {
  library: {
    title: 'Policy library',
    back: 'All policies',
    current: 'Current version',
    historical: 'Historical version · read only',
    versions: 'Version history',
    empty: 'No published policies',
    pending: 'Acknowledgement required',
    done: 'Acknowledged',
    notRequired: 'No acknowledgement required',
    previous: 'Previous versions',
    next: 'More versions',
    consent: 'I have read and understood this version of the policy.',
    retryAfter: 'Try again in {{seconds}}s',
    uncertain: 'The response was lost. Refresh to check whether your acknowledgement was recorded.'
  },
  checklist: {
    title: 'Policy checklist',
    version: '{{policy}} · version {{version}}',
    yes: 'Yes',
    no: 'No',
    answerAllYes: 'Yes to all',
    systemChecked: 'Checked by the system',
    loadError: 'The checklist could not be loaded. Please try again.',
    retry: 'Reload checklist',
    loading: 'Loading checklist…',
    incomplete: 'Answer every question before deciding.',
    hasNo: 'An answer is "No", so you can only reject or return.',
    hasNoBlocking: 'An answer is "No", so you cannot continue.',
    noReason: 'Not met: {{items}}'
  },
  gate: {
    title: 'Acknowledge policies',
    hint: 'Read and acknowledge the new policies before you continue working.',
    progress: 'Policy {{current}} of {{total}}',
    version: 'Version {{version}}',
    changeNote: 'Changes in this version',
    acknowledge: 'I have read and understood',
    acknowledged: 'Your acknowledgement has been recorded.',
    error: 'The acknowledgement was not recorded. Please try again.',
    loadError: 'The policy could not be loaded.',
    retry: 'Reload',
    loading: 'Loading policy…'
  },
  errors: {
    versionChanged: 'The policy has a new version. Read the questions again and answer them again.',
    incomplete: 'Not every question of this step has been answered.',
    hasNo: 'You cannot continue because an answer is "No". You can reject or return instead.',
    notInForce:
      'This step has no policy in force yet, so no decision can be made. Ask a Super Admin to publish the policy.'
  }
} as const
