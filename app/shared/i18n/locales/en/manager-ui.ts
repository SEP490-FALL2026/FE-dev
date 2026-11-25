/** Presentation copy of the redesigned Manager screens (pickers, placeholders, section titles). */
export const managerUi = {
  currency: 'VND',
  amountFormat: 'Enter a non-negative whole VND amount, up to 16 digits.',
  loadFailed: 'The list could not be loaded. Close and reopen it to try again.',
  statePlaceholder: 'Choose a status (type to search)',
  create: {
    softwareStep: '1. Software and plan',
    peopleStep: '2. Beneficiaries',
    reasonStep: '3. Business reason'
  },
  placeholders: {
    application: 'Choose software from the catalog (type a name or vendor to search)',
    kind: 'Filter by software type (type to search)',
    plan: 'Choose a plan of the selected software (type a plan name to search)',
    planFirst: 'Choose the software first, then a plan',
    people: 'Add people from your department (type a name or email, up to {{count}} people)',
    peopleFull: '{{count}} beneficiaries selected, the limit is reached',
    requestType: 'Choose a request type (type to search)',
    noticeEmployee: 'Choose an employee of your department (type a name or employee code)',
    noticeKind: 'Choose the type of change (type to search)',
    noticeNote: 'For example: The employee has resigned, the last working day is Friday',
    date: 'Choose a date, for example 30/11/2026',
    month: 'Choose the month to view (type the month number)',
    state: 'Choose an adjustment status (type to search)',
    persistence: 'Choose how lasting the variance is (type to search)',
    cause: 'For example: Three designers joined, so Figma seats grew from July',
    action: 'For example: Reclaim two unused seats next quarter to cover the overrun',
    knownAmount: 'For example: 12,000,000',
    knownNote: 'For example: Adobe renewal in November for the communications team',
    year: 'Enter a year, for example 2027',
    costCenterAuto: 'Taken from the department you head',
    requestedAmount: 'Before tax, for example 250,000,000',
    budgetNote: 'For example: Budget grows because the product team adds five people',
    businessReason: 'For example: The design team needs Figma for the client app project in Q1',
    personalReason: 'For example: I need Miro to run the department planning sessions',
    proposalReason: 'For example: The whole department uses Notion for project documents',
    ghostReason: 'For example: The employee switched to another tool last month',
    renewalReason: 'For example: Fewer seats are fine since some people moved to another project',
    returnReason: 'For example: The employee no longer uses this software after the project ended',
    reserveReason: 'For example: Needed for the new client project, agreed with Finance',
    withdrawReason: 'For example: The employee moved to another project and no longer needs it'
  }
} as const
