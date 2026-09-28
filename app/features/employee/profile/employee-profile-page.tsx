import { useTranslation } from 'react-i18next'

import { DataPrivacyCard } from './components/data-privacy-card'
import { OrganizationCard } from './components/organization-card'
import { PersonalInfoCard } from './components/personal-info-card'
import type { OrganizationData, PersonalInfoData } from './profile.types'

const defaultPersonalInfo: PersonalInfoData = {
  fullName: 'Nguyen Van Tuan',
  employeeId: 'EMP00123',
  email: 'nguyen.tuan@company.com',
  position: 'Frontend Developer',
  phone: '+84 912 345 678',
  department: 'Product & Technology',
  joinDate: 'Jan 15, 2024'
}

const defaultOrganization: OrganizationData = {
  company: 'Acme Corporation',
  team: 'Frontend',
  department: 'Product & Technology',
  costCenter: 'CC-0012'
}

export function EmployeeProfilePage() {
  const { t } = useTranslation()

  return (
    <div className='mx-auto max-w-6xl space-y-6 pb-12'>
      {/* Page Title & Header Description */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>{t('profile.header.title')}</h1>
        <p className='mt-1 text-sm text-neutral-600 sm:text-base'>{t('profile.header.subtitle')}</p>
      </div>

      {/* Main Sections Stack */}
      <div className='space-y-6'>
        <PersonalInfoCard data={defaultPersonalInfo} />
        <OrganizationCard data={defaultOrganization} />
        <DataPrivacyCard />
      </div>
    </div>
  )
}
