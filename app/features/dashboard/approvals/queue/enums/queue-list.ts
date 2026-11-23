/** UI-only choice between the two lists on the queue screen, kept in the `list` URL parameter. */
export const QUEUE_LIST = {
  SPEND: 'spend',
  NEED: 'need'
} as const

export type QueueList = (typeof QUEUE_LIST)[keyof typeof QUEUE_LIST]
