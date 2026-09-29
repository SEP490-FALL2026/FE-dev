import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { TeamRequestsPage } from './team-requests-page'

function CurrentLocation() {
  const location = useLocation()
  return <output data-testid='location'>{location.search}</output>
}

function showRequests(url = '/manager/team-requests') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <TeamRequestsPage />
      <CurrentLocation />
    </MemoryRouter>
  )
}

describe('Manager Team Requests', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('combines accent-insensitive search, type and software filters, and resets empty results', () => {
    showRequests()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(7)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nguyen thuy' } })
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1034')
    expect(screen.getByRole('table')).not.toHaveTextContent('REQ-1024')
    fireEvent.change(screen.getByRole('combobox', { name: 'Request Type' }), { target: { value: 'renewal' } })
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1034')
    fireEvent.change(screen.getByRole('combobox', { name: 'Software' }), { target: { value: 'Figma' } })
    expect(screen.getByText('No requests found')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset' })[0])
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(7)
    expect(screen.getByTestId('location')).toBeEmptyDOMElement()
  })

  it('filters by a summary status and shows an honest empty approved sample', () => {
    showRequests()
    fireEvent.click(screen.getByRole('button', { name: 'View all In Progress requests' }))
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1033')
    expect(screen.getByRole('table')).not.toHaveTextContent('REQ-1024')
    expect(screen.getByTestId('location')).toHaveTextContent('status=inProgress')
    fireEvent.click(screen.getByRole('button', { name: 'View all Approved requests' }))
    expect(screen.getByText('No requests found')).toBeInTheDocument()
    expect(screen.getByText('Showing 0 to 0 of 0 requests')).toBeInTheDocument()
  })

  it('sorts IDs, paginates supplied records, and resets the page when a filter changes', () => {
    showRequests('/manager/team-requests?size=3&page=2')
    expect(screen.getByRole('table')).not.toHaveTextContent('REQ-1024')
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1034')
    fireEvent.click(screen.getByRole('button', { name: 'Request ID' }))
    expect(screen.getByRole('columnheader', { name: 'Request ID' })).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('table')).not.toHaveTextContent('REQ-1024')
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1024')
    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'overdue' } })
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1034')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('validates date ranges and normalizes malformed URL dates without crashing', () => {
    showRequests('/manager/team-requests?from=2026-02-31&to=bad')
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1024')
    fireEvent.click(screen.getByRole('button', { name: 'Submitted Date' }))
    fireEvent.change(screen.getByLabelText('From date'), { target: { value: '2026-09-01' } })
    expect(screen.getByRole('alert')).toHaveTextContent('The end date must be on or after the start date.')
    expect(screen.getByText('No requests found')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-09-30' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('No requests found')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset' })[0])
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1024')
  })

  it('links the selected request to approval detail with the list state', () => {
    showRequests('/manager/team-requests?size=3&page=2')
    expect(screen.getByRole('link', { name: 'Review REQ-1034' })).toHaveAttribute(
      'href',
      '/manager/team-requests/REQ-1034?size=3&page=2'
    )
    expect(screen.getByRole('link', { name: 'REQ-1034' })).toHaveAttribute(
      'href',
      '/manager/team-requests/REQ-1034?size=3&page=2'
    )
  })

  it('localizes the page and dates', async () => {
    await setAppLanguage('vi', false)
    showRequests()
    expect(screen.getByRole('heading', { level: 1, name: 'Yêu cầu của nhóm' })).toBeInTheDocument()
    expect(document.title).toBe('Yêu cầu của nhóm | SaaS-Sentry')
    expect(screen.getByRole('table')).toHaveTextContent(
      new Intl.DateTimeFormat('vi', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      }).format(new Date('2026-08-23T09:15:00+07:00'))
    )
  })
})
