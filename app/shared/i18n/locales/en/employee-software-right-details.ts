export const employeeSoftwareRightDetails = {
  action: 'Details',
  open: 'Details for {{name}}',
  title: 'Software access details',
  close: 'Close details',
  access: 'Granted access',
  application: 'Software information',
  plan: 'Plan information',
  provisioning: 'Provisioning method',
  effectiveFrom: 'Effective from',
  renewed: 'A renewal continues this access',
  catalogUnavailable: 'Catalog information is currently unavailable. Your access details are still shown above.',
  provisioningTypes: {
    K1: 'Individual account',
    K2: 'Workspace',
    K3: 'Enterprise SSO / SCIM',
    K4: 'License key',
    K5: 'Internal access'
  }
} as const
