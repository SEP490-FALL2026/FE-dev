import { useState } from 'react'
import { Boxes, FilePlus2 } from 'lucide-react'
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
import { ManagerCatalogPicker, type ManagerCatalogPlan } from '../../shared/components/manager-catalog-picker'
import { ManagerRequestSummary } from '../components/manager-request-summary'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { TermMonthsField } from '~/entities/request/components/term-months-field'
import { readTermMonths, termMonthsPayload } from '~/entities/request/term-months'

export function ManagerLiveCreate({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const [people, setPeople] = useState<ManagerChoice[]>([])
  const [plan, setPlan] = useState<ManagerCatalogPlan | null>(null)
  const [created, setCreated] = useState<{ id: string; label: string }[]>([])
  const [pending, setPending] = useState<GroupBodyDto | null>(null)
  const action = useManagerAction({
    mutationFn: (body: GroupBodyDto) => groupRequestSubmit(body),
    invalidate: [getSpendQueueListQueryKey()],
    onSuccess: (result) => {
      setCreated(
        result.data
          ? [{ id: result.data.request.id, label: plan ? `${plan.application.name} · ${plan.name}` : '' }]
          : []
      )
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
              if (action.blocked || pending || !plan?.canSubmit || people.length < 2 || people.length > 100) return
              const form = new FormData(event.currentTarget)
              const planId = plan.id
              const businessReason = String(form.get('businessReason')).trim()
              if (!businessReason) return
              setPending({
                businessReason,
                ...termMonthsPayload(readTermMonths(form)),
                planId,
                lines: people.map((person) => ({ employeeId: person.value }))
              })
            }}
          >
            <fieldset disabled={action.blocked || !!pending} className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='section-accent text-sm font-semibold'>{translate('ui.create.softwareStep')}</h3>
                <ManagerCatalogPicker
                  value={plan}
                  onChange={setPlan}
                  disabled={action.blocked}
                  invalid={action.fields.includes('planId')}
                />
                <TermMonthsField
                  key={plan?.id ?? 'none'}
                  subject={plan?.provisioningType}
                  invalid={action.fields.includes('termMonths')}
                  inputClassName={managerInputClass}
                />
              </div>
              <div className='space-y-4 border-t border-border/50 pt-5'>
                <h3 className='section-accent text-sm font-semibold'>{translate('ui.create.peopleStep')}</h3>
                <ManagerPeoplePicker
                  value={people}
                  onChange={setPeople}
                  disabled={action.blocked}
                  multiple
                  limit={100}
                  invalid={action.fields.some((field) => field.startsWith('lines.'))}
                />
              </div>
              <div className='space-y-4 border-t border-border/50 pt-5'>
                <h3 className='section-accent text-sm font-semibold'>{translate('ui.create.reasonStep')}</h3>
                <ManagerField label={translate('reason')}>
                  <textarea
                    className={managerInputClass}
                    name='businessReason'
                    required
                    maxLength={1000}
                    rows={3}
                    placeholder={translate('ui.placeholders.businessReason')}
                  />
                </ManagerField>
              </div>
            </fieldset>
            <ManagerActionState action={action} />
            <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              <ManagerButton
                primary
                type='submit'
                disabled={action.blocked || !!pending || !plan?.canSubmit || people.length < 2 || people.length > 100}
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
          <div className='space-y-3'>
            {created.map((item) => (
              <div
                key={item.id}
                className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface p-4 transition-colors hover:border-primary/40'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <span
                    aria-hidden='true'
                    className='grid size-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-5' />
                  </span>
                  <p className='min-w-0 truncate text-sm font-semibold text-foreground' title={item.label}>
                    {item.label}
                  </p>
                </div>
                <ManagerButton onClick={() => onOpen(item.id)}>{translate('open')}</ManagerButton>
              </div>
            ))}
          </div>
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
