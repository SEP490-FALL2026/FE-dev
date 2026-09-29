import { RenewalSchedulePage } from '~/features/finance/renewal-schedule-page'

export function meta() {
  return [
    { title: 'Lịch Gia hạn & Hạn chót - SaaS-Sentry' },
    { name: 'description', content: 'Theo dõi lịch gia hạn và cảnh báo hạn chót báo hủy' }
  ]
}

export default function FinanceRenewalsRoute() {
  return <RenewalSchedulePage />
}
