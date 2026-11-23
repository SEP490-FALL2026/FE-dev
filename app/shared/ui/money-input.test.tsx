import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { MoneyInput, formatMoneyInput, parseMoneyInput } from './money-input'

function Harness({ onRaw }: { onRaw: (raw: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <MoneyInput
      data-testid='amount'
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onRaw(next)
      }}
    />
  )
}

describe('MoneyInput', () => {
  beforeEach(async () => {
    await setAppLanguage('vi', false)
  })

  it('shows 1000 as 1.000 in Vietnamese while keeping the plain number', () => {
    let raw = ''
    render(<Harness onRaw={(next) => (raw = next)} />)
    const input = screen.getByTestId('amount') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1000' } })
    expect(input.value).toBe('1.000')
    expect(raw).toBe('1000')
    fireEvent.change(input, { target: { value: '1.000.000' } })
    expect(input.value).toBe('1.000.000')
    expect(raw).toBe('1000000')
  })

  it('uses a comma for the group in English', async () => {
    await setAppLanguage('en', false)
    let raw = ''
    render(<Harness onRaw={(next) => (raw = next)} />)
    const input = screen.getByTestId('amount') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1234567.5' } })
    expect(input.value).toBe('1,234,567.5')
    expect(raw).toBe('1234567.5')
  })

  it('keeps exact digits beyond the safe integer range and drops letters', () => {
    expect(parseMoneyInput('9007199254740993,25', 'vi')).toBe('9007199254740993.25')
    expect(formatMoneyInput('9007199254740993.25', 'vi')).toBe('9.007.199.254.740.993,25')
    expect(parseMoneyInput('12ab3', 'vi')).toBe('123')
    expect(parseMoneyInput('007', 'vi')).toBe('7')
    expect(parseMoneyInput(',5', 'vi')).toBe('0.5')
  })

  it('reads a pasted plain decimal as a decimal and a three digit tail as a group', () => {
    expect(parseMoneyInput('1000.5', 'vi')).toBe('1000.5')
    expect(parseMoneyInput('1.000', 'vi')).toBe('1000')
  })
})
