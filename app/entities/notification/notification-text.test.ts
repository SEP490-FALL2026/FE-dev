import { describe, expect, it } from 'vitest'
import { notificationText } from './notification-text'

describe('notificationText', () => {
  it('uses the localized text returned by the server', () => {
    expect(notificationText({ title: 'Tiêu đề', message: 'Nội dung' })).toEqual({
      title: 'Tiêu đề',
      message: 'Nội dung'
    })
  })
  it('allows older responses without localized text', () => {
    expect(notificationText({})).toEqual({ title: undefined, message: undefined })
  })
})
