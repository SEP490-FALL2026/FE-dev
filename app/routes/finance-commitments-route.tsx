import { HeldCommitmentsPage } from '~/features/finance/held-commitments-page'

export function meta() {
  return [
    { title: 'Khoản Cam kết Đang giữ - SaaS-Sentry' },
    { name: 'description', content: 'Quản lý và đối soát các khoản cam kết ngân sách đang giữ chỗ' }
  ]
}

export default function FinanceCommitmentsRoute() {
  return <HeldCommitmentsPage />
}
