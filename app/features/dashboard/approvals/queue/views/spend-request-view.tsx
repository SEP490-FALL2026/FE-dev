import { useTranslation } from 'react-i18next'
import { useSpendApprovalGet } from '~/shared/api/generated/operations/spend-approvals/spend-approval-get'
import { useBudgetCheckGet } from '~/shared/api/generated/operations/finance-reviews/budget-check-get'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage } from '../../shared/components/approvals-ui'
import { useSpendYears } from '../hooks/use-spend-years'
import { SpendRequestFacts } from '../components/spend-request-facts'
import { SpendBudgetPanel } from '../components/spend-budget-panel'
import { SpendDecisionForm } from '../components/spend-decision-form'
import { SpendFinancePanel } from '../components/spend-finance-panel'
import { BUDGET_CHECK_CODE } from '../enums/budget-check-code'
import { BUDGET_CHECK_ROUTE } from '../enums/budget-check-route'
import { SPEND_STEP_STATE } from '../enums/spend-step-state'
import { BUDGET_INFORMATION_STATE } from '../enums/budget-information-state'
import { REQUEST_TYPE } from '../enums/request-type'

export function ApprovalRequestView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  return (
    <ApprovalsPage
      title={translate('detail')}
      actions={<ApprovalsButton onClick={() => onSelectTab('queue')}>{translate('back')}</ApprovalsButton>}
    >
      {itemId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId) ? (
        <SpendRequestContent key={itemId} requestId={itemId} />
      ) : (
        <ApprovalsEmpty />
      )}
    </ApprovalsPage>
  )
}

function SpendRequestContent({ requestId }: { requestId: string }) {
  const approvalQuery = useSpendApprovalGet(requestId)
  const requestQuery = useAccessRequestGet(requestId)
  const requestData = requestQuery.data?.data
  const request = requestData && 'request' in requestData ? requestData.request : undefined
  const isGroup = request?.type === REQUEST_TYPE.GROUP_GRANT
  const checkQuery = useBudgetCheckGet(requestId)
  const yearsQuery = useSpendYears(requestId)
  const approval = approvalQuery.data?.data?.spendApproval
  const check = checkQuery.data?.data?.budgetCheck
  const knownCodes: readonly (string | null)[] = [null, ...Object.values(BUDGET_CHECK_CODE)]
  const ready = Boolean(
    check &&
    request &&
    requestQuery.isSuccess &&
    !requestQuery.isFetching &&
    Object.values(REQUEST_TYPE).includes(request.type) &&
    checkQuery.isSuccess &&
    !checkQuery.isFetching &&
    yearsQuery.isComplete &&
    yearsQuery.years.length === check.yearCount &&
    knownCodes.includes(check.primaryCode)
  )
  const knownRoutes: readonly string[] = [BUDGET_CHECK_ROUTE.SPEND_APPROVAL, BUDGET_CHECK_ROUTE.FINANCE_REVIEW]
  const blocked = !check || !knownRoutes.includes(check.route) || check.periodClosed || check.staleCostEvidence
  return (
    <ApprovalsQueryState query={approvalQuery}>
      {approval ? (
        <div className='space-y-6'>
          <h2
            className='truncate text-xl font-semibold'
            title={approval.request.plan?.applicationName ?? approval.request.softwareName ?? requestId}
          >
            {approval.request.plan?.applicationName ?? approval.request.softwareName ?? requestId}
          </h2>
          <SpendRequestFacts approval={approval} isGroup={isGroup} />
          <ApprovalsQueryState query={requestQuery}>{!request && <ApprovalsEmpty />}</ApprovalsQueryState>
          <ApprovalsQueryState query={checkQuery}>
            <ApprovalsQueryState query={yearsQuery}>
              {check && <SpendBudgetPanel check={check} years={yearsQuery.years} />}
            </ApprovalsQueryState>
          </ApprovalsQueryState>
          <SpendFinancePanel
            requestId={requestId}
            canAsk={
              approval.step.state === SPEND_STEP_STATE.PENDING &&
              (approval.latestBudgetInformation === null ||
                Object.values(BUDGET_INFORMATION_STATE).includes(approval.latestBudgetInformation.state))
            }
            hasOpenQuestion={approval.latestBudgetInformation?.state === BUDGET_INFORMATION_STATE.OPEN}
          />
          <SpendDecisionForm
            key={approval.step.id}
            approval={approval}
            isGroup={isGroup}
            years={yearsQuery.years}
            ready={ready}
            blocked={blocked || approvalQuery.isFetching}
          />
        </div>
      ) : (
        <ApprovalsEmpty />
      )}
    </ApprovalsQueryState>
  )
}
