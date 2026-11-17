import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { MyProfileEditor } from './components/my-profile-editor'
import { employeeProfile } from '../../../test/fixtures/employee-api'
import { setAppLanguage } from '~/shared/i18n/i18n'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const patch = vi.fn()
const upload = vi.fn()
const remove = vi.fn()
let profile = { ...employeeProfile }
const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: profile })),
  http.patch('*/api/v1/me/profile', async ({ request }) => {
    const body = (await request.json()) as { workPhone: string | null }
    patch(body)
    profile = { ...profile, workPhone: body.workPhone?.replaceAll(' ', '') ?? null }
    return HttpResponse.json({ success: true, data: { workPhone: profile.workPhone } })
  }),
  http.put('*/api/v1/me/avatar', async ({ request }) => {
    upload({ contentType: request.headers.get('content-type'), body: await request.text() })
    return HttpResponse.json({ success: true, data: { avatar: null } })
  }),
  http.delete('*/api/v1/me/avatar', async ({ request }) => {
    remove(await request.text())
    profile = { ...profile, avatar: null }
    return HttpResponse.json({ success: true, data: { avatar: null } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  profile = { ...employeeProfile }
  await setAppLanguage('en', false)
})
function mount() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MyProfileEditor />
    </QueryClientProvider>
  )
}
describe('personal profile mutations', () => {
  it('sends a phone patch, displays the normalized result and clears with null', async () => {
    mount()
    const phone = await screen.findByLabelText('Work phone')
    fireEvent.change(phone, { target: { value: '+84 901234567' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save phone' }))
    await waitFor(() => expect(patch).toHaveBeenCalledWith({ workPhone: '+84 901234567' }))
    await waitFor(() => expect(phone).toHaveValue('+84901234567'))
    fireEvent.change(phone, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save phone' }))
    await waitFor(() => expect(patch).toHaveBeenLastCalledWith({ workPhone: null }))
  })
  it('rejects invalid uploads before calling the API and preserves a phone draft while changing the photo', async () => {
    mount()
    const phone = await screen.findByLabelText('Work phone')
    fireEvent.change(phone, { target: { value: '0901234567' } })
    const file = screen.getByLabelText('Change photo')
    fireEvent.change(file, { target: { files: [new File(['x'], 'photo.svg', { type: 'image/svg+xml' })] } })
    fireEvent.change(file, {
      target: { files: [new File([new Uint8Array(1024 * 1024 + 1)], 'photo.png', { type: 'image/png' })] }
    })
    expect(upload).not.toHaveBeenCalled()
    fireEvent.change(file, { target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] } })
    await waitFor(() => expect(upload).toHaveBeenCalledOnce())
    expect(upload.mock.calls[0][0].contentType).toContain('multipart/form-data; boundary=')
    // jsdom/MSW rebuilds browser Files as blobs; verify the actual multipart field and media type.
    expect(upload.mock.calls[0][0].body).toContain('name="file"')
    expect(upload.mock.calls[0][0].body).toContain('Content-Type: image/png')
    expect(phone).toHaveValue('0901234567')
    expect(patch).not.toHaveBeenCalled()
  })
  it('removes an avatar without sending a request body', async () => {
    profile = { ...profile, avatar: { url: 'https://example.test/avatar.png', expiresAt: '2026-12-01T00:00:00Z' } }
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Remove photo' }))
    await waitFor(() => expect(remove).toHaveBeenCalledWith(''))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument())
  })
  it('keeps an invalid phone editable and does not send it', async () => {
    mount()
    const phone = await screen.findByLabelText('Work phone')
    fireEvent.change(phone, { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save phone' }))
    expect(phone).toHaveAttribute('aria-invalid', 'true')
    expect(phone).toHaveValue('123')
    expect(patch).not.toHaveBeenCalled()
  })
})
