import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { catalogSoftwareList } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'
import { EmployeeRequestStepper } from '../employee-request-stepper'

interface EmployeeRequestNewSoftwareViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  initialParams?: Record<string, string>
  preselectedSoftwareId?: string
  requestType?: 'newSoftware' | 'changePlan'
}

export function EmployeeRequestNewSoftwareView({
  onSelectTab,
  initialParams = {},
  preselectedSoftwareId = 'figma',
  requestType = 'newSoftware'
}: EmployeeRequestNewSoftwareViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(initialParams.softwareId || preselectedSoftwareId)
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState(initialParams.plan || '')
  const [reason, setReason] = useState(initialParams.reason || '')
  const [project, setProject] = useState(initialParams.project || '')

  const filteredCatalog = catalogSoftwareList.filter(
    (sw) =>
      sw.name.toLowerCase().includes(search.toLowerCase()) || sw.category.toLowerCase().includes(search.toLowerCase())
  )

  const selectedSoftware = catalogSoftwareList.find((sw) => sw.id === selectedSoftwareId) || catalogSoftwareList[0]
  const canContinue = plan.trim().length > 0 && project.trim().length > 0 && reason.trim().length > 0

  const handleContinue = () => {
    if (!canContinue) return
    onSelectTab('review-request', {
      plan,
      project,
      reason,
      softwareId: selectedSoftware.id,
      softwareName: selectedSoftware.name,
      type: requestType
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
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>
          {t(
            requestType === 'changePlan'
              ? 'employee.createRequest.changePlanTitle'
              : 'employee.requestNewSoftware.title'
          )}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.requestNewSoftware.subtitle')}</p>
      </div>

      <EmployeeRequestStepper currentStep={1} firstStepLabel={t('employee.requestNewSoftware.step1')} />

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
                className='h-11 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
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
                    aria-pressed={isSelected}
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
              {filteredCatalog.length === 0 && (
                <p className='rounded-xl border border-border bg-surface-subtle p-4 text-sm text-muted-foreground'>
                  {t('employee.requestNewSoftware.emptyCatalog')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Request Form Details */}
        <div className='space-y-4 lg:col-span-6'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.requestNewSoftware.detailsTitle')}</h2>

            <div>
              <p className='mb-1.5 text-sm font-semibold text-muted-foreground'>
                {t('employee.requestNewSoftware.fieldSoftware')}
              </p>
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
              <label className='mb-1.5 block text-sm font-semibold text-foreground' htmlFor='employee-request-plan'>
                {t('employee.requestNewSoftware.fieldPlan')}
              </label>
              <input
                className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
                id='employee-request-plan'
                onChange={(e) => setPlan(e.target.value)}
                value={plan}
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground' htmlFor='employee-request-project'>
                {t('employee.requestNewSoftware.fieldProject')}
              </label>
              <input
                className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
                id='employee-request-project'
                onChange={(e) => setProject(e.target.value)}
                value={project}
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground' htmlFor='employee-request-reason'>
                {t('employee.requestNewSoftware.fieldReason')}
              </label>
              <textarea
                className='w-full rounded-xl border border-border bg-background p-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
                id='employee-request-reason'
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('employee.requestNewSoftware.fieldReasonPlaceholder')}
                rows={3}
                value={reason}
              />
            </div>

            {!canContinue && (
              <p className='text-sm text-danger-ink' role='status'>
                {t('employee.requestNewSoftware.completeFields')}
              </p>
            )}

            <div className='flex items-center justify-between pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => onSelectTab('create-request')}
                type='button'
              >
                {t('employee.requestNewSoftware.actCancel')}
              </button>
              <button
                className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-50'
                disabled={!canContinue}
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
