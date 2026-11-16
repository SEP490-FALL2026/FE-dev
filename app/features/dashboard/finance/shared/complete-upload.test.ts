import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { completeUpload, isUploadPending } from './complete-upload'

const failure = (status: number, code: string) =>
  new AxiosError('failed', undefined, undefined, undefined, {
    config: { headers: new AxiosHeaders() } as InternalAxiosRequestConfig,
    status,
    statusText: '',
    headers: {},
    data: { success: false, error: { code } }
  })

describe('completeUpload', () => {
  it('repeats the completion while the storage has not seen the file, then succeeds', async () => {
    const complete = vi
      .fn()
      .mockRejectedValueOnce(failure(409, 'DOCUMENT.UPLOAD_PENDING'))
      .mockRejectedValueOnce(failure(409, 'BUDGET_ATTACHMENT.UPLOAD_PENDING'))
      .mockResolvedValue('done')
    await expect(completeUpload(complete, { delayMs: 0 })).resolves.toBe('done')
    expect(complete).toHaveBeenCalledTimes(3)
  })

  it('gives up after the attempts and throws the pending error', async () => {
    const complete = vi.fn().mockRejectedValue(failure(409, 'DOCUMENT.UPLOAD_PENDING'))
    await expect(completeUpload(complete, { attempts: 3, delayMs: 0 })).rejects.toSatisfy(isUploadPending)
    expect(complete).toHaveBeenCalledTimes(3)
  })

  it('does not repeat a mismatch or an expired upload: the file has to be declared again', async () => {
    const mismatch = vi.fn().mockRejectedValue(failure(422, 'DOCUMENT.UPLOAD_MISMATCH'))
    await expect(completeUpload(mismatch, { delayMs: 0 })).rejects.toBeDefined()
    expect(mismatch).toHaveBeenCalledTimes(1)
    const expired = vi.fn().mockRejectedValue(failure(409, 'BUDGET_ATTACHMENT.UPLOAD_EXPIRED'))
    await expect(completeUpload(expired, { delayMs: 0 })).rejects.toBeDefined()
    expect(expired).toHaveBeenCalledTimes(1)
  })
})
