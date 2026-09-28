import { useState } from 'react'
import { useNavigate } from 'react-router'

import { DescriptionAndRelatedCard } from './components/description-and-related-card'
import { GeneralInfoCard } from './components/general-info-card'
import { LicenseCostSummaryCard } from './components/license-cost-summary-card'
import { QuickActionsCard } from './components/quick-actions-card'
import { SoftwareDetailHeader } from './components/software-detail-header'
import { SoftwareDetailTabs, type SoftwareDetailTabKey } from './components/software-detail-tabs'
import { UsageMonitoringCard } from './components/usage-monitoring-card'
import { UsageStatusCard } from './components/usage-status-card'
import type { SoftwareDetailData } from './software-detail.types'

const defaultFigmaData: SoftwareDetailData = {
  id: '1',
  name: 'Figma',
  tagline: 'Design and prototyping platform for product teams.',
  status: 'active',
  tags: ['Productivity', 'Design', 'SaaS'],
  assignedDate: 'Jan 15, 2025',
  expirationDate: 'Jan 14, 2026',
  category: 'Design & Prototyping',
  provider: 'Figma, Inc.',
  autoRenewal: true,
  plan: 'Professional',
  licenseType: 'Named User',
  costCenter: 'CC-001',
  owner: 'Acme Corporation',
  project: 'Product Development',
  description:
    'Figma is a collaborative design tool used by our product and engineering teams to create user interfaces, prototypes, and design systems.',
  businessOwner: {
    name: 'Le Thi Mai',
    title: 'Product Manager',
    initials: 'LT'
  },
  team: 'Product Team',
  department: 'Product & Technology',
  totalLicenses: 20,
  assignedLicenses: 18,
  availableLicenses: 2,
  monthlyCost: 720.0,
  annualCost: 8640.0,
  usagePercentage: 90,
  activeCount: 18,
  inactiveCount: 2,
  lastActivityDate: 'Apr 28, 2025 (12 days ago)'
}

interface SoftwareDetailPageProps {
  softwareId?: string
}

export function SoftwareDetailPage({ softwareId }: SoftwareDetailPageProps) {
  void softwareId
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SoftwareDetailTabKey>('overview')
  const [data] = useState<SoftwareDetailData>(defaultFigmaData)

  const handleRequestChange = () => {
    navigate('/employee/create-request')
  }

  return (
    <div className='mx-auto max-w-[1440px] space-y-6'>
      {/* Header Banner */}
      <SoftwareDetailHeader name={data.name} onRequestChange={handleRequestChange} tagline={data.tagline} />

      {/* Tabs */}
      <SoftwareDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left Column (8 cols) */}
        <div className='space-y-6 lg:col-span-8'>
          <GeneralInfoCard data={data} />
          <UsageMonitoringCard />
          <DescriptionAndRelatedCard data={data} />
        </div>

        {/* Right Column (4 cols) */}
        <div className='space-y-6 lg:col-span-4'>
          <LicenseCostSummaryCard data={data} />
          <UsageStatusCard data={data} />
          <QuickActionsCard
            onRequestChangePlan={handleRequestChange}
            onRequestRenewal={handleRequestChange}
            onReturnLicense={handleRequestChange}
          />
        </div>
      </div>
    </div>
  )
}
