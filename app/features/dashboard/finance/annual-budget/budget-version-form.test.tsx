import { fireEvent, screen } from '@testing-library/react'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { renderBudget } from './budget-test-fixtures'
import { BudgetVersionForm } from './components/budget-version-form'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const initial = { base: vnd('1000'), reserve: vnd('100'), reserveReason: undefined }

describe('BudgetVersionForm validation', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  const mount = (askBaseReason = true) => {
    const onSubmit = vi.fn()
    renderBudget(
      <BudgetVersionForm
        initial={initial}
        currency='VND'
        askBaseReason={askBaseReason}
        pending={false}
        onClose={() => undefined}
        onSubmit={onSubmit}
      />
    )
    return onSubmit
  }
  const save = () => fireEvent.click(screen.getAllByRole('button', { name: 'Save version' }).at(-1) as HTMLElement)

  it('has no quarterly split and saves one figure for the whole year', () => {
    const onSubmit = mount()
    expect(screen.queryByLabelText(/Quarter/)).toBeNull()
    save()
    // The reserve is the default share and unchanged, so it is not sent again.
    expect(onSubmit).toHaveBeenCalledWith({ base: { amount: '1000' } })
  })

  it('requires a reason when the base of an existing version changes', async () => {
    const onSubmit = mount()
    fireEvent.change(screen.getAllByLabelText(/^Base amount/)[0], { target: { value: '2000' } })
    save()
    expect(onSubmit).not.toHaveBeenCalled()
    // The dialog ignores a second submit in the same tick.
    await Promise.resolve()
    fireEvent.change(screen.getAllByLabelText(/Reason for changing the base/)[0], { target: { value: 'Raised' } })
    save()
    expect(onSubmit).toHaveBeenCalled()
  })

  it('sends the reserve as a share and asks for a reason when it is not the default', async () => {
    const onSubmit = mount(false)
    fireEvent.change(screen.getByLabelText(/Reserve \(% of base\)/), { target: { value: '12' } })
    save()
    expect(onSubmit).not.toHaveBeenCalled()
    await Promise.resolve()
    fireEvent.change(screen.getAllByLabelText(/Reason for the reserve/)[0], { target: { value: 'Hiring' } })
    save()
    expect(onSubmit).toHaveBeenCalledWith({
      base: { amount: '1000' },
      reservePercent: 12,
      reserveReason: 'Hiring'
    })
  })

  it('refuses a share above 100 and never sends a share together with an amount', async () => {
    const onSubmit = mount(false)
    fireEvent.change(screen.getByLabelText(/Reserve \(% of base\)/), { target: { value: '101' } })
    save()
    expect(onSubmit).not.toHaveBeenCalled()
    await Promise.resolve()
    fireEvent.change(screen.getByLabelText(/Reserve entered as/), { target: { value: 'amount' } })
    fireEvent.change(screen.getByLabelText(/^Reserve amount/), { target: { value: '150' } })
    fireEvent.change(screen.getAllByLabelText(/Reason for the reserve/)[0], { target: { value: 'Hiring' } })
    save()
    const body = onSubmit.mock.calls[0][0]
    expect(body.reserve).toEqual({ amount: '150' })
    expect(body.reservePercent).toBeUndefined()
  })

  describe('with the default share read from BUDGET_RESERVE_DEFAULT_PERCENT', () => {
    const previousAdapter = apiClient.defaults.adapter
    beforeEach(() => {
      apiClient.defaults.adapter = async (config) => ({
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: {
          success: true,
          message: 'OK',
          data: { items: [{ key: 'BUDGET_RESERVE_DEFAULT_PERCENT', value: 15 }] }
        }
      })
    })
    afterEach(() => {
      apiClient.defaults.adapter = previousAdapter
    })

    it('needs no reason for the organisation default, only for another share', async () => {
      const onSubmit = mount(false)
      await screen.findByPlaceholderText('15')
      fireEvent.change(screen.getByLabelText(/Reserve \(% of base\)/), { target: { value: '15' } })
      save()
      expect(onSubmit).toHaveBeenCalledWith({ base: { amount: '1000' }, reservePercent: 15 })
      onSubmit.mockClear()
      fireEvent.change(screen.getByLabelText(/Reserve \(% of base\)/), { target: { value: '10' } })
      save()
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
