import { useState } from 'react'

import { ApprovalFlowCard } from './components/approval-flow-card'
import { ApprovalProgressCard } from './components/approval-progress-card'
import { RequestHeaderCard } from './components/request-header-card'
import { RequestHistoryCard } from './components/request-history-card'
import { RequestInfoCard } from './components/request-info-card'
import type { RequestDetailData } from './request-detail.types'

const defaultRequestData: RequestDetailData = {
  id: 'REQ-1024',
  softwareName: 'Figma Professional',
  softwareLogoUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCuJg_eaRAfsSKEtTKXCaH-Hwopc4ZlZy8zkliHXhMTUqb4I0MQOGEV4fO0Necysl9Hv8__MuKzS7MOyFQO8acE4I-WQ_kp8a2K5kxpEoYTolBUyke77CKEfhhKKbQr3y6vAcBuEY-U8S7PMQbhR0PMaj1tlgrB0ekP7zczgzpXAoJtObWTvUHgdzTqQ6eMfJ8-Qu_nuv6rykr2sGhHe0AvwqnQFlTf-_T0GUKDk6Y6MfH6mzmETjKs',
  plan: 'Professional',
  requestTypeKey: 'myRequests.types.newSoftware',
  requestTypeBadge: 'requestDetail.header.newSoftwareAccess',
  status: 'pending',
  statusBadgeKey: 'myRequests.status.pending',
  submittedDate: 'Aug 23, 2026',
  submittedTime: '09:15 AM',
  currentStatusDescKey: 'requestDetail.header.currentStatusDesc',
  businessReason: 'Need Figma Professional for UI/UX design work in Project Alpha.',
  project: 'Project Alpha',
  costCenter: 'CC-001',
  requiredFrom: 'Sep 01, 2026',
  requiredUntil: 'Dec 31, 2026',
  submittedBy: {
    name: 'Nguyễn Minh An',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjDnVh9w7AITjUFGU2nBCMvLS2btU3aeljSZ39HgW7ijI4Bg7fr--vx2mFIGddirUgEtQk-ZZz6Q9weTK9jHt3GDUTsnbkocxroDwO9F6QcE3pxUN89uTQFPbDktxqfilpj-Ydi6boy0QVhCmTkrhb_Y-2rdMAQYR6M2v9w-alNv3rHsI9Dr9PdRWZ9BiW4Ic8LTJtUwXZXgzK2XruJyWMuqDyrCLSudsB5pTzd9f-vP9jNjAN_6Cr'
  },
  managerName: 'Trần Văn Bình'
}

interface RequestDetailPageProps {
  requestId?: string
}

export function RequestDetailPage({ requestId }: RequestDetailPageProps) {
  const [data] = useState<RequestDetailData>(() => ({
    ...defaultRequestData,
    id: requestId || defaultRequestData.id
  }))

  const handleCancelRequest = () => {
    // In MVP, could trigger confirmation or toast
  }

  return (
    <div className='mx-auto max-w-[1200px] space-y-6'>
      {/* Top Header Card */}
      <RequestHeaderCard data={data} />

      {/* Main 2-column Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left Column (5 cols): Timeline & Cancel */}
        <div className='space-y-6 lg:col-span-5'>
          <ApprovalProgressCard
            managerName={data.managerName}
            onCancelRequest={handleCancelRequest}
            submittedDate={data.submittedDate}
            submittedTime={data.submittedTime}
          />
        </div>

        {/* Right Column (7 cols): Information & Approval Flow */}
        <div className='space-y-6 lg:col-span-7'>
          <RequestInfoCard data={data} />
          <ApprovalFlowCard managerName={data.managerName} />
        </div>
      </div>

      {/* Bottom Full-Width Card: History Log */}
      <RequestHistoryCard
        managerName={data.managerName}
        submittedDate={data.submittedDate}
        submittedTime={data.submittedTime}
      />
    </div>
  )
}
