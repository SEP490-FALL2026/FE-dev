import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { deviceEnrollmentCodeCreate } from '~/shared/api/generated/operations/device-credentials/device-enrollment-code-create'
import { useEnrollmentCode } from './hooks/use-enrollment-code'

vi.mock('~/shared/api/generated/operations/device-credentials/device-enrollment-code-create', () => ({
  deviceEnrollmentCodeCreate: vi.fn()
}))
afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})
const response = {
  success: true as const,
  message: 'DEVICE.ENROLLMENT_CODE_CREATED',
  data: {
    code: 'ABCD-EFGH-IJKL',
    collectorKind: 'AI_COLLECTOR' as const,
    maxUses: 1,
    expiresAt: '2099-01-01T00:00:00Z'
  }
}

it('clears the one-time secret on blur, hidden tab, timeout and unmount', async () => {
  vi.useFakeTimers()
  vi.mocked(deviceEnrollmentCodeCreate).mockResolvedValue(response)
  const { result, unmount } = renderHook(() => useEnrollmentCode('registration-1', vi.fn(), vi.fn()))
  await act(() => result.current.create())
  expect(result.current.secret?.code).toBe('ABCD-EFGH-IJKL')
  act(() => window.dispatchEvent(new Event('blur')))
  expect(result.current.secret).toBeNull()
  await act(() => result.current.create())
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
  act(() => document.dispatchEvent(new Event('visibilitychange')))
  expect(result.current.secret).toBeNull()
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
  await act(() => result.current.create())
  act(() => vi.advanceTimersByTime(60000))
  expect(result.current.secret).toBeNull()
  unmount()
})

it('discards a delayed response after leaving the window', async () => {
  let resolve!: (value: typeof response) => void
  vi.mocked(deviceEnrollmentCodeCreate).mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  const { result } = renderHook(() => useEnrollmentCode('registration-1', vi.fn(), vi.fn()))
  let pending!: Promise<void>
  act(() => {
    pending = result.current.create()
  })
  act(() => window.dispatchEvent(new Event('blur')))
  await act(async () => {
    resolve(response)
    await pending
  })
  expect(result.current.secret).toBeNull()
})
