import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { useTranslation } from 'react-i18next'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import type { GroupCheckResponseDtoDataLinesItemReason } from '~/shared/api/generated/model/group-requests/groupCheckResponseDtoDataLinesItemReason'
import { groupRequestSubmit } from '~/shared/api/generated/operations/group-requests/group-request-submit'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { ManagerGroupConfirmation } from '../components/manager-group-confirmation'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { ManagerPeoplePicker } from '../../shared/components/manager-people-picker'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'
import { ManagerCatalogPicker, type ManagerCatalogPlan } from '../components/manager-catalog-picker'
import { ManagerRequestSummary } from '../components/manager-request-summary'
import { ManagerGroupEndDates } from '../components/manager-group-end-dates'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerLiveCreate({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const [people, setPeople] = useState<ManagerChoice[]>([])
  const [plan, setPlan] = useState<ManagerCatalogPlan | null>(null)
  const [created, setCreated] = useState<string[]>([])
  const [pending, setPending] = useState<GroupBodyDto | null>(null)
  const [termMonths, setTermMonths] = useState('')
  const [dates, setDates] = useState<Record<string, string>>({})
  const [dateIssues, setDateIssues] = useState<Record<string, GroupCheckResponseDtoDataLinesItemReason>>({})
  const termRequired = Number(termMonths) > 12
  const action = useManagerAction({
    mutationFn: (body: GroupBodyDto) => groupRequestSubmit(body),
    invalidate: [getSpendQueueListQueryKey()],
    onSuccess: (result) => {
      setCreated(result.data ? [result.data.request.id] : [])
      setPending(null)
    }
  })
  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('group')} icon={FilePlus2} description={translate('groupHint')} />
      <ManagerSection title={translate('create')}>
        <ManagerFormErrors fields={action.fields}>
          <form
            className='space-y-5'
            onSubmit={(event) => {
              event.preventDefault()
              if (action.blocked || pending || !plan?.canSubmit || !people.length || people.length > 10) return
              const form = new FormData(event.currentTarget)
              const planId = plan.id
              const businessReason = String(form.get('businessReason')).trim()
              const months = Number(termMonths)
              const expectedSpendOn = String(form.get('expectedSpendOn') ?? '')
              const term = String(form.get('termConfirmation') ?? '').trim()
              if (!businessReason || !Number.isInteger(months) || months < 1 || months > 120 || (termRequired && !term))
                return
              const common = {
                businessReason,
                termMonths: months,
                ...(termRequired ? { termConfirmation: { reason: term } } : {})
              }
              setPending({
                ...common,
                planId,
                lines: people.map((person) => ({
                  employeeId: person.value,
                  ...(dates[person.value] ? { expectedEndDate: dates[person.value] } : {})
                })),
                ...(expectedSpendOn ? { expectedSpendOn } : {})
              })
            }}
          >
            <fieldset disabled={action.blocked || !!pending} className='space-y-4'>
              <div className='space-y-4'>
                <ManagerCatalogPicker
                  value={plan}
                  onChange={setPlan}
                  disabled={action.blocked}
                  invalid={action.fields.includes('planId')}
                />
                <ManagerField label={translate('months')}>
                  <input
                    className={managerInputClass}
                    name='termMonths'
                    type='number'
                    min={1}
                    max={120}
                    step={1}
                    required
                    value={termMonths}
                    onChange={(event) => setTermMonths(event.target.value)}
                  />
                </ManagerField>
              </div>
              <ManagerPeoplePicker
                value={people}
                onChange={(selected) => {
                  setPeople(selected)
                  setDates((previous) =>
                    Object.fromEntries(selected.map((person) => [person.value, previous[person.value] ?? '']))
                  )
                  setDateIssues({})
                }}
                disabled={action.blocked}
                multiple
                limit={10}
                invalid={action.fields.some((field) => field.startsWith('lines.'))}
              />
              {!!people.length && (
                <ManagerGroupEndDates
                  people={people}
                  dates={dates}
                  issues={dateIssues}
                  onChange={(value) => {
                    setDates(value)
                    setDateIssues((previous) =>
                      Object.fromEntries(
                        Object.entries(previous).filter(([employeeId]) => dates[employeeId] === value[employeeId])
                      )
                    )
                  }}
                />
              )}
              <ManagerField label={translate('reason')}>
                <textarea className={managerInputClass} name='businessReason' required maxLength={1000} />
              </ManagerField>
              <div className='grid gap-4 sm:grid-cols-2'>
                <ManagerField label={translate('expectedSpend')}>
                  <input className={managerInputClass} name='expectedSpendOn' type='date' />
                </ManagerField>
                {termRequired && (
                  <ManagerField label={translate('requestForm.termConfirmation')}>
                    <textarea className={managerInputClass} name='termConfirmation' required maxLength={1000} />
                  </ManagerField>
                )}
              </div>
            </fieldset>
            <ManagerActionState action={action} />
            <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              <ManagerButton
                primary
                type='submit'
                disabled={action.blocked || !!pending || !plan?.canSubmit || !people.length || people.length > 10}
                busy={action.isPending}
              >
                {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('submit')}
              </ManagerButton>
            </div>
          </form>
        </ManagerFormErrors>
      </ManagerSection>
      {!!created.length && (
        <ManagerSection title={translate('created')}>
          {created.map((id) => (
            <div key={id} className='flex flex-wrap justify-between gap-3'>
              <p className='break-all text-right font-mono text-sm'>{id}</p>
              <ManagerButton onClick={() => onOpen(id)}>{translate('open')}</ManagerButton>
            </div>
          ))}
        </ManagerSection>
      )}
      {pending && plan && (
        <Dialog
          presentation='sheet'
          title={translate('create')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setPending(null)
          }}
        >
          <div className='space-y-4'>
            <ManagerRequestSummary
              plan={{ value: plan.id, label: plan.name, description: plan.application.name }}
              people={people}
            />
            <ManagerGroupConfirmation
              body={pending}
              people={people}
              blocked={action.blocked}
              busy={action.isPending}
              onCancel={() => setPending(null)}
              onEditDates={(issues) => {
                setDateIssues(Object.fromEntries(issues.map((issue) => [issue.employeeId, issue.reason])))
                setPending(null)
              }}
              onConfirm={() => {
                if (!action.blocked) action.mutate(pending)
              }}
            />
          </div>
        </Dialog>
      )}
    </div>
  )
}
