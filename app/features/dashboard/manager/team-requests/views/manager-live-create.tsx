import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { useTranslation } from 'react-i18next'
import type { DelegatedBodyDto } from '~/shared/api/generated/model/delegated-requests/delegatedBodyDto'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import { delegatedRequestSend } from '~/shared/api/generated/operations/delegated-requests/delegated-request-send'
import { groupRequestSubmit } from '~/shared/api/generated/operations/group-requests/group-request-submit'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { ManagerGroupConfirmation } from '../components/manager-group-confirmation'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { ManagerPeoplePicker } from '../../shared/components/manager-people-picker'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'
import { ManagerPlanPicker } from '../components/manager-plan-picker'
import { ManagerRequestSummary } from '../components/manager-request-summary'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerLiveCreate({ group, onOpen }: { group: boolean; onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const [people, setPeople] = useState<ManagerChoice[]>([])
  const [plan, setPlan] = useState<ManagerChoice | null>(null)
  const [created, setCreated] = useState<string[]>([])
  const [pending, setPending] = useState<
    { kind: 'group'; body: GroupBodyDto } | { kind: 'delegated'; body: DelegatedBodyDto } | null
  >(null)
  const delegated = useManagerAction({
    mutationFn: (body: DelegatedBodyDto) => delegatedRequestSend(body),
    invalidate: [getSpendQueueListQueryKey()],
    onSuccess: (result) => {
      setCreated(result.data?.requests.map((request) => request.id) ?? [])
      setPending(null)
    }
  })
  const grouped = useManagerAction({
    mutationFn: (body: GroupBodyDto) => groupRequestSubmit(body),
    invalidate: [getSpendQueueListQueryKey()],
    onSuccess: (result) => {
      setCreated(result.data ? [result.data.request.id] : [])
      setPending(null)
    }
  })
  const action = group ? grouped : delegated
  return (
    <div className='space-y-6'>
      <ManagerPageHeader
        title={translate(group ? 'group' : 'individual')}
        icon={FilePlus2}
        description={group ? translate('groupHint') : undefined}
      />
      <ManagerSection title={translate('create')}>
        <ManagerFormErrors fields={action.fields}>
          <form
            className='space-y-5'
            onSubmit={(event) => {
              event.preventDefault()
              if (action.blocked || !plan || !people.length || people.length > (group ? 10 : 1)) return
              const form = new FormData(event.currentTarget)
              const planId = plan.value
              const employeeIds = people.map((person) => person.value)
              const businessReason = String(form.get('businessReason')).trim()
              const termMonths = Number(form.get('termMonths'))
              const expectedSpendOn = String(form.get('expectedSpendOn') ?? '')
              const expectedEndDate = String(form.get('expectedEndDate') ?? '')
              const projectLabel = String(form.get('projectLabel') ?? '').trim()
              const term = String(form.get('termConfirmation') ?? '').trim()
              const common = {
                businessReason,
                termMonths,
                ...(projectLabel ? { projectLabel } : {}),
                ...(term ? { termConfirmation: { reason: term } } : {})
              }
              if (group)
                setPending({
                  kind: 'group',
                  body: {
                    ...common,
                    planId,
                    lines: employeeIds.map((employeeId) => ({
                      employeeId,
                      ...(expectedEndDate ? { expectedEndDate } : {})
                    })),
                    ...(expectedSpendOn ? { expectedSpendOn } : {})
                  }
                })
              else
                setPending({
                  kind: 'delegated',
                  body: {
                    ...common,
                    beneficiaryEmployeeIds: employeeIds,
                    items: [{ planId, ...(expectedSpendOn ? { expectedSpendOn } : {}) }],
                    ...(expectedEndDate ? { expectedEndDate } : {})
                  }
                })
            }}
          >
            <fieldset disabled={action.blocked} className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <ManagerPlanPicker
                  value={plan}
                  onChange={setPlan}
                  disabled={action.blocked}
                  invalid={action.fields.some((field) => field === 'planId' || field.startsWith('items.'))}
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
                  />
                </ManagerField>
              </div>
              <ManagerPeoplePicker
                value={people}
                onChange={setPeople}
                disabled={action.blocked}
                multiple={group}
                limit={group ? 10 : 1}
                invalid={action.fields.some(
                  (field) => field.startsWith('beneficiaryEmployeeIds') || field.startsWith('lines.')
                )}
              />
              <ManagerField label={translate('reason')}>
                <textarea className={managerInputClass} name='businessReason' required maxLength={1000} />
              </ManagerField>
              <div className='grid gap-4 sm:grid-cols-2'>
                <ManagerField label={translate('expectedSpend')}>
                  <input className={managerInputClass} name='expectedSpendOn' type='date' />
                </ManagerField>
                <ManagerField label={translate('endDate')}>
                  <input className={managerInputClass} name='expectedEndDate' type='date' />
                </ManagerField>
                <ManagerField label={translate('project')}>
                  <input className={managerInputClass} name='projectLabel' maxLength={200} />
                </ManagerField>
                <ManagerField label={translate('termConfirmation')}>
                  <textarea className={managerInputClass} name='termConfirmation' maxLength={1000} />
                </ManagerField>
              </div>
            </fieldset>
            <ManagerActionState action={action} />
            <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              <ManagerButton
                primary
                type='submit'
                disabled={action.blocked || !plan || !people.length || people.length > (group ? 10 : 1)}
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
            <ManagerRequestSummary plan={plan} people={people} />
            {pending.kind === 'group' ? (
              <ManagerGroupConfirmation
                body={pending.body}
                blocked={action.blocked}
                busy={action.isPending}
                onCancel={() => setPending(null)}
                onConfirm={() => {
                  if (!grouped.blocked) grouped.mutate(pending.body)
                }}
              />
            ) : (
              <div className='flex justify-end gap-3'>
                <ManagerButton disabled={action.isPending} onClick={() => setPending(null)}>
                  {translate('cancel')}
                </ManagerButton>
                <ManagerButton
                  primary
                  busy={action.isPending}
                  disabled={action.blocked}
                  onClick={() => {
                    if (action.blocked) return
                    delegated.mutate(pending.body)
                  }}
                >
                  {translate('confirm')}
                </ManagerButton>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  )
}
