export const adminDepartmentEditor = {
  editor: {
    codePlaceholder: 'e.g. ENG or PEOPLE-OPS',
    namePlaceholder: 'Enter the department name',
    functionPlaceholder: 'Describe the department’s responsibilities',
    headChoice: 'Department head change',
    keepHead: 'Keep current head',
    assignHead: 'Choose new head',
    vacateHead: 'Leave vacant',
    chooseHead: 'Choose a manager',
    chooseHeadPlaceholder: 'Select a manager in this department',
    managerHelp:
      'Only department members with an active, activated Manager account are listed. Assign the Manager role in Accounts first if needed.',
    vacateHelp:
      'Requests will wait for a department head from the effective date. The former head keeps the Manager role until it is revoked.',
    partialSave: 'Department details were saved; the head change failed. Correct the highlighted field and save again.',
    unknownOutcome:
      'The write result is uncertain. Compare your draft with the latest department data before saving again. Future head changes may not appear as the current head yet.',
    latestTitle: 'Latest department data',
    review: 'I reviewed the latest department data',
    readLatest: 'Reload department data',
    readFailed: 'Could not reload department data. Try reloading before saving again.',
    errors: {
      name: 'Enter a name of 1–200 characters and a function of at most 1,000 characters.',
      itAdmin: 'Choose an active employee with a usable information technology administrator account.',
      headMembership: 'Choose a member of this department on the effective date.',
      managerRequired: 'Assign the Manager role to this employee in Accounts first.',
      headRole: 'A Super Admin or Spending Approver cannot be a department head.',
      anotherDepartment: 'This employee is already head of another department during this period.',
      employeeInactive: 'This employee no longer exists or is no longer active.',
      date: 'Choose today or a later business date.',
      inactive: 'This department is retired. Close the editor and refresh the department.',
      validation: 'Review the department fields, head selection and effective date.'
    }
  }
}
