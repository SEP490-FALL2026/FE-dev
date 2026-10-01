(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  if (root) root.UF07_DATA = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const session = Object.freeze({
    id: 'IMP-20250114-7F3A',
    source: 'Microsoft 365',
    file: 'm365_usage_jan2025.csv',
    template: 'Microsoft 365 · Usage v3',
    identifierType: 'User Principal Name',
    importedAt: '14/01/2025 · 10:24 ICT',
    importedBy: 'IT Admin',
    importedByEmail: 'it-admin@company.com',
    coverage: '01/01/2025–31/01/2025',
    totalIdentities: 1248,
    matchedBeforeQueue: 1102,
    unmatchedAtStart: 146,
  });

  const records = Object.freeze({
    'UQ-0184': Object.freeze({
      id: 'UQ-0184',
      raw: 'Nguyen.Van_A@acmecloud.onmicrosoft.com',
      normalized: 'nguyen.van_a@acmecloud.onmicrosoft.com',
      displayName: 'Nguyen Van A',
      detectedAt: '14/01/2025 · 10:25 ICT',
      usageRecords: 23,
      assignments: 1,
      status: 'Needs Review',
      matchMethod: 'Approximate Email + Display Name',
      confirmedBy: 'IT Admin · it-admin@company.com',
      confirmedAt: '14/01/2025 · 10:31 ICT',
      candidates: Object.freeze([
        Object.freeze({
          name: 'Nguyen Van An',
          employeeId: 'EMP-0241',
          email: 'nguyen.van.an@company.com',
          confidence: 94,
          evidence: 'Exact full name · Near-match username · Active status',
          assignment: 'Microsoft 365 E3 · Active',
        }),
        Object.freeze({
          name: 'Nguyen Van Anh',
          employeeId: 'EMP-0398',
          email: 'nguyen.van.anh@company.com',
          confidence: 63,
          evidence: 'Near-match name · Different username suffix',
          assignment: 'No Microsoft 365 Assignment',
        }),
        Object.freeze({
          name: 'Van An Nguyen',
          employeeId: 'EMP-0614',
          email: 'van.an.nguyen@company.com',
          confidence: 51,
          evidence: 'Similar name tokens · Alternate email format',
          assignment: 'No Microsoft 365 Assignment',
        }),
      ]),
    }),
    'UQ-0185': Object.freeze({
      id: 'UQ-0185',
      raw: 'svc-marketing-automation@acmecloud.onmicrosoft.com',
      normalized: 'svc-marketing-automation@acmecloud.onmicrosoft.com',
      displayName: 'Marketing Automation Service',
      detectedAt: '14/01/2025 · 10:25 ICT',
      usageRecords: 31,
      assignments: 0,
      status: 'No Match Found',
      matchMethod: 'No suitable candidate found',
      ignoreReason: 'External vendor service account, not assigned to employee',
      ignoredBy: 'IT Admin · it-admin@company.com',
      ignoredAt: '14/01/2025 · 10:32 ICT',
      candidates: Object.freeze([]),
    }),
    'UQ-0186': Object.freeze({
      id: 'UQ-0186',
      raw: 'n.tran@acmecloud.onmicrosoft.com',
      normalized: 'n.tran@acmecloud.onmicrosoft.com',
      displayName: 'N Tran',
      detectedAt: '14/01/2025 · 10:25 ICT',
      usageRecords: 18,
      assignments: 2,
      status: 'Identity Conflict',
      matchMethod: 'Abbreviated username + Near-match name',
      blocked: true,
      blockedAt: '14/01/2025 · 10:34 ICT',
      candidates: Object.freeze([
        Object.freeze({
          name: 'Nguyen Minh Tran',
          employeeId: 'EMP-0312',
          email: 'nguyen.minh.tran@company.com',
          confidence: 82,
          evidence: 'Near-match username · Tran surname · N initial',
          assignment: 'Microsoft 365 E3 · Active',
        }),
        Object.freeze({
          name: 'Nguyen Mai Tran',
          employeeId: 'EMP-0448',
          email: 'nguyen.mai.tran@company.com',
          confidence: 80,
          evidence: 'Near-match username · Tran surname · N initial',
          assignment: 'Microsoft 365 E3 · Active',
        }),
      ]),
    }),
  });

  const ledger = Object.freeze({
    queueStart: 146,
    afterMatch: 145,
    afterIgnore: 144,
    afterConflict: 144,
    conflictWaiting: 1,
  });

  const screens = Object.freeze([
    Object.freeze({ id: '01', title: 'Identity Unmatched Queue', subtitle: 'Review and resolve Microsoft 365 identities not yet linked to employees.', queue: 146, recordId: 'UQ-0184', state: 'queue' }),
    Object.freeze({ id: '02', title: 'View Identity Match Suggestions', subtitle: 'Compare raw source string with internal candidates before confirmation.', queue: 146, recordId: 'UQ-0184', state: 'candidates' }),
    Object.freeze({ id: '03', title: 'Confirm Manual Match', subtitle: 'Review impact scope before committing identity mapping.', queue: 146, recordId: 'UQ-0184', state: 'confirm-match' }),
    Object.freeze({ id: '04', title: 'Re-aggregating Usage Data', subtitle: 'Mapping committed; system is recalculating usage for active assignments.', queue: 146, recordId: 'UQ-0184', state: 'recompute' }),
    Object.freeze({ id: '05', title: 'Identity Matched Successfully', subtitle: 'Record resolved and usage metrics re-aggregated.', queue: 145, recordId: 'UQ-0184', state: 'match-success' }),
    Object.freeze({ id: '06', title: 'No Candidate Found', subtitle: 'Search for employee or dismiss identity with mandatory reason.', queue: 145, recordId: 'UQ-0185', state: 'no-candidate' }),
    Object.freeze({ id: '07', title: 'Confirm Dismiss Identity', subtitle: 'Dismissed records will not be used to conclude employee usage.', queue: 145, recordId: 'UQ-0185', state: 'confirm-ignore' }),
    Object.freeze({ id: '08', title: 'Identity Dismissed', subtitle: 'Decision and justification recorded in audit log.', queue: 144, recordId: 'UQ-0185', state: 'ignore-success' }),
    Object.freeze({ id: '09', title: 'Identity Conflict Detected', subtitle: 'One identity matched equally with two employees.', queue: 144, recordId: 'UQ-0186', state: 'ambiguous' }),
    Object.freeze({ id: '10', title: 'Ambiguous Selection Blocked', subtitle: 'Conflict blocked per BR-18.4; cannot auto-select candidate.', queue: 144, recordId: 'UQ-0186', state: 'conflict-blocked' }),
    Object.freeze({ id: '11', title: 'Awaiting Conflict Resolution', subtitle: 'Record remains in queue and is excluded from rule conclusions.', queue: 144, recordId: 'UQ-0186', state: 'conflict-waiting' }),
  ]);

  return Object.freeze({ session, records, ledger, screens });
});
