import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import {
  usePersonnelNoticeList,
  getPersonnelNoticeListQueryKey
} from '~/shared/api/generated/operations/personnel-notices/personnel-notice-list'
import {
  usePersonnelNoticeGet,
  getPersonnelNoticeGetQueryKey
} from '~/shared/api/generated/operations/personnel-notices/personnel-notice-get'
import { personnelNoticeWithdraw } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-withdraw'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { ManagerNoticeForm } from '../components/manager-notice-form'
import { NOTICE_STATUS } from '../enums/notice-status'

export function ManagerNotices() {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage()
  const [params, setParams] = useSearchParams()
  const { formatDate } = useDashboardFormat()
  const creating = params.get('compose') === 'notice'
  const setCreating = (open: boolean) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (open) next.set('compose', 'notice')
        else next.delete('compose')
        return next
      },
      { replace: true }
    )
  const query = usePersonnelNoticeList({ page: paging.page, pageSize: paging.pageSize })
  const id = params.get('noticeId') ?? ''
  return (
    <div className='space-y-6'>
      <ManagerSection
        title={translate('noticeHistory')}
        action={
          <ManagerButton primary onClick={() => setCreating(true)}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('reportChange')}
          </ManagerButton>
        }
      >
        <ManagerQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('noNotices')}
          emptyDescription={translate('noNoticesHint')}
        />
        {!query.isError && (
          <ManagerDataTable
            label={translate('noticeHistory')}
            items={query.data?.data?.items ?? []}
            rowKey={(notice) => notice.id}
            columns={[
              {
                key: 'employee',
                label: translate('employee'),
                render: (notice) => (
                  <div>
                    <p className='max-w-64 truncate font-medium' title={notice.employee.fullName}>
                      {notice.employee.fullName}
                    </p>
                    <p className='mt-1 font-mono text-xs text-muted-foreground'>{notice.code}</p>
                  </div>
                )
              },
              { key: 'kind', label: translate('kind'), render: (notice) => translate(`statuses.${notice.kind}`) },
              {
                key: 'date',
                label: translate('proposedOn'),
                align: 'right',
                render: (notice) => formatDate(notice.proposedOn)
              },
              { key: 'status', label: translate('status'), render: (notice) => <ManagerStatus value={notice.status} /> }
            ]}
            onOpen={(notice) =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                next.set('noticeId', notice.id)
                return next
              })
            }
          />
        )}
        <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </ManagerSection>
      {isResourceId(id) && <NoticeDetail key={id} id={id} />}{' '}
      {creating && (
        <ManagerNoticeForm
          onClose={() => setCreating(false)}
          onCreated={(noticeId) => {
            setCreating(false)
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.delete('compose')
              next.set('noticeId', noticeId)
              return next
            })
          }}
        />
      )}
    </div>
  )
}
function NoticeDetail({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const query = usePersonnelNoticeGet(id)
  const notice = !query.isError ? query.data?.data : null
  const [confirm, setConfirm] = useState(false)
  const action = useManagerAction({
    mutationFn: () => personnelNoticeWithdraw(id),
    invalidate: [getPersonnelNoticeListQueryKey(), getPersonnelNoticeGetQueryKey(id)],
    onSuccess: () => setConfirm(false)
  })
  return (
    <ManagerSection title={translate('notice')}>
      <ManagerQueryState query={query} empty={!notice} />
      {notice && (
        <>
          <div className='flex flex-wrap justify-between gap-3'>
            <h3 className='truncate font-medium' title={notice.employee.fullName}>
              {notice.employee.fullName}
            </h3>
            <ManagerStatus value={notice.status} />
          </div>
          <p className='text-sm'>{translate(`statuses.${notice.kind}`)}</p>
          <p className='text-right font-mono text-sm tabular-nums'>{notice.proposedOn}</p>
          {notice.note && <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{notice.note}</p>}
          {notice.rejectReason && (
            <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{notice.rejectReason}</p>
          )}
          {notice.status === NOTICE_STATUS.PENDING_VERIFICATION && (
            <div className='flex justify-end'>
              <ManagerButton disabled={action.blocked} busy={action.isPending} onClick={() => setConfirm(true)}>
                {action.retrySeconds
                  ? translate('retryAfter', { seconds: action.retrySeconds })
                  : translate('withdraw')}
              </ManagerButton>
            </div>
          )}
          <ManagerActionState action={action} />
        </>
      )}
      {confirm && (
        <Dialog
          presentation='sheet'
          title={translate('withdraw')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirm(false)
          }}
        >
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirm(false)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              disabled={action.blocked}
              busy={action.isPending}
              onClick={() => {
                if (!action.blocked) action.mutate()
              }}
            >
              {translate('confirm')}
            </ManagerButton>
          </div>
        </Dialog>
      )}
    </ManagerSection>
  )
}
