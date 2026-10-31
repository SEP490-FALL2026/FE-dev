import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useHandoverDutyList,
  getHandoverDutyListQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import {
  useHandoverDutyGet,
  getHandoverDutyGetQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-get'
import { useHandoverDutyConfirm } from '~/shared/api/generated/operations/handover-duties/handover-duty-confirm'
import { ConfirmHandoverBodyDtoValue } from '~/shared/api/generated/model/handover-duties/confirmHandoverBodyDtoValue'
import { useDashboardFormat, Dialog } from '../../../dashboard-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import {
  EmployeeButton,
  EmployeeField,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { HANDOVER_SOURCE, HANDOVER_STATUS, HANDOVER_VALUE, HANDOVER_ROLE } from '../enums/handover-status'

export function EmployeeHandoversView() {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const { page, pageSize, onPage } = useEmployeePage()
  const query = useHandoverDutyList({ scope: 'mine', page, pageSize })
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{translate('handovers')}</h1>
      <p className='text-sm text-muted-foreground'>{translate('handoverHint')}</p>
      <EmployeeSection title={translate('handovers')}>
        <EmployeeQueryState query={query} empty={!query.data?.data?.items.length} />
        {!query.isError &&
          query.data?.data?.items.map((duty) => (
            <article
              key={duty.id}
              className='flex flex-wrap items-center justify-between gap-4 border-b border-border/40 py-4'
            >
              <div className='min-w-0'>
                <h3 className='truncate text-sm font-semibold' title={duty.application.name}>
                  {duty.application.name} · {duty.plan.name}
                </h3>
                <p className='mt-1 text-right font-mono text-xs tabular-nums'>
                  {translate('dueOn')}: {formatDate(duty.dueOn)}
                </p>
                {duty.overdue && <p className='text-xs text-warning'>{translate('overdue')}</p>}
              </div>
              <div className='flex items-center gap-3'>
                <EmployeeStatus value={duty.status} />
                <EmployeeButton onClick={() => setSelected(duty.id)}>{translate('open')}</EmployeeButton>
              </div>
            </article>
          ))}
        <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      </EmployeeSection>
      {selected && <HandoverDialog key={selected} id={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function HandoverDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('employee')
  const query = useHandoverDutyGet(id)
  const duty = !query.isError ? query.data?.data : undefined
  const [value, setValue] = useState<ConfirmHandoverBodyDtoValue>(HANDOVER_VALUE.HANDLED)
  const feedback = useEmployeeFeedback([getHandoverDutyListQueryKey(), getHandoverDutyGetQueryKey(id)])
  const mutation = useHandoverDutyConfirm({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async () => {
        await feedback.onSuccess()
        onClose()
      }
    }
  })
  const departure = duty?.source === HANDOVER_SOURCE.DEPARTURE && duty.role === HANDOVER_ROLE.REQUESTER
  const choices: ConfirmHandoverBodyDtoValue[] = departure
    ? [HANDOVER_VALUE.HANDED_OVER, HANDOVER_VALUE.NOT_NEEDED]
    : [HANDOVER_VALUE.HANDLED]
  const selectedValue = choices.includes(value) ? value : choices[0]
  const knownSource = !!duty && Object.values(HANDOVER_SOURCE).includes(duty.source)
  const knownRole = !!duty && Object.values(HANDOVER_ROLE).includes(duty.role)
  return (
    <Dialog
      title={translate('handovers')}
      hint={translate('handoverHint')}
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <EmployeeQueryState query={query} empty={!duty} />
      {duty && (
        <div className='space-y-4'>
          <p className='truncate text-sm font-medium' title={duty.application.name}>
            {duty.application.name} · {duty.plan.name}
          </p>
          <EmployeeStatus value={duty.status} />
          {duty.canConfirm && knownSource && knownRole && duty.status === HANDOVER_STATUS.OPEN && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (!mutation.isPending && !feedback.blocked) mutation.mutate({ id, data: { value: selectedValue } })
              }}
            >
              <EmployeeField label={translate('handoverValue')}>
                <select
                  className={employeeInputClass}
                  value={selectedValue}
                  onChange={(event) => {
                    const selected = choices.find((choice) => choice === event.target.value)
                    if (selected) setValue(selected)
                  }}
                  disabled={mutation.isPending}
                >
                  {choices.map((choice) => (
                    <option key={choice} value={choice}>
                      {translate(`statuses.${choice}`)}
                    </option>
                  ))}
                </select>
              </EmployeeField>
              <div className='mt-5 flex justify-end'>
                <EmployeeButton primary type='submit' busy={mutation.isPending} disabled={feedback.blocked}>
                  {feedback.retrySeconds
                    ? translate('retryAfter', { seconds: feedback.retrySeconds })
                    : translate('confirm')}
                </EmployeeButton>
              </div>
            </form>
          )}
        </div>
      )}
    </Dialog>
  )
}
