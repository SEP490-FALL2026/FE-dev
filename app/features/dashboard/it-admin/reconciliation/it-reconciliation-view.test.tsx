import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItReconciliationView } from './views/it-reconciliation-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT reconciliation localization', () => {
  it('translates the workflow, filters, quantities, and departments', async () => {
    await setAppLanguage('en', false)
    render(<ItReconciliationView />)

    expect(screen.getByText('Purchase reconciliation and license discrepancies')).toBeInTheDocument()
    expect(screen.getByText('Approved demand')).toBeInTheDocument()
    expect(screen.getAllByText(/Software Engineering/).length).toBeGreaterThan(0)
    expect(screen.queryByText('Kỹ thuật phần mềm')).not.toBeInTheDocument()
  })
})
