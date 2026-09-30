import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { catalogSoftwareList } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeRequestNewSoftwareViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  preselectedSoftwareId?: string
}

export function EmployeeRequestNewSoftwareView({
  onSelectTab,
  preselectedSoftwareId = 'figma'
}: EmployeeRequestNewSoftwareViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(preselectedSoftwareId)
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('Professional / Enterprise')
  const [reason, setReason] = useState('Cần công cụ để thực hiện dự án mới và cộng tác trong team.')
  const [project, setProject] = useState('Dự án Alpha Portal (Q4/2026)')

  const filteredCatalog = catalogSoftwareList.filter(
    (sw) =>
      sw.name.toLowerCase().includes(search.toLowerCase()) || sw.category.toLowerCase().includes(search.toLowerCase())
  )

  const selectedSoftware = catalogSoftwareList.find((sw) => sw.id === selectedSoftwareId) || catalogSoftwareList[0]

  const handleContinue = () => {
    onSelectTab('review-request', {
      plan,
      project,
      reason,
      softwareId: selectedSoftware.id,
      softwareName: selectedSoftware.name,
      type: 'newSoftware'
    })
  }

  return (
    <div className='space-y-6'>
      {/* Back button & Heading */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.requestNewSoftware.backToSelection')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.requestNewSoftware.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.requestNewSoftware.subtitle')}</p>
      </div>

      {/* Stepper Indicator */}
      <div className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center gap-3'>
          <span className='grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {1}
          </span>
          <span className='text-xs font-bold text-foreground'>{t('employee.requestNewSoftware.step1')}</span>
        </div>
        <div className='h-0.5 w-16 bg-border' />
        <div className='flex items-center gap-3 opacity-50'>
          <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground'>
            {2}
          </span>
          <span className='text-xs font-medium text-muted-foreground'>{t('employee.requestNewSoftware.step2')}</span>
        </div>
        <div className='h-0.5 w-16 bg-border' />
        <div className='flex items-center gap-3 opacity-50'>
          <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground'>
            {3}
          </span>
          <span className='text-xs font-medium text-muted-foreground'>{t('employee.requestNewSoftware.step3')}</span>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left: Software Selector */}
        <div className='space-y-4 lg:col-span-6'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='mb-3 flex items-center justify-between'>
              <h2 className='text-sm font-bold text-foreground'>{t('employee.requestNewSoftware.catalogTitle')}</h2>
            </div>

            <div className='relative mb-4'>
              <Search
                aria-hidden='true'
                className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
              />
              <input
                aria-label={t('employee.requestNewSoftware.searchPlaceholder')}
                className='h-9 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('employee.requestNewSoftware.searchPlaceholder')}
                type='search'
                value={search}
              />
            </div>

            <div className='space-y-2 max-h-96 overflow-y-auto pr-1'>
              {filteredCatalog.map((sw) => {
                const isSelected = sw.id === selectedSoftwareId
                return (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-primary bg-primary-soft/50 shadow-xs'
                        : 'border-border bg-surface hover:bg-surface-subtle'
                    }`}
                    key={sw.id}
                    onClick={() => setSelectedSoftwareId(sw.id)}
                    type='button'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        alt={sw.name}
                        className='size-9 rounded-lg border border-border bg-surface object-contain p-1'
                        src={sw.logoUrl}
                      />
                      <div>
                        <p className='text-xs font-bold text-foreground'>{sw.name}</p>
                        <p className='text-[0.7rem] text-muted-foreground'>{sw.cost}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className='grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                        <Check aria-hidden='true' className='size-3.5' />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Request Form Details */}
        <div className='space-y-4 lg:col-span-6'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.requestNewSoftware.detailsTitle')}</h2>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-1.5'>
                {t('employee.requestNewSoftware.fieldSoftware')}
              </label>
              <div className='flex items-center gap-3 rounded-xl border border-border bg-surface-subtle/50 p-3'>
                <img
                  alt={selectedSoftware.name}
                  className='size-8 rounded-lg border border-border bg-surface object-contain p-1'
                  src={selectedSoftware.logoUrl}
                />
                <div>
                  <p className='text-xs font-bold text-foreground'>{selectedSoftware.name}</p>
                  <p className='text-[0.7rem] text-muted-foreground'>{selectedSoftware.category}</p>
                </div>
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-1.5'>
                {t('employee.requestNewSoftware.fieldPlan')}
              </label>
              <input
                className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setPlan(e.target.value)}
                value={plan}
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-1.5'>
                {t('employee.requestNewSoftware.fieldProject')}
              </label>
              <input
                className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setProject(e.target.value)}
                value={project}
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-1.5'>
                {t('employee.requestNewSoftware.fieldReason')}
              </label>
              <textarea
                className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                value={reason}
              />
            </div>

            <div className='flex items-center justify-between pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => onSelectTab('create-request')}
                type='button'
              >
                {t('employee.requestNewSoftware.actCancel')}
              </button>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleContinue}
                type='button'
              >
                <span>{t('employee.requestNewSoftware.actContinue')}</span>
                <ArrowRight aria-hidden='true' className='size-3.5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
