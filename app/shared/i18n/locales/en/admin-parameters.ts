export const parameterPresentation = {
  usingDefault: 'Using default',
  customized: 'Customized',
  notChanged: 'No recorded change',
  unknownName: 'Other parameter',
  unknownDescription: 'No display description is available for this parameter.',
  unknownUnit: 'Unit label unavailable',
  currentlyApplied: 'Currently applied',
  noLongerApplied: 'No longer applied',
  historyTitle: 'History · {{name}}',
  validFrom: 'Applies from',
  validUntil: 'Applies until',
  units: {
    workingDays: 'Working days',
    steps: 'Processing steps',
    minutesPerDay: 'Minutes per day',
    monthOfYear: 'Month of the year',
    days: 'Days',
    minutes: 'Minutes',
    hours: 'Hours',
    months: 'Months',
    percent: 'Percent'
  },
  definitions: {
    approvalSla: {
      name: 'Approval processing deadline',
      description: 'The deadline in working days for an approval step.'
    },
    backlogAlert: {
      name: 'Backlog alert threshold',
      description: 'The processing-step threshold used to flag a work backlog.'
    },
    activityWindow: {
      name: 'Daily activity threshold',
      description: 'The daily activity minutes used to assess software usage.'
    },
    fiscalYearStart: {
      name: 'Fiscal year start month',
      description: 'The month marking the beginning of the fiscal year.'
    },
    spendSubmissionWait: {
      name: 'Spending submission deadline',
      description: 'The working-day deadline for submitting spending for approval.'
    },
    transferReview: {
      name: 'Post-transfer review deadline',
      description: 'The access review deadline after an employee changes departments.'
    }
  }
} as const
