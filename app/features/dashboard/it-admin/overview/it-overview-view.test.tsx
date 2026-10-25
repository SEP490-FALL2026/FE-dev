import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItOverviewView } from './views/it-overview-view'

describe('IT Admin overview localization', () => {
  it('shows operational queues and chart labels in English', async () => {
    await setAppLanguage('en', false)
    render(
      <ItOverviewView
        formatCompact={String}
        formatCurrency={String}
        formatMonth={String}
        formatNumber={String}
        onSelectTab={vi.fn()}
      />
    )

    expect(screen.getByRole('region', { name: 'IT operations queues' })).toBeInTheDocument()
    expect(screen.getByText('Ready to provision')).toBeInTheDocument()
    expect(screen.getByText('Software and AI license cost trend')).toBeInTheDocument()
    expect(screen.queryByText('Hàng đợi tác vụ')).not.toBeInTheDocument()
  })
})
