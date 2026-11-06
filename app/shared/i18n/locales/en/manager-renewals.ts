export const managerRenewals = {
  title: 'Subscription adjustments',
  hint: 'Confirm IT proposals for subscriptions owned by your department.',
  proposal: 'IT proposal',
  quantity: 'Proposed seats',
  activeUsers: 'Seats in use',
  acknowledge: 'I acknowledge cancelling this subscription while people are still using it.',
  stale: 'This proposal has changed. IT must submit a new proposal before confirmation.',
  usageUnavailable: 'Usage data is not available to assess activity.',
  selectedSeat: 'Seat proposed for release by IT',
  confirm: 'Confirm proposal',
  state: {
    PROPOSED: 'Awaiting confirmation',
    DECIDED: 'Confirmed',
    OUTCOME_RECORDED: 'Outcome recorded',
    STALE: 'New proposal required'
  },
  choice: { RENEW: 'Renew', REDUCE: 'Reduce seats', CANCEL: 'Cancel subscription' }
} as const
