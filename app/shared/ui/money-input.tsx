import { useLayoutEffect, useRef, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

interface Separators {
  group: string
  decimal: string
}

function separatorsOf(locale: string): Separators {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.5)
  return {
    group: parts.find((part) => part.type === 'group')?.value ?? ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.'
  }
}

/** Reads what a person typed or pasted into the plain decimal string the API uses ("1.000,5" in vi becomes "1000.5"). */
export function parseMoneyInput(text: string, locale: string): string {
  const { decimal } = separatorsOf(locale)
  let cleaned = text.trim()
  // A pasted plain decimal such as 1000.5 is not a grouping: a group always has three digits after it.
  if (decimal !== '.' && /^\d+\.\d{1,2}$/.test(cleaned)) cleaned = cleaned.replace('.', decimal)
  let result = ''
  let hasDecimal = false
  for (const char of cleaned) {
    if (char >= '0' && char <= '9') result += char
    else if (char === decimal && !hasDecimal) {
      result += '.'
      hasDecimal = true
    }
  }
  if (result.startsWith('.')) result = `0${result}`
  return result.replace(/^0+(?=\d)/, '')
}

/** Groups the digits of a plain decimal string by thousands for the locale; the fraction is left as typed. */
export function formatMoneyInput(raw: string, locale: string): string {
  const { group, decimal } = separatorsOf(locale)
  if (!/^\d*(?:\.\d*)?$/.test(raw)) return raw
  const [integer, fraction] = raw.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, group)
  return fraction === undefined ? grouped : `${grouped}${decimal}${fraction}`
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  /** The plain decimal string, for example "1000.5"; the field shows it grouped by thousands. */
  value: string
  onValueChange: (value: string) => void
}

const isDigit = (char: string) => char >= '0' && char <= '9'

/** Amount field that shows 1000 as 1.000 (vi) or 1,000 (en) while the form keeps the plain number. */
export function MoneyInput({ value, onValueChange, inputMode = 'decimal', maxLength, ...props }: Props) {
  const { i18n } = useTranslation()
  const locale = i18n.language
  const { decimal } = separatorsOf(locale)
  const ref = useRef<HTMLInputElement>(null)
  const caret = useRef<number | null>(null)
  const display = formatMoneyInput(value, locale)

  useLayoutEffect(() => {
    const input = ref.current
    const wanted = caret.current
    caret.current = null
    if (!input || wanted === null || document.activeElement !== input) return
    // Put the caret after the same number of digits it had before the text was regrouped.
    let seen = 0
    let position = 0
    while (position < display.length && seen < wanted) {
      if (isDigit(display[position]) || display[position] === decimal) seen += 1
      position += 1
    }
    input.setSelectionRange(position, position)
  }, [display, decimal])

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    const before = text.slice(0, event.target.selectionStart ?? text.length)
    caret.current = [...before].filter((char) => isDigit(char) || char === decimal).length
    // maxLength counts the digits of the number, not the separators the field adds.
    onValueChange(parseMoneyInput(text, locale).slice(0, maxLength))
  }

  return <input {...props} ref={ref} inputMode={inputMode} autoComplete='off' value={display} onChange={change} />
}
