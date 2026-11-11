import { ArrowLeft, Layers } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSpendApprovalGet } from '~/shared/api/generated/operations/spend-approvals/spend-approval-get'
import { useBudgetCheckGet } from '~/shared/api/generated/operations/budget-checks/budget-check-get'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage } from '../../shared/components/approvals-ui'
import { useSpendYears } from '../hooks/use-spend-years'
import { SpendRequestFacts } from '../components/spend-request-facts'
import { SpendBudgetPanel } from '../components/spend-budget-panel'
import { SpendDecisionForm } from '../components/spend-decision-form'
import { BUDGET_CHECK_CODE } from '../enums/budget-check-code'
import { useSpendRequestKind } from '../hooks/use-spend-request-kind'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function ApprovalRequestView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [searchParams] = useSearchParams()
  const batchId = searchParams.get('batch')?.trim() ?? ''
  const hasBatch = UUID_PATTERN.test(batchId)
  return (
    <ApprovalsPage
      title={translate('detail')}
      actions={
        <>
          <ApprovalsButton variant='ghost' onClick={() => onSelectTab('queue')}>
            <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
            {translate('back')}
          </ApprovalsButton>
          {hasBatch && (
            <ApprovalsButton onClick={() => onSelectTab('batch', { id: batchId })}>
              <Layers aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('batchLink')}
            </ApprovalsButton>
          )}
        </>
      }
    >
      {itemId && UUID_PATTERN.test(itemId) ? (
        <SpendRequestContent key={itemId} requestId={itemId} />
      ) : (
        <ApprovalsEmpty />
      )}
    </ApprovalsPage>
  )
}

function SpendRequestContent({ requestId }: { requestId: string }) {
  const approvalQuery = useSpendApprovalGet(requestId)
  const approval = approvalQuery.data?.data?.spendApproval
  const requestKind = useSpendRequestKind(requestId, approval ? approval.request.beneficiary !== null : undefined)
  const isGroup = requestKind.kind === 'group'
  const checkQuery = useBudgetCheckGet(requestId)
  const yearsQuery = useSpendYears(requestId)
  const check = checkQuery.data?.data?.budgetCheck
  const knownCodes: readonly (string | null)[] = [null, ...Object.values(BUDGET_CHECK_CODE)]
  const ready = Boolean(
    check &&
    requestKind.kind &&
    !requestKind.isFetching &&
    checkQuery.isSuccess &&
    !checkQuery.isFetching &&
    yearsQuery.isComplete &&
    yearsQuery.years.length === check.yearCount &&
    knownCodes.includes(check.primaryCode)
  )
  const blocked = !check || !['WITHIN_BASE', 'USES_RESERVE'].includes(check.outcome)
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
          {requestKind.failure && <ApprovalsQueryState query={requestKind.failure}>{null}</ApprovalsQueryState>}
          <ApprovalsQueryState query={checkQuery}>
            <ApprovalsQueryState query={yearsQuery}>
              {check && <SpendBudgetPanel check={check} years={yearsQuery.years} />}
            </ApprovalsQueryState>
          </ApprovalsQueryState>
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
