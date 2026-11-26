import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { InvoiceFields, type InvoiceDraft } from './components/invoice-fields'

vi.mock('~/shared/api/generated/operations/currencies/currency-list', () => ({
  useCurrencyList: () => ({ isFetching: false, data: { data: { items: [{ code: 'USD' }] } } })
}))

const initial: InvoiceDraft = {
  number: '',
  issuedOn: '',
  month: '',
  quantity: '1',
  unitPrice: '',
  currency: 'VND',
  netAmount: '',
  deductibleTax: '',
  nonDeductibleTax: '',
  paymentSource: 'COMPANY_CARD'
}

function TestForm({ onDraft }: { onDraft: (draft: InvoiceDraft) => void }) {
  const [draft, setDraft] = useState(initial)
  return (
    <form>
      <InvoiceFields
        draft={draft}
        disabled={false}
        onChange={(key, value) => {
          const next = { ...draft, [key]: value }
          setDraft(next)
          onDraft(next)
        }}
      />
    </form>
  )
}

function mount(onDraft: (draft: InvoiceDraft) => void) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <TestForm onDraft={onDraft} />
    </QueryClientProvider>
  )
}

beforeEach(async () => {
  await setAppLanguage('vi', false)
})

it('groups each VND field and keeps the exact digits in the draft used for preview and submit', () => {
  const onDraft = vi.fn()
  mount(onDraft)
  const fields = [
    ['Số tiền trước thuế bằng đồng Việt Nam', 'netAmount'],
    ['Thuế được khấu trừ bằng đồng Việt Nam', 'deductibleTax'],
    ['Thuế không được khấu trừ bằng đồng Việt Nam', 'nonDeductibleTax']
  ] as const
  for (const [label, key] of fields) {
    const input = screen.getByRole('textbox', { name: label })
    fireEvent.change(input, { target: { value: '250000' } })
    expect(input).toHaveValue('250.000')
    expect(onDraft).toHaveBeenLastCalledWith(expect.objectContaining({ [key]: '250000' }))
    expect(input).toBeValid()
  }
})

it('preserves foreign price decimals and rejects fractional dong and incomplete amounts', () => {
  const onDraft = vi.fn()
  mount(onDraft)
  const price = screen.getByRole('textbox', { name: 'Đơn giá gốc' })
  fireEvent.change(price, { target: { value: '9007199254740993,25' } })
  expect(price).toHaveValue('9.007.199.254.740.993,25')
  expect(onDraft).toHaveBeenLastCalledWith(expect.objectContaining({ unitPrice: '9007199254740993.25' }))
  const net = screen.getByRole('textbox', { name: 'Số tiền trước thuế bằng đồng Việt Nam' })
  fireEvent.change(net, { target: { value: '12,5' } })
  expect(net).toBeInvalid()
  fireEvent.change(price, { target: { value: '12,' } })
  expect(price).toBeInvalid()
})

it('rejects an overlong dong amount instead of silently changing it', () => {
  const onDraft = vi.fn()
  mount(onDraft)
  const net = screen.getByRole('textbox', { name: 'Số tiền trước thuế bằng đồng Việt Nam' })
  fireEvent.change(net, { target: { value: '12345678901234567' } })
  expect(net).toHaveValue('12.345.678.901.234.567')
  expect(net).toBeInvalid()
  expect(onDraft).toHaveBeenLastCalledWith(expect.objectContaining({ netAmount: '12345678901234567' }))
})

it('formats English decimals while retaining the API decimal string', async () => {
  await setAppLanguage('en', false)
  const onDraft = vi.fn()
  mount(onDraft)
  const price = screen.getByRole('textbox', { name: 'Original unit price' })
  fireEvent.change(price, { target: { value: '1234567.25' } })
  await waitFor(() => expect(price).toHaveValue('1,234,567.25'))
  expect(onDraft).toHaveBeenLastCalledWith(expect.objectContaining({ unitPrice: '1234567.25' }))
})
