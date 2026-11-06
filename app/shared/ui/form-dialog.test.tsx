import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { AdminFormDialog } from './form-dialog'

const labels = { open: 'Open', edit: 'Edit', name: 'Name', outer: 'Outer', inner: 'Inner', value: 'Inner value' }

describe('form dialog surfaces', () => {
  it('isolates a modal from the underlying workspace and restores it when closed', () => {
    function Workspace() {
      const [open, setOpen] = useState(false)
      return (
        <main>
          <button onClick={() => setOpen(true)}>{labels.open}</button>
          {open && (
            <AdminFormDialog title={labels.edit} pending={false} onSubmit={vi.fn()} onClose={() => setOpen(false)}>
              <label>
                {labels.name}
                <input />
              </label>
            </AdminFormDialog>
          )}
        </main>
      )
    }
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <Workspace />
      </QueryClientProvider>
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    trigger.focus()
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Edit' })
    expect(container).not.toContainElement(dialog)
    expect(container).toHaveAttribute('inert')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(container).not.toHaveAttribute('inert')
    expect(trigger).toHaveFocus()
  })

  it('keeps a nested editor in its own form and closes only the top surface with Escape', () => {
    const outerClose = vi.fn()
    function Editors() {
      const [innerOpen, setInnerOpen] = useState(true)
      return (
        <AdminFormDialog title={labels.outer} pending={false} onSubmit={vi.fn()} onClose={outerClose}>
          {innerOpen && (
            <AdminFormDialog
              title={labels.inner}
              pending={false}
              onSubmit={vi.fn()}
              onClose={() => setInnerOpen(false)}
            >
              <input aria-label={labels.value} />
            </AdminFormDialog>
          )}
        </AdminFormDialog>
      )
    }
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Editors />
      </QueryClientProvider>
    )
    const input = screen.getByRole('textbox', { name: 'Inner value' })
    expect(input.closest('form')?.parentElement?.closest('form')).toBeNull()
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Inner' })).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('dialog', { name: 'Outer' })).getByRole('button', { name: /close|đóng/i })
    ).toBeVisible()
    expect(outerClose).not.toHaveBeenCalled()
  })
})
