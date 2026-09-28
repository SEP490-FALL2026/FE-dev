import { ChevronDown, RotateCcw, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface RequestsFiltersProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  statusFilter: string
  onStatusFilterChange: (val: string) => void
  typeFilter: string
  onTypeFilterChange: (val: string) => void
  onClearFilters: () => void
}

export function RequestsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters
}: RequestsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs lg:flex-row lg:items-end'>
      {/* Search Input */}
      <div className='relative flex-1'>
        <Search className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        <input
          className='w-full rounded-lg border border-neutral-200 bg-white py-2 pr-4 pl-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('myRequests.filters.searchPlaceholder')}
          type='text'
          value={searchQuery}
        />
      </div>

      {/* Status Filter */}
      <div className='w-full lg:w-48'>
        <label className='mb-1 block text-xs font-medium text-neutral-500'>{t('myRequests.filters.statusLabel')}</label>
        <div className='relative'>
          <select
            className='w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-9 pl-3 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
            onChange={(e) => onStatusFilterChange(e.target.value)}
            value={statusFilter}
          >
            <option value='all'>{t('myRequests.filters.statusAll')}</option>
            <option value='pending'>{t('myRequests.filters.statusPending')}</option>
            <option value='approved'>{t('myRequests.filters.statusApproved')}</option>
            <option value='completed'>{t('myRequests.filters.statusCompleted')}</option>
            <option value='rejected'>{t('myRequests.filters.statusRejected')}</option>
            <option value='cancelled'>{t('myRequests.filters.statusCancelled')}</option>
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        </div>
      </div>

      {/* Type Filter */}
      <div className='w-full lg:w-48'>
        <label className='mb-1 block text-xs font-medium text-neutral-500'>{t('myRequests.filters.typeLabel')}</label>
        <div className='relative'>
          <select
            className='w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-9 pl-3 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
            onChange={(e) => onTypeFilterChange(e.target.value)}
            value={typeFilter}
          >
            <option value='all'>{t('myRequests.filters.typeAll')}</option>
            <option value='newSoftware'>{t('myRequests.filters.typeNew')}</option>
            <option value='changePlan'>{t('myRequests.filters.typeChangePlan')}</option>
            <option value='renewal'>{t('myRequests.filters.typeRenewal')}</option>
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className='w-full lg:w-auto'>
        <button
          className='flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900'
          onClick={onClearFilters}
          type='button'
        >
          <RotateCcw className='h-4 w-4 text-neutral-400' />
          {t('myRequests.filters.clearFilters')}
        </button>
      </div>
    </div>
  )
}
