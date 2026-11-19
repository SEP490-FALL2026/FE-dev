import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { Dialog } from './dashboard-ui'

it('closes only the inner confirmation when Escape is pressed inside a drawer', async () => {
  await setAppLanguage('en', false)
  const closeDrawer = vi.fn()
  const labels = { details: 'Proposal details', withdrawal: 'Withdraw proposal', confirm: 'Confirm withdrawal' }
  function NestedConfirmation() {
    const [confirm, setConfirm] = useState(true)
    return (
      <Dialog title={labels.details} presentation='drawer' onClose={closeDrawer}>
        {confirm && (
          <Dialog title={labels.withdrawal} presentation='sheet' onClose={() => setConfirm(false)}>
            <button type='button'>{labels.confirm}</button>
          </Dialog>
        )}
      </Dialog>
    )
  }
  render(<NestedConfirmation />)
  fireEvent.keyDown(screen.getByRole('dialog', { name: 'Withdraw proposal' }), { key: 'Escape' })
  expect(screen.queryByRole('dialog', { name: 'Withdraw proposal' })).not.toBeInTheDocument()
  expect(screen.getByRole('dialog', { name: 'Proposal details' })).toBeInTheDocument()
  expect(closeDrawer).not.toHaveBeenCalled()
})
