import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { termRule, type TermSubject } from '../term-months'
import { isTermRefusal } from '../enums/term-refusal'

/**
 * Numeric months are required unless long-term use is explicitly selected; K4 has no term field.
 * The server checks employment eligibility and exposes any refusal under the field.
 */
export function TermMonthsField({
  subject,
  refusal,
  invalid,
  defaultMonths,
  maxMonths,
  inputClassName,
  placeholder,
  onChange
}: {
  subject: TermSubject | null | undefined
  refusal?: string | null
  invalid?: boolean
  defaultMonths?: number | null
  /** Lowers the upper bound, e.g. a supplement may only shorten the term. */
  maxMonths?: number
  inputClassName: string
  /** Optional example shown in the empty months field. */
  placeholder?: string
  onChange?: (months: number | undefined) => void
}) {
  const { t: translate } = useTranslation('requestFlow')
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const rule = termRule(subject)
  const [longTerm, setLongTerm] = useState(!rule.required && defaultMonths === null)
  if (!rule.asked) return null
  const max = Math.min(rule.maxMonths, maxMonths ?? rule.maxMonths)
  const refusalText = isTermRefusal(refusal) ? translate(`termRefusal.${refusal}`) : undefined
  const hintId = `${id}-hint`
  return (
    <div className='grid gap-2 text-sm'>
      <label htmlFor={id} className='font-medium'>
        {translate('termMonths')}
      </label>
      <input
        id={id}
        ref={input}
        name='termMonths'
        type='number'
        inputMode='numeric'
        min={1}
        max={max}
        step={1}
        required={!longTerm}
        disabled={longTerm}
        defaultValue={defaultMonths ?? undefined}
        placeholder={placeholder}
        aria-invalid={invalid || !!refusalText || undefined}
        aria-describedby={hintId}
        className={inputClassName}
        onChange={(event) => {
          const value = event.target.valueAsNumber
          onChange?.(Number.isInteger(value) && value > 0 ? value : undefined)
        }}
      />
      {!rule.required && (
        <label className='flex min-h-11 items-center gap-2'>
          <input
            type='checkbox'
            checked={longTerm}
            onChange={(event) => {
              setLongTerm(event.target.checked)
              onChange?.(event.target.checked ? undefined : input.current?.valueAsNumber || undefined)
            }}
          />
          {translate('longTerm')}
        </label>
      )}
      <p id={hintId} className={`text-xs ${refusalText ? 'text-danger' : 'text-muted-foreground'}`}>
        {refusalText ?? translate(rule.required ? 'termHintRequired' : 'termHint', { max })}
      </p>
    </div>
  )
}
