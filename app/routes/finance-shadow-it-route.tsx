import { ShadowItPage } from '~/features/finance/shadow-it-page'

export function meta() {
  return [
    { title: 'Chi tiêu ngoài danh mục - SaaS-Sentry' },
    { name: 'description', content: 'Phát hiện và xem xét hợp thức hóa chi tiêu Shadow IT' }
  ]
}

export default function FinanceShadowItRoute() {
  return <ShadowItPage />
}
