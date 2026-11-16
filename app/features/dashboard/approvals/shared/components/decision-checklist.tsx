import { useTranslation } from 'react-i18next'
import { ApprovalsQueryState } from './approvals-query-state'
import { CHECKLIST_ANSWER, type DecisionChecklist } from '../hooks/use-decision-checklist'

/** Yes/No questions of a decision step; `SYSTEM` items show as answered Yes by the system. */
export function DecisionChecklistPanel({ checklist, disabled }: { checklist: DecisionChecklist; disabled?: boolean }) {
  const { t: translate } = useTranslation('approvals')
  return (
    <ApprovalsQueryState query={checklist.query}>
      <fieldset disabled={disabled} className='space-y-3 rounded-md border border-border/70 p-4'>
        <legend className='px-1 text-sm font-medium'>{translate('checklist.title')}</legend>
        {checklist.items.map((item) => {
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
        {!checklist.complete && <p className='text-xs text-muted-foreground'>{translate('checklist.incomplete')}</p>}
      </fieldset>
    </ApprovalsQueryState>
  )
}
