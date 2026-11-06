import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { useTranslation } from 'react-i18next'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import { groupRequestSubmit } from '~/shared/api/generated/operations/group-requests/group-request-submit'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { ManagerGroupConfirmation } from '../components/manager-group-confirmation'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { ManagerPeoplePicker } from '../../shared/components/manager-people-picker'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'
import { ManagerCatalogPicker, type ManagerCatalogPlan } from '../components/manager-catalog-picker'
import { ManagerRequestSummary } from '../components/manager-request-summary'
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
      <ManagerSection title={translate('groupDetails')}>
        <ManagerFormErrors fields={action.fields}>
          <form
            className='space-y-5'
            onSubmit={(event) => {
              event.preventDefault()
              if (action.blocked || pending || !plan?.canSubmit || people.length < 2 || people.length > 10) return
              const form = new FormData(event.currentTarget)
              const planId = plan.id
              const businessReason = String(form.get('businessReason')).trim()
              const months = Number(termMonths)
              if (!businessReason || !Number.isInteger(months) || months < 1 || months > 12) return
              setPending({
                businessReason,
                termMonths: months,
                planId,
                lines: people.map((person) => ({ employeeId: person.value }))
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
                    max={12}
                    step={1}
                    required
                    value={termMonths}
                    onChange={(event) => setTermMonths(event.target.value)}
                  />
                </ManagerField>
              </div>
              <ManagerPeoplePicker
                value={people}
                onChange={setPeople}
                disabled={action.blocked}
                multiple
                limit={10}
                invalid={action.fields.some((field) => field.startsWith('lines.'))}
              />
              <ManagerField label={translate('reason')}>
                <textarea className={managerInputClass} name='businessReason' required maxLength={1000} />
              </ManagerField>
            </fieldset>
            <ManagerActionState action={action} />
            <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              <ManagerButton
                primary
                type='submit'
                disabled={action.blocked || !!pending || !plan?.canSubmit || people.length < 2 || people.length > 10}
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
          title={translate('groupDetails')}
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
