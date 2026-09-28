import { ChevronRight, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

interface RequestsHeaderProps {
  onCreateRequest: () => void
}

export function RequestsHeader({ onCreateRequest }: RequestsHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className='space-y-4'>
      {/* Breadcrumbs */}
      <nav
        aria-label={t('myRequests.breadcrumbs.ariaLabel')}
        className='flex items-center gap-2 text-sm text-neutral-500'
      >
        <NavLink className='transition-colors hover:text-neutral-900' to='/employee/dashboard'>
          {t('myRequests.breadcrumbs.home')}
        </NavLink>
        <ChevronRight className='h-3.5 w-3.5 text-neutral-400' />
        <span className='font-medium text-neutral-900'>{t('myRequests.breadcrumbs.current')}</span>
      </nav>

      {/* Title & Action */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-neutral-900'>{t('myRequests.header.title')}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{t('myRequests.header.subtitle')}</p>
        </div>

        <button
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2'
          onClick={onCreateRequest}
          type='button'
        >
          <Plus className='h-4 w-4' />
          {t('myRequests.header.createRequest')}
        </button>
      </div>
    </div>
  )
}
