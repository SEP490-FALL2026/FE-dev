import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import {
  accessRequestLineList,
  getAccessRequestLineListQueryKey
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsButton } from '../../shared/components/approvals-ui'
import { NeedDecisionForm } from './need-decision-form'
import { NEED_STEP_STATE } from '../enums/need-step-state'
import { NEED_LINE_STATE } from '../enums/need-line-state'

export function GroupNeedDecisions({
  request,
  employeeId,
  disabled
}: {
  request: AccessRequestResponseDtoDataRequest
  employeeId: string
  disabled: boolean
}) {
  const { t: translate } = useTranslation('approvalsNeed')
  const [selectedStep, setSelectedStep] = useState('')
  const linesQuery = useQuery({
    queryKey: [...getAccessRequestLineListQueryKey(request.id), 'all-need-pages'],
    queryFn: async ({ signal }) => {
      const first = await accessRequestLineList(request.id, { page: 1, pageSize: 100 }, undefined, signal)
      if (!first.data) return []
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, first.data.pagination.totalPages - 1) }, (_, index) =>
          accessRequestLineList(request.id, { page: index + 2, pageSize: 100 }, undefined, signal)
        )
      )
      if (otherPages.some((page) => !page.data)) throw new Error('Incomplete group response')
      const items = [...first.data.items, ...otherPages.flatMap((page) => page.data?.items ?? [])]
      if (
        items.length !== first.data.pagination.totalItems ||
        new Set(items.map((line) => line.employee.employeeId)).size !== items.length
      )
        throw new Error('Inconsistent group response')
      return items
    }
  })
  const pendingLines = (linesQuery.data ?? []).filter(
    (line) =>
      line.state === NEED_LINE_STATE.AWAITING_NEED &&
      line.needStep.state === NEED_STEP_STATE.PENDING &&
      line.needStep.assignee?.employeeId === employeeId
  )
  const stepIds = [...new Set(pendingLines.map((line) => line.needStep.id))]
  const stepId = stepIds.includes(selectedStep) ? selectedStep : stepIds[0]
  const selectedLines = pendingLines.filter((line) => line.needStep.id === stepId)
  const knownStates = (linesQuery.data ?? []).every(
    (line) =>
      Object.values(NEED_LINE_STATE).includes(line.state) &&
      Object.values(NEED_STEP_STATE).includes(line.needStep.state)
  )
  const ownRequest =
    request.requester.employeeId === employeeId || selectedLines.some((line) => line.employee.employeeId === employeeId)
  return (
    <ApprovalsQueryState query={linesQuery}>
      {stepIds.length > 1 && (
        <div role='group' aria-label={translate('selectStep')} className='flex flex-wrap gap-2'>
          {stepIds.map((id, index) => (
            <ApprovalsButton key={id} onClick={() => setSelectedStep(id)} aria-pressed={id === stepId}>
              {translate('stepNumber', { number: index + 1 })}
            </ApprovalsButton>
          ))}
        </div>
      )}
      {knownStates && selectedLines.length > 0 && selectedLines.length <= 100 && !ownRequest ? (
        <NeedDecisionForm
          key={stepId}
          request={request}
          lines={selectedLines}
          disabled={disabled || linesQuery.isFetching}
        />
      ) : (
        <p
          role='status'
          className='rounded-lg border border-border bg-surface-subtle p-4 text-sm text-muted-foreground'
        >
          {translate(selectedLines.length > 100 ? 'groupLimit' : 'locked')}
        </p>
      )}
    </ApprovalsQueryState>
  )
}
