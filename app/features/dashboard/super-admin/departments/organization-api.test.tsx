import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminDepartmentsView } from './views/super-admin-departments-view'
import { MemoryRouter } from 'react-router'

describe('Organization API integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; params: unknown; body: unknown }[] = []
  beforeEach(async () => {
    requests.length = 0
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push({
        url: config.url,
        method: config.method,
        params: config.params,
        body: config.data ? JSON.parse(config.data) : undefined
      })
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {
          success: true,
          message: 'OK',
          data: {
            items: [],
            pagination: { page: config.params?.page ?? 1, pageSize: 20, totalItems: 40, totalPages: 2 }
          }
        }
      }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <SuperAdminDepartmentsView />
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
  it('requests server pages and resets pagination when search changes', async () => {
    mount()
    await waitFor(() => expect(requests.length).toBeGreaterThan(0))
    expect(screen.getByLabelText('Search departments')).toHaveAttribute(
      'placeholder',
      'Enter a department name or code'
    )
    fireEvent.click(await screen.findByRole('button', { name: /next/i }))
    await waitFor(() => expect(requests.some((r) => (r.params as { page?: number })?.page === 2)).toBe(true))
    fireEvent.change(screen.getByLabelText('Search departments'), { target: { value: 'Engineering' } })
    expect(screen.getByPlaceholderText('Enter a department name or code')).toHaveValue('Engineering')
    await waitFor(() =>
      expect(
        requests.some(
          (r) =>
            (r.params as { search?: string; page?: number })?.search === 'Engineering' &&
            (r.params as { page?: number }).page === 1
        )
      ).toBe(true)
    )
  })
  it('sends only department fields and a complete HR basis, then reloads the list', async () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Create department' }))
    fireEvent.change(screen.getByLabelText('Department code'), { target: { value: 'ENG' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Engineering' } })
    fireEvent.change(screen.getByLabelText('Document type'), { target: { value: 'Decision' } })
    fireEvent.change(screen.getByLabelText('Reference'), { target: { value: 'HR-42' } })
    fireEvent.change(screen.getByLabelText('Issuer'), { target: { value: 'HR' } })
    fireEvent.change(screen.getByLabelText('Issued on'), { target: { value: '2026-10-30' } })
    fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)
    await waitFor(() => expect(requests.some((r) => r.method === 'post')).toBe(true))
    expect(requests.find((r) => r.method === 'post')?.body).toEqual({
      code: 'ENG',
      name: 'Engineering',
      function: null,
      itAdminEmployeeId: null,
      hrBasis: { type: 'Decision', reference: 'HR-42', issuer: 'HR', issuedOn: '2026-10-30' }
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(requests.filter((r) => r.method === 'get' && r.url?.endsWith('/departments')).length).toBeGreaterThan(1)
    expect(i18n.language).toBe('en')
  })
})
