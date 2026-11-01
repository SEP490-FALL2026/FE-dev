import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  getAssignmentExpiryQueueListQueryKey,
  assignmentExpiryQueueList,
  assignmentExpiryStartRevocation
} from '~/shared/api/generated/operations/assignment-expiry'
import type {
  AssignmentExpiryQueueListParams,
  ExpiryQueuePageResponseDtoDataItemsItem
} from '~/shared/api/generated/model'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ExpiryStatus } from '../enums/expiry-status'

export function ProvisioningExpiryQueue({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { t: translate } = useTranslation('itProvisioning')
  const [params, setParams] = useState<AssignmentExpiryQueueListParams>({ page: 1, pageSize: 20 })
  const [selected, setSelected] = useState<ExpiryQueuePageResponseDtoDataItemsItem | null>(null)
  const query = useQuery({
    queryKey: getAssignmentExpiryQueueListQueryKey(params),
    queryFn: () => assignmentExpiryQueueList(params)
  })
  const feedback = useItMutationFeedback([['it-provisioning'], getAssignmentExpiryQueueListQueryKey()], () =>
    setSelected(null)
  )
  const mutation = useMutation({
    mutationFn: () => assignmentExpiryStartRevocation(selected!.assignmentId),
    ...feedback
  })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <div className='grid gap-3 sm:grid-cols-2'>
        <ItField label={translate('status')}>
          <select
            className={itInputClass}
            value={params.status ?? ''}
            onChange={(event) =>
              setParams((previous) => ({
                ...previous,
                page: 1,
                status: (event.target.value || undefined) as AssignmentExpiryQueueListParams['status']
              }))
            }
          >
            <option value=''>{translate('allStatuses')}</option>
            {Object.values(ExpiryStatus).map((status) => (
              <option value={status} key={status}>
                {translate(`expiryValues.${status}`)}
              </option>
            ))}
          </select>
        </ItField>
        <ItField label={translate('debt')}>
          <select
            className={itInputClass}
            value={params.debt ?? ''}
            onChange={(event) =>
              setParams((previous) => ({
                ...previous,
                page: 1,
                debt: (event.target.value || undefined) as AssignmentExpiryQueueListParams['debt']
              }))
            }
          >
            <option value=''>{translate('anyDebt')}</option>
            <option value='true'>{translate('withDebt')}</option>
            <option value='false'>{translate('withoutDebt')}</option>
          </select>
        </ItField>
      </div>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='space-y-3'>
            {data.items.map((item) => (
              <article
                key={item.assignmentId}
                className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4'
              >
                <div className='space-y-1'>
                  <h2 className='font-medium'>
                    {item.plan.applicationName} · {item.plan.planName}
                  </h2>
                  <p className='text-sm'>{item.employee.fullName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {translate(`expiryValues.${item.status}`, { defaultValue: translate('unavailable') })} ·{' '}
                    {translate('overdueDays', { count: item.daysOverdue })}
                  </p>
                  {item.debt && <p className='text-sm text-warning'>{translate('withDebt')}</p>}
                </div>
                {item.revocation ? (
                  <button className={itButtonClass} onClick={() => onOpenTask(item.revocation!.taskId)}>
                    {translate('details')}
                  </button>
                ) : (
                  item.status === ExpiryStatus.READY_TO_REVOKE && (
                    <button className={itButtonClass} onClick={() => setSelected(item)}>
                      {translate('startRevocation')}
                    </button>
                  )
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={params.page ?? 1}
          pageSize={20}
          total={data.pagination.totalItems}
          onChange={(page) => setParams((previous) => ({ ...previous, page }))}
        />
      )}
      {selected && (
        <ItFormDialog
          title={translate('startRevocation')}
          pending={mutation.isPending}
          onClose={() => setSelected(null)}
          submitLabel={translate('confirm')}
          onSubmit={(event) => {
            event.preventDefault()
            if (!mutation.isPending) mutation.mutate()
          }}
        >
          <p className='text-sm'>{translate('expiryConfirm')}</p>
          {selected.plan.dataLossOnRemoval && <p className='text-sm text-warning'>{translate('dataLoss')}</p>}
        </ItFormDialog>
      )}
    </div>
  )
}
