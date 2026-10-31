import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NeedDecisionBodyDtoSpend } from '~/shared/api/generated/model/access-requests/needDecisionBodyDtoSpend'
import { useAccessRequestPlanLineSuggestionList } from '~/shared/api/generated/operations/spend-submission/access-request-plan-line-suggestion-list'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import {
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function allocationFromForm(form: FormData): NeedDecisionBodyDtoSpend {
  const date = String(form.get('expectedSpendOn') ?? '')
  return {
    ...(form.get('offPlan') === 'on'
      ? { offPlan: true }
      : {
          planLine: {
            position: Number(form.get('position')),
            ...(form.get('stillNeeded') === 'on' ? { stillNeeded: true } : {})
          }
        }),
    ...(date ? { expectedSpendOn: date } : {})
  }
}
export function ManagerPlanAllocation({
  id,
  required = true,
  includeExpectedSpend = true
}: {
  id: string
  required?: boolean
  includeExpectedSpend?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage('suggestionPage')
  const [offPlan, setOffPlan] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const query = useAccessRequestPlanLineSuggestionList(
    id,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: expanded } }
  )
  return (
    <fieldset className='space-y-3'>
      <legend className='mb-3 text-sm font-semibold'>{translate('selectPlan')}</legend>
      <label className='flex min-h-11 items-center gap-2 text-sm'>
        <input
          name='offPlan'
          type='checkbox'
          checked={offPlan}
          onChange={(event) => setOffPlan(event.target.checked)}
        />
        {translate('offPlan')}
      </label>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ManagerField label={translate('planPosition')}>
          <input
            name='position'
            type='number'
            min={1}
            step={1}
            required={required && !offPlan}
            disabled={offPlan}
            className={managerInputClass}
          />
        </ManagerField>
        {includeExpectedSpend && (
          <ManagerField label={translate('expectedSpend')}>
            <input name='expectedSpendOn' type='date' className={managerInputClass} />
          </ManagerField>
        )}
      </div>
      <label className='flex min-h-11 items-center gap-2 text-sm'>
        <input name='stillNeeded' type='checkbox' />
        {translate('stillNeeded')}
      </label>
      <details onToggle={(event) => setExpanded(event.currentTarget.open)}>
        <summary className='cursor-pointer text-sm'>{translate('suggestions')}</summary>
        <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
        {!query.isError &&
          query.data?.data?.items.map((line) => (
            <p key={line.position} className='mt-2 text-sm'>
              {line.position} · {line.description}
            </p>
          ))}
        <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </details>
    </fieldset>
  )
}
