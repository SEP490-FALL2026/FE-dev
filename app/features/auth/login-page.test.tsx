import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { demoAccounts } from './demo-accounts'
import { LoginPage } from './login-page'

function LocationProbe() {
  const location = useLocation()

  return <output data-testid='location'>{location.pathname}</output>
}

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AppProviders>
        <LoginPage />
        <LocationProbe />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    document.documentElement.removeAttribute('data-theme')
    await setAppLanguage('vi', false)
  })

  it('presents accessible login fields and all six BRD demo accounts', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { name: 'Đăng nhập vào SaaS-Sentry' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'username')
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('autocomplete', 'current-password')

    for (const account of demoAccounts) {
      expect(screen.getByText(account.email)).toBeInTheDocument()
    }

    expect(screen.getAllByRole('button', { name: /Dùng tài khoản/ })).toHaveLength(6)
  })

  it('fills the form from a selected demo account', () => {
    renderLoginPage()

    fireEvent.click(screen.getByRole('button', { name: /Dùng tài khoản Finance/ }))

    expect(screen.getByLabelText('Email')).toHaveValue('finance@saas-sentry.test')
    expect(screen.getByLabelText('Mật khẩu')).toHaveValue('Demo@123')
  })

  it.each(demoAccounts)('routes $role credentials to the matching dashboard', (account) => {
    renderLoginPage()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: account.email } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: account.password } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    expect(screen.getByTestId('location')).toHaveTextContent(`/dashboard/${account.role}`)
  })

  it('announces invalid credentials without navigating', () => {
    renderLoginPage()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'unknown@example.com' } })
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Email hoặc mật khẩu demo không đúng.')
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })

  it('toggles password visibility and exposes global display controls', () => {
    renderLoginPage()

    const passwordInput = screen.getByLabelText('Mật khẩu')
    fireEvent.click(screen.getByRole('button', { name: 'Hiện mật khẩu' }))

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ẩn mật khẩu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện tối' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
  })
})
