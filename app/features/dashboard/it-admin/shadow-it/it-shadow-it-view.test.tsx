import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItShadowItView } from './views/it-shadow-it-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT external software request localization', () => {
  it('shows English headings, filters, and actions', async () => {
    await setAppLanguage('en', false)
    render(<ItShadowItView />)

    expect(screen.getByText('Software requests outside the catalog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Awaiting decision' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve request' })).toBeInTheDocument()
    expect(screen.queryByText('Chờ quyết định')).not.toBeInTheDocument()
  })
})
