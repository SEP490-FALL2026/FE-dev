export const common = {
  brand: 'SaaS-Sentry',
  notifications: {
    label: 'Notifications',
    close: 'Dismiss notification',
    markAllRead: 'Mark all as read',
    markRead: 'Mark as read',
    unread: 'Unread',
    loadMore: 'Load more',
    loading: 'Loading notifications',
    retry: 'Try again',
    retryAfter: 'Try again in {{seconds}}s',
    empty: 'No notifications yet',
    emptyHint: 'Updates related to your work will appear here.',
    loadError: 'Notifications could not be loaded. Please try again.',
    saved: 'Notifications marked as read',
    saveError: 'Could not mark notifications as read. Please try again.',
    uncertain: 'The result is uncertain. The inbox will refresh before you try again.',
    fallback: 'New work update',
    updateHint: 'There is an update related to your work.',
    requestReference: 'Request: {{id}}',
    openRequest: 'View request',
    countOverflow: '99+',
    codes: {
      REQUEST_SUBMITTED: 'Request submitted',
      REQUEST_GRANTED: 'Access granted',
      REQUEST_NEED_APPROVED: 'Need approved',
      REQUEST_NEED_REJECTED: 'Need rejected',
      REQUEST_SPEND_APPROVED: 'Spending approved',
      REQUEST_SPEND_REJECTED: 'Spending rejected',
      STEP_ASSIGNED: 'A workflow step needs your attention',
      REQUEST_WITHDRAWN: 'Request withdrawn',
      HANDOVER_REQUIRED: 'A data handover needs confirmation'
    }
  },
  language: {
    english: 'English',
    englishShort: 'EN',
    selector: 'Language',
    switchTo: 'Switch to {{language}}',
    vietnamese: 'Vietnamese',
    vietnameseShort: 'VI'
  }
} as const
