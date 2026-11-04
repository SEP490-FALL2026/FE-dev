import { ItChoiceSelect } from '../../shared/components/it-choice-select'
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
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ExpiryStatus } from '../enums/expiry-status'
import { ExpiryHandover } from './expiry-handover'

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
        <ItChoiceSelect
          label={translate('status')}
          value={params.status ?? ''}
          options={[
            { value: '', label: translate('allStatuses') },
            ...Object.values(ExpiryStatus).map((value) => ({ value, label: translate(`expiryValues.${value}`) }))
          ]}
          onChange={(value) =>
            setParams((previous) => ({
              ...previous,
              page: 1,
              status: Object.values(ExpiryStatus).find((status) => status === value)
            }))
          }
        />
        <ItChoiceSelect
          label={translate('debt')}
          value={params.debt ?? ''}
          options={[
            { value: '', label: translate('anyDebt') },
            { value: 'true', label: translate('withDebt') },
            { value: 'false', label: translate('withoutDebt') }
          ]}
          onChange={(value) =>
            setParams((previous) => ({
              ...previous,
              page: 1,
              debt: value === 'true' || value === 'false' ? value : undefined
            }))
          }
        />
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
                  {item.handover && <ExpiryHandover handover={item.handover} />}
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
