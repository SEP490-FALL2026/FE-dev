import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { termRule, type TermSubject } from '../term-months'
import { isTermRefusal } from '../enums/term-refusal'

/**
 * "Thời gian dùng" of a request (`termMonths`). Submits the field `termMonths`; left empty, set to long-term use or
 * not rendered (K4) the field is omitted from the body, which the contract reads as long-term use. Only K1 requires
 * months. The server's `termRefusal` is shown under the field.
 */
export function TermMonthsField({
  subject,
  refusal,
  invalid,
  defaultMonths,
  maxMonths,
  inputClassName,
  onChange
}: {
  subject: TermSubject | null | undefined
  refusal?: string | null
  invalid?: boolean
  defaultMonths?: number | null
  /** Lowers the upper bound, e.g. a supplement may only shorten the term. */
  maxMonths?: number
  inputClassName: string
  onChange?: () => void
}) {
  const { t: translate } = useTranslation('requestFlow')
  const id = useId()
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
        name='termMonths'
        type='number'
        inputMode='numeric'
        min={1}
        max={max}
        step={1}
        required={rule.required}
        disabled={longTerm}
        defaultValue={defaultMonths ?? undefined}
        aria-invalid={invalid || !!refusalText || undefined}
        aria-describedby={hintId}
        className={inputClassName}
        onChange={onChange}
      />
      {!rule.required && (
        <label className='flex min-h-11 items-center gap-2'>
          <input
            type='checkbox'
            checked={longTerm}
            onChange={(event) => {
              setLongTerm(event.target.checked)
              onChange?.()
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
