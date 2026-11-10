import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import type { ReactNode } from 'react'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeBudget } from '~/shared/i18n/locales/en/finance-budget'

export const exactMoney = { amount: '9007199254740993.25', currency: 'USD' }
export const apiVersion: VersionResponseDtoDataVersion = {
  id: 'version-1',
  costCenter: { id: 'center-1', code: 'ENG', name: 'Engineering API' },
  year: 2027,
  number: 1,
  origin: 'PROPOSAL',
  baseReason: null,
  state: 'DRAFT',
  waitingReason: null,
  proposalId: 'proposal-1',
  rejectedPredecessorId: null,
  base: exactMoney,
  reserve: { amount: '0', currency: 'USD' },
  reservePercent: 0,
  reserveReason: null,
  defaultReserve: { amount: '900719925474099.325', currency: 'USD' },
  total: exactMoney,
  quarters: null,
  reason: null,
  decision: null,
  createdBy: null,
  createdAt: '2026-11-01T00:00:00Z',
  sentAt: null,
  detachedAt: null,
  neverCurrent: false,
  expiredAt: null
}
export const apiLine: VersionLinePageResponseDtoDataItemsItem = {
  position: 1,
  lineType: 'RENEW',
  zbb: null,
  priorityRank: 1,
  overCeiling: null,
  proposalPosition: 1,
  description: 'API plan line',
  planId: null,
  seats: 2,
  amount: exactMoney,
  financeComment: null,
  adjustmentReason: null
}
export const apiPage = <Item,>(items: Item[], page = 1) => ({
  items,
  pagination: { page, pageSize: 20, totalItems: 21, totalPages: 2 }
})
/** Side lists that budget screens load next to the record under test: attachments and the plan picker. */
export function budgetSideList(config: InternalAxiosRequestConfig) {
  const path = config.url?.split('?')[0] ?? ''
  if (!/\/attachments$|\/plans$/.test(path)) return undefined
  return apiResponse(config, { items: [], pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 } })
}
export function apiResponse(config: InternalAxiosRequestConfig, data: unknown) {
  return {
    config,
    data: { success: true, message: 'OK', data },
    headers: new AxiosHeaders(),
    status: 200,
    statusText: 'OK'
  }
}
export async function budgetTestLanguage() {
  i18n.addResourceBundle('en', 'financeBudget', financeBudget)
  await setAppLanguage('en', false)
}
export function renderBudget(element: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(<QueryClientProvider client={client}>{element}</QueryClientProvider>)
  return client
}
