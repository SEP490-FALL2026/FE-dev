import { useTranslation } from 'react-i18next'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import type { ApprovalTabKey } from '../../approvals-nav'
import { ArrowLeft } from 'lucide-react'
import { ApprovalsPage, ApprovalsButton, ApprovalsEmpty, ApprovalsSection } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { NeedRequestSummary } from '../components/need-request-summary'
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
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('overview')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </ApprovalsButton>
      }
    >
      {itemId && validId ? (
        <NeedDetail key={itemId} requestId={itemId} />
      ) : (
        <ApprovalsEmpty message={translate(itemId ? 'invalidRequest' : 'noRequest')} />
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
        <div className='space-y-6'>
          <NeedRequestSummary request={request} />
          <ApprovalsSection title={translate('decision')}>
            <ApprovalsQueryState query={currentUser}>
              {request.type === NEED_REQUEST_TYPE.GROUP_GRANT && employeeId && knownBranch ? (
                <GroupNeedDecisions
                  request={request}
                  employeeId={employeeId}
                  disabled={requestQuery.isFetching || currentUser.isFetching}
                />
              ) : permitted && Object.values(NEED_REQUEST_TYPE).includes(request.type) ? (
                <NeedDecisionForm request={request} disabled={requestQuery.isFetching || currentUser.isFetching} />
              ) : (
                <p
                  role='status'
                  className='rounded-lg border border-border bg-surface-subtle p-4 text-sm text-muted-foreground'
                >
                  {translate('locked')}
                </p>
              )}
            </ApprovalsQueryState>
          </ApprovalsSection>
        </div>
      ) : (
        <ApprovalsEmpty message={translate('noRequest')} />
      )}
    </ApprovalsQueryState>
  )
}
