import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  provisioningTaskGet,
  provisioningTaskList,
  getProvisioningTaskListQueryKey,
  getProvisioningTaskGetQueryKey
} from '~/shared/api/generated/operations/provisioning-tasks'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import type { ProvisioningTaskListParams } from '~/shared/api/generated/model'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { ProvisioningActionDialog } from '../components/provisioning-action-dialog'
import { taskActions, type TaskAction } from '../task-actions'
import { ProvisioningExpiryQueue } from '../components/provisioning-expiry-queue'
import { ProvisioningGrantQueue } from '../components/provisioning-grant-queue'
import { TaskStatus } from '../enums/task-status'
import { TaskChannel } from '../enums/task-channel'
import { TaskScope } from '../enums/task-scope'

export function ItProvisioningView({
  initialTaskId,
  initialScope = TaskScope.MINE,
  initialQueue = 'tasks'
}: {
  initialTaskId?: string
  initialScope?: TaskScope
  initialQueue?: 'tasks' | 'grants' | 'expiry'
  onSelectTab?: (tab: ItAdminTabKey) => void
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const { formatDate } = useDashboardFormat()
  const me = useMeGet({ query: { staleTime: 60000 } })
  const authorized = me.data?.data?.roles.includes('IT_ADMIN') === true
  const actorIds = [me.data?.data?.appUserId ?? '', me.data?.data?.employee.id ?? '']
  const [selectedTask, setSelectedTask] = useState(initialTaskId ?? '')
  const [queue, setQueue] = useState<'tasks' | 'grants' | 'expiry'>(initialQueue)
  const [params, setParams] = useState<ProvisioningTaskListParams>({ page: 1, pageSize: 20, scope: initialScope })
  const [action, setAction] = useState<TaskAction | null>(null)
  const list = useQuery({
    queryKey: getProvisioningTaskListQueryKey(params),
    queryFn: () => provisioningTaskList(params),
    enabled: authorized && !selectedTask && queue === 'tasks'
  })
  const detail = useQuery({
    queryKey: getProvisioningTaskGetQueryKey(selectedTask),
    queryFn: () => provisioningTaskGet(selectedTask),
    enabled: authorized && !!selectedTask
  })
  const task = detail.data?.data?.task
  const requestQuery = useAccessRequestGet(task?.requestId ?? '', {
    query: { enabled: authorized && task?.kind === 'GRANT' && task.status === TaskStatus.FAILED && !!task.requestId }
  })
  const requestData = requestQuery.data?.data
  const request = requestData && 'request' in requestData ? requestData.request : undefined
  const withdrawn = !requestQuery.isError && !requestQuery.isFetching && !!request?.withdrawal
  const page = list.data?.data
  function filter(key: keyof ProvisioningTaskListParams, value: string) {
    setParams((previous) => ({ ...previous, [key]: value || undefined, page: 1 }))
  }
  if (!authorized)
    return (
      <ItQueryState query={me}>
        <p className='p-6 text-sm'>{translate('accessRequired')}</p>
      </ItQueryState>
    )
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{translate('description')}</p>
        </div>
        {selectedTask && (
          <button
            className={itButtonClass}
            onClick={() => {
              setSelectedTask('')
              setAction(null)
            }}
          >
            {translate('back')}
          </button>
        )}
      </header>
      {selectedTask ? (
        <ItQueryState query={detail}>
          {task ? (
            <article className='space-y-5 rounded-lg border border-border bg-surface p-5'>
              <div>
                <h2 className='truncate text-lg font-semibold' title={task.plan?.applicationName}>
                  {task.plan?.applicationName}
                </h2>
                <p className='truncate text-sm text-muted-foreground' title={task.plan?.planName}>
                  {task.plan?.planName}
                </p>
              </div>
              <dl className='grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3'>
                <div>
                  <dt className='text-muted-foreground'>{translate('beneficiary')}</dt>
                  <dd className='truncate' title={task.beneficiary?.fullName}>
                    {task.beneficiary?.fullName ?? translate('unavailable')}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('account')}</dt>
                  <dd className='break-all'>{task.accountIdentifier}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('status')}</dt>
                  <dd>{translate(`values.${task.status}`, { defaultValue: translate('unavailable') })}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('kind')}</dt>
                  <dd>{translate(`values.${task.kind}`, { defaultValue: translate('unavailable') })}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('channel')}</dt>
                  <dd>{translate(`values.${task.channel}`, { defaultValue: translate('unavailable') })}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('attempts')}</dt>
                  <dd className='font-mono tabular-nums'>
                    {translate('attemptCount', { count: task.attempts, max: task.maxAttempts })}
                  </dd>
                </div>
              </dl>
              {task.claimableNow === false && task.notBefore && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translate('claimAvailableOn', { date: formatDate(task.notBefore) })}
                </p>
              )}
              {task.steps.length > 0 && (
                <div>
                  <h3 className='mb-2 font-medium'>{translate('steps')}</h3>
                  <ol className='list-inside list-decimal space-y-2 text-sm'>
                    {task.steps.map((step, index) => (
                      <li key={`${step.code}-${index}`}>
                        {translate(`stepsValues.${step.code}`)}
                        {step.accountIdentifier && (
                          <span className='ml-2 break-all text-muted-foreground'>{step.accountIdentifier}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {task.doneWhen && (
                <p className='text-sm'>
                  {translate('doneWhen')}: {translate(`doneValues.${task.doneWhen}`)}
                </p>
              )}
              {task.evidence && (
                <div>
                  <h3 className='font-medium'>{translate('evidence')}</h3>
                  <p className='whitespace-pre-wrap break-words text-sm'>{task.evidence}</p>
                </div>
              )}
              {task.failureReason && (
                <div>
                  <h3 className='font-medium'>{translate('reason')}</h3>
                  <p className='whitespace-pre-wrap break-words text-sm'>{task.failureReason}</p>
                </div>
              )}
              {task.revocation?.paidThroughOn && (
                <p className='text-sm'>
                  {translate('paidThroughOn')}: {task.revocation.paidThroughOn}
                </p>
              )}
              <div className='flex flex-wrap gap-2'>
                {taskActions(task, withdrawn)
                  .filter(
                    (item) =>
                      !['complete', 'failure', 'revocation'].includes(item) || actorIds.includes(task.claimedBy ?? '')
                  )
                  .map((item) => (
                    <button key={item} className={itButtonClass} onClick={() => setAction(item)}>
                      {translate(`actions.${item}`)}
                    </button>
                  ))}
              </div>
            </article>
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      ) : (
        <>
          <div className='flex flex-wrap gap-2' role='group' aria-label={translate('queue')}>
            <button className={itButtonClass} aria-pressed={queue === 'tasks'} onClick={() => setQueue('tasks')}>
              {translate('tasks')}
            </button>
            <button className={itButtonClass} aria-pressed={queue === 'grants'} onClick={() => setQueue('grants')}>
              {translate('grants')}
            </button>
            <button className={itButtonClass} aria-pressed={queue === 'expiry'} onClick={() => setQueue('expiry')}>
              {translate('expiry')}
            </button>
          </div>
          {queue === 'expiry' ? (
            <ProvisioningExpiryQueue onOpenTask={setSelectedTask} />
          ) : queue === 'grants' ? (
            <ProvisioningGrantQueue onCreated={setSelectedTask} />
          ) : (
            <>
              <div className='grid gap-3 sm:grid-cols-3'>
                <ItChoiceSelect
                  label={translate('scope')}
                  value={params.scope ?? TaskScope.MINE}
                  options={Object.values(TaskScope).map((value) => ({ value, label: translate(`values.${value}`) }))}
                  onChange={(value) => filter('scope', value)}
                />
                <ItChoiceSelect
                  label={translate('status')}
                  value={params.status ?? ''}
                  options={[
                    { value: '', label: translate('allStatuses') },
                    ...Object.values(TaskStatus).map((value) => ({ value, label: translate(`values.${value}`) }))
                  ]}
                  onChange={(value) => filter('status', value)}
                />
                <ItChoiceSelect
                  label={translate('channel')}
                  value={params.channel ?? ''}
                  options={[
                    { value: '', label: translate('allChannels') },
                    ...Object.values(TaskChannel).map((value) => ({ value, label: translate(`values.${value}`) }))
                  ]}
                  onChange={(value) => filter('channel', value)}
                />
              </div>
              <ItQueryState query={list}>
                {page?.items.length ? (
                  <div className='space-y-3'>
                    {page.items.map((item) => (
                      <article
                        key={item.id}
                        className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4'
                      >
                        <div className='min-w-0'>
                          <h2
                            className='truncate font-medium'
                            title={`${item.plan?.applicationName ?? ''} ${item.plan?.planName ?? ''}`}
                          >
                            {item.plan?.applicationName} {item.plan?.planName}
                          </h2>
                          <p className='truncate text-sm text-muted-foreground' title={item.beneficiary?.fullName}>
                            {item.beneficiary?.fullName} ·{' '}
                            {translate(`values.${item.kind}`, { defaultValue: translate('unavailable') })} ·{' '}
                            {translate(`values.${item.status}`, { defaultValue: translate('unavailable') })} ·{' '}
                            {translate(`values.${item.channel}`, { defaultValue: translate('unavailable') })}
                          </p>
                          <p className='mt-1 font-mono text-xs tabular-nums text-muted-foreground'>
                            {translate('waitSeconds', { count: item.elapsedSeconds })}
                          </p>
                        </div>
                        <button className={itButtonClass} onClick={() => setSelectedTask(item.id)}>
                          {translate('details')}
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <ItEmpty />
                )}
              </ItQueryState>
              {page && (
                <ItPagination
                  page={params.page ?? 1}
                  total={page.pagination.totalItems}
                  pageSize={params.pageSize ?? 20}
                  onChange={(next) => setParams((previous) => ({ ...previous, page: next }))}
                />
              )}
            </>
          )}
        </>
      )}
      {task && action && <ProvisioningActionDialog task={task} action={action} onClose={() => setAction(null)} />}
    </section>
  )
}
