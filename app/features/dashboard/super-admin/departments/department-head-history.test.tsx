import { StrictMode, useState } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DepartmentHeadHistory } from './components/department-head-history'

const department: NonNullable<DepartmentResponseDtoData> = {
  id: 'department-1',
  code: 'ENG',
  name: 'Engineering',
  function: null,
  status: 'ACTIVE',
  costCenter: null,
  itAdmin: null,
  head: null,
  memberCount: 0,
  warnings: [],
  createdAt: '',
  updatedAt: '',
  deactivatedAt: null,
  successor: null,
  headHistory: [],
  headHistoryHasMore: false
}

function HistoryHarness() {
  const { t: translate } = useTranslation('adminOrganization')
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        {translate('viewHeadHistory')}
      </button>
      {open && <DepartmentHeadHistory department={department} onClose={() => setOpen(false)} />}
    </>
  )
}

describe('Native history dialog lifecycle', () => {
  const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
  const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
  let closeEvents = 0

  beforeEach(async () => {
    await setAppLanguage('en', false)
    vi.useFakeTimers()
    closeEvents = 0
    Object.defineProperties(HTMLDialogElement.prototype, {
      showModal: {
        configurable: true,
        value(this: HTMLDialogElement) {
          this.open = true
        }
      },
      close: {
        configurable: true,
        value(this: HTMLDialogElement) {
          if (!this.open) return
          this.open = false
          // Browsers queue the close event; Strict Mode can reopen the same node before it fires.
          setTimeout(() => {
            closeEvents += 1
            this.dispatchEvent(new Event('close'))
          }, 0)
        }
      }
    })
  })

  afterEach(() => {
    cleanup()
    for (const [name, descriptor] of [
      ['showModal', originalShowModal],
      ['close', originalClose]
    ] as const) {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
      else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
    }
    vi.useRealTimers()
  })

  it('stays open after the queued cleanup event in Strict Mode, then closes and reopens normally', async () => {
    render(
      <StrictMode>
        <HistoryHarness />
      </StrictMode>
    )
    fireEvent.click(screen.getByRole('button', { name: 'View head history' }))
    await act(async () => {
      vi.runOnlyPendingTimers()
    })
    expect(closeEvents).toBeGreaterThan(0)
    expect(screen.getByRole('dialog', { name: 'Head history' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[0])
    await act(async () => {
      vi.runOnlyPendingTimers()
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'View head history' }))
    await act(async () => {
      vi.runOnlyPendingTimers()
    })
    expect(screen.getByRole('dialog', { name: 'Head history' })).toBeInTheDocument()
  })
})
