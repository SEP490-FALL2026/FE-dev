import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { budgetFileType, completeBudgetUpload, uploadBudgetFile } from './hooks/budget-file-upload'

const api = vi.hoisted(() => ({ declare: vi.fn(), complete: vi.fn() }))
vi.mock('~/shared/api/generated/operations/budgets/budget-proposal-attachment-declare', () => ({
  budgetProposalAttachmentDeclare: api.declare
}))
vi.mock('~/shared/api/generated/operations/budgets/budget-attachment-complete', () => ({
  budgetAttachmentComplete: api.complete
}))
function failure(code: string, status = 409) {
  return new AxiosError(code, undefined, undefined, undefined, {
    data: { error: { code } },
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() }
  })
}
beforeEach(() => {
  api.declare.mockReset()
  api.complete.mockReset()
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
it('retries completion only for UPLOAD_PENDING and stops after the bounded wait', async () => {
  vi.useFakeTimers()
  api.complete
    .mockRejectedValueOnce(failure('BUDGET_ATTACHMENT.UPLOAD_PENDING'))
    .mockResolvedValue({ data: { attachment: { status: 'UPLOADED' } } })
  const result = completeBudgetUpload('id')
  await vi.advanceTimersByTimeAsync(1500)
  await expect(result).resolves.toBe('id')
  expect(api.complete).toHaveBeenCalledTimes(2)
})
it.each(['BUDGET_ATTACHMENT.UPLOAD_EXPIRED', 'BUDGET_ATTACHMENT.UPLOAD_MISMATCH', 'SERVICE_UNAVAILABLE'])(
  'does not repeat completion for %s',
  async (code) => {
    api.complete.mockRejectedValue(failure(code, code === 'SERVICE_UNAVAILABLE' ? 503 : 409))
    await expect(completeBudgetUpload('id')).rejects.toThrow(code)
    expect(api.complete).toHaveBeenCalledOnce()
  }
)
it('never repeats a declaration after a response with an uncertain outcome', async () => {
  api.declare.mockRejectedValue(failure('SERVICE_UNAVAILABLE', 503))
  await expect(uploadBudgetFile(new File(['test'], 'budget.pdf'))).rejects.toThrow('SERVICE_UNAVAILABLE')
  expect(api.declare).toHaveBeenCalledOnce()
  expect(api.complete).not.toHaveBeenCalled()
})
it('rejects empty files, unsupported types and path-like names before declaring', async () => {
  expect(budgetFileType(new File([], 'empty.pdf'))).toBeNull()
  expect(budgetFileType(new File(['test'], 'budget.exe'))).toBeNull()
  expect(budgetFileType(new File(['test'], '../budget.pdf'))).toBeNull()
  expect(budgetFileType(new File(['test'], 'budget.xlsx'))).toBe(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  await expect(uploadBudgetFile(new File(['test'], 'budget.exe'))).rejects.toThrow('INVALID_BUDGET_FILE')
  expect(api.declare).not.toHaveBeenCalled()
})
