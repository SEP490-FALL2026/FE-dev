import { useState } from 'react'
import { Files, Send } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import {
  useSpendQueueList,
  getSpendQueueListQueryKey
} from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { spendBatchSubmit } from '~/shared/api/generated/operations/spend-submission/spend-batch-submit'
import { useSpendBatchGet } from '~/shared/api/generated/operations/spend-submission/spend-batch-get'
import { useSpendBatchItemList } from '~/shared/api/generated/operations/spend-submission/spend-batch-item-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { Dialog } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId, resourceIdPattern } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerLiveBatch({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage()
  const [params, setParams] = useSearchParams()
  const query = useSpendQueueList({ page: paging.page, pageSize: paging.pageSize })
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState(false)
  const action = useManagerAction({
    mutationFn: (requestIds: string[]) => spendBatchSubmit({ requestIds }),
    invalidate: [getSpendQueueListQueryKey(), ...selected.map((id) => getAccessRequestGetQueryKey(id))],
    onSuccess: (result) => {
      setConfirm(false)
      setSelected([])
      const id = result.data?.batch.id
      if (id)
        setParams((previous) => {
          const next = new URLSearchParams(previous)
          next.set('batchId', id)
          return next
        })
    }
  })
  const batchId = params.get('batchId') ?? ''
  return (
    <div className='space-y-6'>
      <ManagerPageHeader
        title={translate('batch')}
        description={translate('batchHint')}
        icon={Files}
        actions={
          <ManagerButton
            primary
            disabled={!selected.length || action.blocked || query.isFetching}
            busy={action.isPending}
            onClick={() => setConfirm(true)}
          >
            <Send aria-hidden strokeWidth={1.5} className='size-4' />
            {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('submit')}
          </ManagerButton>
        }
      />
      <ManagerSection
        title={translate('batchQueue')}
        action={
          <span className='rounded-md bg-primary-soft/50 px-2.5 py-1.5 text-xs font-medium text-primary-ink'>
            {translate('selected', { count: selected.length })}
          </span>
        }
      >
        <ManagerQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('noQueue')}
          emptyDescription={translate('noQueueHint')}
        />
        {!query.isError && (
          <ManagerDataTable
            label={translate('batchQueue')}
            items={query.data?.data?.items ?? []}
            rowKey={(item) => item.requestId}
            columns={[
              {
                key: 'application',
                label: translate('application'),
                render: (item) => (
                  <div className='flex min-w-0 items-center gap-3'>
                    <input
                      type='checkbox'
                      aria-label={item.plan?.applicationName ?? item.softwareName ?? item.requestId}
                      checked={selected.includes(item.requestId)}
                      disabled={!item.readyToSubmit || action.blocked || query.isFetching}
                      onChange={(event) =>
                        setSelected((previous) =>
                          event.target.checked
                            ? [...previous, item.requestId]
                            : previous.filter((id) => id !== item.requestId)
                        )
                      }
                    />
                    <p
                      className='min-w-0 truncate font-medium'
                      title={item.plan?.applicationName ?? item.softwareName ?? ''}
                    >
                      {item.plan?.applicationName ?? item.softwareName}
                    </p>
                  </div>
                )
              },
              {
                key: 'employee',
                label: translate('employee'),
                render: (item) => (
                  <p className='max-w-48 truncate' title={item.requester.fullName}>
                    {item.requester.fullName}
                  </p>
                )
              },
              {
                key: 'amount',
                label: translate('amount'),
                align: 'right',
                render: (item) => <ManagerMoney money={item.amount} />
              },
              {
                key: 'status',
                label: translate('status'),
                render: (item) => (
                  <div className='space-y-2'>
                    <ManagerStatus value={item.stage} />
                    <p className={`text-xs ${item.readyToSubmit ? 'text-success' : 'text-warning'}`}>
                      {translate(item.readyToSubmit ? 'ready' : 'notReady')}
                    </p>
                  </div>
                )
              }
            ]}
            onOpen={(item) => onOpen(item.requestId)}
          />
        )}
        <ManagerPagination
          pagination={query.data?.data?.pagination}
          onPage={paging.onPage}
          busy={query.isFetching || action.isPending}
        />
        <ManagerActionState action={action} />
      </ManagerSection>
      <details className='rounded-lg border border-border/60 bg-surface p-4 sm:p-5'>
        <summary className='cursor-pointer text-sm font-medium'>{translate('batchLookup')}</summary>
        <form
          className='mt-5 flex flex-wrap items-start gap-3'
          onSubmit={(event) => {
            event.preventDefault()
            const id = String(new FormData(event.currentTarget).get('batchId')).trim()
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('batchId', id)
              next.delete('batchPage')
              return next
            })
          }}
        >
          <div className='w-full max-w-md'>
            <ManagerField label={translate('batchId')}>
              <input name='batchId' required pattern={resourceIdPattern} className={managerInputClass} />
            </ManagerField>
          </div>
          <div className='pt-7'>
            <ManagerButton type='submit'>{translate('open')}</ManagerButton>
          </div>
        </form>
      </details>
      {isResourceId(batchId) && (
        <ManagerSection title={translate('batchId')}>
          <BatchResult key={batchId} id={batchId} onOpen={onOpen} />
        </ManagerSection>
      )}
      {confirm && (
        <Dialog
          presentation='sheet'
          title={translate('batch')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirm(false)
          }}
        >
          <p className='mb-4 text-right font-mono tabular-nums'>{selected.length}</p>
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirm(false)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              busy={action.isPending}
              disabled={action.blocked}
              onClick={() => {
                if (!action.blocked) action.mutate(selected)
              }}
            >
              {translate('confirm')}
            </ManagerButton>
          </div>
        </Dialog>
      )}
    </div>
  )
}
function BatchResult({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage('batchPage')
  const batch = useSpendBatchGet(id)
  const items = useSpendBatchItemList(
    id,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !!batch.data?.data && !batch.isError } }
  )
  return (
    <div>
      <ManagerQueryState query={batch} />
      {!batch.isError && batch.data?.data && (
        <>
          <p className='break-all text-right font-mono text-xs'>{batch.data.data.batch.id}</p>
          <ManagerQueryState query={items} empty={!items.data?.data?.items.length} />
          {!items.isError &&
            items.data?.data?.items.map((item) => (
              <div
                key={item.requestId}
                className='flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-3'
              >
                <ManagerButton onClick={() => onOpen(item.requestId)}>{translate('open')}</ManagerButton>
                <ManagerStatus value={item.outcome} />
                <ManagerStatus value={item.requestState} />
              </div>
            ))}
          <ManagerPagination pagination={items.data?.data?.pagination} onPage={paging.onPage} busy={items.isFetching} />
        </>
      )}
    </div>
  )
}
