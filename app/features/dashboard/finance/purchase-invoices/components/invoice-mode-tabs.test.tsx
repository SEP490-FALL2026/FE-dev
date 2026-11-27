import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { InvoiceModeTabs, type InvoiceMode } from './invoice-mode-tabs'

beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('switches invoice queues by keyboard with a single tab stop and wraps in both directions', () => {
  function Harness() {
    const [mode, setMode] = useState<InvoiceMode>('queue')
    return <InvoiceModeTabs mode={mode} onChange={setMode} counts={{ queue: 8, missing: 2 }} />
  }
  render(<Harness />)
  const [queue, missing] = screen.getAllByRole('tab')
  queue.focus()
  fireEvent.keyDown(queue, { key: 'ArrowRight' })
  expect(missing).toHaveFocus()
  expect(missing).toHaveAttribute('aria-selected', 'true')
  expect(queue).toHaveAttribute('tabindex', '-1')
  fireEvent.keyDown(missing, { key: 'ArrowRight' })
  expect(queue).toHaveFocus()
  fireEvent.keyDown(queue, { key: 'ArrowLeft' })
  expect(missing).toHaveFocus()
  fireEvent.keyDown(missing, { key: 'Home' })
  expect(queue).toHaveFocus()
  fireEvent.keyDown(queue, { key: 'End' })
  expect(missing).toHaveFocus()
})
