import { useSyncExternalStore } from 'react'

import { optimizationApprover, optimizationOpportunities, type OptimizationOpportunity } from './optimization-data'

/*
 * Session-only store shared by the Finance proposal screens and the Spending Approver decision screens,
 * so a proposal sent by Finance shows up in the approver's list in the same demo session. Nothing is
 * persisted: a reload restores the demo data until the backend provides the workflow contract.
 */

let state: OptimizationOpportunity[] = optimizationOpportunities
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => state

function update(id: string, change: (item: OptimizationOpportunity) => OptimizationOpportunity) {
  state = state.map((item) => (item.id === id ? change(item) : item))
  listeners.forEach((listener) => listener())
}

export function useOptimizationOpportunities() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function sendOptimizationToApprover(id: string, note: string) {
  update(id, (item) => ({
    ...item,
    financeNote: note || item.financeNote,
    sentAt: new Date().toISOString(),
    status: 'SENT'
  }))
}

export function decideOptimization(id: string, approved: boolean, reason?: string) {
  update(id, (item) => ({
    ...item,
    decision: { at: new Date().toISOString(), by: optimizationApprover, reason },
    status: approved ? 'APPROVED' : 'REJECTED'
  }))
}

/** Tests start every case from the demo data. */
export function resetOptimizationStore() {
  state = optimizationOpportunities
  listeners.forEach((listener) => listener())
}
