import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AdjustmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-adjustments/adjustmentListResponseDtoDataItemsItem'
import {
  budgetAdjustmentList,
  getBudgetAdjustmentListQueryKey
} from '~/shared/api/generated/operations/budget-adjustments/budget-adjustment-list'
import { ApprovalsButton, ApprovalsPage } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { AdjustmentDecisionDialog } from './adjustment-decision'
import { adjustmentState } from '../enums/in-year'

const PAGE_SIZE = 100
/** There is no get-by-id route: look through the pages of the list, newest first, up to this many. */
const MAX_PAGES = 10

/** The id of a deep link to one adjustment (for example from a notification) rides in the `id` route parameter. */
export const ADJUSTMENT_ID_PREFIX = 'adjustment:'

async function findAdjustment(
  id: string,
  signal?: AbortSignal
): Promise<AdjustmentListResponseDtoDataItemsItem | null> {
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await budgetAdjustmentList({ page, pageSize: PAGE_SIZE }, undefined, signal)
    const data = response.data
    const found = data?.items.find((item) => item.id === id)
    if (found) return found
    if (!data || page >= data.pagination.totalPages) return null
  }
  return null
}

/** Opens one adjustment by id: a pending one goes straight to the decision, any other is shown as read-only facts. */
export function AdjustmentById({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const query = useQuery({
    queryKey: [...getBudgetAdjustmentListQueryKey(), 'by-id', id],
    queryFn: ({ signal }) => findAdjustment(id, signal)
  })
  const adjustment = query.data
  return (
    <ApprovalsPage title={translate('inYear.adjustmentTitle')}>
      <ApprovalsQueryState query={query}>
        {adjustment ? (
          adjustment.state === adjustmentState.PENDING ? (
            <AdjustmentDecisionDialog adjustment={adjustment} onClose={onBack} />
          ) : (
            <div role='status' className='space-y-3 text-sm'>
              <p>
                {translate('inYear.adjustmentAlreadyDecided', {
                  state: translate(`inYear.states.${adjustment.state}`)
                })}
              </p>
              <ApprovalsButton variant='ghost' onClick={onBack}>
                {translate('inYear.backToAdjustments')}
              </ApprovalsButton>
            </div>
          )
        ) : (
          <div role='status' className='space-y-3 text-sm'>
            <p>{translate('inYear.adjustmentNotFound')}</p>
            <ApprovalsButton variant='ghost' onClick={onBack}>
              {translate('inYear.backToAdjustments')}
            </ApprovalsButton>
          </div>
        )}
      </ApprovalsQueryState>
    </ApprovalsPage>
  )
}
