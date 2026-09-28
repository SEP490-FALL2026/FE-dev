import { ArrowUpDown, ChevronDown, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareSortType } from '../my-software.types'

interface SoftwareFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  sortBy: SoftwareSortType
  onSortByChange: (sort: SoftwareSortType) => void
}

export function SoftwareFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange
}: SoftwareFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-3 md:flex-row'>
      {/* Search Input */}
      <div className='relative flex-1'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        <input
          className='w-full rounded-lg border border-neutral-200 bg-white py-2 pr-4 pl-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('mySoftware.filters.searchPlaceholder')}
          type='text'
          value={searchQuery}
        />
      </div>

      {/* Select Controls */}
      <div className='flex flex-wrap gap-3'>
        {/* Status Filter */}
        <div className='relative min-w-[140px]'>
          <select
            className='w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-10 pl-4 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
            onChange={(e) => onStatusFilterChange(e.target.value)}
            value={statusFilter}
          >
            <option value='all'>{t('mySoftware.filters.statusAll')}</option>
            <option value='active'>{t('mySoftware.filters.statusActive')}</option>
            <option value='expiringSoon'>{t('mySoftware.filters.statusExpiring')}</option>
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        </div>

        {/* Sort Filter */}
        <div className='relative min-w-[200px]'>
          <ArrowUpDown className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
          <select
            className='w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-10 pl-9 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
            onChange={(e) => onSortByChange(e.target.value as SoftwareSortType)}
            value={sortBy}
          >
            <option value='assignedDate'>{t('mySoftware.filters.sortAssignedDate')}</option>
            <option value='name'>{t('mySoftware.filters.sortName')}</option>
            <option value='expiration'>{t('mySoftware.filters.sortExpiration')}</option>
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        </div>
      </div>
    </div>
  )
}
