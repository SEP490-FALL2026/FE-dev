import { fireEvent, render, screen, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogApplicationDetail } from './components/catalog-application-detail'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)

beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    const url = config.url ?? ''
    if (url.endsWith('/applications/app-1'))
      return {
        data: { name: 'Design suite', status: 'APPROVED', kind: 'LICENSED', businessOwner: { fullName: 'Owner' } }
      }
    if (url.endsWith('/retirement'))
      return {
        data: {
          retirement: {
            status: 'APPROVED',
            confirmed: false,
            canRetire: false,
            blockers: { assignmentTotal: 0, subscriptionTotal: 0 }
          }
        }
      }
    if (url.endsWith('/seat-usage')) return { data: { purchased: 8, occupied: 3, free: 5 } }
    if (url.endsWith('/plans'))
      return {
        data: {
          items: [{ id: 'plan-1', name: 'Design professional', provisioningType: 'K4' }],
          pagination: { totalItems: 1 }
        }
      }
    if (url.endsWith('/subscriptions'))
      return {
        data: {
          items: [{ id: 'sub-1', planName: 'Design professional', status: 'ACTIVE' }],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { closed: true, items: [], pagination: { totalItems: 0 } } }
  })
})

function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogApplicationDetail id='app-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
}

it('opens seat usage in a drawer and returns focus to the same subscription action', async () => {
  mount()
  const trigger = await screen.findByRole('button', { name: 'Seat usage' })
  trigger.focus()
  fireEvent.click(trigger)
  const dialog = await screen.findByRole('dialog', { name: 'Seat usage' })
  expect(await within(dialog).findByText('8')).toBeInTheDocument()
  expect(dialog).toContainElement(document.activeElement as HTMLElement)
  fireEvent.keyDown(document.activeElement ?? dialog, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

it('replaces application lists with the key workspace and restores them on Back', async () => {
  mount()
  fireEvent.click(await screen.findByText('License keys'))
  expect(screen.queryByRole('heading', { name: 'Subscriptions' })).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'License keys' })).toBeInTheDocument()
  expect(screen.queryByText('sub-1')).not.toBeInTheDocument()
  fireEvent.click(await screen.findByLabelText('Design professional'))
  expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(await screen.findByRole('radio')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(await screen.findByRole('heading', { name: 'Subscriptions' })).toBeInTheDocument()
})
