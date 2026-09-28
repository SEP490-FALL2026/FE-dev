import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { RequestActionsBar } from './components/request-actions-bar'
import { RequestDetailsPanel } from './components/request-details-panel'
import { RequestStepper } from './components/request-stepper'
import { SoftwareSelectionPanel } from './components/software-selection-panel'
import type { AvailableSoftwareItem, RequestFormData } from './request-new-software.types'

const initialSoftwareList: AvailableSoftwareItem[] = [
  {
    id: 'figma',
    name: 'Figma',
    descriptionKey: 'requestNewSoftware.selection.figmaDesc',
    logoType: 'figma',
    isAvailable: true
  },
  {
    id: 'github',
    name: 'GitHub',
    descriptionKey: 'requestNewSoftware.selection.githubDesc',
    logoType: 'github',
    isAvailable: true
  },
  {
    id: 'jira',
    name: 'Jira Software',
    descriptionKey: 'requestNewSoftware.selection.jiraDesc',
    logoType: 'jira',
    isAvailable: true
  }
]

export function RequestNewSoftwarePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<RequestFormData>({
    selectedSoftwareId: 'figma',
    plan: 'Professional',
    businessReason: 'Need Figma Professional for UI design tasks in Project Alpha.',
    project: 'Project Alpha',
    costCenter: 'CC-001 - Product Design',
    requiredFrom: 'Sep 01, 2026',
    requiredUntil: 'Dec 31, 2026'
  })

  const filteredSoftware = useMemo(() => {
    if (!searchQuery.trim()) return initialSoftwareList
    const q = searchQuery.toLowerCase()
    return initialSoftwareList.filter((item) => item.name.toLowerCase().includes(q))
  }, [searchQuery])

  const selectedSoftware = useMemo(() => {
    return initialSoftwareList.find((item) => item.id === formData.selectedSoftwareId) || initialSoftwareList[0]
  }, [formData.selectedSoftwareId])

  const handleFieldChange = <K extends keyof RequestFormData>(field: K, value: RequestFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    navigate('/employee/create-request')
  }

  const handleBack = () => {
    navigate('/employee/create-request')
  }

  const handleContinue = () => {
    navigate('/employee/create-request/review?type=new-software')
  }

  return (
    <div className='mx-auto max-w-7xl space-y-8'>
      {/* Page Title & Subtitle */}
      <div>
        <h1 className='mb-2 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
          {t('requestNewSoftware.header.title')}
        </h1>
        <p className='text-sm text-neutral-600 md:text-base'>{t('requestNewSoftware.header.subtitle')}</p>
      </div>

      {/* Stepper (Step 1 active) */}
      <RequestStepper currentStep={1} />

      {/* 2-column Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Left: Choose Software */}
        <SoftwareSelectionPanel
          items={filteredSoftware}
          onSearchChange={setSearchQuery}
          onSelect={(id) => handleFieldChange('selectedSoftwareId', id)}
          searchQuery={searchQuery}
          selectedId={formData.selectedSoftwareId}
        />

        {/* Right: Request Details */}
        <RequestDetailsPanel
          formData={formData}
          onChangeField={handleFieldChange}
          selectedSoftware={selectedSoftware}
        />
      </div>

      {/* Bottom Actions Bar */}
      <RequestActionsBar onBack={handleBack} onCancel={handleCancel} onContinue={handleContinue} />
    </div>
  )
}
