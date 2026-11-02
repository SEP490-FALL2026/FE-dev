import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalsButton, ApprovalsPagination, ApprovalsSearch, ApprovalsStatus, ApprovalsSelect } from './approvals-ui'
import { ApprovalsQueryState } from './approvals-query-state'

const content = { approve: 'Approve', search: 'Search', searchPlaceholder: 'Enter a request ID', stale: 'Stale data' }
const selectContent = {
  label: 'Decision',
  options: [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' }
  ]
}

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
}

beforeEach(async () => {
  await setAppLanguage('en', false)
})

describe('Spending Approver shared controls', () => {
  it('does not automatically refetch a forbidden identity query into an error loop', () => {
    const client = new QueryClient()
    const error = new AxiosError('forbidden', undefined, undefined, undefined, {
      config: { headers: new AxiosHeaders() },
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      data: { error: { code: 'AUTHORIZATION.FORBIDDEN' } }
    })
    const refresh = vi.spyOn(client, 'fetchQuery').mockRejectedValue(error)
    render(
      <QueryClientProvider client={client}>
        <ApprovalsQueryState
          query={{ queryKey: getMeGetQueryKey(), isPending: false, isError: true, error, refetch: () => undefined }}
        >
          <p>{content.stale}</p>
        </ApprovalsQueryState>
      </QueryClientProvider>
    )
    expect(screen.queryByText(content.stale)).not.toBeInTheDocument()
    expect(refresh).not.toHaveBeenCalled()
  })
  it('blocks duplicate clicks while an action is pending', () => {
    const onClick = vi.fn()
    render(
      <ApprovalsButton pending onClick={onClick}>
        {content.approve}
      </ApprovalsButton>,
      { wrapper }
    )
    const button = screen.getByRole('button', { name: 'Approve' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('provides a meaningful placeholder and displays the typed search value', () => {
    function SearchHarness() {
      const [value, setValue] = useState('')
      return (
        <ApprovalsSearch
          label={content.search}
          placeholder={content.searchPlaceholder}
          value={value}
          onChange={setValue}
        />
      )
    }
    render(<SearchHarness />, { wrapper })
    const input = screen.getByPlaceholderText('Enter a request ID')
    expect(input).toHaveValue('')
    fireEvent.change(input, { target: { value: 'REQ-123' } })
    expect(input).toHaveValue('REQ-123')
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBe(input)
  })

  it('disables page boundaries and requests the next server page', () => {
    const onPageChange = vi.fn()
    render(
      <ApprovalsPagination
        pagination={{ page: 1, pageSize: 20, totalItems: 30, totalPages: 2 }}
        onPageChange={onPageChange}
      />,
      { wrapper }
    )
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('renders unknown server statuses safely', () => {
    render(<ApprovalsStatus value='FUTURE_SERVER_STATUS' />, { wrapper })
    expect(screen.getByText('Unknown status')).toBeInTheDocument()
    expect(screen.queryByText('FUTURE_SERVER_STATUS')).not.toBeInTheDocument()
  })

  it('supports keyboard selection without committing an escaped choice', () => {
    function SelectHarness() {
      const [value, setValue] = useState('approve')
      return (
        <ApprovalsSelect
          label={selectContent.label}
          value={value}
          options={selectContent.options}
          onChange={setValue}
        />
      )
    }
    render(<SelectHarness />, { wrapper })
    const trigger = screen.getByRole('combobox', { name: selectContent.label })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(trigger).toHaveTextContent('Approve')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'End' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(trigger).toHaveTextContent('Reject')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes its options when a pointer interaction leaves the selector', () => {
    render(
      <ApprovalsSelect
        label={selectContent.label}
        value='approve'
        options={selectContent.options}
        onChange={() => undefined}
      />,
      { wrapper }
    )
    fireEvent.click(screen.getByRole('combobox', { name: selectContent.label }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('hides stale content when loading fails and provides a working retry', () => {
    const refetch = vi.fn()
    render(
      <ApprovalsQueryState query={{ isPending: false, isError: true, error: new Error('private'), refetch }}>
        <p>{content.stale}</p>
      </ApprovalsQueryState>,
      { wrapper }
    )
    expect(screen.queryByText('Stale data')).not.toBeInTheDocument()
    expect(screen.queryByText('private')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalledOnce()
  })
})
