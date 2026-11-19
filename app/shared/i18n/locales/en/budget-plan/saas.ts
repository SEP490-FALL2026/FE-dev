/** FIN-46: each SaaS linked to the company catalog, its cost-bearing Cost Center and the related budget. */
export const saas = {
  colAnnualCost: 'Annual cost',
  colBudget: 'Related budget',
  colCostCenter: 'Cost-bearing Cost Center',
  colGroup: 'Cost group',
  colSaas: 'SaaS',
  colSeats: 'Seats',
  colStatus: 'Catalog',
  empty: 'No SaaS matches the filters.',
  inCatalogCount: 'In the catalog',
  inCatalogHint: 'Allowed for company use',
  listHint: 'The related budget is the {{year}} allocation for the cost group at the cost-bearing Cost Center.',
  listTitle: 'SaaS, cost owner and related budget',
  needsReview: 'Needs IT Admin evaluation before purchase.',
  newCount: 'New SaaS to evaluate',
  newHint: 'Expected annual cost {{amount}}',
  notAllocated: 'This group has no allocation',
  notAllowedCount: 'Not allowed',
  notAllowedHint: 'Move to a tool in the catalog',
  reviewNotice:
    'New SaaS outside the catalog must be evaluated by the IT Admin before purchase. Related purchase requests are handled on the budget exceptions screen.',
  shareOf: 'Uses {{percent}} of the group allocation',
  status: {
    IN_CATALOG: 'In catalog',
    NEW_UNDER_REVIEW: 'New, to evaluate',
    NOT_ALLOWED: 'Not allowed'
  },
  subtitle:
    'Link each SaaS to the company-approved catalog, the Cost Center that bears the cost and the related budget.',
  summaryLabel: 'SaaS catalog summary',
  title: 'Software and cost',
  toExceptions: 'View budget exceptions'
} as const
