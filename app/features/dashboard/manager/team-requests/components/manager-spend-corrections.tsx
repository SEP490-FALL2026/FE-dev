import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplementBodyDto } from '~/shared/api/generated/model/spend-submission/supplementBodyDto'
import { accessRequestSupplementAdd } from '~/shared/api/generated/operations/spend-submission/access-request-supplement-add'
import {
  useAccessRequestSupplementList,
  getAccessRequestSupplementListQueryKey
} from '~/shared/api/generated/operations/spend-submission/access-request-supplement-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useSupplementMembers } from '../hooks/use-supplement-members'
import { ManagerSupplementMembers } from './manager-supplement-members'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerSpendCorrections({ id, group = false }: { id: string; group?: boolean }) {
  const { t: translate } = useTranslation('manager')
  const [mode, setMode] = useState(false)
  const paging = useManagerPage('supplementPage')
  const query = useAccessRequestSupplementList(id, { page: paging.page, pageSize: paging.pageSize })
  return (
    <ManagerSection title={translate('supplements')}>
      <div className='flex flex-wrap gap-3'>
        <ManagerButton onClick={() => setMode(true)}>{translate('supplement')}</ManagerButton>
      </div>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((item) => (
          <p
            key={item.number}
            className='border-b border-border/40 py-3 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'
          >
            {item.reason}
          </p>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {mode && <CorrectionDialog id={id} group={group} onClose={() => setMode(false)} />}
    </ManagerSection>
  )
}
function CorrectionDialog({ id, group, onClose }: { id: string; group: boolean; onClose: () => void }) {
  const { t: flow } = useTranslation('requestFlow')
  const { t: translate } = useTranslation('manager')
  const [dropEmployeeIds, setDropEmployeeIds] = useState<string[]>([])
  const [endDate, setEndDate] = useState('')
  const members = useSupplementMembers(id, group)
  const validSelection =
    !dropEmployeeIds.length ||
    (members.query.isSuccess &&
      !members.query.isFetching &&
      dropEmployeeIds.length < members.members.length &&
      dropEmployeeIds.every((id) => members.members.some((line) => line.employee.employeeId === id)))
  const keys = [
    getAccessRequestGetQueryKey(id),
    getSpendQueueListQueryKey(),
    getAccessRequestSupplementListQueryKey(id)
  ]
  const supplement = useManagerAction({
    mutationFn: (body: SupplementBodyDto) => accessRequestSupplementAdd(id, body),
    invalidate: keys,
    onSuccess: onClose
  })
  const action = supplement
  return (
    <Dialog
      presentation='sheet'
      title={translate('supplement')}
      hint={translate('confirmAction')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked || !validSelection || (!endDate && !dropEmployeeIds.length)) return
            const form = new FormData(event.currentTarget)
            supplement.mutate({
              reason: String(form.get('reason')).trim(),
              ...(dropEmployeeIds.length ? { dropEmployeeIds } : {}),
              ...(form.get('expectedEndDate') ? { expectedEndDate: String(form.get('expectedEndDate')) } : {})
            })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <ManagerField label={flow('endDate')}>
              <input
                type='date'
                name='expectedEndDate'
                className={managerInputClass}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </ManagerField>
            {group && (
              <ManagerSupplementMembers source={members} selected={dropEmployeeIds} onChange={setDropEmployeeIds} />
            )}
            <ManagerField label={translate('reason')}>
              <textarea name='reason' required maxLength={1000} className={managerInputClass} />
            </ManagerField>
          </fieldset>
          <ManagerActionState action={action} />
          {!endDate && !dropEmployeeIds.length && (
            <p className='text-sm text-muted-foreground'>{translate('requestUx.noChange')}</p>
          )}
          <div className='flex justify-end'>
            <ManagerButton
              primary
              type='submit'
              busy={action.isPending}
              disabled={action.blocked || !validSelection || (!endDate && !dropEmployeeIds.length)}
            >
              {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
