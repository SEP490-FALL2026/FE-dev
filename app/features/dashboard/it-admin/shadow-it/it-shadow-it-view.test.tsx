import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItShadowItView } from './views/it-shadow-it-view'
const calls = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-assessment-get', () => ({
  useAccessRequestAssessmentGet: (id: string) => {
    calls.get(id)
    return { isPending: false, isError: false, data: { data: null }, refetch: vi.fn() }
  }
}))
vi.mock('~/shared/api/generated/operations/me/me-get', () => ({
  useMeGet: () => ({ data: { data: { roles: { effective: [] } } } })
}))
afterEach(async () => setAppLanguage('vi', false))
describe('external software assessment lookup', () => {
  it('states missing queue capability and fetches only an explicit request', async () => {
    await setAppLanguage('en', false)
    render(<ItShadowItView />)
    expect(screen.getByText(/API snapshot does not provide an assessment queue/)).toBeInTheDocument()
    expect(calls.get).not.toHaveBeenCalled()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '12345678-1234-1234-1234-123456789012' } })
    fireEvent.submit(screen.getByRole('textbox').closest('form')!)
    expect(calls.get).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012')
    expect(screen.queryByRole('button', { name: 'Approve request' })).not.toBeInTheDocument()
  })
})
