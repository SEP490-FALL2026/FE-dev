import { useQuery } from '@tanstack/react-query'
import {
  getSpendBatchList,
  getSpendBatchListQueryKey,
  type SpendBatchListParams
} from '../../shared/finance-api-extensions'
import {
  spendBatchGet,
  getSpendBatchGetQueryKey
} from '~/shared/api/generated/operations/spend-submission/spend-batch-get'
import {
  spendBatchItemList,
  getSpendBatchItemListQueryKey
} from '~/shared/api/generated/operations/spend-submission/spend-batch-item-list'

export function useSpendBatchList(params?: SpendBatchListParams) {
  return useQuery({
    queryKey: getSpendBatchListQueryKey(params),
    queryFn: async ({ signal }) => {
      const response = await getSpendBatchList(params, signal)
      return response.data
    }
  })
}

export function useSpendBatchGet(batchId: string | undefined) {
  return useQuery({
    queryKey: batchId ? getSpendBatchGetQueryKey(batchId) : ['spend-batch-get-disabled'],
    enabled: Boolean(batchId),
    queryFn: async ({ signal }) => {
      if (!batchId) throw new Error('batchId is required')
      const response = await spendBatchGet(batchId, undefined, signal)
      return response.data?.batch
    }
  })
}

export function useSpendBatchItemList(batchId: string | undefined, params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: batchId ? getSpendBatchItemListQueryKey(batchId, params) : ['spend-batch-items-disabled'],
    enabled: Boolean(batchId),
    queryFn: async ({ signal }) => {
      if (!batchId) throw new Error('batchId is required')
      const response = await spendBatchItemList(batchId, params, undefined, signal)
      return response.data
    }
  })
}

