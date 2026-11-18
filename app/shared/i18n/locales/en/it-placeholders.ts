export const itPlaceholders = {
  appName: 'Example: Figma, Notion, Slack',
  vendor: 'Example: Figma Inc.',
  homepageUrl: 'Example: https://www.figma.com',
  logoUrl: 'Example: https://example.com/logo.png',
  planName: 'Example: Professional, Business or Enterprise',
  groupName: 'Example: Design and creative',
  revocationNote: 'Example: Remove the workspace and hand data to the manager before revoking',
  amountVnd: 'Enter the amount in dong, for example 12000000',
  workspaceEmail: 'Example: admin@company.com',
  searchApp: 'Type a software name to search',
  searchEmployee: 'Type a name or email to search',
  searchDevice: 'Type an asset code or hostname to search',
  searchContract: 'Type a contract number or vendor to search',
  note: 'Example: The department moved to another tool at the start of the month',
  reason: 'Example: The device was lost and must be disabled now',
  evidence: 'Example: Support ticket number or link to the handover record',
  purchaseReason: 'Example: Buying 5 extra seats for the new design team',
  withdrawalReason: 'Example: The user has left and the seat is no longer needed',
  alternative: 'Example: Use the Business plan of a tool already in the catalogue',
  device: {
    assetCode: 'Example: LAP-0042',
    hostname: 'Example: design-laptop-01',
    os: 'Example: Windows 11 Pro',
    handedOverOn: 'Pick the handover date'
  },
  invoice: {
    number: 'Example: 0000123',
    issuedOn: 'Pick the invoice issue date',
    month: 'Pick the usage month',
    quantity: 'Enter the number of seats, for example 5',
    unitPrice: 'Enter the unit price in dong, for example 250000',
    netAmount: 'Enter the pre-tax amount, for example 1250000',
    deductibleTax: 'Enter the deductible tax, for example 125000',
    nonDeductibleTax: 'Enter the non-deductible tax, for example 0'
  },
  quote: {
    amount: 'Enter the unit price, for example 250000',
    currency: 'VND',
    validFrom: 'Pick the date the quote takes effect',
    validUntil: 'Pick the date the quote expires'
  }
} as const
