export const adminImportImpact = {
  importImpact: {
    title: 'Import impact',
    unplaced: 'New employees without a department',
    unplacedHelp: 'These profiles can be assigned a department after import.',
    byDepartment: 'New employees by department',
    missingHeads: 'Departments without a head',
    missingHeadsHelp: 'Requests from these departments will wait until a department head is assigned.',
    reviewTitle: 'Employees to review: {{count}}',
    reviewHelp: 'These employees hold seats but are absent from the file. Import does not mark them as departed.',
    reviewShown: 'Showing {{shown}} of {{total}} employees.',
    seats: '{{count}} assigned seats'
  }
} as const
