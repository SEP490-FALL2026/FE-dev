import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { PolicyAcknowledgementGate } from './policy-acknowledgement-gate'

const policyBody = (code: string, title: string) => ({
  id: `${code}-id`,
  code,
  title,
  versionNumber: 1,
  isCurrent: true,
  publishedAt: '2026-11-01T00:00:00Z',
  changeNote: '',
  publishedByAppUserId: null,
  requiresReacknowledgement: true,
  applicableRoles: ['FINANCE'],
  content: {
    sections: [
      { heading: 'Scope', body: `Body of ${title}` },
      { heading: 'Rules', body: '1. **First rule** with [a link](https://example.test/p)\n2. Second rule' }
    ],
    steps: [
      {
        code: '4.7',
        title: 'Decide the budget version',
        checklist: [
          { code: '4.7-01', text: 'The ceiling holds', check: 'SYSTEM' },
          { code: '4.7-02', text: 'The files were read', check: 'PERSON' }
        ]
      }
    ]
  },
  myAcknowledgement: null
})

describe('PolicyAcknowledgementGate', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let pending: { code: string; title: string; versionNumber: number }[] = []
  let meFails = false
  let ackError: { status: number; code: string } | null = null

  const reply = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
    config,
    status,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })

  beforeEach(async () => {
    requests = []
    pending = [
      { code: 'POL-GEN', title: 'General policy', versionNumber: 1 },
      { code: 'POL-MF4', title: 'Budget policy', versionNumber: 1 }
    ]
    meFails = false
    ackError = null
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (config.method === 'post' && url.includes('/acknowledgements')) {
        if (ackError) {
          throw new AxiosError('refused', 'ERR_BAD_REQUEST', config, undefined, {
            ...reply(config, { success: false, error: { code: ackError.code } }, ackError.status),
            status: ackError.status
          })
        }
        const code = url.split('/policies/')[1].split('/')[0]
        pending = pending.filter((policy) => policy.code !== code)
        return reply(
          config,
          {
            success: true,
            message: 'OK',
            data: { policyCode: code, versionNumber: 1, acknowledgedAt: null, alreadyAcknowledged: false }
          },
          201
        )
      }
      if (url.includes('/policies/')) {
        const code = url.split('/policies/')[1]
        const title = code === 'POL-GEN' ? 'General policy' : 'Budget policy'
        return reply(config, { success: true, message: 'OK', data: policyBody(code, title) })
      }
      if (url.endsWith('/me')) {
        if (meFails) throw new AxiosError('down', 'ERR_NETWORK', config)
        return reply(config, {
          success: true,
          message: 'OK',
          data: { roles: ['FINANCE'], pendingPolicyAcknowledgements: pending }
        })
      }
      return reply(config, { success: true, message: 'OK', data: null })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = () =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <PolicyAcknowledgementGate>
          <output data-testid='dashboard-pages' />
        </PolicyAcknowledgementGate>
      </QueryClientProvider>
    )

  it('holds the dashboard back and reads one policy at a time with its progress', async () => {
    mount()
    expect(await screen.findByText('Policy 1 of 2')).toBeTruthy()
    expect(await screen.findByText('Body of General policy')).toBeTruthy()
    expect(screen.queryByTestId('dashboard-pages')).toBeNull()
    expect(screen.getByText('The ceiling holds')).toBeTruthy()
    expect(screen.getByText('(Checked by the system)')).toBeTruthy()
    expect(screen.getByText('(Answered by the person deciding)')).toBeTruthy()
  })

  it('renders the markdown of the policy text and keeps the action bar with its progress at hand', async () => {
    const { container } = mount()
    await screen.findByText('Body of General policy')
    expect(container.querySelector('ol li strong')?.textContent).toBe('First rule')
    expect(screen.getByRole('link', { name: 'a link' }).getAttribute('href')).toBe('https://example.test/p')
    expect(container.textContent).not.toContain('**')

    const bar = screen.getByRole('group', { name: 'Confirm this policy' })
    expect(bar.className).toContain('sticky')
    expect(bar.className).toContain('bottom-0')
    expect(bar.textContent).toContain('Policy 1 of 2')
    expect(bar.querySelector('button')?.textContent).toBe('I have read and understood')
  })

  it('acknowledges each policy, refetches meGet and opens the dashboard once none is left', async () => {
    mount()
    await screen.findByText('Body of General policy')
    fireEvent.click(screen.getByRole('button', { name: 'I have read and understood' }))
    expect(await screen.findByText('Policy 2 of 2')).toBeTruthy()
    await screen.findByText('Body of Budget policy')
    expect(requests.some((r) => r.method === 'post' && r.url?.endsWith('/policies/POL-GEN/acknowledgements'))).toBe(
      true
    )

    fireEvent.click(screen.getByRole('button', { name: 'I have read and understood' }))
    expect(await screen.findByTestId('dashboard-pages')).toBeTruthy()
    expect(requests.filter((r) => r.method === 'post')).toHaveLength(2)
  })

  it('treats POLICY.ACKNOWLEDGEMENT_NOT_REQUIRED as done and refreshes the list', async () => {
    mount()
    await screen.findByText('Body of General policy')
    ackError = { status: 409, code: 'POLICY.ACKNOWLEDGEMENT_NOT_REQUIRED' }
    pending = [{ code: 'POL-MF4', title: 'Budget policy', versionNumber: 1 }]
    fireEvent.click(screen.getByRole('button', { name: 'I have read and understood' }))
    expect(await screen.findByText('Body of Budget policy')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('shows a message and stays on the policy when the acknowledgement is refused', async () => {
    mount()
    await screen.findByText('Body of General policy')
    ackError = { status: 403, code: 'AUTHORIZATION.FORBIDDEN' }
    fireEvent.click(screen.getByRole('button', { name: 'I have read and understood' }))
    expect(await screen.findByText('You are not allowed to confirm this policy.')).toBeTruthy()
    expect(screen.getByText('Body of General policy')).toBeTruthy()
  })

  it('does not block the pages when nothing is pending or meGet fails', async () => {
    pending = []
    const first = mount()
    expect(await screen.findByTestId('dashboard-pages')).toBeTruthy()
    first.unmount()

    meFails = true
    mount()
    await waitFor(() => expect(requests.some((r) => r.url?.endsWith('/me'))).toBe(true))
    expect(screen.getByTestId('dashboard-pages')).toBeTruthy()
  })
})
