/** Presentation copy of the redesigned Employee screens (pickers, placeholders, section titles). */
export const employeeUi = {
  select: {
    empty: 'No matching options'
  },
  placeholders: {
    workPhone: 'Example: 0901 234 567',
    requestView: 'Choose a processing stage (type to search)',
    requestState: 'Choose a request status (type to search)',
    requestType: 'Choose a request type (type to search)',
    rightsView: 'Choose an access period (type to search)',
    application: 'Choose software from the catalog (type a name or vendor to search)',
    departmentApplication: 'Choose software of your department (type a name to search)',
    kind: 'Filter by software type (type to search)',
    plan: 'Choose a plan of the selected software (type a plan name to search)',
    planFirst: 'Choose the software first, then its plan',
    members: 'Add a colleague from your department (type a name or email to search)',
    membersFull: 'All 10 beneficiary places are taken',
    assignment: 'Choose an access you currently hold (type software or plan to search)',
    issueAssignment: 'Choose the software with the problem (type a name to search)',
    issueCategory: 'Choose the issue category (type to search)',
    issueImpact: 'Choose the impact level (type to search)',
    issueDescription:
      'For example: since 9 AM sign-in fails with a license expired message although the access is valid',
    businessReason: 'For example: Figma is needed to design screens for this quarter client project',
    extensionMonths: 'Enter the extension in months, for example 3',
    termMonths: 'Enter the months of use, for example 6',
    softwareName: 'For example: Notion',
    homepage: 'For example: https://www.notion.so',
    expectedUsers: 'Enter the expected number of users, for example 5',
    plannedPlanName: 'For example: Business plan for the design team',
    purpose: 'For example: manage project documents and meeting notes of the product team',
    dataDescription: 'For example: internal documents without customer personal data',
    withdrawReason: 'For example: the project has ended so this software is no longer needed',
    policyVersion: 'Choose a policy version (type a number to search)'
  },
  create: {
    softwareStep: 'Software and plan',
    softwareStepHint: 'Choose software of your department or from the whole catalog, then pick a plan.',
    detailsStep: 'Request details',
    detailsStepHint: 'Give the period of use and a reason so approvers can decide faster.',
    removeMember: 'Remove {{name}} from the list',
    memberCount: '{{count}} / 10 people'
  },
  lists: {
    filters: 'Filters',
    issuesTitle: 'My issue reports',
    issuesTotal_one: '{{count}} report',
    issuesTotal_other: '{{count}} reports',
    returnsHint: 'Follow the access return requests you have sent.',
    expiryHint: 'Access that ends soon. Choose a row to send a renewal request.',
    draftsHint: 'Drafts have not been sent yet. Submit or delete them when no longer needed.'
  },
  profile: {
    identity: 'Employment details',
    contact: 'Photo and contact'
  },
  privacy: {
    hint: 'Review the company device monitoring notice and the data collected from your devices.'
  },
  policies: {
    hint: 'Read the policies in force and acknowledge the ones that require your confirmation.'
  },
  issues: {
    hint: 'Report problems with software assigned to you and follow replies from the support team.',
    softwareStep: 'Software with the problem',
    detailsStep: 'Issue description'
  }
} as const
