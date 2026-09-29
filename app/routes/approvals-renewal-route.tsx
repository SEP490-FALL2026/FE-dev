import { RenewalDecisionPanelPage } from '~/features/approvals/renewal-decision-panel-page'

export function meta() {
  return [
    { title: 'Quyết định Kỳ gia hạn - SaaS-Sentry' },
    { name: 'description', content: 'Quyết định kỳ gia hạn trước hạn chót báo hủy' }
  ]
}

export default function ApprovalsRenewalRoute() {
  return <RenewalDecisionPanelPage />
}
