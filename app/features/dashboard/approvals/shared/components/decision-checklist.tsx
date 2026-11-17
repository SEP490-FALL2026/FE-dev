import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApprovalsQueryState } from './approvals-query-state'
import { CHECKLIST_ANSWER, type DecisionChecklist } from '../hooks/use-decision-checklist'

/**
 * Yes/No questions of a decision step; `SYSTEM` items show as answered Yes by the system.
 * With `collapsible` the questions start hidden behind a button and a one-line summary keeps the form short.
 */
export function DecisionChecklistPanel({
  checklist,
  disabled,
  collapsible = false
}: {
  checklist: DecisionChecklist
  disabled?: boolean
  collapsible?: boolean
}) {
  const { t: translate } = useTranslation('approvals')
  const [open, setOpen] = useState(!collapsible)
  const personItems = checklist.items.filter((item) => item.check === 'PERSON')
  const answered = personItems.filter((item) => checklist.answers[item.code] !== undefined).length
  return (
    <ApprovalsQueryState query={checklist.query}>
      <fieldset disabled={disabled} className='space-y-3 rounded-md border border-border/70 p-4'>
        <legend className='px-1 text-sm font-medium'>{translate('checklist.title')}</legend>
        {collapsible && (
          <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
            <p className='text-muted-foreground'>
              {translate('checklist.summary', { done: answered, total: personItems.length })}
            </p>
            <button
              type='button'
              aria-expanded={open}
              onClick={() => setOpen((previous) => !previous)}
              className='inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 font-medium hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
            >
              {translate(open ? 'checklist.hide' : 'checklist.show')}
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className={`size-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
        {(open ? checklist.items : []).map((item) => {
          const system = item.check === 'SYSTEM'
          const value = system ? CHECKLIST_ANSWER.YES : checklist.answers[item.code]
          return (
            <div key={item.code} className='flex flex-wrap items-start justify-between gap-3 text-sm'>
              <p className='min-w-0 flex-1'>
                {item.text}
                {system && <span className='ml-2 text-xs text-muted-foreground'>{translate('checklist.system')}</span>}
              </p>
              <div role='radiogroup' aria-label={item.text} className='flex gap-4'>
                {([CHECKLIST_ANSWER.YES, CHECKLIST_ANSWER.NO] as const).map((answer) => (
                  <label key={answer} className='flex min-h-11 items-center gap-2'>
                    <input
                      type='radio'
                      className='size-4 accent-primary'
                      name={`checklist-${item.code}`}
                      checked={value === answer}
                      disabled={system}
                      onChange={() => checklist.setAnswer(item.code, answer)}
                    />
                    {translate(answer === CHECKLIST_ANSWER.YES ? 'checklist.yes' : 'checklist.no')}
                  </label>
                ))}
              </div>
            </div>
          )
        })}
        {checklist.hasNo && (
          <p role='status' className='text-sm text-warning-ink'>
            {translate('checklist.hasNo')}
          </p>
        )}
        {open && !checklist.complete && (
          <p className='text-xs text-muted-foreground'>{translate('checklist.incomplete')}</p>
        )}
      </fieldset>
    </ApprovalsQueryState>
  )
}
