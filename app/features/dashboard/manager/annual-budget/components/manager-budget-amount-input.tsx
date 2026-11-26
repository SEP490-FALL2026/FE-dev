import { useLayoutEffect, useRef, useState, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { formatMoneyInput } from '~/shared/ui/money-input'
import { managerInputClass } from '../../shared/components/manager-api-ui'

const digitsOf = (text: string) => text.replace(/[^0-9]/g, '')

/** Group VND live and map the caret by digit position, independently of separators. */
export function ManagerBudgetAmountInput({
  name,
  defaultValue = '',
  onPaste,
  onKeyDown,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'defaultValue'> & {
  name: string
  defaultValue?: string
}) {
  const { t, i18n } = useTranslation('manager')
  const [edit, setEdit] = useState<{ amount: string; caret: number | null }>({ amount: defaultValue, caret: null })
  const [compositionValue, setCompositionValue] = useState<string | null>(null)
  const composing = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const amount = edit.amount
  const english = i18n.resolvedLanguage === 'en'
  const locale = english ? 'en' : 'vi'
  const group = english ? ',' : '.'
  const rawAmount = amount.replace(/^0+(?=\d)/, '')
  const display = formatMoneyInput(rawAmount, locale)
  const integerPattern = english ? '[0-9]{1,3}(,[0-9]{3}){0,5}|[0-9]{1,16}' : '[0-9]{1,3}(\\.[0-9]{3}){0,5}|[0-9]{1,16}'

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input || edit.caret === null || composing.current || document.activeElement !== input) return
    let position = 0
    let digits = 0
    while (position < display.length && digits < edit.caret) {
      if (/[0-9]/.test(display[position])) digits++
      position++
    }
    input.setSelectionRange(position, position)
  }, [edit, display])

  const commit = (digits: string, caret: number) => {
    if (!/^\d{0,16}$/.test(digits)) return
    const normalized = digits.replace(/^0+(?=\d)/, '')
    setEdit({
      amount: normalized,
      caret: normalized === '0' && caret > 0 ? 1 : Math.max(0, caret - (digits.length - normalized.length))
    })
  }
  const validPaste = (text: string) => {
    const groups = text.split(group)
    return (
      /^\d+$/.test(text) ||
      (groups.length > 1 && /^\d{1,3}$/.test(groups[0]) && groups.slice(1).every((part) => /^\d{3}$/.test(part)))
    )
  }

  return (
    <span className='relative block min-w-0'>
      <input type='hidden' name={name} value={rawAmount} disabled={props.disabled} />
      <input
        {...props}
        ref={inputRef}
        type='text'
        className={`${managerInputClass} pr-14 text-left font-mono tabular-nums`}
        value={compositionValue ?? display}
        onChange={(event) => {
          const text = event.target.value
          if (composing.current) {
            setCompositionValue(text)
            return
          }
          const native = event.nativeEvent as InputEvent
          if (native.inputType === 'insertText' && native.data && !/^\d+$/.test(native.data)) return
          if (!native.inputType && text.includes(group) && !validPaste(text)) return
          const digits = text.split(group).join('')
          const caret = digitsOf(text.slice(0, event.target.selectionStart ?? text.length)).length
          // Mobile keyboards may delete a separator without emitting a keydown.
          if (digits === rawAmount && text !== display && native.inputType?.startsWith('deleteContent')) {
            const index = native.inputType === 'deleteContentBackward' ? caret - 1 : caret
            if (index >= 0 && index < digits.length) commit(digits.slice(0, index) + digits.slice(index + 1), index)
            return
          }
          commit(digits, caret)
        }}
        onCompositionStart={() => {
          composing.current = true
        }}
        onCompositionEnd={(event) => {
          composing.current = false
          const text = event.currentTarget.value
          commit(
            text.split(group).join(''),
            digitsOf(text.slice(0, event.currentTarget.selectionStart ?? text.length)).length
          )
          setCompositionValue(null)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            event.defaultPrevented ||
            composing.current ||
            props.readOnly ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
          )
            return
          const input = event.currentTarget
          const start = input.selectionStart ?? 0
          if (start !== input.selectionEnd) return
          const backward = event.key === 'Backspace' && display[start - 1] === group
          const forward = event.key === 'Delete' && display[start] === group
          if (!backward && !forward) return
          event.preventDefault()
          const offset = digitsOf(display.slice(0, start)).length
          const index = backward ? offset - 1 : offset
          commit(rawAmount.slice(0, index) + rawAmount.slice(index + 1), index)
        }}
        onPaste={(event) => {
          onPaste?.(event)
          if (event.defaultPrevented || props.readOnly) return
          event.preventDefault()
          const pasted = event.clipboardData.getData('text').trim()
          if (!validPaste(pasted)) return
          const input = event.currentTarget
          const digits = pasted.split(group).join('')
          const start = digitsOf(display.slice(0, input.selectionStart ?? display.length)).length
          const end = digitsOf(display.slice(0, input.selectionEnd ?? display.length)).length
          commit(rawAmount.slice(0, start) + digits + rawAmount.slice(end), start + digits.length)
        }}
        inputMode='numeric'
        autoComplete='off'
        pattern={amount.length > 16 ? '(?!)' : integerPattern}
        title={t('ui.amountFormat')}
      />
      <span
        aria-hidden
        className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground'
      >
        {t('ui.currency')}
      </span>
    </span>
  )
}
