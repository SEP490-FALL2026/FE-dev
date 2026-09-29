import { SoftwareDirectoryPage } from '~/features/finance/software-directory-page'

export function meta() {
  return [
    { title: 'Danh mục Chi phí SaaS - SaaS-Sentry' },
    { name: 'description', content: 'Danh mục chi tiết tất cả các phần mềm trả phí trong doanh nghiệp' }
  ]
}

export default function FinanceDirectoryRoute() {
  return <SoftwareDirectoryPage />
}
