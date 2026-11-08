import { useState } from 'react'
import { Calendar, Plus, UserRound, XCircle } from 'lucide-react'
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
                  <div className='flex items-center gap-2.5'>
                    <span
                      aria-hidden='true'
                      className='grid size-7 shrink-0 place-items-center rounded-lg border border-border/60 bg-surface-subtle text-muted-foreground'
                    >
                      <UserRound strokeWidth={1.5} className='size-3.5' />
                    </span>
                    <div>
                      <p className='max-w-64 truncate font-medium text-foreground' title={notice.employee.fullName}>
                        {notice.employee.fullName}
                      </p>
                      <p className='mt-0.5 font-mono text-xs text-muted-foreground'>{notice.code}</p>
                    </div>
                  </div>
                )
              },
              { key: 'kind', label: translate('kind'), render: (notice) => translate(`statuses.${notice.kind}`) },
              {
                key: 'date',
                label: translate('proposedOn'),
                render: (notice) => (
                  <span className='font-mono text-xs tabular-nums text-muted-foreground'>
                    {formatDate(notice.proposedOn)}
                  </span>
                )
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
  const { formatDate } = useDashboardFormat()
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
        <div className='space-y-5'>
          {/* Employee Spotlight */}
          <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
            <div className='flex items-center gap-3.5 min-w-0'>
              <span
                aria-hidden='true'
                className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
              >
                <UserRound strokeWidth={1.5} className='size-6' />
              </span>
              <div className='min-w-0'>
                <h3 className='truncate text-lg font-bold text-foreground' title={notice.employee.fullName}>
                  {notice.employee.fullName}
                </h3>
                <p className='truncate font-mono text-xs text-muted-foreground'>{notice.code}</p>
              </div>
            </div>
            <ManagerStatus value={notice.status} />
          </div>

          {/* Rejection Alert */}
          {notice.rejectReason && (
            <div
              role='alert'
              className='flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs font-medium text-danger'
            >
              <XCircle className='size-4 shrink-0 mt-0.5' />
              <p className='whitespace-pre-wrap break-words [overflow-wrap:anywhere]'>{notice.rejectReason}</p>
            </div>
          )}

          {/* Details Grid */}
          <dl className='grid gap-4 rounded-xl border border-border/60 bg-surface p-4 text-sm sm:grid-cols-2'>
            <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
              <dt className='text-xs text-muted-foreground'>{translate('kind')}</dt>
              <dd className='mt-1 font-medium text-foreground'>{translate(`statuses.${notice.kind}`)}</dd>
            </div>
            <div>
              <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Calendar strokeWidth={1.5} className='size-3.5' />
                {translate('proposedOn')}
              </dt>
              <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                {formatDate(notice.proposedOn)}
              </dd>
            </div>
          </dl>

          {/* Note if present */}
          {notice.note && (
            <div className='space-y-1.5'>
              <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {translate('note')}
              </dt>
              <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm text-foreground'>
                <p className='whitespace-pre-wrap break-words [overflow-wrap:anywhere]'>{notice.note}</p>
              </dd>
            </div>
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
        </div>
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
