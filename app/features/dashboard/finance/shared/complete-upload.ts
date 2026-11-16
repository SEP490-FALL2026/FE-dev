import { isAxiosError } from 'axios'

const PENDING_CODES = ['BUDGET_ATTACHMENT.UPLOAD_PENDING', 'DOCUMENT.UPLOAD_PENDING']

/** The storage had not seen the file yet when the upload was completed. The API calls this safe to repeat after a few seconds. */
export function isUploadPending(error: unknown): boolean {
  if (!isAxiosError(error)) return false
  const body = error.response?.data as { error?: { code?: string } } | undefined
  return error.response?.status === 409 && PENDING_CODES.includes(body?.error?.code ?? '')
}

/** Calls `complete`, repeating it while the API answers UPLOAD_PENDING (a safe repeat); any other failure is thrown at once. */
export async function completeUpload<Result>(
  complete: () => Promise<Result>,
  { attempts = 4, delayMs = 1500 }: { attempts?: number; delayMs?: number } = {}
): Promise<Result> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await complete()
    } catch (error) {
      if (!isUploadPending(error) || attempt >= attempts) throw error
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}
