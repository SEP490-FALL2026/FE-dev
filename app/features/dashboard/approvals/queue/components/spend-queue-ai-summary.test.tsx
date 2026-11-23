import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosAdapter } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SpendQueueAiSummary } from './spend-queue-ai-summary'

const originalAdapter = apiClient.defaults.adapter

function renderComponent(adapter: AxiosAdapter, onOpen = vi.fn()) {
  apiClient.defaults.adapter = adapter
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  const view = render(
    <QueryClientProvider client={queryClient}>
      <SpendQueueAiSummary onOpen={onOpen} />
    </QueryClientProvider>
  )
  return { ...view, queryClient, onOpen }
}

describe('SpendQueueAiSummary', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })

  it('renders nothing when source returns 403 AI.DISABLED', async () => {
    renderComponent(async (config) => {
      const error = new AxiosError('AI.DISABLED', '403', config, undefined, {
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config,
        data: { error: { code: 'AI.DISABLED' } }
      })
      throw error
    })

    await waitFor(() => {
      expect(screen.queryByText('AI summary')).not.toBeInTheDocument()
    })
  })

  it('renders initial state with step count and trigger button', async () => {
    renderComponent(async (config) => {
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {
          success: true,
          data: {
            queueRevision: 'rev-123',
            stepCount: 3,
            omittedCount: 0
          }
        }
      }
    })

    expect(await screen.findByText('AI summary')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Summarise 3 requests/i })).toBeInTheDocument()
  })

  it('handles summary fetch error without infinite running state', async () => {
    const invocationId = 'inv-test-error'

    renderComponent(async (config) => {
      if (config.method?.toLowerCase() === 'get' && config.url?.includes('/source')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: {},
          data: {
            success: true,
            data: { queueRevision: 'rev-error-test', stepCount: 2, omittedCount: 0 }
          }
        }
      }
      if (config.method?.toLowerCase() === 'post') {
        return {
          config,
          status: 202,
          statusText: 'Accepted',
          headers: {},
          data: { success: true, data: { invocationId } }
        }
      }
      if (config.method?.toLowerCase() === 'get' && config.url?.includes(invocationId)) {
        const err = new AxiosError('Server error', '500', config, undefined, {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config,
          data: { error: { code: 'INTERNAL_ERROR' } }
        })
        throw err
      }
      return { config, status: 200, statusText: 'OK', headers: {}, data: {} }
    })

    const button = await screen.findByRole('button', { name: /Summarise 2 requests/i })
    fireEvent.click(button)

    // It must NOT stay stuck in running, but show unavailable error message
    expect(
      await screen.findByText(
        'The summary is not available right now. You can still decide in the list below.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByText('Generating summary, please wait…')).not.toBeInTheDocument()
  })

  it('renders completed summary and invokes onOpen when clicking open', async () => {
    const invocationId = 'inv-completed-123'
    const requestId = 'req-abc-999'
    const onOpen = vi.fn()

    renderComponent(async (config) => {
      if (config.method?.toLowerCase() === 'get' && config.url?.includes('/source')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: {},
          data: {
            success: true,
            data: { queueRevision: 'rev-ok', stepCount: 1, omittedCount: 0 }
          }
        }
      }
      if (config.method?.toLowerCase() === 'post') {
        return {
          config,
          status: 202,
          statusText: 'Accepted',
          headers: {},
          data: { success: true, data: { invocationId } }
        }
      }
      if (config.method?.toLowerCase() === 'get' && config.url?.includes(invocationId)) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: {},
          data: {
            success: true,
            data: {
              invocationId,
              status: 'COMPLETED',
              simulated: false,
              sourceStale: false,
              omittedCount: 0,
              lines: [
                {
                  stepId: 'step-1',
                  requestId,
                  summary: 'Need GitHub Copilot for engineer'
                }
              ]
            }
          }
        }
      }
      return { config, status: 200, statusText: 'OK', headers: {}, data: {} }
    }, onOpen)

    const button = await screen.findByRole('button', { name: /Summarise 1 requests/i })
    fireEvent.click(button)

    expect(await screen.findByText('Need GitHub Copilot for engineer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Summarise again/i })).toBeInTheDocument()

    const openButton = screen.getByRole('button', { name: 'Open' })
    fireEvent.click(openButton)
    expect(onOpen).toHaveBeenCalledWith(requestId)
  })
})
