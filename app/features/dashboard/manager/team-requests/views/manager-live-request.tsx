import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useAccessRequestSimilarSeatList } from '~/shared/api/generated/operations/access-requests/access-request-similar-seat-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import {
  ManagerButton,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { ManagerNeedForm } from '../components/manager-need-form'
import { ManagerGroupDecisions } from '../components/manager-group-decisions'
import { ManagerSpendCorrections } from '../components/manager-spend-corrections'
import { NEED_STEP_STATE, REQUEST_TYPE, REQUEST_STATE } from '../enums/need-decision'

export function ManagerLiveRequest({ id, employeeId, onBack }: { id: string; employeeId: string; onBack: () => void }) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestGet(id)
  const data = !query.isError ? query.data?.data : null
  const request = data && 'request' in data ? data.request : null
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
          <ManagerButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </ManagerButton>
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
          {request.type === REQUEST_TYPE.GROUP_GRANT ? (
            <ManagerGroupDecisions
              id={id}
              employeeId={employeeId}
              hasSpend={request.policy.hasSpendStep}
              requestPending={request.state === REQUEST_STATE.PENDING}
            />
          ) : canDecide ? (
            <ManagerSection title={translate('decision')}>
              <ManagerNeedForm id={id} hasSpend={request.policy.hasSpendStep} />
              <SimilarSeats id={id} />
            </ManagerSection>
          ) : (
            <p className='text-sm text-muted-foreground'>{translate('noPermission')}</p>
          )}
          {request.state === REQUEST_STATE.AWAITING_SPEND_SUBMISSION && <ManagerSpendCorrections id={id} />}
        </div>
      )}
    </div>
  )
}
function SimilarSeats({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage('seatPage')
  const query = useAccessRequestSimilarSeatList(id, { page: paging.page, pageSize: paging.pageSize })
  return (
    <details>
      <summary className='cursor-pointer text-sm'>{translate('similarSeats')}</summary>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((seat) => (
          <p key={seat.assignmentId} className='mt-2 text-sm'>
            {seat.plan.planName}
          </p>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </details>
  )
}
