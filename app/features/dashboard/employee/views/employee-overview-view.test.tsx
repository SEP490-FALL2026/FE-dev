import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeOverviewView } from './employee-overview-view'

describe('EmployeeOverviewView assigned software', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('pages through all assigned software and opens details from the second page', () => {
    const onSelectTab = vi.fn()

    render(
      <EmployeeOverviewView
        displayName='Employee'
        formatCurrency={(value) => String(value)}
        formatNumber={(value) => String(value)}
        onSelectTab={onSelectTab}
      />
    )

    const table = screen.getByRole('table')
    const pagination = screen.getByRole('navigation', { name: 'Assigned software pages' })
    const previous = within(pagination).getByRole('button', { name: 'Previous' })
    const next = within(pagination).getByRole('button', { name: 'Next' })

    expect(within(table).getAllByRole('row')).toHaveLength(5)
    expect(within(table).getByText('Figma')).toBeInTheDocument()
    expect(within(table).queryByText('Microsoft 365')).not.toBeInTheDocument()
    expect(within(pagination).getByText('Page 1 of 2')).toBeInTheDocument()
    expect(previous).toBeDisabled()

    fireEvent.click(next)

    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByText('Microsoft 365')).toBeInTheDocument()
    expect(within(table).getByText('Zoom')).toBeInTheDocument()
    expect(within(table).queryByText('Figma')).not.toBeInTheDocument()
    expect(within(pagination).getByText('Page 2 of 2')).toBeInTheDocument()
    expect(next).toBeDisabled()

    fireEvent.click(within(table).getAllByRole('button', { name: 'Details' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('software-detail', { id: '5' })

    fireEvent.click(previous)
    expect(within(table).getByText('Figma')).toBeInTheDocument()
  })
})
