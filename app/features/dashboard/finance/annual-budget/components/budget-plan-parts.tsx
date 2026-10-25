import { useTranslation } from 'react-i18next'

import { Pill, type Tone } from '../../../dashboard-ui'
import type { BudgetStatus, ProposalStage } from '../../annual-budget-data'

/* Status pills shared by the annual budget planning screens and the Spending Approver's APV-05. */

export const budgetStatusTones: Record<BudgetStatus, Tone> = {
  ACTIVE: 'success',
  APPROVED: 'primary',
  DRAFT: 'neutral',
  EXPIRED: 'danger',
  PENDING_APPROVAL: 'warning',
  UNDER_FINANCE_REVIEW: 'info'
}

export const proposalStageTones: Record<ProposalStage, Tone> = {
  APPROVED: 'success',
  IN_ANALYSIS: 'info',
  NEEDS_INFO: 'warning',
  NEGOTIATED: 'primary',
  REJECTED: 'danger',
  RETURNED: 'danger',
  SENT: 'warning',
  SUBMITTED: 'neutral'
}

export function BudgetStatusPill({ status }: { status: BudgetStatus }) {
  const { t } = useTranslation('dashboard')
  return <Pill tone={budgetStatusTones[status]}>{t(`budgetPlan.status.${status}`)}</Pill>
}

export function ProposalStagePill({ stage }: { stage: ProposalStage }) {
  const { t } = useTranslation('dashboard')
  return <Pill tone={proposalStageTones[stage]}>{t(`budgetPlan.stage.${stage}`)}</Pill>
}
