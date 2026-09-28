import { useTranslation } from 'react-i18next'

export type SoftwareDetailTabKey = 'overview' | 'usageActivity' | 'licenseCost' | 'relatedRequests'

interface SoftwareDetailTabsProps {
  activeTab: SoftwareDetailTabKey
  onTabChange: (tab: SoftwareDetailTabKey) => void
}

const tabs: { key: SoftwareDetailTabKey; labelKey: string }[] = [
  { key: 'overview', labelKey: 'softwareDetail.tabs.overview' },
  { key: 'usageActivity', labelKey: 'softwareDetail.tabs.usageActivity' },
  { key: 'licenseCost', labelKey: 'softwareDetail.tabs.licenseCost' },
  { key: 'relatedRequests', labelKey: 'softwareDetail.tabs.relatedRequests' }
]

export function SoftwareDetailTabs({ activeTab, onTabChange }: SoftwareDetailTabsProps) {
  const { t } = useTranslation()

  return (
    <div className='flex gap-8 border-b border-neutral-200'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key

        return (
          <button
            className={`pb-3 text-sm transition-colors ${
              isActive
                ? '-mb-px border-b-2 border-brand-500 font-bold text-brand-500'
                : 'border-b-2 border-transparent font-medium text-neutral-500 hover:text-neutral-900'
            }`}
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            type='button'
          >
            {t(tab.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
