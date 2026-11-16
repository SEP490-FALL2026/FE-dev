import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { CHECKLIST_ANSWER } from '../enums/checklist-answer'
import { CHECKLIST_ITEM_CHECK } from '../enums/checklist-item-check'
import type { PolicyChecklistState } from '../hooks/use-policy-checklist'
import { InlineMarkdown } from '~/shared/ui/inline-markdown'

/**
 * Questions of the policy step. `SYSTEM` questions show Yes and are locked; `PERSON` questions need Yes or No.
 * `blockingNo` tells the person whether a No still leaves reject/return (`false`) or stops the step (`true`).
 */
export function PolicyChecklist({
  checklist,
  disabled,
  blockingNo = false
}: {
  checklist: PolicyChecklistState
  disabled?: boolean
  blockingNo?: boolean
}) {
  const { t: translate } = useTranslation('policy')
  const id = useId()
  const { query, policy, items } = checklist
  if (query.isPending)
    return (
      <p role='status' className='text-sm text-muted-foreground'>
        {translate('checklist.loading')}
      </p>
    )
  if (query.isError || !policy)
    return (
      <div role='alert' className='space-y-2 text-sm'>
        <p className='text-danger-ink'>{translate('checklist.loadError')}</p>
        <button
          type='button'
          className='min-h-11 rounded-md border border-border px-4 text-sm transition-colors hover:bg-surface-subtle'
          disabled={query.isFetching}
          aria-busy={query.isFetching}
          onClick={checklist.reload}
        >
          {translate('checklist.retry')}
        </button>
      </div>
    )
  return (
    <fieldset disabled={disabled || query.isFetching} className='space-y-3'>
      <legend className='text-sm font-semibold'>{translate('checklist.title')}</legend>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='min-w-0 flex-1 text-xs text-muted-foreground'>
          {translate('checklist.version', { policy: policy.policyCode, version: policy.versionNumber })} ·{' '}
          {policy.step.title}
        </p>
        {items.some((item) => item.check === CHECKLIST_ITEM_CHECK.PERSON) && (
          <button
            type='button'
            className='min-h-9 rounded-md border border-border bg-surface px-3 text-xs font-medium transition-colors hover:bg-surface-subtle disabled:opacity-50'
            onClick={checklist.answerAllYes}
          >
            {translate('checklist.answerAllYes')}
          </button>
        )}
      </div>
      <ol
        tabIndex={0}
        aria-label={translate('checklist.title')}
        className='max-h-80 divide-y divide-border/50 overflow-y-auto overscroll-contain rounded-lg border border-border/70 focus-visible:outline-2 focus-visible:outline-primary'
      >
        {items.map((item) => {
          const name = `${id}-${item.code}`
          const system = item.check === CHECKLIST_ITEM_CHECK.SYSTEM
          const answer = checklist.answerOf(item.code, item.check)
          return (
            <li key={item.code} className='flex flex-wrap items-center justify-between gap-3 p-3 text-sm'>
              <InlineMarkdown text={item.text} className='min-w-0 flex-1 [overflow-wrap:anywhere]' />
              {system ? (
                <span className='text-xs text-muted-foreground'>
                  {translate('checklist.yes')} · {translate('checklist.systemChecked')}
                </span>
              ) : (
                <span role='radiogroup' aria-label={item.text} className='flex gap-4'>
                  {([CHECKLIST_ANSWER.YES, CHECKLIST_ANSWER.NO] as const).map((value) => (
                    <label key={value} className='flex min-h-11 items-center gap-2'>
                      <input
                        type='radio'
                        name={name}
                        value={value}
                        checked={answer === value}
                        onChange={() => checklist.setAnswer(item.code, value)}
                      />
                      {translate(value === CHECKLIST_ANSWER.YES ? 'checklist.yes' : 'checklist.no')}
                    </label>
                  ))}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!checklist.complete && <p className='text-xs text-muted-foreground'>{translate('checklist.incomplete')}</p>}
      {checklist.hasNo && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate(blockingNo ? 'checklist.hasNoBlocking' : 'checklist.hasNo')}
        </p>
      )}
    </fieldset>
  )
}

/** Reason text prefilled from the questions answered No, for reject/return decisions. */
export function useChecklistNoReason(checklist: PolicyChecklistState) {
  const { t: translate } = useTranslation('policy')
  return checklist.hasNo
    ? translate('checklist.noReason', { items: checklist.failedItems.map((item) => item.text).join('; ') })
    : ''
}
