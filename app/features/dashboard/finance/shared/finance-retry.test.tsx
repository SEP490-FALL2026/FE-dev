import { AxiosError, AxiosHeaders } from 'axios'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { financeBudget } from '~/shared/i18n/locales/en/finance-budget'
import { recordFinanceRetry } from './hooks/use-finance-retry'

afterEach(() => vi.useRealTimers())

describe('Finance write cooldown', () => {
  it('blocks dialog submission and shows the server Retry-After countdown', async () => {
    await setAppLanguage('en', false)
    vi.useFakeTimers()
    const submit = vi.fn((event) => event.preventDefault())
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <FinanceFormDialog
          title={financeBudget.versions}
          pending={false}
          onClose={() => undefined}
          onSubmit={submit}
          submitLabel={financeBudget.actions.save}
        >
          <input aria-label={financeBudget.fields.amount} />
        </FinanceFormDialog>
      </QueryClientProvider>
    )
    const error = new AxiosError('Rate limit', undefined, undefined, undefined, {
      status: 429,
      statusText: '',
      config: { headers: new AxiosHeaders() },
      headers: { 'retry-after': '2' },
      data: {}
    })
    act(() => recordFinanceRetry(queryClient, error))
    expect(screen.getByRole('button', { name: 'Try again in 2s' })).toBeDisabled()
    fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)
    expect(submit).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(2250))
    expect(screen.getByRole('button', { name: financeBudget.actions.save })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: financeBudget.actions.save }))
    expect(submit).toHaveBeenCalledOnce()
  })
})
