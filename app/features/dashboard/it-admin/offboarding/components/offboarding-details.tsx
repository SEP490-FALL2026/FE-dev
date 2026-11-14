import { OffboardingRightContext } from './offboarding-right-context'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import {
  getOffboardingCaseGetQueryKey,
  useOffboardingCaseGet
} from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { getOffboardingCaseListQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { ItHandoverPanel } from '../../shared/components/it-handover-panel'
import { OffboardingCaseStatus } from './offboarding-case-status'
import { useOffboardingCaseRightList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { useOffboardingCaseOpenRequestList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-request-list'
import { useOffboardingCaseOpenGrantTaskList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-grant-task-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { OffboardingActionDialog, type OffboardingAction } from './offboarding-action-dialog'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { OffboardingState } from '../enums/offboarding-state'

export function OffboardingDetails({
  id,
  onBack,
  onSelectTab
}: {
  id: string
  onBack: () => void
  onSelectTab?: (tab: ItAdminTabKey) => void
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const [page, setPage] = useState(1)
  const [requestPage, setRequestPage] = useState(1)
  const [grantPage, setGrantPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [action, setAction] = useState<OffboardingAction | null>(null)
  const detail = useOffboardingCaseGet(id)
  const rights = useOffboardingCaseRightList(id, { page, pageSize: 20 })
  const requests = useOffboardingCaseOpenRequestList(id, { page: requestPage, pageSize: 20 })
  const grants = useOffboardingCaseOpenGrantTaskList(id, { page: grantPage, pageSize: 20 })
  const me = useMeGet()
  const item = detail.data?.data
  const authorized = !me.isError && (me.data?.data?.roles.includes('IT_ADMIN') ?? false)
  const active = authorized && !detail.isFetching && item?.accessBlocked === true && !item.closed
  const rightData = rights.data?.data
  const requestData = requests.data?.data
  const grantData = grants.data?.data
  const visibleSelected = selected.filter((assignmentId) =>
    rightData?.items.some((right) => right.assignmentId === assignmentId && right.revocable && !right.revocation)
  )
  return (
    <div className='space-y-5'>
      <button className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <ItQueryState query={detail}>
        {item ? (
          <>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='text-xl font-semibold [text-wrap:balance]'>{item.employee.fullName}</h2>
                <p className='text-sm text-muted-foreground'>
                  {item.employee.employeeCode} ·{' '}
                  {translate(`states.${item.state}`, { defaultValue: translate('states.UNKNOWN') })}
                </p>
              </div>
              <button className={itButtonClass} onClick={() => void detail.refetch()}>
                {translate('refresh')}
              </button>
            </div>
            <OffboardingCaseStatus
              item={item}
              active={active}
              onLock={() => setAction({ kind: 'lock', caseId: id })}
              onMailboxLock={() => setAction({ kind: 'mailbox', caseId: id })}
            />
            {item.itHandover && (
              <ItHandoverPanel
                source={{ kind: 'offboarding', id }}
                handover={item.itHandover}
                leavingEmployeeId={item.employee.id}
                canAct={authorized && !detail.isFetching}
                invalidates={[getOffboardingCaseGetQueryKey(id), getOffboardingCaseListQueryKey()]}
              />
            )}
            <section className='space-y-3'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <h3 className='font-semibold [text-wrap:balance]'>{translate('rights')}</h3>
                <button
                  disabled={!active || !item.accountLock || !visibleSelected.length || rights.isFetching}
                  className={itPrimaryClass}
                  onClick={() => setAction({ kind: 'revoke', caseId: id, assignmentIds: visibleSelected })}
                >
                  {translate('actions.revoke')}
                </button>
              </div>
              <ItQueryState query={rights}>
                <div className='space-y-2'>
                  {rightData?.items.map((right) => (
                    <label
                      key={right.assignmentId}
                      className='flex items-start gap-3 rounded-lg border border-border bg-surface p-4'
                    >
                      <input
                        type='checkbox'
                        disabled={!active || !right.revocable || Boolean(right.revocation)}
                        checked={visibleSelected.includes(right.assignmentId)}
                        onChange={(event) =>
                          setSelected((previous) =>
                            event.target.checked
                              ? [...previous, right.assignmentId]
                              : previous.filter((value) => value !== right.assignmentId)
                          )
                        }
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='font-medium'>{right.application.name}</p>
                        <p className='text-sm text-muted-foreground'>{right.plan.name}</p>
                        <OffboardingRightContext right={right} caseId={id} authorized={authorized && !item.closed} />
                        {right.revocation && (
                          <p className='text-sm'>
                            {translate('revocation')}:{' '}
                            {translate(`states.${right.revocation.status}`, {
                              defaultValue: translate('states.UNKNOWN')
                            })}
                          </p>
                        )}
                        {right.dataLossOnRemoval && <p className='text-sm text-danger'>{translate('dataLoss')}</p>}
                      </div>
                    </label>
                  ))}
                  {!rightData?.items.length && <ItEmpty />}
                </div>
              </ItQueryState>
              <ItPagination
                page={page}
                total={rightData?.pagination.totalItems ?? 0}
                pageSize={20}
                onChange={(value) => {
                  setPage(value)
                  setSelected([])
                }}
              />
            </section>
            <section className='space-y-3'>
              <h3 className='font-semibold [text-wrap:balance]'>{translate('openRequests')}</h3>
              <ItQueryState query={requests}>
                <div className='space-y-2'>
                  {requestData?.items.map((request) => (
                    <div
                      key={request.requestId}
                      className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4'
                    >
                      <div>
                        <p>{request.plan?.planName ?? translate('unknown')}</p>
                        <p className='text-sm text-muted-foreground'>
                          {translate(`states.${request.state}`, { defaultValue: translate('states.UNKNOWN') })}
                        </p>
                      </div>
                      <button
                        className={itButtonClass}
                        disabled={!active || item.state !== OffboardingState.LEFT || !request.cancellable}
                        onClick={() =>
                          setAction({
                            kind: 'cancel',
                            caseId: id,
                            requestId: request.requestId,
                            employeeId: item.employee.id,
                            group: request.group
                          })
                        }
                      >
                        {translate(request.group ? 'actions.closeLine' : 'actions.cancel')}
                      </button>
                    </div>
                  ))}
                  {!requestData?.items.length && <ItEmpty />}
                </div>
              </ItQueryState>
              <ItPagination
                page={requestPage}
                total={requestData?.pagination.totalItems ?? 0}
                pageSize={20}
                onChange={setRequestPage}
              />
            </section>
            <section className='space-y-3'>
              <h3 className='font-semibold [text-wrap:balance]'>{translate('openGrants')}</h3>
              <ItQueryState query={grants}>
                <div className='space-y-2'>
                  {grantData?.items.map((task) => (
                    <div key={task.taskId} className='rounded-lg border border-border p-4 text-sm'>
                      {task.plan.planName} ·{' '}
                      {translate(`states.${task.status}`, { defaultValue: translate('states.UNKNOWN') })}
                    </div>
                  ))}
                  {!grantData?.items.length && <ItEmpty />}
                </div>
              </ItQueryState>
              <ItPagination
                page={grantPage}
                total={grantData?.pagination.totalItems ?? 0}
                pageSize={20}
                onChange={setGrantPage}
              />
              {onSelectTab && (
                <button className={itButtonClass} onClick={() => onSelectTab('provisioning')}>
                  {translate('provisioning')}
                </button>
              )}
            </section>
            {!authorized && <p className='text-sm text-muted-foreground'>{translate('noPermission')}</p>}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {action && (
        <OffboardingActionDialog
          action={action}
          onClose={() => {
            setAction(null)
            setSelected([])
          }}
        />
      )}
    </div>
  )
}
