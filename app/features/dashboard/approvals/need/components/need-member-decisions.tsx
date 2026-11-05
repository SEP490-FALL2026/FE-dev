import { useTranslation } from 'react-i18next'
import type { LinesResponseDtoDataItemsItem } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItem'
import type { LineNeedDecisionBodyDtoLinesItemDecision } from '~/shared/api/generated/model/group-requests/lineNeedDecisionBodyDtoLinesItemDecision'
import { Check, X } from 'lucide-react'
import { ApprovalsButton, ApprovalsField, approvalsInputClass } from '../../shared/components/approvals-ui'
import { rejectPressedClass, segmentClass } from './segment-classes'
import { NEED_DECISION } from '../enums/need-decision'

export interface MemberDecision {
  decision: LineNeedDecisionBodyDtoLinesItemDecision
  reason: string
}

export function NeedMemberDecisions({
  lines,
  decisions,
  onChange
}: {
  lines: LinesResponseDtoDataItemsItem[]
  decisions: Record<string, MemberDecision>
  onChange: (employeeId: string, selection: MemberDecision) => void
}) {
  const { t: translate } = useTranslation('approvalsNeed')
  return (
    <div className='space-y-4'>
      {lines.map((line) => {
        const employeeId = line.employee.employeeId
        const selection = decisions[employeeId]
        return (
          <fieldset key={employeeId} className='space-y-3 border-b border-border/40 pb-4 last:border-b-0'>
            <legend className='max-w-full truncate text-sm font-medium' title={line.employee.fullName}>
              {line.employee.fullName}
            </legend>
            <div role='group' aria-label={line.employee.fullName} className={segmentClass}>
              <ApprovalsButton
                variant='ghost'
                aria-label={translate('approveMember', { name: line.employee.fullName })}
                aria-pressed={selection?.decision === NEED_DECISION.APPROVE}
                onClick={() =>
                  onChange(employeeId, { decision: NEED_DECISION.APPROVE, reason: selection?.reason ?? '' })
                }
              >
                <Check aria-hidden className='size-4' strokeWidth={1.5} />
                {translate('approve')}
              </ApprovalsButton>
              <ApprovalsButton
                variant='ghost'
                aria-label={translate('rejectMember', { name: line.employee.fullName })}
                aria-pressed={selection?.decision === NEED_DECISION.REJECT}
                className={rejectPressedClass}
                onClick={() =>
                  onChange(employeeId, { decision: NEED_DECISION.REJECT, reason: selection?.reason ?? '' })
                }
              >
                <X aria-hidden className='size-4' strokeWidth={1.5} />
                {translate('reject')}
              </ApprovalsButton>
            </div>
            {selection?.decision === NEED_DECISION.REJECT && (
              <ApprovalsField label={translate('memberReason', { name: line.employee.fullName })} required>
                <textarea
                  aria-label={translate('memberReason', { name: line.employee.fullName })}
                  className={approvalsInputClass}
                  required
                  rows={2}
                  maxLength={1000}
                  placeholder={translate('reasonPlaceholder')}
                  value={selection.reason}
                  onChange={(event) => onChange(employeeId, { ...selection, reason: event.target.value })}
                />
              </ApprovalsField>
            )}
          </fieldset>
        )
      })}
    </div>
  )
}
