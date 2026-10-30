export const auth = {
  backHome: 'Back to home',
  description: 'A single place to track software, access, and technology spend across your organization.',
  documentTitle: 'Login | SaaS-Sentry',
  email: {
    label: 'Email',
    placeholder: 'name@company.com'
  },
  eyebrow: 'Internal workspace',
  formTitle: 'Sign in',
  password: {
    hide: 'Hide password',
    label: 'Password',
    placeholder: 'Enter your password',
    show: 'Show password'
  },
  roles: {
    employee: {
      description: 'Review assigned software and submit seat requests.',
      label: 'Employee'
    },
    finance: {
      description: 'Control budgets, commitments, invoices, and forecasts.',
      label: 'Finance'
    },
    'it-admin': {
      description: 'Operate the catalog, licenses, usage imports, and discovery.',
      label: 'IT Admin'
    },
    manager: {
      description: 'Confirm team needs and review access recommendations.',
      label: 'Manager'
    },
    'spending-approver': {
      description: 'Make final decisions for spend and catalog changes.',
      label: 'Spending Approver'
    },
    'super-admin': {
      description: 'Manage accounts, roles, configuration, jobs, and audit.',
      label: 'Super Admin'
    }
  },
  submit: 'Sign in',
  submitting: 'Signing in…',
  signedIn: 'Signed in successfully.',
  retryIn: 'Try again in {{seconds}} seconds',
  loginFooter: 'SaaS-Sentry · Your organization’s workspace',
  showcase: { access: 'Controlled access' },
  support: { description: 'Having trouble signing in?', link: 'Recover your access' },
  welcome: 'Welcome back',
  formDescription: 'Use your assigned account to access your workspace.',
  accountNotice: 'Need an account? Contact your organization’s administrator.',
  forgotPassword: 'Forgot password?',
  securityNote: 'Your session is protected by short-lived access credentials.',
  session: {
    checking: 'Checking your session…',
    unavailable: 'Could not check your session. Please try again when the connection is stable.',
    retry: 'Try again',
    loggingOut: 'Signing out…',
    logoutFailed: 'Could not sign out on the server. Please try again.'
  },
  footer: 'SaaS-Sentry · Internal software management',
  highlights: {
    accessTitle: 'Relevant access',
    accessBody: 'Information follows your account’s current permissions.',
    sessionTitle: 'Protected session',
    sessionBody: 'Access credentials refresh as needed and end on sign out.'
  },
  errors: {
    invalidCredentials: 'Email or password is incorrect.',
    validation: 'Some details are invalid. Check the marked fields.',
    blocked: 'Sign-in is temporarily blocked. Try again in {{seconds}} seconds.',
    rateLimited: 'Too many attempts. Please wait and try again.',
    rateLimitedWait: 'Too many attempts. Try again in {{seconds}} seconds.',
    unavailable: 'Sign-in is temporarily unavailable. Please try again later.',
    generic: 'Could not sign in. Please try again.',
    noWorkspace: 'This account has no available workspace yet.',
    requestId: 'Request ID: {{requestId}}'
  },
  actions: {
    back: 'Back to sign in',
    backToLogin: 'Go to sign in',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    passwordMismatch: 'Passwords do not match.',
    passwordPolicy: 'Your new password must be 12 to 128 characters and differ from your sign-in email.',
    invalidLink: 'This link is invalid or has expired.',
    requestNewLink: 'Request a new link',
    contactAdmin: 'Contact your administrator for a new activation invitation.',
    validation: 'Some details are invalid. Check the marked fields.',
    currentPasswordInvalid: 'The current password is incorrect.',
    rateLimited: 'Too many attempts. Please wait and try again.',
    rateLimitedWait: 'Too many attempts. Try again in {{seconds}} seconds.',
    unavailable: 'The service is temporarily unavailable. Please try again later.',
    genericError: 'Could not complete the request. Please try again.',
    forgot: {
      title: 'Forgot password',
      description: 'Enter your sign-in email. If the account is valid, we will send reset instructions.',
      submit: 'Send instructions',
      success: 'If the email is valid, you will receive instructions.'
    },
    reset: {
      title: 'Reset password',
      description: 'Choose a new password to continue using your account.',
      submit: 'Reset password',
      success: 'Your password has been reset. Sign in with the new password.'
    },
    activate: {
      title: 'Activate account',
      description: 'Set a password to complete your invitation.',
      submit: 'Activate account',
      success: 'Your account is active. You can sign in.'
    },
    change: {
      title: 'Change password',
      description: 'Changing your password ends all current sessions.',
      submit: 'Change password',
      success: 'Your password has changed. Please sign in again.'
    }
  },
  title: 'Every application. One control center.'
} as const
