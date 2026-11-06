import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import type { ReactNode } from 'react'
import type { ProposalLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-proposals/proposalLinePageResponseDtoDataItemsItem'
import type { ProposalResponseDtoDataProposal } from '~/shared/api/generated/model/budget-proposals/proposalResponseDtoDataProposal'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeBudget } from '~/shared/i18n/locales/en/finance-budget'
import { defaultReserveOf } from './components/budget-version-form'

/** Responses carry a currency; request bodies send `{ amount }` only. */
export const exactMoney = { amount: '9007199254740993.25', currency: 'USD' }
/** The default reserve (10% of the base) that the version form compares a typed reserve against. */
export const defaultReserve = { amount: defaultReserveOf(exactMoney.amount), currency: 'USD' }
const costCenter = { id: 'center-1', code: 'ENG', name: 'Engineering API' }
export const apiProposal: ProposalResponseDtoDataProposal = {
  id: 'proposal-1',
  costCenter,
  year: 2027,
  state: 'SUBMITTED',
  previousProposalId: null,
  successorOfProposalId: null,
  successorProposalId: null,
  total: exactMoney,
  submittedBy: null,
  submittedAt: '2026-11-01T00:00:00Z',
  returned: null,
  withdrawnAt: null,
  succeededAt: null,
  closedAt: null
}
export const apiProposalLine: ProposalLinePageResponseDtoDataItemsItem = {
  position: 1,
  description: 'API plan line',
  planId: null,
  seats: 2,
  amount: exactMoney,
  note: null
}
export const apiVersion: VersionResponseDtoDataVersion = {
  id: 'version-1',
  costCenter,
  year: 2027,
  number: 1,
  kind: 'INITIAL',
  state: 'DRAFT',
  waitingReason: null,
  proposalId: 'proposal-1',
  rejectedPredecessorId: null,
  base: exactMoney,
  reserve: defaultReserve,
  total: exactMoney,
  reservePercent: 10,
  defaultReserve,
  reserveReason: null,
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
/** The first non-GET request whose path ends with `suffix`, and its parsed JSON body. */
export function writeTo(requests: InternalAxiosRequestConfig[], suffix: string) {
  const request = requests.find((item) => item.method !== 'get' && item.url?.split('?')[0].endsWith(suffix))
  if (!request) return undefined
  return { request, body: typeof request.data === 'string' ? JSON.parse(request.data) : request.data }
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
