import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { useTranslation } from 'react-i18next'
import { ManagerField, ManagerFormErrors } from '../shared/components/manager-api-ui'
import { ManagerBudgetAmountInput } from './components/manager-budget-amount-input'

beforeEach(async () => {
  await setAppLanguage('vi', false)
})

function AmountForm({ initialAmount, invalid }: { initialAmount?: string; invalid: boolean }) {
  const { t } = useTranslation('manager')
  return (
    <form data-testid='proposal'>
      <ManagerFormErrors fields={invalid ? ['requestedAmount.amount'] : []}>
        <ManagerField label={t('amount')}>
          <ManagerBudgetAmountInput name='requestedAmount' required defaultValue={initialAmount} />
        </ManagerField>
      </ManagerFormErrors>
    </form>
  )
}

function mount(initialAmount?: string, invalid = false) {
  return render(<AmountForm initialAmount={initialAmount} invalid={invalid} />)
}

function rawAmount() {
  return new FormData(screen.getByTestId('proposal') as HTMLFormElement).get('requestedAmount')
}

function focusAmount() {
  const input = screen.getByRole('textbox') as HTMLInputElement
  act(() => input.focus())
  input.setSelectionRange(input.value.length, input.value.length)
  return input
}

// Apply the browser's normal text-edit operation, with real input events and caret positions.
function insert(input: HTMLInputElement, digits: string) {
  for (const key of digits) {
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    fireEvent.keyDown(input, { key })
    fireEvent.keyPress(input, { key, charCode: key.charCodeAt(0) })
    fireEvent.input(input, {
      target: {
        value: input.value.slice(0, start) + key + input.value.slice(end),
        selectionStart: start + 1,
        selectionEnd: start + 1
      },
      data: key,
      inputType: 'insertText'
    })
    fireEvent.keyUp(input, { key })
  }
}

function paste(input: HTMLInputElement, value: string) {
  fireEvent.paste(input, { clipboardData: { getData: () => value } })
}

function erase(input: HTMLInputElement, key: 'Backspace' | 'Delete') {
  if (!fireEvent.keyDown(input, { key })) return
  let start = input.selectionStart ?? 0
  let end = input.selectionEnd ?? start
  if (start === end) {
    if (key === 'Backspace') start = Math.max(0, start - 1)
    else end = Math.min(input.value.length, end + 1)
  }
  fireEvent.input(input, {
    target: { value: input.value.slice(0, start) + input.value.slice(end), selectionStart: start, selectionEnd: start },
    inputType: key === 'Backspace' ? 'deleteContentBackward' : 'deleteContentForward'
  })
  fireEvent.keyUp(input, { key })
}

it('formats each keystroke immediately and keeps the caret after the entered digits', () => {
  mount()
  const input = focusAmount()
  expect(input).toHaveAttribute('inputmode', 'numeric')
  expect(input).toBeInvalid()
  for (const [digit, expected] of [
    ['2', '2'],
    ['5', '25'],
    ['0', '250'],
    ['0', '2.500'],
    ['0', '25.000'],
    ['0', '250.000'],
    ['0', '2.500.000'],
    ['0', '25.000.000'],
    ['0', '250.000.000']
  ]) {
    insert(input, digit)
    expect(input).toHaveValue(expected)
    expect(input.selectionStart).toBe(expected.length)
  }
  expect(rawAmount()).toBe('250000000')
  fireEvent.blur(input)
  expect(input).toHaveValue('250.000.000')
  expect(input).toBeValid()
  fireEvent.focus(input)
  expect(input).toHaveValue('250.000.000')
})

it('retains exact digits beyond the safe integer range across locale changes', async () => {
  mount()
  const input = focusAmount()
  insert(input, '9007199254740993')
  expect(input).toHaveValue('9.007.199.254.740.993')
  fireEvent.blur(input)
  expect(input).toHaveValue('9.007.199.254.740.993')
  expect(input).toBeValid()
  expect(rawAmount()).toBe('9007199254740993')
  await setAppLanguage('en', false)
  expect(input).toHaveValue('9,007,199,254,740,993')
  expect(input).toBeValid()
  expect(rawAmount()).toBe('9007199254740993')
})

it('rejects text, negative, fractional, exponent and overlong input without changing the amount', () => {
  mount('250000000')
  const input = focusAmount()
  for (const value of ['abc', '-100', '12,5', '12.5', '1e6', '10000000000000000']) {
    fireEvent.change(input, { target: { value } })
    expect(input).toHaveValue('250.000.000')
    expect(rawAmount()).toBe('250000000')
  }
  input.setSelectionRange(0, input.value.length)
  paste(input, '1.250.000')
  expect(rawAmount()).toBe('1250000')
  fireEvent.change(input, { target: { value: '' } })
  expect(rawAmount()).toBe('')
  expect(input).toBeInvalid()
})

it('loads resubmission values and forwards the server field error to the visible control', () => {
  mount('123200000', true)
  const input = screen.getByRole('textbox')
  expect(input).toHaveValue('123.200.000')
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription('Kiểm tra các trường được đánh dấu')
  expect(rawAmount()).toBe('123200000')
})

it('allows zero for known year-end needs', () => {
  mount('0')
  expect(screen.getByRole('textbox')).toHaveValue('0')
  expect(screen.getByRole('textbox')).toBeValid()
  expect(rawAmount()).toBe('0')
})

it('blocks malformed or fractional pastes in both locales', async () => {
  mount('0')
  const input = focusAmount()
  input.setSelectionRange(0, 1)
  paste(input, '1.250.000')
  expect(input).toHaveValue('1.250.000')
  for (const value of ['-100', '1e6', '12,5', '12.5', 'abc']) {
    paste(input, value)
    expect(input).toHaveValue('1.250.000')
  }
  await setAppLanguage('en', false)
  input.setSelectionRange(0, input.value.length)
  paste(input, '2,500,000')
  expect(input).toHaveValue('2,500,000')
  paste(input, '12,5')
  paste(input, '12.5')
  expect(input).toHaveValue('2,500,000')
  fireEvent.blur(input)
  expect(input).toHaveValue('2,500,000')
})

it('marks an overlong initial value invalid instead of submitting it', () => {
  mount('10000000000000000')
  expect(screen.getByRole('textbox')).toBeInvalid()
})

it('preserves the caret for insertion, replacement and paste in the middle', () => {
  mount('123456')
  const input = focusAmount()
  input.setSelectionRange(3, 3)
  insert(input, '9')
  expect(input).toHaveValue('1.239.456')
  expect(input.selectionStart).toBe(5)
  input.setSelectionRange(3, 5)
  insert(input, '80')
  expect(input).toHaveValue('1.280.456')
  expect(input.selectionStart).toBe(5)
  input.setSelectionRange(3, 5)
  paste(input, '90')
  expect(input).toHaveValue('1.290.456')
  expect(input.selectionStart).toBe(5)
  expect(rawAmount()).toBe('1290456')
})

it('allows backspace, delete and clearing the field without reintroducing digits', () => {
  mount('1000')
  const input = focusAmount()
  erase(input, 'Backspace')
  expect(input).toHaveValue('100')
  input.setSelectionRange(0, 0)
  erase(input, 'Delete')
  expect(input).toHaveValue('0')
  expect(rawAmount()).toBe('0')
  input.setSelectionRange(0, input.value.length)
  erase(input, 'Backspace')
  expect(input).toHaveValue('')
  expect(rawAmount()).toBe('')
  expect(input).toBeInvalid()
})

it('deletes digits across separators with Backspace and Delete', () => {
  mount('12345')
  const input = focusAmount()
  input.setSelectionRange(3, 3)
  erase(input, 'Backspace')
  expect(input).toHaveValue('1.345')
  expect(input.selectionStart).toBe(1)
  erase(input, 'Delete')
  expect(input).toHaveValue('145')
  expect(input.selectionStart).toBe(1)
  erase(input, 'Backspace')
  expect(input).toHaveValue('45')
})

it('handles mobile separator deletion and composition without blocking numeric keys', () => {
  mount('1234')
  const input = focusAmount()
  fireEvent.input(input, {
    target: { value: '1234', selectionStart: 1, selectionEnd: 1 },
    inputType: 'deleteContentBackward'
  })
  expect(input).toHaveValue('234')
  input.setSelectionRange(0, input.value.length)
  fireEvent.compositionStart(input)
  fireEvent.input(input, {
    target: { value: '250000', selectionStart: 6, selectionEnd: 6 },
    inputType: 'insertCompositionText'
  })
  fireEvent.compositionEnd(input)
  expect(input).toHaveValue('250.000')
  expect(rawAmount()).toBe('250000')
  expect(input.selectionStart).toBe(7)
})
