import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { HomePage } from './home-page'

function renderHomePage() {
  return render(
    <MemoryRouter>
      <AppProviders>
        <HomePage />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('HomePage', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    document.documentElement.removeAttribute('data-theme')
    await setAppLanguage('vi', false)
  })

  it('renders the Vietnamese landing experience from translation resources', () => {
    renderHomePage()

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('SaaS-Sentry')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /quyết định SaaS/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Đăng ký' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Đã mua')).not.toHaveLength(0)
    expect(screen.getAllByText('Đã cấp')).not.toHaveLength(0)
    expect(screen.getAllByText('Có dùng')).not.toHaveLength(0)
    expect(screen.getAllByText('Còn cần')).not.toHaveLength(0)
  })

  it('switches every mapped label to English', async () => {
    renderHomePage()

    fireEvent.click(screen.getByRole('button', { name: 'Chuyển sang Tiếng Anh' }))

    expect(await screen.findByRole('heading', { level: 1, name: /SaaS decisions/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Purchased')).not.toHaveLength(0)
    expect(screen.getAllByText('Assigned')).not.toHaveLength(0)
    expect(screen.getAllByText('Used')).not.toHaveLength(0)
    expect(screen.getAllByText('Still needed')).not.toHaveLength(0)
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('switches from the default light theme to dark and persists it', async () => {
    renderHomePage()

    const switchButton = await screen.findByRole('button', { name: 'Chuyển sang giao diện tối' })
    fireEvent.click(switchButton)

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem('saas-sentry.theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện sáng' })).toBeInTheDocument()
  })

  it('keeps the header independent from the body and controls stable across locales', () => {
    renderHomePage()

    const header = screen.getByRole('banner')
    const main = screen.getByRole('main')
    const hero = main.querySelector('section')
    const languageSelector = screen.getByRole('group', { name: 'Ngôn ngữ' })

    expect(header).toHaveClass('px-5')
    expect(header).not.toHaveClass('max-w-7xl', 'mx-auto')
    expect(main).toHaveClass('max-w-7xl', 'mx-auto')
    expect(hero).toHaveClass('max-w-[calc(100vw-2.5rem)]')
    expect(languageSelector).toHaveClass('w-[4.75rem]')
    within(languageSelector)
      .getAllByRole('button')
      .forEach((button) => expect(button).toHaveClass('w-1/2'))
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveClass('w-[5.75rem]')
  })
})
