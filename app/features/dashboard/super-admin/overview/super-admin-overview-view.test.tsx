import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { SuperAdminOverviewView } from './views/super-admin-overview-view'

describe('Super Admin overview localization', () => {
  beforeEach(async () => {
    await setAppLanguage('vi', false)
  })

  it('renders English copy and localized demo department names', async () => {
    await setAppLanguage('en', false)
    render(<SuperAdminOverviewView onSelectTab={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'System Administration Overview' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Organization metrics' })).toBeInTheDocument()
    expect(screen.getByText('IT & Engineering')).toBeInTheDocument()
    expect(screen.getAllByText('No manager assigned').length).toBeGreaterThan(0)
    expect(screen.queryByText('Chưa có Quản lý')).not.toBeInTheDocument()
  })
})
