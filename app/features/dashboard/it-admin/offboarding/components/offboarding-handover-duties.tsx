import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useHandoverDutyList,
  getHandoverDutyListQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { useHandoverDutyGet } from '~/shared/api/generated/operations/handover-duties/handover-duty-get'
import { useHandoverDutyConfirm } from '~/shared/api/generated/operations/handover-duties/handover-duty-confirm'
import { getOffboardingCaseGetQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { getOffboardingCaseListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { getOffboardingCaseRightListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { getLicenseAssignmentListQueryKey } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { OffboardingHandoverRole } from '../enums/handover-duty-role'
import { OffboardingHandoverStatus } from '../enums/handover-duty-status'
import { HandoverConfirmationValue } from '../enums/handover-confirmation-value'
export function OffboardingHandoverDuties({
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
  const [selected, setSelected] = useState<string>()
  const query = useHandoverDutyList(
    { employeeId, scope: 'all', page, pageSize: 20 },
    { query: { enabled: authorized } }
  )
  if (!authorized) return null
  return (
    <section className='space-y-3'>
      <h3 className='font-semibold [text-wrap:balance]'>{translate('duties.handoverTitle')}</h3>
      <p className='text-sm text-muted-foreground'>{translate('duties.handoverHint')}</p>
      <ItQueryState query={query}>
        <div className='space-y-3'>
          {query.data?.data?.items.map((duty) => (
            <article
              key={duty.id}
              className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4'
            >
              <div>
                <p className='font-medium'>
                  {duty.application.name} · {duty.plan.name}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {translate(`duties.roles.${duty.role}`, { defaultValue: translate('states.UNKNOWN') })} ·{' '}
                  {translate(`duties.states.${duty.status}`, { defaultValue: translate('states.UNKNOWN') })}
                </p>
              </div>
              <button
                className={itButtonClass}
                disabled={
                  query.isFetching ||
                  !duty.canConfirm ||
                  duty.role !== OffboardingHandoverRole.IT_ADMIN ||
                  duty.status !== OffboardingHandoverStatus.OPEN
                }
                onClick={() => setSelected(duty.id)}
              >
                {translate('duties.confirm')}
              </button>
            </article>
          ))}
          {query.data?.data?.items.length === 0 && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
      {selected && <HandoverConfirmation id={selected} caseId={caseId} onClose={() => setSelected(undefined)} />}
    </section>
  )
}
export function HandoverConfirmation({ id, caseId, onClose }: { id: string; caseId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itOffboarding')
  const detail = useHandoverDutyGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const feedback = useItMutationFeedback(
    [
      detail.queryKey,
      getHandoverDutyListQueryKey(),
      getOffboardingCaseGetQueryKey(caseId),
      getOffboardingCaseListQueryKey(),
      getOffboardingCaseRightListQueryKey(caseId),
      getLicenseAssignmentListQueryKey()
    ],
    onClose
  )
  const confirm = useHandoverDutyConfirm({ mutation: feedback })
  const duty = detail.data?.data
  const allowed =
    !detail.isFetching &&
    !detail.isError &&
    duty?.canConfirm &&
    duty.role === OffboardingHandoverRole.IT_ADMIN &&
    duty.status === OffboardingHandoverStatus.OPEN
  return (
    <ItFormDialog
      title={translate('duties.confirm')}
      pending={confirm.isPending}
      submitDisabled={!allowed}
      submitLabel={translate('duties.confirm')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (allowed && !confirm.isPending) confirm.mutate({ id, data: { value: HandoverConfirmationValue.HANDLED } })
      }}
    >
      <ItQueryState query={detail}>
        <p>{translate('duties.confirmHint')}</p>
        {duty?.noticeText && <p className='break-words text-sm text-muted-foreground'>{duty.noticeText}</p>}
        {duty && !allowed && <p className='text-sm text-muted-foreground'>{translate('duties.notConfirmer')}</p>}
      </ItQueryState>
    </ItFormDialog>
  )
}
