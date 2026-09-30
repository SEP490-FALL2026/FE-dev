export const auth = {
  account: {
    description: 'Open the shared dashboard as this BRD role.',
    use: 'Use {{role}} account'
  },
  backHome: 'Back to home',
  demo: {
    description: 'These public credentials are for interface review only. No session or token is stored.',
    password: 'Shared password',
    title: 'Six demo roles'
  },
  description: 'Choose a demo persona or enter its credentials to preview the shared role workspace.',
  documentTitle: 'Login | SaaS-Sentry',
  email: {
    label: 'Email',
    placeholder: 'name@saas-sentry.test'
  },
  eyebrow: 'Internal workspace preview',
  formTitle: 'Login to SaaS-Sentry',
  invalidCredentials: 'The demo email or password is incorrect.',
  password: {
    hide: 'Hide password',
    label: 'Password',
    placeholder: 'Enter the demo password',
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
  submit: 'Login',
  title: 'See the right signals for every role'
} as const
