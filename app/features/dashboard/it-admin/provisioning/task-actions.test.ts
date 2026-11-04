import { expect, it } from 'vitest'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import { taskActions } from './task-actions'
const failed = {
  kind: 'GRANT',
  status: 'FAILED',
  channel: 'MANUAL',
  availableDecisions: ['RETRY'],
  plan: { provisioningType: 'K2' }
} as TaskResponseDtoDataTask
it('does not offer withdrawn-task cancellation without confirmed withdrawal context', () => {
  expect(taskActions(failed)).not.toContain('cancel')
})
it('offers only cancellation when the request withdrawal has been confirmed', () => {
  expect(taskActions(failed, true)).toEqual(['cancel'])
})
