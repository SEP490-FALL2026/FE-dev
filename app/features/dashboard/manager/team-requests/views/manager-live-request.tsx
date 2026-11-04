import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { NeedQueueResponseDtoDataItemsItem } from '~/shared/api/generated/model/need-decisions/needQueueResponseDtoDataItemsItem'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import {
  ManagerButton,
  ManagerMoney,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { ManagerNeedForm } from '../components/manager-need-form'
import { ManagerGroupDecisions } from '../components/manager-group-decisions'
import { ManagerSpendCorrections } from '../components/manager-spend-corrections'
import { NEED_STEP_STATE, REQUEST_TYPE, REQUEST_STATE } from '../enums/need-decision'
import { ManagerRequestAssessment, ManagerRequestTimings } from '../components/manager-request-progress'
import { ManagerRequestWithdraw } from '../components/manager-request-withdraw'
import { ManagerLineWithdrawals } from '../components/manager-line-withdrawals'
import { isHeadWithdrawalStage } from '../enums/withdrawal'
import { ManagerSimilarSeats } from '../components/manager-similar-seats'

export function ManagerLiveRequest({
  id,
  employeeId,
  departmentCode,
  onBack
}: {
  id: string
  employeeId: string
  departmentCode?: string
  onBack: () => void
}) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestGet(id)
  const data = !query.isError ? query.data?.data : null
  const request = data && 'request' in data ? data.request : null
  const client = useQueryClient()
  const queueContext = client
    .getQueriesData<{ data?: { items: NeedQueueResponseDtoDataItemsItem[] } | null }>({
      queryKey: getNeedDecisionListQueryKey()
    })
    .flatMap(([, page]) => page?.data?.items ?? [])
    .find((row) => row.requestId === id && row.stepId === request?.needStep.id)
  const mayWithdraw = !!request && request.department.code === departmentCode && isHeadWithdrawalStage(request.state)
  const canDecide =
    request?.state === REQUEST_STATE.PENDING &&
    request.needStep.state === NEED_STEP_STATE.PENDING &&
    request.needStep.assignee?.employeeId === employeeId &&
    request.requester.employeeId !== employeeId
  return (
    <div className='space-y-6'>
      <ManagerPageHeader
        title={translate('requests')}
        icon={ClipboardCheck}
        actions={
          <div className='flex flex-wrap gap-3'>
            {mayWithdraw && <ManagerRequestWithdraw id={id} />}
            <ManagerButton onClick={onBack}>
              <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('back')}
            </ManagerButton>
          </div>
        }
      />
      <ManagerQueryState query={query} empty={!request} />
      {request && (
        <div
          className={
            request.type === REQUEST_TYPE.GROUP_GRANT
              ? 'space-y-5'
              : 'grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
          }
        >
          <ManagerSection
            title={request.plan?.applicationName ?? request.proposal?.softwareName ?? translate('requests')}
          >
            <div className='flex flex-wrap justify-between gap-3'>
              <p className='truncate font-mono text-xs' title={request.id}>
                {request.id}
              </p>
              <ManagerStatus value={request.state} />
            </div>
            <dl className='grid gap-5 sm:grid-cols-2'>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('employee')}</dt>
                <dd className='truncate text-sm' title={request.requester.fullName}>
                  {request.requester.fullName}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('department')}</dt>
                <dd className='truncate text-sm' title={request.department.name}>
                  {request.department.name}
                </dd>
              </div>
              <div className='sm:col-span-2'>
                <dt className='text-sm text-muted-foreground'>{translate('reason')}</dt>
                <dd className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</dd>
              </div>
              <div className='text-right'>
                <dt className='text-sm text-muted-foreground'>{translate('total')}</dt>
                <dd>
                  <ManagerMoney money={request.pricing.amount} />
                </dd>
              </div>
            </dl>
            <p className='text-right font-mono text-xs tabular-nums'>{formatDateTime(request.submittedAt)}</p>
          </ManagerSection>
          {request.type === REQUEST_TYPE.GROUP_GRANT && mayWithdraw ? (
            <ManagerLineWithdrawals id={id} />
          ) : request.type === REQUEST_TYPE.GROUP_GRANT ? (
            <ManagerGroupDecisions
              id={id}
              employeeId={employeeId}
              hasSpend={queueContext?.planLineRequired ?? request.policy.hasSpendStep}
              termRequired={queueContext?.termConfirmationRequired}
              requestPending={request.state === REQUEST_STATE.PENDING}
            />
          ) : canDecide ? (
            <ManagerSection title={translate('decision')}>
              <ManagerNeedForm
                id={id}
                hasSpend={queueContext?.planLineRequired ?? request.policy.hasSpendStep}
                termRequired={queueContext?.termConfirmationRequired}
              />
              <ManagerSimilarSeats id={id} />
            </ManagerSection>
          ) : (
            <p className='text-sm text-muted-foreground'>{translate('noPermission')}</p>
          )}
          {request.state === REQUEST_STATE.AWAITING_SPEND_SUBMISSION && <ManagerSpendCorrections id={id} />}
        </div>
      )}
      {request && <ManagerRequestTimings id={id} />}
      {request?.proposal && <ManagerRequestAssessment id={id} />}
    </div>
  )
}
