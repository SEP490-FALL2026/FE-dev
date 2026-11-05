import { budgetPlan } from './dashboard-budget-plan'

/** Spending Approver (UF-15) screens and shared budget wording; Finance copy lives in the `finance*` namespaces. */
export const spendDashboard = {
  budgetPlan,
  ui: {
    all: 'All',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save'
  },
  budget: {
    actual: 'Actual',
    asOf: 'Data as of {{time}}',
    borneCost: 'Borne cost',
    borneCostNote: 'All amounts are borne cost; deductible VAT is shown in its own column and never consumes budget.',
    budget: 'Budget',
    costCenter: 'Cost Center',
    deductibleVat: 'Deductible VAT',
    deductibleVatSeparate: 'Deductible VAT (separate)',
    estimateTitle: 'Estimated cost',
    estimated: 'Estimate',
    held: 'Held commitments',
    noBudget: 'No budget',
    nonDeductibleTax: 'Non-deductible tax',
    overCommitted: 'Over-committed',
    pending: 'Spend requests awaiting decision',
    preTax: 'Price before tax',
    remaining: 'Remaining',
    snapshotTitle: 'Budget snapshot',
    totalPayable: 'Total payable',
    usedRatio: 'Spent and committed share'
  }
} as const
