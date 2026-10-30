import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  usePersonnelNoticeList,
  getPersonnelNoticeListQueryKey
} from '~/shared/api/generated/operations/personnel-notices/personnel-notice-list'
import {
  usePersonnelNoticeGet,
  getPersonnelNoticeGetQueryKey
} from '~/shared/api/generated/operations/personnel-notices/personnel-notice-get'
import { usePersonnelNoticeRecord } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-record'
import { usePersonnelNoticeLinkEvent } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-link-event'
import { usePersonnelNoticeReject } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-reject'
import { getDepartmentTransferListQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { getLongLeaveListQueryKey } from '~/shared/api/generated/operations/long-leaves/long-leave-list'
import { getOffboardingCaseListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminFormDialog, adminButtonClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { NoticeActionForm, type NoticeAction } from './notice-action-form'
import { noticeStatuses, noticePending } from '../enums/notice-status'
import { noticeKinds, noticeTitleChange } from '../enums/notice-kind'

export function NoticePanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [action, setAction] = useState<NoticeAction | null>(null)
  const query = usePersonnelNoticeList({ page, pageSize: 20 })
  const detail = usePersonnelNoticeGet(selectedId ?? '', { query: { enabled: Boolean(selectedId) } })
  const feedback = usePersonnelMutationFeedback(
    [
      getPersonnelNoticeListQueryKey(),
      getPersonnelNoticeGetQueryKey(selectedId ?? ''),
      getDepartmentTransferListQueryKey(),
      getLongLeaveListQueryKey(),
      getOffboardingCaseListQueryKey()
    ],
    () => {
      setAction(null)
      setSelectedId(null)
    }
  )
  const record = usePersonnelNoticeRecord({ mutation: { ...feedback, retry: false } })
  const link = usePersonnelNoticeLinkEvent({ mutation: { ...feedback, retry: false } })
  const reject = usePersonnelNoticeReject({ mutation: { ...feedback, retry: false } })
  const pending = record.isPending || link.isPending || reject.isPending
  const data = query.data?.data
  const notice = detail.data?.data
  const canHandle = notice?.status === noticePending && noticeKinds.includes(notice.kind)
  return (
    <section className='space-y-5'>
      <p className='text-sm text-muted-foreground'>{translate('noticeHelp')}</p>
      <AdminQueryState query={query}>
        <PersonnelList empty={!data?.items.length}>
          {data?.items.map((item) => (
            <PersonnelCard
              key={item.id}
              title={item.employee.fullName}
              actions={
                <button className={adminButtonClass} onClick={() => setSelectedId(item.id)}>
                  {translate('viewNotice')}
                </button>
              }
            >
              <p className='font-mono'>{item.code}</p>
              <PersonnelCode code={item.kind} values={noticeKinds} plain />
              <PersonnelCode code={item.status} values={noticeStatuses} />
              <p>{translate('noticeDue', { date: formatDate(item.dueOn) })}</p>
              {item.overdue && <p className='text-warning'>{translate('overdue')}</p>}
            </PersonnelCard>
          ))}
        </PersonnelList>
        <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {selectedId && !action && (
        <AdminFormDialog
          title={translate('noticeDetails')}
          pending={false}
          wide
          onClose={() => setSelectedId(null)}
          submitLabel={translate('close')}
          onSubmit={(event) => {
            event.preventDefault()
            setSelectedId(null)
          }}
        >
          <AdminQueryState query={detail}>
            {notice && (
              <div className='space-y-3'>
                <h3 className='font-semibold'>{notice.employee.fullName}</h3>
                <p className='font-mono'>{notice.code}</p>
                <PersonnelCode code={notice.kind} values={noticeKinds} plain />
                <PersonnelCode code={notice.status} values={noticeStatuses} />
                <p>{translate('noticeSender', { name: notice.sender.fullName })}</p>
                <p>{translate('noticeDue', { date: formatDate(notice.dueOn) })}</p>
                {notice.note && <p>{translate('noticeNote', { note: notice.note })}</p>}
                {canHandle && (
                  <div className='grid gap-2'>
                    {notice.kind !== noticeTitleChange && (
                      <>
                        <button type='button' className={adminButtonClass} onClick={() => setAction('record')}>
                          {translate('recordNotice')}
                        </button>
                        <button type='button' className={adminButtonClass} onClick={() => setAction('link')}>
                          {translate('linkNotice')}
                        </button>
                      </>
                    )}
                    <button type='button' className={adminButtonClass} onClick={() => setAction('reject')}>
                      {translate('rejectNotice')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </AdminQueryState>
        </AdminFormDialog>
      )}
      {action && selectedId && notice && canHandle && (
        <NoticeActionForm
          notice={notice}
          action={action}
          pending={pending}
          onClose={() => setAction(null)}
          onRecord={(body) => record.mutate({ id: selectedId, data: body })}
          onLink={(body) => link.mutate({ id: selectedId, data: body })}
          onReject={(body) => reject.mutate({ id: selectedId, data: body })}
        />
      )}
    </section>
  )
}
