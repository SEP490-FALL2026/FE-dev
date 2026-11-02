import { useTranslation } from 'react-i18next'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import type { ApprovalTabKey } from '../../approvals-nav'
import { ApprovalsPage, ApprovalsButton, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { formatMoney } from '../../shared/approvals-money'
import { NeedDecisionForm } from '../components/need-decision-form'
import { GroupNeedDecisions } from '../components/group-need-decisions'
import { NEED_STEP_STATE } from '../enums/need-step-state'
import { REQUEST_BRANCH } from '../enums/request-branch'
import { NEED_REQUEST_TYPE } from '../enums/request-type'

interface NeedViewProps {
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalNeedView({ itemId, onSelectTab }: NeedViewProps) {
  const { t: translate } = useTranslation('approvalsNeed')
  const validId = Boolean(itemId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId))
  return (
    <ApprovalsPage
      title={translate('needTitle')}
      actions={<ApprovalsButton onClick={() => onSelectTab('overview')}>{translate('back')}</ApprovalsButton>}
    >
      {itemId && validId ? (
        <NeedDetail key={itemId} requestId={itemId} />
      ) : (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate(itemId ? 'invalidRequest' : 'noRequest')}
        </p>
      )}
    </ApprovalsPage>
  )
}

function NeedDetail({ requestId }: { requestId: string }) {
  const { t: translate } = useTranslation('approvalsNeed')
  const requestQuery = useAccessRequestGet(requestId)
  const currentUser = useMeGet()
  const requestData = requestQuery.data?.data
  const request = requestData && 'request' in requestData ? requestData.request : undefined
  const employeeId = currentUser.data?.data?.employee.id
  const identity = currentUser.data?.data
  const departmentCode = identity?.employee.department?.code
  // Managers head one department and belong to it (QĐ-66a/INV-19); other assigned approvers cannot set spend.
  const canSetSpend = Boolean(
    identity?.roles.effective.includes('MANAGER') && departmentCode && departmentCode === request?.department.code
  )
  const knownBranch = request && Object.values(REQUEST_BRANCH).includes(request.branch)
  const permitted = Boolean(
    request &&
    employeeId &&
    request.needStep.state === NEED_STEP_STATE.PENDING &&
    request.needStep.assignee?.employeeId === employeeId &&
    request.requester.employeeId !== employeeId &&
    request.beneficiary?.employeeId !== employeeId &&
    knownBranch
  )
  return (
    <ApprovalsQueryState query={requestQuery}>
      {request ? (
        <>
          <NeedRequestSummary request={request} />
          <ApprovalsQueryState query={currentUser}>
            {request.type === NEED_REQUEST_TYPE.GROUP_GRANT && employeeId && knownBranch ? (
              <GroupNeedDecisions
                request={request}
                employeeId={employeeId}
                canSetSpend={canSetSpend}
                disabled={requestQuery.isFetching || currentUser.isFetching}
              />
            ) : permitted && Object.values(NEED_REQUEST_TYPE).includes(request.type) ? (
              <NeedDecisionForm
                request={request}
                canSetSpend={canSetSpend}
                disabled={requestQuery.isFetching || currentUser.isFetching}
              />
            ) : (
              <p
                role='status'
                className='rounded-lg border border-border bg-surface-subtle p-4 text-sm text-muted-foreground'
              >
                {translate('locked')}
              </p>
            )}
          </ApprovalsQueryState>
        </>
      ) : (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate('noRequest')}
        </p>
      )}
    </ApprovalsQueryState>
  )
}

function NeedRequestSummary({ request }: { request: AccessRequestResponseDtoDataRequest }) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const softwareName = request.plan?.applicationName ?? request.proposal?.softwareName ?? translate('unknown')
  const fields = [
    { label: translate('requester'), value: request.requester.fullName },
    { label: translate('beneficiary'), value: request.beneficiary?.fullName ?? translate('unknown') },
    { label: translate('department'), value: request.department.name },
    { label: translate('term'), value: new Intl.NumberFormat(i18n.language).format(request.termMonths), numeric: true },
    {
      label: translate('cost'),
      value: request.pricing.amount ? formatMoney(request.pricing.amount, i18n.language) : translate('unknown'),
      numeric: true
    }
  ]
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='min-w-0 max-w-full truncate text-lg font-semibold' title={softwareName}>
          {softwareName}
        </h2>
        <ApprovalsStatus value={request.needStep.state} />
      </div>
      <p className='truncate text-right font-mono text-xs text-muted-foreground tabular-nums' title={request.id}>
        {request.id}
      </p>
      <dl className='grid gap-4 sm:grid-cols-2'>
        {fields.map((field) => (
          <div key={field.label} className='min-w-0'>
            <dt className='text-xs text-muted-foreground'>{field.label}</dt>
            <dd
              title={field.value}
              className={`mt-1 truncate text-sm ${field.numeric ? 'text-right font-mono tabular-nums' : ''}`}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <p className='text-xs text-muted-foreground'>{translate('businessReason')}</p>
        <p className='mt-1 text-sm [overflow-wrap:anywhere]'>{request.businessReason}</p>
      </div>
      {request.needDecision && (
        <div className='space-y-2 border-t border-border/40 pt-4'>
          <p className='text-sm font-medium'>{translate('currentDecision')}</p>
          <ApprovalsStatus value={request.needDecision.decision} />
          {request.needDecision.reason && (
            <p className='text-sm [overflow-wrap:anywhere]'>{request.needDecision.reason}</p>
          )}
        </div>
      )}
    </section>
  )
}
