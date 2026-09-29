import { BudgetSnapshotPage } from '~/features/finance/budget-snapshot-page'

export function meta() {
  return [
    { title: 'Kiểm soát Ngân sách - SaaS-Sentry' },
    { name: 'description', content: 'Tài chính kiểm soát ngân sách và trả lời thông tin hạn mức' }
  ]
}

export default function FinanceSnapshotRoute() {
  return <BudgetSnapshotPage />
}
