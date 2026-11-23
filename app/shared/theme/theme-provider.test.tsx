import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'

const THEME_STORAGE_KEY = 'saas-sentry.theme'

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.removeProperty('color-scheme')
  })

  it('uses light as the deterministic default theme', async () => {
    render(
      <AppProviders>
        <div />
      </AppProviders>
    )

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'light'))
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('restores a valid dark preference from local storage', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    render(
      <AppProviders>
        <div />
      </AppProviders>
    )

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  })

  it('falls back to light when the stored preference is invalid', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia')

    render(
      <AppProviders>
        <div />
      </AppProviders>
    )

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'light'))
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })
})
