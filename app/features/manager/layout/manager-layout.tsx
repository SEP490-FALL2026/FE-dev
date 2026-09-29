import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router'

import { ManagerSidebar } from './components/manager-sidebar'
import { ManagerHeader } from './components/manager-header'

export function ManagerLayout() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const main = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    if (main.current) main.current.scrollTop = 0
  }, [pathname])
  return (
    <div className='fixed inset-0 flex overflow-hidden bg-neutral-100'>
      <div className='hidden lg:block'>
        <ManagerSidebar />
      </div>
      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <ManagerHeader open={open} onToggle={() => setOpen(!open)} />
        {open && (
          <div
            id='manager-mobile-navigation'
            className='max-h-[60dvh] shrink-0 overflow-y-auto border-b border-neutral-200 bg-white lg:hidden'
          >
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='m-4 flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-brand-100'
            >
              <X size={18} aria-hidden='true' />
              {t('manager.closeMenu')}
            </button>
            <ManagerSidebar mobile onNavigate={() => setOpen(false)} />
          </div>
        )}
        <main ref={main} className='min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain'>
          <div className='mx-auto max-w-[1600px] space-y-6 p-4 md:p-8'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
