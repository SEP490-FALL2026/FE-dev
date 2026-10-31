import { useTranslation } from 'react-i18next'
import type { GroupCheckResponseDtoData } from '~/shared/api/generated/model'
import type { GroupSelection } from '../hooks/use-live-request-form'
import { GROUP_ELIGIBILITY_REASON, GROUP_PLAN_ELIGIBILITY_REASON } from '../enums/group-eligibility'
import { EmployeeMoney } from '../../shared/components/employee-money'

export function LiveGroupEligibility({
  check,
  members
}: {
  check: NonNullable<GroupCheckResponseDtoData>
  members: GroupSelection[]
}) {
  const { t: translate } = useTranslation('employee')
  const knownPlanReason =
    check.plan.reason && Object.values(GROUP_PLAN_ELIGIBILITY_REASON).some((reason) => reason === check.plan.reason)
  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap justify-between gap-3 text-sm'>
        <span>{translate('plan')}</span>
        <span>
          {check.plan.eligible
            ? translate('eligible')
            : knownPlanReason
              ? translate(`eligibility.${check.plan.reason}` as 'eligibility.KIND_NOT_MULTI_SEAT')
              : translate('ineligible')}
        </span>
      </div>
      <div className='flex flex-wrap justify-between gap-3'>
        <span className='text-sm text-muted-foreground'>{translate('estimatedCost')}</span>
        <EmployeeMoney value={check.pricing.amount} />
      </div>
      <ul className='space-y-2'>
        {check.lines
          .filter((line) => !line.ok)
          .map((line) => {
            const member = members.find((candidate) => candidate.employeeId === line.employeeId)
            const known =
              line.reason && Object.values(GROUP_ELIGIBILITY_REASON).some((reason) => reason === line.reason)
            return (
              <li key={line.employeeId} className='flex flex-wrap justify-between gap-2 text-sm'>
                <span className='truncate font-medium' title={member?.fullName ?? line.employeeId}>
                  {member?.fullName ?? line.employeeId}
                </span>
                <span className='text-warning'>
                  {known
                    ? translate(`eligibility.${line.reason}` as 'eligibility.END_DATE_REQUIRED')
                    : translate('ineligible')}
                </span>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
