import { describe, expect, it } from 'vitest'
import { localizeTerms } from './localize-terms'

describe('localizeTerms', () => {
  it('writes the English words of a policy in Vietnamese on a Vietnamese screen', () => {
    expect(localizeTerms('lý do của Finance cho Request của Cost Center', 'vi')).toBe(
      'lý do của Tài chính cho yêu cầu của trung tâm chi phí'
    )
    expect(localizeTerms('Request cấp mới (case A/B) và mỗi seat Trống', 'vi')).toBe(
      'Yêu cầu cấp mới (trường hợp A/B) và mỗi suất Trống'
    )
  })

  it('leaves the text as written on an English screen', () => {
    expect(localizeTerms('Finance reviews the Request', 'en')).toBe('Finance reviews the Request')
  })
})
