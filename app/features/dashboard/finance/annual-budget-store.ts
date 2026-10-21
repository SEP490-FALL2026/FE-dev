import { useSyncExternalStore } from 'react'

import {
  activeFiscalYear,
  annualProposals,
  budgetAdjustments,
  budgetApprover,
  budgetExceptions,
  decisionHistory,
  financeReviewer,
  fiscalPeriods,
  groupAllocations2026,
  planningFiscalYear,
  proposalTotals,
  requestedAmount,
  type AnnualProposal,
  type BudgetAdjustment,
  type BudgetException,
  type DecisionOutcome,
  type FiscalPeriod,
  type HistoryEntry,
  type SaasGroup
} from './annual-budget-data'

/*
 * Session-only store for annual budget planning. Finance screens (FIN-40 → FIN-47) and the Spending Approver
 * screens (APV-02, APV-05 → APV-07) read and change the same state, and every decision is appended to the
 * decision history. Nothing is persisted: a reload restores the demo data until the backend provides the contract.
 */

export interface AnnualBudgetState {
  adjustments: BudgetAdjustment[]
  allocations: Record<string, Partial<Record<SaasGroup, number>>>
  exceptions: BudgetException[]
  history: HistoryEntry[]
  periods: FiscalPeriod[]
  proposals: AnnualProposal[]
}

const initialState: AnnualBudgetState = {
  adjustments: budgetAdjustments,
  allocations: groupAllocations2026,
  exceptions: budgetExceptions,
  history: decisionHistory,
  periods: fiscalPeriods,
  proposals: annualProposals
}

let state = initialState
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => state

function setState(change: (current: AnnualBudgetState) => AnnualBudgetState) {
  state = change(state)
  listeners.forEach((listener) => listener())
}

const now = () => new Date().toISOString()

function withHistory(current: AnnualBudgetState, entry: Omit<HistoryEntry, 'at' | 'id'>): HistoryEntry[] {
  return [{ ...entry, at: now(), id: `h-${current.history.length + 1}` }, ...current.history]
}

function updateProposal(id: string, change: (proposal: AnnualProposal) => AnnualProposal) {
  setState((current) => ({
    ...current,
    proposals: current.proposals.map((proposal) => (proposal.id === id ? change(proposal) : proposal))
  }))
}

function findProposal(id: string) {
  return state.proposals.find((proposal) => proposal.id === id)
}

export function useAnnualBudgetState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

// ---------------------------------------------------------------- FIN-40 proposal intake

export function requestProposalInfo(id: string, message: string) {
  const proposal = findProposal(id)
  if (!proposal) return
  setState((current) => ({
    ...current,
    history: withHistory(current, {
      actor: financeReviewer,
      costCenter: proposal.costCenter,
      kind: 'REVIEW',
      note: message,
      year: proposal.year
    }),
    proposals: current.proposals.map((item) =>
      item.id === id ? { ...item, infoRequest: { at: now(), message }, stage: 'NEEDS_INFO' } : item
    )
  }))
}

export function startProposalAnalysis(id: string) {
  updateProposal(id, (proposal) => ({ ...proposal, stage: 'IN_ANALYSIS' }))
}

// ---------------------------------------------------------------- FIN-41 review and negotiation

export function setLineFinanceAmount(proposalId: string, lineId: string, amount: number, reason: string) {
  updateProposal(proposalId, (proposal) => ({
    ...proposal,
    lines: proposal.lines.map((item) => (item.id === lineId ? { ...item, finance: { amount, reason } } : item))
  }))
}

export function setProposalBuffer(proposalId: string, rate: number) {
  updateProposal(proposalId, (proposal) => ({ ...proposal, financeBufferRate: rate }))
}

export function setProposalOtherCosts(proposalId: string, amount: number) {
  updateProposal(proposalId, (proposal) => ({ ...proposal, financeOtherCosts: amount }))
}

/** Finishes the analysis: each line cut below the request and the buffer go to the decision history. */
export function completeNegotiation(proposalId: string) {
  const proposal = findProposal(proposalId)
  if (!proposal) return
  setState((current) => {
    let history = current.history
    proposal.lines.forEach((item) => {
      if (item.finance && item.finance.amount < requestedAmount(item)) {
        history = withHistory(
          { ...current, history },
          {
            actor: financeReviewer,
            after: item.finance.amount,
            before: requestedAmount(item),
            costCenter: proposal.costCenter,
            kind: 'CUT',
            note: `${item.software}: ${item.finance.reason}`,
            year: proposal.year
          }
        )
      }
    })
    history = withHistory(
      { ...current, history },
      {
        actor: financeReviewer,
        after: proposal.financeBufferRate,
        costCenter: proposal.costCenter,
        kind: 'BUFFER',
        note: proposal.department,
        year: proposal.year
      }
    )
    return {
      ...current,
      history,
      proposals: current.proposals.map((item) => (item.id === proposalId ? { ...item, stage: 'NEGOTIATED' } : item))
    }
  })
}

// ---------------------------------------------------------------- FIN-42 department summary → APV-05

export function sendProposalsToApprover(ids: string[]) {
  setState((current) => {
    let history = current.history
    current.proposals
      .filter((proposal) => ids.includes(proposal.id))
      .forEach((proposal) => {
        history = withHistory(
          { ...current, history },
          {
            actor: financeReviewer,
            after: proposalTotals(proposal).total,
            costCenter: proposal.costCenter,
            kind: 'REVIEW',
            note: proposal.department,
            year: proposal.year
          }
        )
      })
    return {
      ...current,
      history,
      proposals: current.proposals.map((proposal) =>
        ids.includes(proposal.id)
          ? { ...proposal, sentAt: now(), stage: 'SENT', version: proposal.version + 1 }
          : proposal
      )
    }
  })
}

const stageForOutcome = { ADJUSTMENT_REQUESTED: 'RETURNED', APPROVED: 'APPROVED', REJECTED: 'REJECTED' } as const

/**
 * APV-05: approving locks the department budget version; rejecting ends that version; asking for an adjustment
 * returns it to Finance. Rejecting and asking for an adjustment need a reason (the screen enforces it).
 */
export function decideProposal(id: string, outcome: DecisionOutcome, reason?: string) {
  const proposal = findProposal(id)
  if (!proposal) return
  setState((current) => ({
    ...current,
    history: withHistory(current, {
      actor: budgetApprover,
      after: proposalTotals(proposal).total,
      costCenter: proposal.costCenter,
      kind: 'APPROVAL',
      note: reason ?? proposal.department,
      outcome,
      version: proposal.version,
      year: proposal.year
    }),
    proposals: current.proposals.map((item) =>
      item.id === id
        ? {
            ...item,
            decision: { at: now(), by: budgetApprover, outcome, reason, version: item.version },
            stage: stageForOutcome[outcome]
          }
        : item
    )
  }))
}

// ---------------------------------------------------------------- FIN-43 fiscal periods

export function updateFiscalPeriod(year: number, change: Pick<FiscalPeriod, 'end' | 'planningOpensAt' | 'start'>) {
  setState((current) => ({
    ...current,
    periods: current.periods.map((period) => (period.year === year ? { ...period, ...change } : period))
  }))
}

// ---------------------------------------------------------------- FIN-44 budget exceptions

export function resolveBudgetException(id: string, resolution: Omit<NonNullable<BudgetException['resolution']>, 'at'>) {
  const exception = state.exceptions.find((item) => item.id === id)
  if (!exception) return
  setState((current) => ({
    ...current,
    exceptions: current.exceptions.map((item) =>
      item.id === id ? { ...item, resolution: { ...resolution, at: now() } } : item
    ),
    history: withHistory(current, {
      actor: financeReviewer,
      after: resolution.topUp,
      costCenter: exception.costCenter,
      kind: 'EXCEPTION',
      note: `${exception.requestCode}: ${resolution.note}`,
      year: planningFiscalYear - 1
    })
  }))
}

// ---------------------------------------------------------------- FIN-45 allocation of the approved budget

export function setGroupAllocation(costCenter: string, group: SaasGroup, amount: number) {
  setState((current) => ({
    ...current,
    allocations: { ...current.allocations, [costCenter]: { ...current.allocations[costCenter], [group]: amount } }
  }))
}

/** An approved total is never edited in place: Finance files an adjustment that the Spending Approver decides. */
export function requestBudgetAdjustment(costCenter: string, before: number, after: number, reason: string) {
  setState((current) => ({
    ...current,
    adjustments: [
      {
        after,
        before,
        costCenter,
        id: `adj-${current.adjustments.length + 1}`,
        reason,
        requestedAt: now(),
        requestedBy: financeReviewer,
        year: activeFiscalYear
      },
      ...current.adjustments
    ],
    history: withHistory(current, {
      actor: financeReviewer,
      after,
      before,
      costCenter,
      kind: 'ADJUSTMENT',
      note: reason,
      year: planningFiscalYear - 1
    })
  }))
}

// ---------------------------------------------------------------- APV-07 exceptions and adjustments, APV-02 spend

/** The approver decides a top-up or an exception Finance submitted; a negative answer needs a reason. */
export function decideBudgetException(id: string, approved: boolean, reason?: string) {
  const exception = state.exceptions.find((item) => item.id === id)
  if (!exception) return
  setState((current) => ({
    ...current,
    exceptions: current.exceptions.map((item) =>
      item.id === id ? { ...item, approval: { approved, at: now(), by: budgetApprover, reason } } : item
    ),
    history: withHistory(current, {
      actor: budgetApprover,
      after: exception.resolution?.topUp ?? exception.amount,
      costCenter: exception.costCenter,
      kind: 'EXCEPTION_APPROVAL',
      note: [`${exception.requestCode} · ${exception.software}`, reason].filter(Boolean).join(' — '),
      outcome: approved ? 'APPROVED' : 'REJECTED',
      year: activeFiscalYear
    })
  }))
}

export function decideBudgetAdjustment(id: string, approved: boolean, reason?: string) {
  const adjustment = state.adjustments.find((item) => item.id === id)
  if (!adjustment) return
  setState((current) => ({
    ...current,
    adjustments: current.adjustments.map((item) =>
      item.id === id ? { ...item, approval: { approved, at: now(), by: budgetApprover, reason } } : item
    ),
    history: withHistory(current, {
      actor: budgetApprover,
      after: adjustment.after,
      before: adjustment.before,
      costCenter: adjustment.costCenter,
      kind: 'ADJUSTMENT_APPROVAL',
      note: reason ?? adjustment.reason,
      outcome: approved ? 'APPROVED' : 'REJECTED',
      year: adjustment.year
    })
  }))
}

/** A regular in-year SaaS spend decision (APV-02), kept apart from exception and adjustment decisions. */
export function recordSpendDecision(entry: {
  amount: number
  approved: boolean
  costCenter: string
  reason?: string
  reference: string
  software: string
}) {
  setState((current) => ({
    ...current,
    history: withHistory(current, {
      actor: budgetApprover,
      after: entry.amount,
      costCenter: entry.costCenter,
      kind: 'SPEND_APPROVAL',
      note: [`${entry.reference} · ${entry.software}`, entry.reason].filter(Boolean).join(' — '),
      outcome: entry.approved ? 'APPROVED' : 'REJECTED',
      year: activeFiscalYear
    })
  }))
}

/** Tests start every case from the demo data. */
export function resetAnnualBudgetStore() {
  state = initialState
  listeners.forEach((listener) => listener())
}
