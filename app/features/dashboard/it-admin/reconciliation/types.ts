import type {
  VendorAccountListResponseDtoDataItemsItem,
  OutOfProcessListResponseDtoDataItemsItem,
  InvoiceDiscrepancyListResponseDtoDataItemsItem
} from '~/shared/api/generated/model'

export type VendorDifference = VendorAccountListResponseDtoDataItemsItem
export type OutsideCase = OutOfProcessListResponseDtoDataItemsItem
export type InvoiceDifference = InvoiceDiscrepancyListResponseDtoDataItemsItem
export type ReconciliationQueue = 'invoices' | 'vendor' | 'outside'
export type ReconciliationAction =
  | { kind: 'vendor'; id: string; decision: 'FALSE_ALARM' | 'OUT_OF_PROCESS' }
  | { kind: 'outside'; id: string; outcome: 'FALSE_ALARM' | 'REPORT_ONLY' | 'REVOKED' }
