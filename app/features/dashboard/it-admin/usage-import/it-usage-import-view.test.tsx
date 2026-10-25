import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItUsageImportView } from './views/it-usage-import-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT purchase document localization', () => {
  it('shows the import workflow in English', async () => {
    await setAppLanguage('en', false)
    render(<ItUsageImportView />)

    expect(screen.getByText('Import invoices and purchase contracts')).toBeInTheDocument()
    expect(screen.getByText('Extracted data & plan mapping')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm document import' })).toBeInTheDocument()
    expect(screen.queryByText('Nhập hóa đơn & Hợp đồng mua sắm')).not.toBeInTheDocument()
  })
})
