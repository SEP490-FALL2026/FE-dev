export const itCatalogHelp = {
  name: 'Use the product name employees will recognize when requesting access.',
  vendor: 'Enter the supplier or publisher of this product. Internal software does not need an external vendor.',
  owner:
    'Select a working employee from a department, or paste their employee UUID. This person owns the business need.',
  domains: 'Enter hostnames only, one per line. These identify the application in software discovery.',
  planName: 'Use the vendor plan or edition name to distinguish access and purchase options.',
  quantity: 'Record the seats covered by this purchase. Leave blank if the quantity has not been confirmed.',
  unitAmount: 'Enter the price for one billing unit as a decimal number. Currency is required with a price.',
  currency: 'Use the three-letter currency code from the contract, such as VND or USD.',
  startDate: 'The first day covered by this purchased period.',
  endDate: 'The final day covered by this period. Leave blank if the purchase has no known end date.',
  renewalDate: 'The next renewal date confirmed with the vendor.',
  noticePeriodDays: 'Days of advance notice required to cancel before the contract ends.',
  revocationNote:
    'Describe the steps for safe removal, including data export and handover. Required when removal causes data loss.',
  department: 'Select the department that owns this purchase, or paste its department UUID.',
  kind: 'SaaS uses vendor accounts, licensed software uses keys, and internal software is operated by the organization.',
  sensitivity: 'Choose the sensitivity of company information this application handles.',
  communication: 'Mark the communication features available in this application.',
  provisioning: 'Choose how access is granted. Available options depend on the application kind.',
  pricingModel: 'Choose the unit the vendor charges for, such as seats, hosts or consumption.',
  controlLevel: 'Record how much the organization can control access and revoke it.',
  subscriptionKind: 'Choose a fixed period purchase or a perpetual license according to the agreement.',
  billingCycle: 'Choose how often the vendor bills this subscription.',
  autoRenew: 'Enable only if the agreement renews automatically without a new purchase.',
  allowsMidTermReduction: 'Enable only when the agreement permits reducing seats during the current period.',
  ownerEvidence: 'Record when and how the business owner confirmed retirement. Do not include credentials.'
} as const
