import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useServiceAccountDutyList,
  getServiceAccountDutyListQueryKey
} from '~/shared/api/generated/operations/service-account-duties/service-account-duty-list'
import { useLicenseAssignmentChangeResponsible } from '~/shared/api/generated/operations/license-assignments/license-assignment-change-responsible'
import { getLicenseAssignmentListQueryKey } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { getOffboardingCaseGetQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { getOffboardingCaseListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { getOffboardingCaseRightListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ServiceDutyFileKind } from '../enums/service-duty-file-kind'
const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function OffboardingServiceDuties({
  caseId,
  employeeId,
  authorized
}: {
  caseId: string
  employeeId: string
  authorized: boolean
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const [page, setPage] = useState(1)
  const [assignmentId, setAssignmentId] = useState<string>()
  const query = useServiceAccountDutyList({ employeeId, page, pageSize: 20 }, { query: { enabled: authorized } })
  const feedback = useItMutationFeedback(
    [
      getServiceAccountDutyListQueryKey(),
      getLicenseAssignmentListQueryKey(),
      getOffboardingCaseGetQueryKey(caseId),
      getOffboardingCaseListQueryKey(),
      getOffboardingCaseRightListQueryKey(caseId)
    ],
    () => setAssignmentId(undefined)
  )
  const change = useLicenseAssignmentChangeResponsible({ mutation: feedback })
  const currentDuty = query.data?.data?.items.find((duty) => duty.assignmentId === assignmentId)
  const canTransfer =
    authorized &&
    !query.isFetching &&
    !query.isError &&
    currentDuty?.fileKind === ServiceDutyFileKind.OFFBOARDING &&
    currentDuty.fileId === caseId
  if (!authorized) return null
  return (
    <section className='space-y-3'>
      <h3 className='font-semibold [text-wrap:balance]'>{translate('duties.serviceTitle')}</h3>
      <ItQueryState query={query}>
        <div className='space-y-3'>
          {query.data?.data?.items.map((duty) => (
            <article
              key={duty.assignmentId}
              className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4'
            >
              <div>
                <p className='font-medium'>
                  {duty.plan.applicationName} · {duty.plan.planName}
                </p>
                <p className='break-words text-sm text-muted-foreground'>{duty.accountIdentifier}</p>
              </div>
              <button
                className={itButtonClass}
                disabled={
                  query.isFetching ||
                  change.isPending ||
                  duty.fileKind !== ServiceDutyFileKind.OFFBOARDING ||
                  duty.fileId !== caseId
                }
                onClick={() => setAssignmentId(duty.assignmentId)}
              >
                {translate('duties.transfer')}
              </button>
            </article>
          ))}
          {query.data?.data?.items.length === 0 && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        total={query.data?.data?.pagination.totalItems ?? 0}
        pageSize={20}
        onChange={setPage}
        disabled={change.isPending}
      />
      {assignmentId && (
        <ItFormDialog
          title={translate('duties.transfer')}
          pending={change.isPending}
          submitDisabled={!canTransfer}
          onClose={() => setAssignmentId(undefined)}
          onSubmit={(event) => {
            event.preventDefault()
            if (change.isPending || !canTransfer) return
            const data = new FormData(event.currentTarget)
            const nextEmployeeId = String(data.get('employeeId') ?? '').trim()
            if (nextEmployeeId === employeeId) return
            const expectedEndDate = String(data.get('expectedEndDate') ?? '')
            change.mutate({
              id: assignmentId,
              data: {
                employeeId: nextEmployeeId,
                effectiveFrom: String(data.get('effectiveFrom')),
                ...(expectedEndDate ? { expectedEndDate } : {})
              }
            })
          }}
        >
          <ItField label={translate('duties.successor')}>
            <input
              name='employeeId'
              required
              pattern={uuidPattern}
              className={itInputClass}
              onChange={(event) =>
                event.target.setCustomValidity(
                  event.target.value.trim() === employeeId ? translate('duties.sameEmployee') : ''
                )
              }
            />
          </ItField>
          <p className='text-xs text-muted-foreground'>{translate('duties.successorHint')}</p>
          <ItField label={translate('duties.effectiveFrom')}>
            <input name='effectiveFrom' type='date' required className={itInputClass} />
          </ItField>
          <ItField label={translate('duties.expectedEndDate')}>
            <input name='expectedEndDate' type='date' className={itInputClass} />
          </ItField>
          <p className='text-xs text-muted-foreground'>{translate('duties.endHint')}</p>
        </ItFormDialog>
      )}
    </section>
  )
}
