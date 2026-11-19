export const DeviceSection = {
  DETAIL: 'detail',
  HISTORY: 'history',
  CREDENTIALS: 'credentials',
  USAGE: 'usage',
  STATUS: 'status',
  REJECTIONS: 'rejections'
} as const
export type DeviceSection = (typeof DeviceSection)[keyof typeof DeviceSection]
