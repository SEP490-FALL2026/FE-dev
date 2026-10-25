import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ManagerAnnualBudgetView } from './views/manager-annual-budget-view'

describe('Manager annual budget proposal', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('places documents before the summary and requires a full date before recording a local preview', () => {
    render(<ManagerAnnualBudgetView />)

    expect(screen.getByRole('heading', { name: 'Next year budget proposal' })).toBeInTheDocument()
    expect(screen.getByText('Product & Design')).toBeInTheDocument()
    expect(screen.queryByText('CC-PRODUCT-01')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Expected software needs' })).not.toBeInTheDocument()
    expect(screen.queryByText('Requested seats')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Budget year')).not.toBeInTheDocument()
    expect(screen.queryByText('Budget year')).not.toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings.indexOf('Staff documents')).toBeLessThan(headings.indexOf('Proposal summary'))

    const submit = screen.getByRole('button', { name: 'Send proposal to Finance' })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Choose supporting files'), {
      target: { files: [new File(['sample'], 'design-plan.pdf', { type: 'application/pdf' })] }
    })
    expect(screen.getByText('design-plan.pdf')).toBeInTheDocument()
    expect(submit).toBeDisabled()

    const nextYear = new Date().getFullYear() + 1
    const date = screen.getByLabelText('Budget period start date')
    expect(date).not.toHaveAttribute('min')
    expect(date).not.toHaveAttribute('max')
    fireEvent.change(date, { target: { value: `${nextYear}-04-15` } })
    expect(screen.getByText(`04/15/${nextYear}`)).toBeInTheDocument()
    expect(submit).toBeEnabled()
    fireEvent.click(submit)
    expect(screen.getByText(/No files or proposal were uploaded or sent/)).toBeInTheDocument()
    expect(submit).toBeDisabled()

    fireEvent.change(date, { target: { value: '' } })
    expect(screen.queryByText(/No files or proposal were uploaded or sent/)).not.toBeInTheDocument()
    expect(submit).toBeDisabled()
    fireEvent.change(date, { target: { value: `${nextYear + 1}-05-20` } })
    expect(submit).toBeEnabled()
  })
})
