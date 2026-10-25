import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItUnmatchedIdentitiesView } from './views/it-unmatched-identities-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT identity queue localization', () => {
  it('shows English detail and manual matching copy', async () => {
    await setAppLanguage('en', false)
    render(<ItUnmatchedIdentitiesView />)

    expect(screen.getByText('Match user account identities')).toBeInTheDocument()
    fireEvent.click(screen.getByText('UQ-0186'))
    expect(screen.getByText('Identity conflict requires verification')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Link AI account' }))
    expect(screen.getByText('Confirm manual AI account link')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search by employee ID/)).toBeInTheDocument()
  })
})
