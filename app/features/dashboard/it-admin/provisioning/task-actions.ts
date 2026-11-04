import { TaskStatus } from './enums/task-status'
import { TaskKind } from './enums/task-kind'
import { TaskChannel } from './enums/task-channel'
import { TaskDecision } from './enums/task-decision'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'

export type TaskAction =
  'claim' | 'complete' | 'failure' | 'retry' | 'handOff' | 'closeFailed' | 'cancel' | 'revocation' | 'accessCut'
export function taskActions(task: TaskResponseDtoDataTask, withdrawalRequested = false): TaskAction[] {
  if (task.kind === TaskKind.GRANT && task.status === TaskStatus.FAILED && withdrawalRequested) return ['cancel']
  const actions: TaskAction[] = []
  if (
    task.channel === TaskChannel.MANUAL &&
    (task.status === TaskStatus.QUEUED || task.status === TaskStatus.IN_PROGRESS)
  )
    actions.push('claim')
  if (task.channel === TaskChannel.MANUAL && task.status === TaskStatus.IN_PROGRESS) {
    if (task.kind === TaskKind.GRANT) actions.push('complete')
    else if (['K1', 'K2', 'K5'].includes(task.plan?.provisioningType ?? '')) actions.push('revocation')
    actions.push('failure')
  }
  if (task.status === TaskStatus.FAILED) {
    if (task.availableDecisions.includes(TaskDecision.RETRY)) actions.push('retry')
    if (task.availableDecisions.includes(TaskDecision.HAND_OFF)) actions.push('handOff')
    if (task.availableDecisions.includes(TaskDecision.CLOSE_FAILED)) actions.push('closeFailed')
  }
  if (task.kind === TaskKind.REVOKE && task.status === TaskStatus.COMPLETED && task.revocation?.terminating)
    actions.push('accessCut')
  return actions
}
