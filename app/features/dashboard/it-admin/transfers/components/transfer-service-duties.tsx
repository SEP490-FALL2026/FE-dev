import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useServiceAccountDutyList,
  getServiceAccountDutyListQueryKey
} from '~/shared/api/generated/operations/service-account-duties/service-account-duty-list'
import { useLicenseAssignmentChangeResponsible } from '~/shared/api/generated/operations/license-assignments/license-assignment-change-responsible'
import { getLicenseAssignmentListQueryKey } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { getDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { getDepartmentTransferListQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { DutyFileKind } from '../enums/duty-file-kind'

export function TransferServiceDuties({
  transferId,
  employeeId,
  authorized,
  active
}: {
  transferId: string
  employeeId: string
  authorized: boolean
  active: boolean
}) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string>()
  const query = useServiceAccountDutyList({ employeeId, page, pageSize: 20 }, { query: { enabled: authorized } })
  const data = query.data?.data
  const currentDuty = data?.items.find((duty) => duty.assignmentId === selected)
  const canChange =
    authorized &&
    active &&
    !query.isFetching &&
    !query.isError &&
    currentDuty?.fileKind === DutyFileKind.TRANSFER &&
    currentDuty.fileId === transferId &&
    currentDuty.responsible.employeeId === employeeId
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold'>{translate('service.title')}</h2>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('service.hint')}</p>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {data.items.map((duty) => {
              const belongs = duty.fileKind === DutyFileKind.TRANSFER && duty.fileId === transferId
              return (
                <article
                  key={`${duty.assignmentId}-${duty.fileKind}-${duty.fileId}`}
                  className='flex flex-wrap items-center justify-between gap-4 p-5'
                >
                  <div className='min-w-0 flex-1 basis-52'>
                    <h3 className='truncate font-semibold' title={duty.plan.applicationName}>
                      {duty.plan.applicationName}
                    </h3>
                    <p className='truncate text-sm text-muted-foreground' title={duty.plan.planName}>
                      {duty.plan.planName}
                    </p>
                    <p className='mt-1 break-words text-sm'>{duty.accountIdentifier}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {translate(`values.${duty.fileKind}`, { defaultValue: translate('unknown') })}
                      {!belongs && <span className='ml-2'>{translate('service.otherFile')}</span>}
                    </p>
                  </div>
                  <div className='text-right text-xs text-muted-foreground'>
                    <p>{translate('service.dueOn')}</p>
                    <p className='mt-1 font-mono tabular-nums'>{formatDate(duty.dueOn)}</p>
                    {duty.overdue && <p className='mt-1 text-danger-ink'>{translate('service.overdue')}</p>}
                  </div>
                  <button
                    type='button'
                    className={itButtonClass}
                    disabled={
                      !authorized ||
                      !active ||
                      query.isFetching ||
                      !belongs ||
                      duty.responsible.employeeId !== employeeId
                    }
                    onClick={() => setSelected(duty.assignmentId)}
                  >
                    {translate('service.change')}
                  </button>
                </article>
              )
            })}
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
        <ResponsibilityDialog
          key={selected}
          assignmentId={selected}
          transferId={transferId}
          employeeId={employeeId}
          allowed={canChange}
          onClose={() => setSelected(undefined)}
        />
      )}
    </section>
  )
}

function ResponsibilityDialog({
  assignmentId,
  transferId,
  employeeId,
  allowed,
  onClose
}: {
  assignmentId: string
  transferId: string
  employeeId: string
  allowed: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itTransfers')
  const [successor, setSuccessor] = useState('')
  const [uncertain, setUncertain] = useState(false)
  const feedback = useItMutationFeedback(
    [
      getServiceAccountDutyListQueryKey(),
      getLicenseAssignmentListQueryKey(),
      getDepartmentTransferGetQueryKey(transferId),
      getDepartmentTransferListQueryKey()
    ],
    onClose
  )
  const mutation = useLicenseAssignmentChangeResponsible({
    mutation: {
      ...feedback,
      retry: false,
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      }
    }
  })
  const sameEmployee = successor.trim() === employeeId
  return (
    <ItFormDialog
      wide
      title={translate('service.change')}
      pending={mutation.isPending}
      submitLabel={translate('service.save')}
      submitDisabled={!allowed || uncertain || !successor.trim() || sameEmployee}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (!allowed || uncertain || sameEmployee || !successor.trim() || mutation.isPending) return
        const form = new FormData(event.currentTarget)
        const expectedEndDate = String(form.get('expectedEndDate') ?? '')
        mutation.mutate({
          id: assignmentId,
          data: {
            employeeId: successor.trim(),
            effectiveFrom: String(form.get('effectiveFrom') ?? ''),
            ...(expectedEndDate ? { expectedEndDate } : {})
          }
        })
      }}
    >
      <ItField
        label={translate('service.employee')}
        hint={translate('service.employeeHint')}
        error={sameEmployee ? translate('service.sameEmployee') : undefined}
      >
        <input
          name='employeeId'
          required
          pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
          value={successor}
          onChange={(event) => setSuccessor(event.target.value)}
          placeholder={translate('service.placeholder')}
          className={itInputClass}
        />
      </ItField>
      <ItDirectoryLookup mode='employee' onSelect={setSuccessor} />
      <ItField label={translate('service.effectiveDate')}>
        <input name='effectiveFrom' type='date' required className={itInputClass} />
      </ItField>
      <ItField label={translate('service.endDate')} hint={translate('service.endHint')}>
        <input name='expectedEndDate' type='date' className={itInputClass} />
      </ItField>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('service.uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
