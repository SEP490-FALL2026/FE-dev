import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    expect(onSubmit).toHaveBeenCalledWith({ base: { amount: '1000' }, reserve: { amount: '100' } })
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
})
