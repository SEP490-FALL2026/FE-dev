import { common } from './budget-plan/common'
import { allocation } from './budget-plan/allocation'
import { approver } from './budget-plan/approver'
import { approverExceptions } from './budget-plan/approverExceptions'
import { approverHistory } from './budget-plan/approverHistory'
import { approverSpend } from './budget-plan/approverSpend'
import { check } from './budget-plan/check'
import { department } from './budget-plan/department'
import { exceptions } from './budget-plan/exceptions'
import { filtersApproverDecisions } from './budget-plan/filtersApproverDecisions'
import { filtersApproverQueue } from './budget-plan/filtersApproverQueue'
import { filtersCatalog } from './budget-plan/filtersCatalog'
import { filtersPlanning } from './budget-plan/filtersPlanning'
import { filtersSpend } from './budget-plan/filtersSpend'
import { existing } from './budget-plan/existing'
import { forecastCharts } from './budget-plan/forecastCharts'
import { history } from './budget-plan/history'
import { negotiation } from './budget-plan/negotiation'
import { periods } from './budget-plan/periods'
import { proposals } from './budget-plan/proposals'
import { saas } from './budget-plan/saas'
import { summary } from './budget-plan/summary'

/** Annual budget planning: one file per screen under `budget-plan/`, read as `budgetPlan.<screen>.<key>`. */
export const budgetPlan = {
  ...common,
  allocation,
  approver,
  approverExceptions,
  approverHistory,
  approverSpend,
  check,
  department,
  exceptions,
  filtersApproverDecisions,
  filtersApproverQueue,
  filtersCatalog,
  filtersPlanning,
  filtersSpend,
  existing,
  forecastCharts,
  history,
  negotiation,
  periods,
  proposals,
  saas,
  summary
} as const
