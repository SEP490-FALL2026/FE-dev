import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItOptimizationView } from './views/it-optimization-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT license optimization localization', () => {
  it('translates alert labels and evidence in English', async () => {
    await setAppLanguage('en', false)
    render(<ItOptimizationView />)

    expect(screen.getByText('Cost optimization and license revocation alerts')).toBeInTheDocument()
    expect(screen.getByText('Fewer than 3 active sessions in 30 days (system threshold)')).toBeInTheDocument()
    expect(screen.getAllByText(/Software Engineering/).length).toBeGreaterThan(0)
    expect(screen.queryByText('Ít sử dụng')).not.toBeInTheDocument()
  })
})
