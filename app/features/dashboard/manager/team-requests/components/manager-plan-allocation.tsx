import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NeedDecisionBodyDtoSpend } from '~/shared/api/generated/model/access-requests/needDecisionBodyDtoSpend'
import type { SuggestionListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-submission/suggestionListResponseDtoDataItemsItem'
import { useAccessRequestPlanLineSuggestionList } from '~/shared/api/generated/operations/spend-submission/access-request-plan-line-suggestion-list'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerChoiceSelect } from '../../shared/components/manager-choice-select'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatDecimalMoney } from '~/shared/lib/format-decimal-money'
import {
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function allocationFromForm(form: FormData): NeedDecisionBodyDtoSpend | null {
  const date = String(form.get('expectedSpendOn') ?? '')
  const position = Number(form.get('position'))
  const offPlan = form.get('offPlan') === 'on'
  if (!offPlan && (!Number.isSafeInteger(position) || position < 1)) return null
  return {
    ...(offPlan
      ? { offPlan: true }
      : {
          planLine: {
            position,
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
  const { t: translate, i18n } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage('suggestionPage')
  const [offPlan, setOffPlan] = useState(false)
  const [selection, setSelection] = useState<{ line: SuggestionListResponseDtoDataItemsItem; page: number } | null>(
    null
  )
  const query = useAccessRequestPlanLineSuggestionList(
    id,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !offPlan } }
  )
  const lines = !query.isError ? (query.data?.data?.items ?? []) : []
  const selected =
    selection?.page === paging.page ? lines.find((line) => line.position === selection.line.position) : selection?.line
  const available = query.isSuccess && !query.isFetching && !!selected
  const choice = (line: SuggestionListResponseDtoDataItemsItem) => ({
    value: String(line.position),
    label: line.description,
    description: [
      line.plan?.planName,
      formatDecimalMoney(line.amount, i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'),
      translate('requestForm.budgetWindow', {
        from: formatDate(line.windowFrom),
        to: formatDate(line.windowTo)
      }),
      line.suggested ? translate('requestForm.suggested') : ''
    ]
      .filter(Boolean)
      .join(' · ')
  })
  return (
    <fieldset className='space-y-3'>
      <legend className='mb-3 text-sm font-semibold'>{translate('selectPlan')}</legend>
      <div className='flex flex-wrap gap-x-5 gap-y-2'>
        <label className='flex min-h-11 items-center gap-2 text-sm'>
          <input
            type='radio'
            name='allocationMode'
            value='plan'
            checked={!offPlan}
            onChange={() => setOffPlan(false)}
          />
          {translate('requestForm.inPlan')}
        </label>
        <label className='flex min-h-11 items-center gap-2 text-sm'>
          <input
            name='allocationMode'
            type='radio'
            value='offPlan'
            checked={offPlan}
            onChange={() => setOffPlan(true)}
          />
          {translate('offPlan')}
        </label>
      </div>
      <input type='hidden' name='offPlan' value='on' disabled={!offPlan} />
      <div className='grid gap-4 sm:grid-cols-2'>
        {!offPlan && (
          <div className='space-y-2'>
            <ManagerChoiceSelect
              label={translate('requestForm.budgetLine')}
              placeholder={translate('requestForm.chooseBudgetLine')}
              options={lines.map(choice)}
              selected={selected ? [choice(selected)] : []}
              invalid={required && !available}
              onChange={(choices) => {
                const line = lines.find((item) => String(item.position) === choices[0]?.value)
                setSelection(line ? { line, page: paging.page } : null)
              }}
              state={<ManagerQueryState query={query} empty={!lines.length} />}
              footer={
                <ManagerPagination
                  pagination={query.data?.data?.pagination}
                  onPage={paging.onPage}
                  busy={query.isFetching}
                />
              }
            />
            <input type='hidden' name='position' value={available ? selected?.position : ''} disabled={!available} />
          </div>
        )}
        {includeExpectedSpend && (
          <ManagerField label={translate('expectedSpend')}>
            <input name='expectedSpendOn' type='date' className={managerInputClass} />
          </ManagerField>
        )}
      </div>
      {!offPlan && available && selected?.overdue && (
        <label key={selected.position} className='flex min-h-11 items-center gap-2 text-sm'>
          <input name='stillNeeded' type='checkbox' required />
          <span>
            {translate('requestForm.overdue')}. {translate('stillNeeded')}
          </span>
        </label>
      )}
    </fieldset>
  )
}
