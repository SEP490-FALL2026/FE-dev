import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItDeptCatalogView } from './views/it-dept-catalog-view'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('shows the responsible IT administrator on the catalog list', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      items: [
        { id: 'a1', name: 'Figma', kind: 'SAAS', status: 'APPROVED', responsibleItAdmin: { fullName: 'Admin A' } }
      ],
      pagination: { totalItems: 1 }
    }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Admin A')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Details' })).not.toBeInTheDocument()
})

it('shows the software logo and falls back to its initial if the image fails', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/applications'))
      return {
        data: {
          items: [
            {
              id: 'a1',
              name: 'Figma',
              kind: 'SAAS',
              status: 'APPROVED',
              logoUrl: 'https://example.org/logo.png',
              responsibleItAdmin: null
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { items: [], pagination: { totalPages: 0 } } }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
  const card = (await screen.findByText('Figma')).closest('article')!
  const logo = card.querySelector('img')!
  expect(logo).toHaveAttribute('src', 'https://example.org/logo.png')
  fireEvent.error(logo)
  expect(within(card).getByText('F')).toBeInTheDocument()
})

it('shows application status as active or retired in Vietnamese', async () => {
  await setAppLanguage('vi', false)
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      items: [
        { id: 'a1', name: 'Figma', kind: 'SAAS', status: 'APPROVED', responsibleItAdmin: null },
        { id: 'a2', name: 'Old tool', kind: 'SAAS', status: 'RETIRED', responsibleItAdmin: null }
      ],
      pagination: { totalItems: 2 }
    }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
  const active = (await screen.findByText('Figma')).closest('article')!
  const retired = screen.getByText('Old tool').closest('article')!
  expect(within(active).getByText(/Đang hoạt động/)).toBeInTheDocument()
  expect(within(retired).getByText(/Đã ngừng/)).toBeInTheDocument()
  expect(within(active).queryByText(/Đã duyệt/)).not.toBeInTheDocument()
})

it('shows the provisioning method for each plan of an application, including later pages', async () => {
  await setAppLanguage('vi', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/applications'))
      return {
        data: {
          items: [{ id: 'app-one', name: 'Workspace', kind: 'SAAS', status: 'APPROVED', responsibleItAdmin: null }],
          pagination: { totalItems: 1 }
        }
      }
    if (config.url?.endsWith('/plans'))
      return {
        data: {
          items:
            config.params?.page === 1
              ? [{ id: 'p1', name: 'Team', provisioningType: 'K2' }]
              : [{ id: 'p2', name: 'Personal', provisioningType: 'K1' }],
          pagination: { totalPages: 2 }
        }
      }
    throw new Error('Unexpected request')
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Team · Không gian làm việc dùng chung')).toBeInTheDocument()
  expect(screen.getByText('Personal · Tài khoản cá nhân')).toBeInTheDocument()
  expect(vi.mocked(customAxios)).toHaveBeenCalledWith(
    expect.objectContaining({ params: { applicationId: 'app-one', page: 2, pageSize: 100 } }),
    undefined
  )
})

it('groups setup with application actions and lets the user choose a plan', async () => {
  await setAppLanguage('vi', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/applications'))
      return {
        data: { items: [{ id: 'a1', name: 'Figma', kind: 'SAAS', status: 'APPROVED' }], pagination: { totalItems: 1 } }
      }
    return { data: { items: [{ id: 'p1', name: 'Team', provisioningType: 'K2' }], pagination: { totalPages: 1 } } }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
  const card = (await screen.findByText('Figma')).closest('article')!
  const setup = await within(card).findByText('Thiết lập', { selector: 'summary' })
  expect(setup.parentElement?.parentElement).toContainElement(
    within(card).getByRole('button', { name: 'Sửa ứng dụng' })
  )
  expect(setup.parentElement?.parentElement).toContainElement(within(card).getByRole('button', { name: 'Thêm gói' }))
  fireEvent.click(setup)
  fireEvent.click(within(card).getByRole('button', { name: 'Thiết lập Team' }))
  expect(await screen.findByRole('heading', { name: /Team/ })).toBeInTheDocument()
})
