import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/notifications/notificationListResponseDtoDataItemsItem'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { NotificationPersonnelContext } from './components/notification-personnel-context'

beforeEach(async () => {
  await setAppLanguage('en', false)
})
const notification: NotificationListResponseDtoDataItemsItem = {
  id: 'test-notification',
  code: 'REQUEST_CANCELLED_BENEFICIARY_GONE',
  subject: null,
  params: { reasonKind: 'TRANSFER' },
  createdAt: '2026-11-14T10:00:00Z',
  readAt: null
}
it('explains cancellation from the typed personnel event parameters', () => {
  render(<NotificationPersonnelContext notification={notification} />)
  expect(screen.getByText(/transferred/i)).toBeInTheDocument()
})
it('renders IT rejection feedback as text and ignores unknown decisions', () => {
  const view = render(
    <NotificationPersonnelContext
      notification={{
        ...notification,
        code: 'DEPARTMENT_SOFTWARE_PROPOSAL_DECIDED',
        params: { decision: 'REJECTED', reason: '<script>feedback</script>' }
      }}
    />
  )
  expect(screen.getByText('<script>feedback</script>')).toBeInTheDocument()
  expect(document.querySelector('script')).toBeNull()
  view.rerender(
    <NotificationPersonnelContext
      notification={{
        ...notification,
        code: 'DEPARTMENT_SOFTWARE_PROPOSAL_DECIDED',
        params: { decision: 'FUTURE_DECISION' }
      }}
    />
  )
  expect(view.container).toBeEmptyDOMElement()
})
