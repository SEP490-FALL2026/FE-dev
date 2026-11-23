import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { getMonitoringNoticeCurrentGetQueryKey } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import {
  device,
  registrationId,
  notice,
  pageData,
  server,
  mount,
  openDevice,
  openAcknowledgement,
  confirmText,
  employeeProfile
} from '../../../../../test/fixtures/device-privacy'
it('requires explicit consent, sends only the read notice id and blocks double submission until the API confirms', async () => {
  let finish: () => void = () => undefined
  const pending = new Promise<void>((resolve) => {
    finish = resolve
  })
  const submitted = vi.fn()
  const saved = vi.spyOn(toast, 'success')
  let recorded = false
  server.use(
    http.get('*/api/v1/me/devices', () =>
      HttpResponse.json(
        pageData([
          { ...device, canAcknowledge: !recorded, acknowledgementState: recorded ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED' }
        ])
      )
    ),
    http.post('*/api/v1/me/device-registrations/:id/acknowledgements', async ({ request, params }) => {
      expect(params.id).toBe(registrationId)
      submitted(await request.json())
      await pending
      recorded = true
      return HttpResponse.json(
        {
          success: true,
          data: { id: 'ack-1', registrationId, noticeVersionNumber: 1, acknowledgedAt: '2026-11-06T00:00:00Z' }
        },
        { status: 201 }
      )
    })
  )
  mount()
  const dialog = await openAcknowledgement()
  const submit = within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' })
  expect(submit).toBeDisabled()
  fireEvent.click(within(dialog).getByLabelText(confirmText))
  fireEvent.click(submit)
  fireEvent.click(submit)
  await waitFor(() => expect(submitted).toHaveBeenCalledTimes(1))
  expect(submitted).toHaveBeenCalledWith({ noticeVersionId: notice.id })
  expect(saved).not.toHaveBeenCalled()
  expect(submit).toBeDisabled()
  finish()
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(saved).toHaveBeenCalledTimes(1)
  expect(screen.getByText('Acknowledged')).toBeVisible()
})

it('requires consent again if a newer notice is fetched while the confirmation is open', async () => {
  let latest = notice
  server.use(http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: latest })))
  const client = mount()
  const dialog = await openAcknowledgement()
  fireEvent.click(within(dialog).getByLabelText(confirmText))
  latest = { ...notice, id: '55555555-5555-4555-8555-555555555555', versionNumber: 2 }
  await client.invalidateQueries({ queryKey: getMonitoringNoticeCurrentGetQueryKey() })
  expect(await within(dialog).findByText('Version 2')).toBeVisible()
  expect(within(dialog).getByLabelText(confirmText)).not.toBeChecked()
  expect(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' })).toBeDisabled()
})

it.each([
  { acknowledgementState: 'UNACKNOWLEDGED', canAcknowledge: false, blockedReason: 'SIGNATURE_RECORD_MISSING' },
  { acknowledgementState: 'NEW_STATE', canAcknowledge: true, blockedReason: null }
])('does not acknowledge blocked or unknown registration state: $acknowledgementState', async (override) => {
  server.use(http.get('*/api/v1/me/devices', () => HttpResponse.json(pageData([{ ...device, ...override }]))))
  mount()
  await openDevice()
  expect(screen.getByRole('button', { name: 'Acknowledge monitoring notice' })).toBeDisabled()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('reloads a stale notice on 409 without automatically resubmitting', async () => {
  const submitted = vi.fn()
  let latest = notice
  const error = vi.spyOn(toast, 'error')
  server.use(
    http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: latest })),
    http.post('*/api/v1/me/device-registrations/:id/acknowledgements', () => {
      submitted()
      latest = { ...notice, id: '55555555-5555-4555-8555-555555555555', versionNumber: 2 }
      return HttpResponse.json({ error: { code: 'DEVICE_ACKNOWLEDGEMENT.NOTICE_NOT_CURRENT' } }, { status: 409 })
    })
  )
  mount()
  const dialog = await openAcknowledgement()
  fireEvent.click(within(dialog).getByLabelText(confirmText))
  fireEvent.click(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' }))
  expect(await within(dialog).findByText('Version 2')).toBeVisible()
  expect(within(dialog).getByLabelText(confirmText)).not.toBeChecked()
  expect(submitted).toHaveBeenCalledTimes(1)
  expect(error).toHaveBeenCalledWith(expect.stringContaining('has changed'), expect.anything())
})

it('locks an uncertain write until an explicit status check and fresh consent', async () => {
  const submitted = vi.fn()
  server.use(
    http.post('*/api/v1/me/device-registrations/:id/acknowledgements', () => {
      submitted()
      return HttpResponse.error()
    })
  )
  mount()
  const dialog = await openAcknowledgement()
  fireEvent.click(within(dialog).getByLabelText(confirmText))
  fireEvent.click(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' }))
  const check = await within(dialog).findByRole('button', { name: 'Check current status' })
  expect(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' })).toBeDisabled()
  expect(submitted).toHaveBeenCalledTimes(1)
  await waitFor(() => expect(check).toBeEnabled())
  fireEvent.click(check)
  await waitFor(() =>
    expect(within(dialog).queryByRole('button', { name: 'Check current status' })).not.toBeInTheDocument()
  )
  expect(within(dialog).getByLabelText(confirmText)).not.toBeChecked()
  expect(submitted).toHaveBeenCalledTimes(1)
})

it('honors Retry-After on a throttled acknowledgement', async () => {
  server.use(
    http.post('*/api/v1/me/device-registrations/:id/acknowledgements', () =>
      HttpResponse.json({ error: { code: 'HTTP_TOO_MANY_REQUESTS' } }, { status: 429, headers: { 'Retry-After': '1' } })
    )
  )
  mount()
  const dialog = await openAcknowledgement()
  fireEvent.click(within(dialog).getByLabelText(confirmText))
  fireEvent.click(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' }))
  expect(await within(dialog).findByRole('button', { name: /Try again in 1/ })).toBeDisabled()
  await waitFor(
    () => expect(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' })).toBeEnabled(),
    { timeout: 2500 }
  )
})

it.each([
  { status: 403, code: 'FORBIDDEN', message: 'You no longer have permission' },
  { status: 404, code: 'DEVICE_REGISTRATION.NOT_FOUND', message: 'no longer available' },
  { status: 422, code: 'VALIDATION_ERROR', message: 'could not be accepted' }
])(
  'handles acknowledgement HTTP $status without discarding the read policy or reporting success',
  async ({ status, code, message }) => {
    const failed = vi.spyOn(toast, 'error')
    const saved = vi.spyOn(toast, 'success')
    let profileReads = 0
    server.use(
      http.get('*/api/v1/me', () => {
        profileReads++
        return HttpResponse.json({ success: true, data: employeeProfile })
      }),
      http.post('*/api/v1/me/device-registrations/:id/acknowledgements', () =>
        HttpResponse.json({ error: { code } }, { status })
      )
    )
    mount()
    const dialog = await openAcknowledgement()
    fireEvent.click(within(dialog).getByLabelText(confirmText))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' }))
    await waitFor(() => expect(failed).toHaveBeenCalledWith(expect.stringContaining(message), expect.anything()))
    expect(saved).not.toHaveBeenCalled()
    expect(within(dialog).getByText('Chat contents')).toBeVisible()
    if (status === 403) await waitFor(() => expect(profileReads).toBe(2))
  }
)

it('does not enable consent when the current notice is unavailable', async () => {
  server.use(http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: null })))
  mount()
  await openDevice()
  fireEvent.click(screen.getByRole('button', { name: 'Acknowledge monitoring notice' }))
  const dialog = await screen.findByRole('dialog')
  expect(await within(dialog).findByText('No monitoring notice has been published')).toBeVisible()
  expect(within(dialog).getByRole('button', { name: 'Acknowledge monitoring notice' })).toBeDisabled()
  expect(within(dialog).queryByRole('checkbox')).not.toBeInTheDocument()
})
