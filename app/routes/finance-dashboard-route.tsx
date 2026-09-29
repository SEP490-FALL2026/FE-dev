import { FinanceDashboardPage } from '~/features/finance/finance-dashboard-page'

export function meta() {
  return [
    { title: 'Bảng điều khiển Tài chính - SaaS-Sentry' },
    { name: 'description', content: 'Tổng quan chi phí SaaS, ngân sách các đơn vị và hiệu quả tiết kiệm' }
  ]
}

export default function FinanceDashboardRoute() {
  return <FinanceDashboardPage />
}
