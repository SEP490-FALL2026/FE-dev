/** Decision steps that carry a policy checklist (flows/policies-checklist.md, QĐ-112a). */
export const POLICY_STEP = {
  NEED_REVIEW: { policyCode: 'POL-MF1', stepCode: '1.2' },
  RESERVE_CONFIRMATION: { policyCode: 'POL-MF1', stepCode: '1.6' },
  SPEND_DECISION: { policyCode: 'POL-MF1', stepCode: '1.7' },
  SOFTWARE_ASSESSMENT: { policyCode: 'POL-SAAS', stepCode: '1.3' },
  BUDGET_VERSION_DECISION: { policyCode: 'POL-MF4', stepCode: '4.7' },
  GHOST_SEAT_ESCALATION: { policyCode: 'POL-USAGE', stepCode: '5.3' },
  GHOST_SEAT_DECISION: { policyCode: 'POL-MF5', stepCode: '5.4' }
} as const

export type PolicyStep = (typeof POLICY_STEP)[keyof typeof POLICY_STEP]
