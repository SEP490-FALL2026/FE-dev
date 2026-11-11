export const employeeRequestUx = {
  newAccess: 'Request new access',
  existingAccess: 'Existing access',
  guide: 'How to send a request',
  modes: {
    individual: 'Choose software and a plan for yourself, then check eligibility before sending.',
    group: 'Choose a plan and people in your department. The check identifies who needs more information.',
    proposal: 'Propose software outside the catalog for IT to assess.',
    renewal: 'Choose access you need to keep. Approval is still required before it is extended.',
    return: 'Choose access you no longer need. IT will handle revocation after you send the request.'
  },
  chooseFromSoftware: 'Choose from My software',
  memberProblems: 'People who need attention',
  selectedAccess: 'Selected access',
  currentEnd: 'Current end date',
  renewalOpens: 'Renewal requests open on {{date}}',
  renewalRange: 'The new end date must be after {{previous}} and no later than {{max}}.',
  renewalWindow: 'The renewal window has not opened. See the opening date under the selected access.',
  renewalDate: 'The renewal end date is outside the allowed range. Check the selected access details.',
  groupRefused: 'Some people are not eligible. Check the details for each person.',
  tooMany: 'This request accepts at most {{count}} people.',
  tooFew: 'Choose at least {{count}} different people.',
  groupDate: 'The end date must be within the limit of {{date}}.'
} as const
