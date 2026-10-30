import { AxiosError, AxiosHeaders } from 'axios'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { clearAuthSession } from './auth-session'
import { LoginPage } from './login-page'

function renderLoginPage(url = '/login') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AppProviders>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard/employee' element={<output data-testid='employee-workspace' />} />
        </Routes>
      </AppProviders>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  const previousAdapter = apiClient.defaults.adapter

  beforeEach(async () => {
    clearAuthSession()
    sessionStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
    toast.dismiss()
  })

  it('shows an accessible real sign-in form without demo credentials', () => {
    renderLoginPage()
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'username')
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('autocomplete', 'current-password')
    expect(screen.getByRole('link', { name: 'Quên mật khẩu?' })).toHaveAttribute('href', '/forgot-password')
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).not.toContain('/')
    expect(screen.queryByText('Demo@123')).not.toBeInTheDocument()
  })

  it('signs in through the API and opens the effective role workspace', async () => {
    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me')
        ? {
            success: true,
            message: 'ME.RETRIEVED',
            data: {
              appUserId: 'u1',
              loginEmail: 'person@example.com',
              employee: { id: 'e1', employeeCode: '001', fullName: 'Person', department: null, jobTitle: null },
              roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
              selfServiceOnly: false
            }
          }
        : {
            success: true,
            message: 'AUTH.LOGGED_IN',
            data: {
              accessToken: 'access',
              refreshToken: 'refresh',
              tokenType: 'Bearer',
              expiresAt: new Date(Date.now() + 600_000).toISOString(),
              refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString()
            }
          },
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })
    renderLoginPage('/login?redirectTo=%2Fdashboard%2Femployee')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    expect(await screen.findByTestId('employee-workspace')).toBeInTheDocument()
    const notification = await screen.findByText('Đăng nhập thành công.')
    expect(notification.closest('[data-sonner-toast]')).not.toBeNull()
  })

  it('toggles password visibility', () => {
    renderLoginPage()
    const password = screen.getByLabelText('Mật khẩu')
    fireEvent.click(screen.getByRole('button', { name: 'Hiện mật khẩu' }))
    expect(password).toHaveAttribute('type', 'text')
  })

  it('reports invalid credentials in a dismissible toast outside the form', async () => {
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        data: { error: { code: 'AUTH.INVALID_CREDENTIALS', requestId: 'request-123' } },
        headers: new AxiosHeaders(),
        status: 401,
        statusText: 'Unauthorized'
      })
    }
    renderLoginPage()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'incorrect' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    const message = await screen.findByText('Email hoặc mật khẩu không đúng.')
    expect(message.closest('[data-sonner-toast]')).not.toBeNull()
    expect(message.closest('form')).toBeNull()
    expect(screen.getByText('Mã yêu cầu: request-123')).toBeInTheDocument()
    expect(screen.getByLabelText('Mật khẩu')).toHaveValue('incorrect')
    fireEvent.click(screen.getByRole('button', { name: 'Đóng thông báo' }))
    await waitFor(() => expect(screen.queryByText('Email hoặc mật khẩu không đúng.')).not.toBeInTheDocument())
  })

  it('keeps the retry countdown on the disabled submit button after a rate limit', async () => {
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Too many requests', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        data: { error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
        headers: new AxiosHeaders({ 'retry-after': '30' }),
        status: 429,
        statusText: 'Too Many Requests'
      })
    }
    renderLoginPage()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    expect(await screen.findByRole('button', { name: /Thử lại sau \d+ giây/ })).toBeDisabled()
    const message = await screen.findByText(/Bạn đã thử quá nhiều lần. Vui lòng thử lại sau \d+ giây./)
    expect(message.closest('[data-sonner-toast]')).not.toBeNull()
  })
})
