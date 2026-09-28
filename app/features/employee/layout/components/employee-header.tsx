import { Bell, ChevronDown, CircleHelp, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitch } from '~/shared/ui/language-switch'

// Temporary mock user profile (auth will supply this in future iteration)
const mockCurrentUser = {
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  name: 'Alex Morgan'
}

export function EmployeeHeader() {
  const { t } = useTranslation()

  return (
    <header className='flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-8'>
      {/* Search */}
      <div className='flex w-96 items-center'>
        <div className='relative w-full'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500' />
          <input
            className='w-full rounded-md border border-neutral-200 bg-neutral-100 py-1.5 pr-4 pl-9 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-500 focus:bg-white focus:outline-none'
            placeholder={t('layout.header.searchPlaceholder')}
            type='text'
          />
        </div>
      </div>

      {/* Right controls */}
      <div className='flex items-center gap-4'>
        <LanguageSwitch />

        <button
          aria-label={t('layout.header.help')}
          className='relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100'
          type='button'
        >
          <CircleHelp className='h-5 w-5' />
        </button>

        <button
          aria-label={t('layout.header.notifications')}
          className='relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100'
          type='button'
        >
          <Bell className='h-5 w-5' />
          <span className='absolute top-1.5 right-1.5 flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-brand-500' />
          </span>
        </button>

        <div className='h-6 w-px bg-neutral-200' />

        {/* User profile */}
        <div className='flex cursor-pointer items-center gap-3'>
          <div className='relative'>
            <img
              alt={t('layout.header.avatarAlt')}
              className='h-9 w-9 rounded-full object-cover ring-2 ring-brand-100'
              src={mockCurrentUser.avatarUrl}
            />
            <div className='absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-status-active' />
          </div>
          <div className='hidden text-left sm:block'>
            <div className='text-sm font-semibold leading-none text-neutral-900'>{mockCurrentUser.name}</div>
            <div className='mt-1 text-xs text-neutral-500'>{t('layout.header.userRole')}</div>
          </div>
          <ChevronDown className='h-4 w-4 text-neutral-500' />
        </div>
      </div>
    </header>
  )
}
