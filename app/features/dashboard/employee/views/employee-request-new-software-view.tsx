import { ArrowLeft, ArrowRight, Check, Package, Search } from 'lucide-react'
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
  preselectedSoftwareId,
  requestType = 'newSoftware'
}: EmployeeRequestNewSoftwareViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(initialParams.softwareId || preselectedSoftwareId || '')
  const [search, setSearch] = useState('')
  const filteredCatalog = catalogSoftwareList.filter(
    (software) =>
      software.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      software.category.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )
  const otherSoftwareLabel = t('employee.requestNewSoftware.otherSoftware')
  const showOtherSoftware = otherSoftwareLabel.toLocaleLowerCase().includes(search.toLocaleLowerCase())

  const handleConfirm = () => {
    if (!selectedSoftwareId) return
    onSelectTab('request-software-details', {
      ...Object.fromEntries(Object.entries(initialParams).filter(([key]) => key !== 'tab')),
      softwareId: selectedSoftwareId,
      type: requestType
    })
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
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

      <EmployeeRequestStepper currentStep={1} firstStepLabel={t('employee.requestNewSoftware.step1')} fourStep />

      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
        <h2 className='mb-4 text-base font-bold text-foreground'>{t('employee.requestNewSoftware.catalogTitle')}</h2>
        <div className='relative mb-4'>
          <Search
            aria-hidden='true'
            className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          />
          <input
            aria-label={t('employee.requestNewSoftware.searchPlaceholder')}
            className='h-11 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('employee.requestNewSoftware.searchPlaceholder')}
            type='search'
            value={search}
          />
        </div>

        <div className='max-h-[28rem] space-y-2 overflow-y-auto pr-1'>
          {filteredCatalog.map((software) => {
            const isSelected = software.id === selectedSoftwareId
            return (
              <button
                aria-pressed={isSelected}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? 'border-primary bg-primary-soft/50 shadow-xs'
                    : 'border-border bg-surface hover:bg-surface-subtle'
                }`}
                key={software.id}
                onClick={() => setSelectedSoftwareId(software.id)}
                type='button'
              >
                <span className='flex items-center gap-3'>
                  <img
                    alt={software.name}
                    className='size-9 rounded-lg border border-border bg-surface object-contain p-1'
                    src={software.logoUrl}
                  />
                  <span>
                    <span className='block text-xs font-bold text-foreground'>{software.name}</span>
                    <span className='block text-[0.7rem] text-muted-foreground'>{software.cost}</span>
                  </span>
                </span>
                {isSelected && (
                  <span className='grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                    <Check aria-hidden='true' className='size-3.5' />
                  </span>
                )}
              </button>
            )
          })}
          {showOtherSoftware && (
            <button
              aria-pressed={selectedSoftwareId === 'other'}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                selectedSoftwareId === 'other'
                  ? 'border-primary bg-primary-soft/50 shadow-xs'
                  : 'border-border bg-surface hover:bg-surface-subtle'
              }`}
              onClick={() => setSelectedSoftwareId('other')}
              type='button'
            >
              <span className='flex items-center gap-3'>
                <span className='grid size-9 place-items-center rounded-lg border border-border bg-surface'>
                  <Package aria-hidden='true' className='size-5 text-muted-foreground' />
                </span>
                <span className='text-xs font-bold text-foreground'>{otherSoftwareLabel}</span>
              </span>
              {selectedSoftwareId === 'other' && (
                <span className='grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                  <Check aria-hidden='true' className='size-3.5' />
                </span>
              )}
            </button>
          )}
          {filteredCatalog.length === 0 && !showOtherSoftware && (
            <p className='rounded-xl border border-border bg-surface-subtle p-4 text-sm text-muted-foreground'>
              {t('employee.requestNewSoftware.emptyCatalog')}
            </p>
          )}
        </div>

        <div className='mt-5 flex items-center justify-between gap-3 border-t border-border pt-5'>
          <button
            className='min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground'
            onClick={() => onSelectTab('create-request')}
            type='button'
          >
            {t('employee.requestNewSoftware.actCancel')}
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-50'
            disabled={!selectedSoftwareId}
            onClick={handleConfirm}
            type='button'
          >
            <span>{t('employee.requestNewSoftware.actConfirmSoftware')}</span>
            <ArrowRight aria-hidden='true' className='size-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
