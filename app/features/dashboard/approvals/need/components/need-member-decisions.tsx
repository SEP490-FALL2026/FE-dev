import { useTranslation } from 'react-i18next'
import type { LinesResponseDtoDataItemsItem } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItem'
import type { LineNeedDecisionBodyDtoLinesItemDecision } from '~/shared/api/generated/model/group-requests/lineNeedDecisionBodyDtoLinesItemDecision'
import { ApprovalsField, approvalsInputClass } from '../../shared/components/approvals-ui'
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
          <fieldset key={employeeId} className='space-y-2 border-b border-border/40 pb-4'>
            <legend className='max-w-full truncate text-sm font-medium' title={line.employee.fullName}>
              {line.employee.fullName}
            </legend>
            <div className='flex flex-wrap gap-5'>
              <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='radio'
                  name={`member-${employeeId}`}
                  checked={selection?.decision === NEED_DECISION.APPROVE}
                  onChange={() =>
                    onChange(employeeId, { decision: NEED_DECISION.APPROVE, reason: selection?.reason ?? '' })
                  }
                />
                {translate('approveMember', { name: line.employee.fullName })}
              </label>
              <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='radio'
                  name={`member-${employeeId}`}
                  checked={selection?.decision === NEED_DECISION.REJECT}
                  onChange={() =>
                    onChange(employeeId, { decision: NEED_DECISION.REJECT, reason: selection?.reason ?? '' })
                  }
                />
                {translate('rejectMember', { name: line.employee.fullName })}
              </label>
            </div>
            {selection?.decision === NEED_DECISION.REJECT && (
              <ApprovalsField label={translate('memberReason', { name: line.employee.fullName })}>
                <textarea
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
