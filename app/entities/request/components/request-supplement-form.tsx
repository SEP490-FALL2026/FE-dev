import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplementBodyDto } from '~/shared/api/generated/model/spend-submission/supplementBodyDto'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'
import { useAccessRequestLineList } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { termRule, termMonthsPayload } from '../term-months'
import { GROUP_LINE_STATE } from '../enums/group-line-state'

/** The spend supplement may only shorten the term and remove need-confirmed group members. */
export function RequestSupplementForm({
  id,
  planId,
  termMonths,
  group,
  disabled,
  onSubmit
}: {
  id: string
  planId?: string
  termMonths?: number | null
  group: boolean
  disabled: boolean
  onSubmit: (body: SupplementBodyDto) => void
}) {
  const { t: translate } = useTranslation('requestFlow')
  const [term, setTerm] = useState('')
  const [drop, setDrop] = useState<string[]>([])
  const plan = useRequestablePlanGet(planId ?? '', { query: { enabled: !!planId } })
  const rule = termRule(!plan.isError ? plan.data?.data?.provisioningType : undefined)
  const max = Math.min(rule.maxMonths, termMonths ? termMonths - 1 : rule.maxMonths)
  const canShorten = rule.asked && max >= 1 && !plan.isFetching
  const lines = useAccessRequestLineList(id, { page: 1, pageSize: 100 }, { query: { enabled: group } })
  const removable =
    !lines.isError && !lines.isFetching && lines.data?.data?.pagination.totalPages === 1
      ? lines.data.data.items.filter((line) => line.state === GROUP_LINE_STATE.NEED_CONFIRMED)
      : []
  const validDrop =
    drop.length < removable.length &&
    drop.every((employeeId) => removable.some((line) => line.employee.employeeId === employeeId))
  const months = term ? Number(term) : undefined
  const validTerm = months === undefined || (canShorten && Number.isInteger(months) && months >= 1 && months <= max)
  const ready = validTerm && (!drop.length || validDrop) && (months !== undefined || drop.length > 0)
  const inputClass = 'min-h-11 w-full rounded-md border border-border bg-background p-3 text-base md:text-sm'
  const buttonClass = 'min-h-11 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-50'
  return (
    <form
      className='space-y-4'
      onSubmit={(event) => {
        event.preventDefault()
        const reason = String(new FormData(event.currentTarget).get('reason') ?? '').trim()
        if (disabled || !ready || !reason) return
        onSubmit({ reason, ...termMonthsPayload(months), ...(drop.length ? { dropEmployeeIds: drop } : {}) })
      }}
    >
      <fieldset disabled={disabled} className='space-y-4'>
        {plan.isError && (
          <button type='button' className={buttonClass} onClick={() => void plan.refetch()}>
            {translate('retry')}
          </button>
        )}
        {canShorten && (
          <label className='grid gap-2 text-sm'>
            {translate('termMonths')}
            <input
              className={`${inputClass} text-right font-mono tabular-nums`}
              type='number'
              inputMode='numeric'
              name='termMonths'
              min={1}
              max={max}
              step={1}
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-describedby={`${id}-term-hint`}
            />
            <span id={`${id}-term-hint`} className='text-xs text-muted-foreground'>
              {translate('supplementTermHint')}
            </span>
          </label>
        )}
        {group && (
          <div>
            <p className='text-sm'>{translate('dropMembers')}</p>
            {lines.isError ? (
              <button type='button' className={buttonClass} onClick={() => void lines.refetch()}>
                {translate('retry')}
              </button>
            ) : lines.isFetching ? (
              <p role='status'>{translate('loading')}</p>
            ) : (
              removable.map((line) => (
                <label key={line.employee.employeeId} className='flex min-h-11 items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={drop.includes(line.employee.employeeId)}
                    disabled={!drop.includes(line.employee.employeeId) && drop.length >= removable.length - 1}
                    onChange={(event) =>
                      setDrop((previous) =>
                        event.target.checked
                          ? [...previous, line.employee.employeeId]
                          : previous.filter((employeeId) => employeeId !== line.employee.employeeId)
                      )
                    }
                  />
                  {line.employee.fullName}
                </label>
              ))
            )}
          </div>
        )}
        <label className='grid gap-2 text-sm'>
          {translate('supplement')}
          <textarea className={inputClass} name='reason' required maxLength={1000} rows={3} />
        </label>
        <button className={buttonClass} type='submit' disabled={!ready}>
          {translate('save')}
        </button>
      </fieldset>
    </form>
  )
}
