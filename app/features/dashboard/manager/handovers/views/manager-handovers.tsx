import { useState } from 'react'
import { Handshake } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useTranslation } from 'react-i18next'
import {
  useHandoverDutyList,
  getHandoverDutyListQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import {
  useHandoverDutyGet,
  getHandoverDutyGetQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-get'
import { handoverDutyConfirm } from '~/shared/api/generated/operations/handover-duties/handover-duty-confirm'
import type { ConfirmHandoverBodyDto } from '~/shared/api/generated/model/handover-duties/confirmHandoverBodyDto'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { HANDOVER_ROLE, HANDOVER_SOURCE, HANDOVER_STATUS, HANDOVER_VALUE } from '../enums/handover-status'

export function ManagerHandovers() {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage()
  const query = useHandoverDutyList({ scope: 'mine', page: paging.page, pageSize: paging.pageSize })
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('handovers')} description={translate('handoverHint')} icon={Handshake} />
      <ManagerSection>
        <ManagerQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('noHandovers')}
          emptyDescription={translate('noHandoversHint')}
        />
        {!query.isError && (
          <ManagerDataTable
            label={translate('handovers')}
            items={query.data?.data?.items ?? []}
            rowKey={(duty) => duty.id}
            columns={[
              {
                key: 'application',
                label: translate('application'),
                render: (duty) => (
                  <p className='max-w-64 truncate font-medium' title={duty.application.name}>
                    {duty.application.name}
                  </p>
                )
              },
              { key: 'due', label: translate('due'), align: 'right', render: (duty) => formatDate(duty.dueOn) },
              { key: 'status', label: translate('status'), render: (duty) => <ManagerStatus value={duty.status} /> }
            ]}
            onOpen={(duty) => setSelected(duty.id)}
          />
        )}
        <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </ManagerSection>
      {selected && <HandoverDetail key={selected} id={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
function HandoverDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('manager')
  const query = useHandoverDutyGet(id)
  const duty = !query.isError ? query.data?.data : null
  const action = useManagerAction({
    mutationFn: (body: ConfirmHandoverBodyDto) => handoverDutyConfirm(id, body),
    invalidate: [getHandoverDutyListQueryKey(), getHandoverDutyGetQueryKey(id)],
    onSuccess: onClose
  })
  const departureRequester = duty?.source === HANDOVER_SOURCE.DEPARTURE && duty.role === HANDOVER_ROLE.REQUESTER
  const choices = departureRequester
    ? [HANDOVER_VALUE.HANDED_OVER, HANDOVER_VALUE.NOT_NEEDED]
    : [HANDOVER_VALUE.HANDLED]
  const known =
    !!duty && Object.values(HANDOVER_SOURCE).includes(duty.source) && Object.values(HANDOVER_ROLE).includes(duty.role)
  return (
    <Dialog
      presentation='sheet'
      title={translate('handovers')}
      hint={translate('handoverHint')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerQueryState query={query} empty={!duty} />
      {duty && (
        <div className='space-y-4'>
          <h3 className='truncate font-medium' title={duty.application.name}>
            {duty.application.name}
          </h3>
          <ManagerStatus value={duty.status} />
          {duty.canConfirm && known && duty.status === HANDOVER_STATUS.OPEN && (
            <form
              className='space-y-4'
              onSubmit={(event) => {
                event.preventDefault()
                if (action.blocked) return
                const value = choices.find((choice) => choice === new FormData(event.currentTarget).get('value'))
                if (value) action.mutate({ value })
              }}
            >
              <ManagerField label={translate('decision')}>
                <select name='value' className={managerInputClass} disabled={action.blocked}>
                  {choices.map((choice) => (
                    <option key={choice} value={choice}>
                      {translate(`statuses.${choice}`)}
                    </option>
                  ))}
                </select>
              </ManagerField>
              <ManagerActionState action={action} />
              <div className='flex justify-end'>
                <ManagerButton primary type='submit' disabled={action.blocked} busy={action.isPending}>
                  {action.retrySeconds
                    ? translate('retryAfter', { seconds: action.retrySeconds })
                    : translate('confirm')}
                </ManagerButton>
              </div>
            </form>
          )}
        </div>
      )}
    </Dialog>
  )
}
