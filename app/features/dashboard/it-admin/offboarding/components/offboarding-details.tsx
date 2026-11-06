import { OffboardingServiceDuties } from './offboarding-service-duties'
import { OffboardingHandoverDuties } from './offboarding-handover-duties'
import { OffboardingRightContext } from './offboarding-right-context'
import { useState } from 'react'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useOffboardingCaseGet } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { useOffboardingCaseRightList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-right-list'
import { useOffboardingCaseOpenRequestList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-request-list'
import { useOffboardingCaseOpenGrantTaskList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-grant-task-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { canCloseOffboarding } from '../hooks/offboarding-gates'
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
  const { formatDate } = useDashboardFormat()
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
            <dl className='grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('lastDay')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatDate(item.lastWorkingDay)}</dd>
              </div>
              <div>
                <dt className='text-sm text-muted-foreground'>{translate('heldRights')}</dt>
                <dd className='text-right font-mono tabular-nums'>{item.heldRights}</dd>
              </div>
            </dl>
            <section className='space-y-3 rounded-lg border border-border bg-surface p-4'>
              <h3 className='font-semibold [text-wrap:balance]'>{translate('checklist')}</h3>
              {Object.entries(item.checklist ?? {}).map(([key, step]) => (
                <div key={key} className='flex justify-between gap-3 text-sm'>
                  <span>{translate(`steps.${key}`, { defaultValue: translate('states.UNKNOWN') })}</span>
                  <span>{translate(`states.${step.state}`, { defaultValue: translate('states.UNKNOWN') })}</span>
                </div>
              ))}
              {!item.checklist && <p className='text-sm text-muted-foreground'>{translate('noChecklist')}</p>}
              {Object.values(item.blockers).some((count) => count > 0) && (
                <p className='text-sm text-danger'>
                  {translate('blockerSummary', {
                    count: Object.values(item.blockers).filter((count) => count > 0).length
                  })}
                </p>
              )}
              {item.accountLock ? (
                <p className='break-words text-sm'>
                  {translate('recordedLock')}: {item.accountLock.note}
                </p>
              ) : (
                <p className='text-sm text-muted-foreground'>{translate('hints.lock')}</p>
              )}
              {item.closed ? (
                <p>{translate('closed')}</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  <button
                    disabled={!active || Boolean(item.accountLock)}
                    className={itButtonClass}
                    onClick={() => setAction({ kind: 'lock', caseId: id })}
                  >
                    {translate('actions.lock')}
                  </button>
                  <button
                    disabled={!active || !canCloseOffboarding(item)}
                    className={itButtonClass}
                    onClick={() => setAction({ kind: 'close', caseId: id })}
                  >
                    {translate('actions.close')}
                  </button>
                </div>
              )}
            </section>
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
                        <p>{request.plan?.planName ?? request.requestId}</p>
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
            <OffboardingServiceDuties
              caseId={id}
              employeeId={item.employee.id}
              authorized={authorized && !item.closed}
            />
            <OffboardingHandoverDuties
              caseId={id}
              employeeId={item.employee.id}
              authorized={authorized && !item.closed}
            />
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
