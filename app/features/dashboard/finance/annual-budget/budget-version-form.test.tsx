import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { renderBudget } from './budget-test-fixtures'
import { BudgetVersionForm } from './components/budget-version-form'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const initial = { base: vnd('1000'), reserve: vnd('100'), reserveReason: undefined, quarters: undefined }

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

  it('asks for the quarters to add up to the total before saving', () => {
    const onSubmit = mount()
    for (const [label, value] of [
      ['Quarter 1', '300'],
      ['Quarter 2', '300'],
      ['Quarter 3', '300'],
      ['Quarter 4', '300']
    ])
      fireEvent.change(screen.getAllByLabelText(new RegExp(label))[0], { target: { value } })
    expect(screen.getAllByText(/must add up to the total budget/).length).toBeGreaterThan(0)
    save()
    expect(onSubmit).not.toHaveBeenCalled()
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
