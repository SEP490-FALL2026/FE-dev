import { ArrowLeft, Boxes, Building2, Calendar, UserCheck, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { NeedQueueResponseDtoDataItemsItem } from '~/shared/api/generated/model/need-decisions/needQueueResponseDtoDataItemsItem'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ManagerButton,
  ManagerMoney,
  ManagerQueryState,
  ManagerSection
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

  const softwareTitle =
    request?.plan?.applicationName ?? request?.proposal?.softwareName ?? translate('requestDetail.title')
  const planSubtitle = request?.plan?.planName ?? translate('requestDetail.subtitle')

  return (
    <div className='space-y-6'>
      {/* Top Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onBack}
            aria-label={translate('back')}
            className='grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'
          >
            <ArrowLeft strokeWidth={1.5} className='size-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>{softwareTitle}</h1>
            {request && <span className='sr-only'>{request.id}</span>}
            <p className='text-xs text-muted-foreground'>{planSubtitle}</p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {mayWithdraw && <ManagerRequestWithdraw id={id} />}
          <ManagerButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </ManagerButton>
        </div>
      </div>

      <ManagerQueryState query={query} empty={!request} />

      {request && (
        <div
          className={
            request.type === REQUEST_TYPE.GROUP_GRANT
              ? 'space-y-6'
              : 'grid items-start gap-6 lg:grid-cols-2'
          }
        >
          {/* Left Column: Request Details Card */}
          <ManagerSection title={translate('requestDetail.requestInfo')}>
            {/* Software Spotlight Banner */}
            <div className='flex items-center gap-3.5 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
              <span
                aria-hidden='true'
                className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
              >
                <Boxes strokeWidth={1.5} className='size-6' />
              </span>
              <div className='min-w-0'>
                <h2 className='truncate text-lg font-bold text-foreground' title={softwareTitle}>
                  {softwareTitle}
                </h2>
                <p className='truncate text-xs text-muted-foreground' title={planSubtitle}>
                  {planSubtitle}
                </p>
              </div>
            </div>

            {/* Financial & Scope Metrics Strip */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
              <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                <dt className='text-xs font-medium text-muted-foreground'>{translate('total')}</dt>
                <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-foreground'>
                  <ManagerMoney money={request.pricing.amount} />
                </dd>
              </div>

              <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                <dt className='text-xs font-medium text-muted-foreground'>{translate('requestDetail.termMonths')}</dt>
                <dd className='mt-1 font-mono text-base font-semibold tabular-nums text-foreground'>
                  {request.termMonths
                    ? translate('requestDetail.termMonthsValue', { months: request.termMonths })
                    : '—'}
                </dd>
              </div>

              <div className='col-span-2 rounded-xl border border-border/60 bg-surface p-3.5 sm:col-span-1'>
                <dt className='text-xs font-medium text-muted-foreground'>{translate('requestDetail.lineCount')}</dt>
                <dd className='mt-1 font-mono text-base font-semibold tabular-nums text-foreground'>
                  {translate('requestDetail.lineCountValue', { count: request.lineCount })}
                </dd>
              </div>
            </div>

            {/* Personnel & Placement Details */}
            <dl className='grid gap-4 rounded-xl border border-border/60 bg-surface p-4 text-sm sm:grid-cols-2'>
              <div className='border-b border-border/40 pb-3'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <UserRound strokeWidth={1.5} className='size-3.5' />
                  {translate('requestDetail.requester')}
                </dt>
                <dd className='mt-1 truncate font-medium text-foreground' title={request.requester.fullName}>
                  {request.requester.fullName}
                </dd>
                <dd className='font-mono text-xs text-muted-foreground'>{request.requester.employeeCode}</dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Building2 strokeWidth={1.5} className='size-3.5' />
                  {translate('requestDetail.department')}
                </dt>
                <dd className='mt-1 truncate font-medium text-foreground' title={request.department.name}>
                  {request.department.name}
                </dd>
                <dd className='font-mono text-xs text-muted-foreground'>{request.department.code}</dd>
              </div>

              {request.beneficiary && request.beneficiary.employeeId !== request.requester.employeeId && (
                <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
                  <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <UserCheck strokeWidth={1.5} className='size-3.5' />
                    {translate('requestDetail.beneficiary')}
                  </dt>
                  <dd className='mt-1 truncate font-medium text-foreground' title={request.beneficiary.fullName}>
                    {request.beneficiary.fullName}
                  </dd>
                  <dd className='font-mono text-xs text-muted-foreground'>{request.beneficiary.employeeCode}</dd>
                </div>
              )}

              <div className='pb-1'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Calendar strokeWidth={1.5} className='size-3.5' />
                  {translate('requestDetail.submittedAt')}
                </dt>
                <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                  {formatDateTime(request.submittedAt)}
                </dd>
              </div>
            </dl>

            {/* Business Reason Callout */}
            <div className='space-y-1.5'>
              <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {translate('reason')}
              </dt>
              <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</p>
              </dd>
            </div>
          </ManagerSection>

          {/* Right Column: Decision Actions */}
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
            <ManagerSection title={translate('requestDetail.decisionTitle')}>
              <ManagerNeedForm
                id={id}
                hasSpend={queueContext?.planLineRequired ?? request.policy.hasSpendStep}
                termRequired={queueContext?.termConfirmationRequired}
              />
              <div className='border-t border-border/50 pt-4'>
                <ManagerSimilarSeats id={id} />
              </div>
            </ManagerSection>
          ) : (
            <ManagerSection title={translate('requestDetail.decisionTitle')}>
              <p className='py-4 text-center text-sm text-muted-foreground'>{translate('noPermission')}</p>
            </ManagerSection>
          )}

          {request.state === REQUEST_STATE.AWAITING_SPEND_SUBMISSION && <ManagerSpendCorrections id={id} />}
        </div>
      )}

      {request && <ManagerRequestTimings id={id} />}
      {request?.proposal && <ManagerRequestAssessment id={id} />}
    </div>
  )
}
