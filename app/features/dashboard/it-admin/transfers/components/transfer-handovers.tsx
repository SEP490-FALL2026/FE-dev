import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useHandoverDutyList,
  getHandoverDutyListQueryKey
} from '~/shared/api/generated/operations/handover-duties/handover-duty-list'
import { useHandoverDutyGet } from '~/shared/api/generated/operations/handover-duties/handover-duty-get'
import { useHandoverDutyConfirm } from '~/shared/api/generated/operations/handover-duties/handover-duty-confirm'
import { getLicenseAssignmentListQueryKey } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { getDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { HandoverRole } from '../enums/handover-role'
import { HandoverSource } from '../enums/handover-source'
import { HandoverStatus } from '../enums/handover-status'
import { HandoverValue } from '../enums/handover-value'

export function TransferHandovers({ transferId, employeeId }: { transferId: string; employeeId: string }) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string>()
  const query = useHandoverDutyList({ employeeId, scope: 'all', page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold'>{translate('handover.title')}</h2>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('handover.hint')}</p>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {data.items.map((duty) => (
              <article key={duty.id} className='flex flex-wrap items-center justify-between gap-4 p-5'>
                <div className='min-w-0 flex-1 basis-52'>
                  <h3 className='truncate font-semibold' title={duty.application.name}>
                    {duty.application.name}
                  </h3>
                  <p className='truncate text-sm text-muted-foreground' title={duty.plan.name}>
                    {duty.plan.name}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {translate(`handover.sources.${duty.source}`, { defaultValue: translate('unknown') })}
                    <span aria-hidden> · </span>
                    {translate(`values.${duty.role}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <div className='text-right text-xs'>
                  <p>{translate(`values.${duty.status}`, { defaultValue: translate('unknown') })}</p>
                  <p className='mt-1 font-mono tabular-nums text-muted-foreground'>{formatDate(duty.dueOn)}</p>
                </div>
                <button
                  type='button'
                  className={itButtonClass}
                  disabled={query.isFetching}
                  onClick={() => setSelected(duty.id)}
                >
                  {translate('handover.review')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          disabled={query.isFetching}
          onChange={setPage}
        />
      )}
      {selected && (
        <HandoverDialog
          id={selected}
          employeeId={employeeId}
          transferId={transferId}
          onClose={() => setSelected(undefined)}
        />
      )}
    </section>
  )
}

function HandoverDialog({
  id,
  employeeId,
  transferId,
  onClose
}: {
  id: string
  employeeId: string
  transferId: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itTransfers')
  const [uncertain, setUncertain] = useState(false)
  const query = useHandoverDutyGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const me = useMeGet()
  const duty = query.data?.data
  const allowed =
    !query.isFetching &&
    !query.isError &&
    !me.isError &&
    !!me.data?.data?.roles.includes('IT_ADMIN') &&
    duty?.employee.id === employeeId &&
    duty.canConfirm &&
    duty.role === HandoverRole.IT_ADMIN &&
    duty.source === HandoverSource.TRANSFER_REVIEW &&
    duty.status === HandoverStatus.OPEN
  const feedback = useItMutationFeedback(
    [
      query.queryKey,
      getHandoverDutyListQueryKey(),
      getLicenseAssignmentListQueryKey(),
      getDepartmentTransferGetQueryKey(transferId)
    ],
    onClose
  )
  const mutation = useHandoverDutyConfirm({
    mutation: {
      ...feedback,
      retry: false,
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('handover.review')}
      pending={mutation.isPending}
      submitLabel={translate('handover.confirm')}
      submitDisabled={!allowed || uncertain}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (allowed && !uncertain && !mutation.isPending)
          mutation.mutate({ id, data: { value: HandoverValue.HANDLED } })
      }}
    >
      <ItQueryState query={query}>
        <p className='text-sm'>{translate('handover.confirmHint')}</p>
        {duty?.noticeText && (
          <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>{duty.noticeText}</p>
        )}
        {duty && !allowed && <p className='text-sm text-muted-foreground'>{translate('handover.notAllowed')}</p>}
      </ItQueryState>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('handover.uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
