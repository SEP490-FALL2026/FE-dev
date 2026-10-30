import { AxiosError, AxiosHeaders } from 'axios'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { toast } from 'sonner'

import { AppProviders } from '~/providers/app-providers'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { clearAuthSession } from './auth-session'
import { AuthActionPage } from './auth-action-page'

describe('auth action pages', () => {
  const previousAdapter = apiClient.defaults.adapter

  beforeEach(async () => {
    clearAuthSession()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  afterEach(() => {
    toast.dismiss()
    apiClient.defaults.adapter = previousAdapter
    window.history.replaceState(null, '', '/')
  })

  it('requests a reset without revealing whether the email exists', async () => {
    const requests: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url ?? '')
      return {
        config,
        data: { success: true, message: 'AUTH.PASSWORD_RESET_REQUESTED', data: { requested: true } },
        headers: new AxiosHeaders(),
        status: 202,
        statusText: 'Accepted'
      }
    }
    render(
      <MemoryRouter>
        <AppProviders>
          <AuthActionPage action='forgot' />
        </AppProviders>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi hướng dẫn' }))

    const notification = await screen.findByText('Nếu email hợp lệ, bạn sẽ nhận được thư hướng dẫn.')
    expect(notification.closest('[data-sonner-toast]')).not.toBeNull()
    expect(requests[0]).toMatch(/\/api\/v1\/auth\/password-reset-requests$/)
  })

  it('reads the reset token from the URL fragment and removes it from browser history', async () => {
    window.history.replaceState(null, '', '/reset-password#token=one-time-token')
    let body: unknown
    apiClient.defaults.adapter = async (config) => {
      body = JSON.parse(config.data as string)
      return {
        config,
        data: { success: true, message: 'AUTH.PASSWORD_RESET', data: { passwordReset: true } },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }
    render(
      <MemoryRouter>
        <AppProviders>
          <AuthActionPage action='reset' />
        </AppProviders>
      </MemoryRouter>
    )
    expect(window.location.hash).toBe('')

    fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }))

    expect(
      await screen.findByText('Mật khẩu đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.')
    ).toBeInTheDocument()
    expect(body).toEqual({ token: 'one-time-token', newPassword: 'new-password-123' })
  })

  it('replaces an expired reset form with a persistent recovery action', async () => {
    window.history.replaceState(null, '', '/reset-password#token=expired-token')
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Invalid token', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        data: { error: { code: 'AUTH.PASSWORD_RESET_INVALID' } },
        headers: new AxiosHeaders(),
        status: 400,
        statusText: 'Bad Request'
      })
    }
    render(
      <MemoryRouter>
        <AppProviders>
          <AuthActionPage action='reset' />
        </AppProviders>
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }))

    expect(await screen.findByRole('link', { name: 'Yêu cầu liên kết mới' })).toHaveAttribute(
      'href',
      '/forgot-password'
    )
    expect(screen.queryByLabelText('Mật khẩu mới')).not.toBeInTheDocument()
    expect(screen.getByText('Liên kết không hợp lệ hoặc đã hết hạn.').closest('[data-sonner-toast]')).toBeNull()
  })

  it('replaces an expired invitation form with administrator guidance', async () => {
    window.history.replaceState(null, '', '/activate-account#token=expired-invitation')
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Invalid invitation', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        data: { error: { code: 'AUTH.INVITATION_INVALID' } },
        headers: new AxiosHeaders(),
        status: 400,
        statusText: 'Bad Request'
      })
    }
    render(
      <MemoryRouter>
        <AppProviders>
          <AuthActionPage action='activate' />
        </AppProviders>
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu mới'), { target: { value: 'new-password-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Kích hoạt tài khoản' }))

    expect(await screen.findByText('Liên hệ quản trị viên để được gửi lại lời mời kích hoạt.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Mật khẩu mới')).not.toBeInTheDocument()
    expect(screen.getByText('Liên kết không hợp lệ hoặc đã hết hạn.').closest('[data-sonner-toast]')).toBeNull()
  })
})
