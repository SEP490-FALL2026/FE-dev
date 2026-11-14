import { useTranslation } from 'react-i18next'
import type {
  RevocationCompletionBodyDtoK1Checklist,
  TaskResponseDtoDataTaskK1Checklist
} from '~/shared/api/generated/model'
import { itInputClass } from '../../shared/components/it-form'

type ChecklistTemplate = NonNullable<TaskResponseDtoDataTaskK1Checklist>
export type K1ChecklistTicks = Partial<Record<ChecklistTemplate['items'][number]['code'], string>>

// datetime-local value in the viewer's zone, so the IT Admin can correct it to the real time the step was done.
function localDateTimeNow() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function orderedItems(template: ChecklistTemplate) {
  return [...template.items].sort((first, second) => first.order - second.order)
}

/** Every step ticked, each not earlier than the step before it (the server refuses anything else with a 422). */
export function k1ChecklistProblem(template: ChecklistTemplate, ticks: K1ChecklistTicks) {
  const times = orderedItems(template).map((item) => ticks[item.code])
  if (times.some((time) => !time || Number.isNaN(new Date(time).getTime()))) return 'incomplete' as const
  const instants = times.map((time) => new Date(time ?? '').getTime())
  return instants.some((instant, index) => index > 0 && instant < instants[index - 1]) ? ('order' as const) : null
}

export function buildK1Checklist(
  template: ChecklistTemplate,
  ticks: K1ChecklistTicks
): RevocationCompletionBodyDtoK1Checklist {
  return {
    items: orderedItems(template).map((item) => ({
      code: item.code,
      done: true,
      doneAt: new Date(ticks[item.code] ?? '').toISOString()
    }))
  }
}

export function K1ChecklistFields({
  template,
  ticks,
  onChange
}: {
  template: ChecklistTemplate
  ticks: K1ChecklistTicks
  onChange: (ticks: K1ChecklistTicks) => void
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const problem = k1ChecklistProblem(template, ticks)
  return (
    <fieldset className='space-y-3 rounded-lg border border-border p-4'>
      <legend className='px-1 text-sm font-semibold'>
        {translate(`k1Checklist.variants.${template.variant}`, { defaultValue: translate('k1Checklist.title') })}
      </legend>
      <p className='text-sm text-muted-foreground [text-wrap:pretty]'>{translate('k1Checklist.hint')}</p>
      <ol className='space-y-2'>
        {orderedItems(template).map((item) => {
          const doneAt = ticks[item.code]
          const label = translate(`k1Checklist.steps.${item.code}`, { defaultValue: item.label })
          return (
            <li key={item.code} className='grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center'>
              <label className='flex items-start gap-2 text-sm'>
                <input
                  type='checkbox'
                  className='mt-0.5'
                  checked={Boolean(doneAt)}
                  onChange={(event) =>
                    onChange({ ...ticks, [item.code]: event.target.checked ? localDateTimeNow() : undefined })
                  }
                />
                <span>
                  <span className='font-mono tabular-nums text-muted-foreground'>{item.order}. </span>
                  {label}
                </span>
              </label>
              <input
                type='datetime-local'
                aria-label={translate('k1Checklist.doneAt', { step: label })}
                disabled={!doneAt}
                required={Boolean(doneAt)}
                className={`${itInputClass} sm:w-56`}
                value={doneAt ?? ''}
                onChange={(event) => onChange({ ...ticks, [item.code]: event.target.value || undefined })}
              />
            </li>
          )
        })}
      </ol>
      {problem && (
        <p role='status' className='text-sm text-warning'>
          {translate(`k1Checklist.problems.${problem}`)}
        </p>
      )}
    </fieldset>
  )
}
