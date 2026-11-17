import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplementBodyDto } from '~/shared/api/generated/model/spend-submission/supplementBodyDto'
import { accessRequestSupplementAdd } from '~/shared/api/generated/operations/spend-submission/access-request-supplement-add'
import {
  useAccessRequestSupplementList,
  getAccessRequestSupplementListQueryKey
} from '~/shared/api/generated/operations/spend-submission/access-request-supplement-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { RequestSupplementForm } from '~/entities/request/components/request-supplement-form'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import { REQUEST_TYPE } from '../enums/need-decision'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import {
  ManagerActionState,
  ManagerButton,
  ManagerFormErrors,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection
} from '../../shared/components/manager-api-ui'

export function ManagerSpendCorrections({ id, request }: { id: string; request: AccessRequestResponseDtoDataRequest }) {
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
      {mode && <CorrectionDialog id={id} request={request} onClose={() => setMode(false)} />}
    </ManagerSection>
  )
}
function CorrectionDialog({
  id,
  request,
  onClose
}: {
  id: string
  request: AccessRequestResponseDtoDataRequest
  onClose: () => void
}) {
  const { t: translate } = useTranslation('manager')
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
        <RequestSupplementForm
          id={id}
          planId={request.plan?.planId}
          termMonths={request.termMonths}
          group={request.type === REQUEST_TYPE.GROUP_GRANT}
          disabled={action.blocked}
          onSubmit={(body) => supplement.mutate(body)}
        />
        <ManagerActionState action={action} />
      </ManagerFormErrors>
    </Dialog>
  )
}
