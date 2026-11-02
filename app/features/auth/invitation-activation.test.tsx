import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes, useLocation, useNavigationType } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'

import { AppProviders } from '~/providers/app-providers'
import ActivateAccountRoute from '~/routes/activate-account'
import { configureApiAuth } from '~/shared/api/axios-client'
import type { AuthRedeemInvitation200 } from '~/shared/api/generated/model/auth/authRedeemInvitation200'
import type { ErrorEnvelopeDto } from '~/shared/api/generated/model/errorEnvelopeDto'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { clearAuthSession } from './auth-session'
import { LoginPage } from './login-page'

const activated = {
  success: true,
  message: 'AUTH.ACCOUNT_ACTIVATED',
  data: { activated: true }
} satisfies AuthRedeemInvitation200
const requests: { body: unknown; authorization: string | null }[] = []
const refreshAccessToken = vi.fn(async () => 'refreshed-access-token')
let respond: () => Response | Promise<Response>
const server = setupServer(
  http.post('*/api/v1/auth/invitations/redeem', async ({ request }) => {
    requests.push({ body: await request.json(), authorization: request.headers.get('Authorization') })
    return respond()
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  clearAuthSession()
  localStorage.clear()
  sessionStorage.clear()
  localStorage.setItem('saas-sentry.language', 'vi')
  await setAppLanguage('vi', false)
  requests.length = 0
  refreshAccessToken.mockClear()
  configureApiAuth({ getAccessToken: () => 'another-account-access-token', refreshAccessToken })
  respond = () => HttpResponse.json(activated)
})
afterEach(() => {
  toast.dismiss()
  vi.useRealTimers()
  server.resetHandlers()
  configureApiAuth(null)
  window.history.replaceState(null, '', '/')
})

function LocationProbe() {
  return <output data-testid='location'>{`${useLocation().pathname}:${useNavigationType()}`}</output>
}

function openInvitation(url = '/activate-account#token=invitation-token') {
  window.history.replaceState(null, '', url)
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AppProviders>
        <Routes>
          <Route path='/activate-account' element={<ActivateAccountRoute />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
        <LocationProbe />
      </AppProviders>
    </MemoryRouter>
  )
}

function fillPasswords(password = 'new-password-123', confirmation = password) {
  fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: password } })
  fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu mới'), { target: { value: confirmation } })
}

function submitInvitation() {
  fireEvent.click(screen.getByRole('button', { name: 'Kích hoạt tài khoản' }))
}

function submitFormDirectly() {
  const form = screen.getByRole('button', { name: 'Kích hoạt tài khoản' }).closest('form')
  if (!form) throw new Error('Activation form is missing')
  fireEvent.submit(form)
}

function errorResponse(code: string, status: number, details?: Record<string, unknown>) {
  return HttpResponse.json(
    {
      success: false,
      error: { code, message: 'Do not display this backend message', requestId: 'invitation-request', details }
    } satisfies ErrorEnvelopeDto,
    { status }
  )
}

describe('employee invitation activation route', () => {
  it.each([
    ['/activate-account', 'missing'],
    ['/activate-account?token=query-token', 'query-only'],
    ['/activate-account#token=', 'empty'],
    ['/activate-account#token=%20%20', 'blank'],
    [`/activate-account#token=${'a'.repeat(257)}`, 'oversized'],
    ['/activate-account#token=first&token=second', 'ambiguous']
  ])('rejects a %s link (%s) without showing a password form or sending a request', async (url) => {
    openInvitation(url)
    expect(await screen.findByRole('alert')).toHaveTextContent('Liên kết không hợp lệ hoặc đã hết hạn.')
    expect(screen.queryByLabelText('Mật khẩu mới')).not.toBeInTheDocument()
    expect(screen.getByText('Liên hệ quản trị viên để được gửi lại lời mời kích hoạt.')).toBeInTheDocument()
    expect(requests).toHaveLength(0)
    expect(window.location.hash).toBe('')
  })

  it('accepts the maximum token length and strips the fragment without redeeming on mount', () => {
    openInvitation(`/activate-account#token=${'a'.repeat(256)}`)
    expect(screen.getByLabelText('Mật khẩu mới')).toBeInTheDocument()
    expect(window.location.hash).toBe('')
    expect(requests).toHaveLength(0)
    expect(Object.values(localStorage)).not.toContain('a'.repeat(256))
    expect(sessionStorage.length).toBe(0)
  })

  it('redeems the decoded fragment token publicly, preserves the password, and replaces the route with login', async () => {
    openInvitation('/activate-account#token=invitation%2Btoken%2Fvalue')
    fillPasswords('  new-password-123  ')
    submitInvitation()

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login:REPLACE'))
    expect(requests).toEqual([
      { body: { token: 'invitation+token/value', password: '  new-password-123  ' }, authorization: null }
    ])
    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(localStorage.getItem('saas-sentry.auth-tokens')).toBeNull()
    expect(await screen.findByText('Tài khoản đã được kích hoạt. Bạn có thể đăng nhập.')).toBeInTheDocument()
  })

  it('blocks duplicate submission while the invitation request is pending', async () => {
    let finishRequest: (response: Response) => void = () => undefined
    respond = () =>
      new Promise<Response>((resolve) => {
        finishRequest = resolve
      })
    openInvitation()
    fillPasswords()
    submitInvitation()
    await waitFor(() => expect(requests).toHaveLength(1))
    const button = screen.getByRole('button', { name: 'Kích hoạt tài khoản' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    submitFormDirectly()
    expect(requests).toHaveLength(1)
    await act(async () => finishRequest(HttpResponse.json(activated)))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login:REPLACE'))
  })

  it.each([
    ['new-password-123', 'different-password-123', 'Hai mật khẩu chưa khớp.', 'Xác nhận mật khẩu mới'],
    ['short', 'short', 'Mật khẩu mới cần từ 12 đến 128 ký tự và khác email đăng nhập.', 'Mật khẩu mới'],
    ['a'.repeat(129), 'a'.repeat(129), 'Mật khẩu mới cần từ 12 đến 128 ký tự và khác email đăng nhập.', 'Mật khẩu mới']
  ])('keeps invalid passwords local with accessible feedback (%s)', (password, confirmation, message, label) => {
    openInvitation()
    fillPasswords(password, confirmation)
    submitFormDirectly()
    expect(screen.getByRole('alert')).toHaveTextContent(message)
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(label)).toHaveAccessibleDescription(expect.stringContaining(message))
    expect(requests).toHaveLength(0)
  })

  it('replaces an unusable invitation with recovery guidance and a login option', async () => {
    respond = () => errorResponse('AUTH.INVITATION_INVALID', 400)
    openInvitation()
    fillPasswords()
    submitInvitation()
    expect(await screen.findByRole('alert')).toHaveTextContent('Liên kết không hợp lệ hoặc đã hết hạn.')
    expect(screen.queryByLabelText('Mật khẩu mới')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Quay lại đăng nhập' })).toHaveAttribute('href', '/login')
    expect(screen.getByText(/Nếu đã gửi yêu cầu kích hoạt/)).toBeInTheDocument()
    expect(refreshAccessToken).not.toHaveBeenCalled()
  })

  it.each(['SERVICE_UNAVAILABLE', 'HTTP_INTERNAL_SERVER_ERROR'])('allows only manual retry after %s', async (code) => {
    respond = () => errorResponse(code, code === 'SERVICE_UNAVAILABLE' ? 503 : 500)
    openInvitation()
    fillPasswords()
    submitInvitation()
    expect(await screen.findByText(/Chưa xác định được tài khoản đã kích hoạt hay chưa/)).toBeInTheDocument()
    expect(requests).toHaveLength(1)
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveValue('new-password-123')
    expect(screen.getByRole('button', { name: 'Kích hoạt tài khoản' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Quay lại đăng nhập' })).toHaveAttribute('href', '/login')

    respond = () => errorResponse('AUTH.INVITATION_INVALID', 400)
    submitInvitation()
    expect(await screen.findByText(/Nếu đã gửi yêu cầu kích hoạt/)).toBeInTheDocument()
    expect(requests).toHaveLength(2)
  })

  it('keeps the form and explains the uncertain outcome when the response is lost', async () => {
    respond = () => HttpResponse.error()
    openInvitation()
    fillPasswords()
    submitInvitation()
    expect(await screen.findByText(/Chưa xác định được tài khoản đã kích hoạt hay chưa/)).toBeInTheDocument()
    expect(requests).toHaveLength(1)
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveValue('new-password-123')
    expect(screen.getByTestId('location')).toHaveTextContent('/activate-account:POP')
  })

  it('marks the password when BE rejects its policy without displaying the raw error', async () => {
    respond = () => errorResponse('AUTH.PASSWORD_POLICY_VIOLATION', 422)
    openInvitation()
    fillPasswords()
    submitInvitation()
    await waitFor(() => expect(screen.getByLabelText('Mật khẩu mới')).toHaveAttribute('aria-invalid', 'true'))
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveValue('new-password-123')
    expect(screen.queryByText('Do not display this backend message')).not.toBeInTheDocument()
  })

  it('maps BE validation issues to the password field', async () => {
    respond = () => errorResponse('VALIDATION_ERROR', 422, { issues: [{ path: ['password'], message: 'Invalid' }] })
    openInvitation()
    fillPasswords()
    submitInvitation()
    await waitFor(() => expect(screen.getByLabelText('Mật khẩu mới')).toHaveAttribute('aria-invalid', 'true'))
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveValue('new-password-123')
  })

  it('never refreshes another account session after a public 401', async () => {
    respond = () => errorResponse('AUTHENTICATION_REQUIRED', 401)
    openInvitation()
    fillPasswords()
    submitInvitation()
    expect(await screen.findByText('Không thể hoàn tất yêu cầu. Vui lòng thử lại.')).toBeInTheDocument()
    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(requests).toHaveLength(1)
    expect(requests[0].authorization).toBeNull()
  })

  it('honors the rate-limit cooldown before allowing a manual retry', async () => {
    respond = () => errorResponse('HTTP_TOO_MANY_REQUESTS', 429, { retryAfterSeconds: 2 })
    openInvitation()
    fillPasswords()
    submitInvitation()
    const button = await screen.findByRole('button', { name: 'Thử lại sau 2 giây' })
    expect(button).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Kích hoạt tài khoản' })).toBeEnabled(), {
      timeout: 3500
    })
    expect(requests).toHaveLength(1)
  })

  it('renders the activation flow and uncertain outcome in English', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    respond = () => errorResponse('SERVICE_UNAVAILABLE', 503)
    openInvitation()
    expect(screen.getByRole('heading', { name: 'Activate account' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'new-password-123' } })
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'new-password-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Activate account' }))
    expect(await screen.findByText(/We could not confirm whether your account was activated/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/login')
  })
})
