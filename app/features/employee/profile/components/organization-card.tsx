import { Building2, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { OrganizationData } from '../profile.types'

interface OrganizationCardProps {
  data: OrganizationData
}

export function OrganizationCard({ data }: OrganizationCardProps) {
  const { t } = useTranslation()

  const fields = [
    { label: t('profile.organization.fields.company'), value: data.company },
    { label: t('profile.organization.fields.team'), value: data.team },
    { label: t('profile.organization.fields.department'), value: data.department },
    { label: t('profile.organization.fields.costCenter'), value: data.costCenter }
  ]

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs' id='organization'>
      {/* Card Header */}
      <div className='flex items-center justify-between border-b border-neutral-200 pb-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
            <Building2 className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-base font-bold text-neutral-900'>{t('profile.organization.title')}</h3>
            <p className='text-xs text-neutral-500'>{t('profile.organization.subtitle')}</p>
          </div>
        </div>

        <button
          className='inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-2xs transition-colors hover:border-brand-300 hover:text-brand-500'
          type='button'
        >
          <Pencil className='h-3.5 w-3.5 text-neutral-500' />
          {t('profile.organization.editAction')}
        </button>
      </div>

      {/* Details Key-Value 2-Column Grid */}
      <div className='mt-5 grid grid-cols-1 gap-x-8 gap-y-5 text-xs sm:grid-cols-2'>
        {fields.map((field) => (
          <div key={field.label}>
            <span className='block text-neutral-500'>{field.label}</span>
            <span className='mt-1 block text-sm font-semibold text-neutral-900'>{field.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
