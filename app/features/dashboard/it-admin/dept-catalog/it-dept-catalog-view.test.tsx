import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItDeptCatalogView } from './views/it-dept-catalog-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT department catalog localization', () => {
  it('shows English catalog labels and sample description', async () => {
    await setAppLanguage('en', false)
    render(<ItDeptCatalogView />)

    expect(screen.getByText('Configure requestable software catalog')).toBeInTheDocument()
    expect(screen.getAllByText('Software Engineering').length).toBeGreaterThan(0)
    expect(
      screen.getByText('Enterprise ChatGPT Plus account with GPT-4o, Canvas, and safe web browsing.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Cho phép xin')).not.toBeInTheDocument()
  })
})
