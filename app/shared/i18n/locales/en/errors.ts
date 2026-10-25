export const errors = {
  forbiddenAction: 'Back to my dashboard',
  forbiddenDetails: 'You are signed in as {{currentRole}}. You do not have permission to access the {{attemptedRole}} dashboard.',
  forbiddenLoginAgain: 'Sign in with another account',
  forbiddenSub: 'Access denied due to Role-Based Access Control (RBAC) security policy.',
  forbiddenTitle: '403 - Access Forbidden',
  genericDetails: 'An unexpected error occurred.',
  genericTitle: 'Error',
  loading: 'Starting SaaS-Sentry…',
  notFoundDetails: 'The requested page could not be found.',
  notFoundTitle: '404'
} as const
