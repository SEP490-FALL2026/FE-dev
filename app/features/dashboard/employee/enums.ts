export const EMPLOYEE_TAB_KEYS = [
  'overview',
  'my-software',
  'software-detail',
  'my-requests',
  'request-detail',
  'create-request',
  'request-new-software',
  'request-software-details',
  'temporary-renewal',
  'return-license',
  'review-request',
  'submission-success',
  'profile',
  'privacy',
  'data-export',
  'data-usage'
] as const

export type EmployeeTabKey = (typeof EMPLOYEE_TAB_KEYS)[number]

export const SOFTWARE_REQUEST_TYPES = ['NEW', 'RENEWAL', 'RETURN'] as const
export type SoftwareRequestType = (typeof SOFTWARE_REQUEST_TYPES)[number]

export const SOFTWARE_REQUEST_SCOPES = ['INDIVIDUAL', 'TEAM'] as const
export type SoftwareRequestScope = (typeof SOFTWARE_REQUEST_SCOPES)[number]

export const LICENSE_RETURN_REASONS = [
  'NO_LONGER_NEEDED',
  'FOUND_ALTERNATIVE',
  'PROJECT_ENDED',
  'ROLE_CHANGED',
  'OTHER'
] as const
export type LicenseReturnReason = (typeof LICENSE_RETURN_REASONS)[number]
