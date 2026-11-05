import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  budgetAttachmentMineList,
  getBudgetAttachmentMineListQueryKey
} from '~/shared/api/generated/operations/budgets/budget-attachment-mine-list'
import { budgetAttachmentDiscard } from '~/shared/api/generated/operations/budgets/budget-attachment-discard'
import { getManagerError } from '../../shared/hooks/manager-errors'
import { BUDGET_ATTACHMENT_STATUS, BUDGET_ATTACHMENT_TARGET } from '../enums/attachment-status'
import { budgetAttachmentErrorCode, completeBudgetUpload, uploadBudgetFile } from './budget-file-upload'

export function useBudgetAttachments() {
  const { t: translate } = useTranslation('manager')
  const client = useQueryClient()
  const [selected, setSelected] = useState<string[]>([])
  const [uncertain, setUncertain] = useState(false)
  const [retryAt, setRetryAt] = useState(0)
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const lock = useRef(false)
  const query = useQuery({
    queryKey: [...getBudgetAttachmentMineListQueryKey(), 'proposal-form'],
    queryFn: async ({ signal }) => {
      const first = await budgetAttachmentMineList({ page: 1, pageSize: 100 }, undefined, signal)
      const items = [...(first.data?.items ?? [])]
      for (let page = 2; page <= (first.data?.pagination.totalPages ?? 0); page++) {
        const next = await budgetAttachmentMineList({ page, pageSize: 100 }, undefined, signal)
        items.push(...(next.data?.items ?? []))
      }
      return items.filter((item) => item.target === BUDGET_ATTACHMENT_TARGET.PROPOSAL)
    }
  })
  const operation = useMutation({
    retry: false,
    mutationFn: async (input: { kind: 'upload'; file: File } | { kind: 'complete' | 'discard'; id: string }) => {
      if (input.kind === 'upload') return uploadBudgetFile(input.file)
      if (input.kind === 'complete') return completeBudgetUpload(input.id)
      await budgetAttachmentDiscard(input.id)
      return input.id
    },
    onSuccess: (id, input) => {
      setSelected((previous) =>
        input.kind === 'discard' ? previous.filter((item) => item !== id) : [...new Set([...previous, id])].slice(0, 20)
      )
      toast.success(translate('saved'), { id: 'budget-file' })
    },
    onError: (error, input) => {
      const code = budgetAttachmentErrorCode(error)
      const failure = getManagerError(error, true)
      if (failure.key === 'unknownOutcome' && input.kind === 'upload') setUncertain(true)
      if (failure.key === 'rateLimit') setRetryAt(Date.now() + failure.retrySeconds * 1000)
      const key =
        code === 'BUDGET_ATTACHMENT.TOO_LARGE'
          ? 'tooLarge'
          : code === 'BUDGET_ATTACHMENT.UPLOAD_PENDING'
            ? 'retryFile'
            : code === 'BUDGET_ATTACHMENT.UPLOAD_EXPIRED' || code === 'BUDGET_ATTACHMENT.UPLOAD_MISMATCH'
              ? 'expiredFile'
              : code === 'BUDGET_ATTACHMENT.LIMIT_REACHED'
                ? 'limitFiles'
                : code === 'BUDGET_ATTACHMENT.TYPE_NOT_ALLOWED' || code === 'BUDGET_ATTACHMENT.FILE_INVALID'
                  ? 'invalidFile'
                  : 'uploadFailed'
      toast.error(
        failure.key === 'forbidden' ||
          failure.key === 'missing' ||
          failure.key === 'financeSetup' ||
          failure.key === 'rateLimit'
          ? translate(`errors.${failure.key}`)
          : translate(`budgetForm.${key}`),
        { id: 'budget-file' }
      )
    },
    onSettled: async () => {
      await client.invalidateQueries({ queryKey: getBudgetAttachmentMineListQueryKey() })
      lock.current = false
    }
  })
  const items = !query.isError ? (query.data ?? []) : []
  const ready = selected.every((id) =>
    items.some(
      (file) =>
        file.id === id && file.status === BUDGET_ATTACHMENT_STATUS.UPLOADED && new Date(file.expiresAt).getTime() > now
    )
  )
  const run: typeof operation.mutate = (input) => {
    if (lock.current || Date.now() < retryAt || (input.kind === 'upload' && uncertain)) return
    if (input.kind === 'upload' && (selected.length >= 20 || items.length >= 20)) return
    lock.current = true
    operation.mutate(input)
  }
  return {
    query,
    items,
    selected,
    setSelected,
    operation,
    run,
    uncertain,
    retryAt,
    now,
    refresh: async () => {
      const result = await query.refetch()
      if (result.isSuccess) {
        setUncertain(false)
        setSelected((previous) =>
          previous.filter((id) =>
            result.data.some((file) => file.id === id && file.status === BUDGET_ATTACHMENT_STATUS.UPLOADED)
          )
        )
      }
    },
    busy: operation.isPending,
    blocked: operation.isPending || (selected.length > 0 && (query.isFetching || !ready))
  }
}
