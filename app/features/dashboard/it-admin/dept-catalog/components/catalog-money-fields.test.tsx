import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPlanRules } from './catalog-plan-rules'
import { SubscriptionExtraFields } from './subscription-extra-fields'

vi.mock('~/shared/api/generated/operations/it-admins/it-admin-list', () => ({
  getItAdminListQueryKey: () => ['it-admins'],
  itAdminList: async () => ({ data: { items: [], pagination: { totalPages: 1 } } })
}))

beforeEach(async () => {
  await setAppLanguage('vi', false)
})

it('formats the plan price and submits its exact decimal string', () => {
  const { container } = render(
    <form>
      <CatalogPlanRules provisioningType='K2' />
    </form>
  )
  const input = screen.getByRole('textbox', { name: 'Giá tham chiếu (VND, chưa thuế)' })
  fireEvent.change(input, { target: { value: '250000,125' } })
  expect(input).toHaveValue('250.000,125')
  expect(new FormData(container.querySelector('form')!).get('referencePrice')).toBe('250000.125')
  expect(input).toBeValid()
})

it('formats English decimals and rejects incomplete decimal input', async () => {
  await setAppLanguage('en', false)
  const { container } = render(
    <form>
      <CatalogPlanRules provisioningType='K2' />
    </form>
  )
  const input = screen.getByRole('textbox', { name: /reference price/i })
  fireEvent.change(input, { target: { value: '250000.25' } })
  expect(input).toHaveValue('250,000.25')
  expect(new FormData(container.querySelector('form')!).get('referencePrice')).toBe('250000.25')
  fireEvent.change(input, { target: { value: '250000.' } })
  expect(input).toBeInvalid()
})

it('keeps a foreign-currency price exact and requires its currency', () => {
  const { container } = render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <form>
        <SubscriptionExtraFields allowPrimary={false} onDirty={() => undefined} />
      </form>
    </QueryClientProvider>
  )
  const input = screen.getByRole('textbox', { name: 'Giá gốc nhà cung cấp' })
  fireEvent.change(input, { target: { value: '9007199254740993,25' } })
  expect(input).toHaveValue('9.007.199.254.740.993,25')
  const form = container.querySelector('form')!
  expect(new FormData(form).get('originalAmount')).toBe('9007199254740993.25')
  expect(form.querySelector('[name="originalCurrency"]')).toBeRequired()
})
