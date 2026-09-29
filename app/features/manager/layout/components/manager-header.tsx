import { Bell, ChevronDown, ChevronRight, Menu, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Form, Link, useLocation, useParams, useSearchParams } from 'react-router'

import { LanguageSwitch } from '~/shared/ui/language-switch'

const sampleManager = { name: 'Nguyễn Minh An', initials: 'NA' }

export function ManagerHeader({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { t, i18n } = useTranslation()
  const { pathname, search } = useLocation()
  const isTeam = pathname === '/manager/my-team'
  const isSoftware = pathname === '/manager/team-software'
  const isGhostReview = pathname === '/manager/ghost-seat-review'
  const isCreateRequest = pathname === '/manager/create-request'
  const isAccessReview = pathname === '/manager/access-review'
  const isAssignmentDetail = pathname.startsWith('/manager/access-review/')
  const isGhostDetail = pathname.startsWith('/manager/ghost-seat-review/')
  const ghostBackParams = new URLSearchParams(search)
  ghostBackParams.delete('panel')
  ghostBackParams.delete('id')
  const isDetail = pathname.startsWith('/manager/my-team/')
  const isRequests = pathname === '/manager/team-requests'
  const isApprovalDetail = pathname.startsWith('/manager/team-requests/')
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  return (
    <header className='z-20 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 md:px-8'>
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <button
          type='button'
          onClick={onToggle}
          aria-label={t(open ? 'manager.closeMenu' : 'manager.openMenu')}
          aria-expanded={open}
          aria-controls='manager-mobile-navigation'
          className='rounded-lg p-2 hover:bg-brand-100 lg:hidden'
        >
          <Menu size={20} aria-hidden='true' />
        </button>
        {isAssignmentDetail ? (
          <nav
            aria-label={t('managerTeam.breadcrumb')}
            className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-neutral-500'
          >
            <Link to={`/manager/access-review${search}`} className='hover:text-brand-600'>
              {t('accessReview.title')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <span aria-current='page' className='font-medium text-neutral-900'>
              {t('assignmentDetail.title')}
            </span>
          </nav>
        ) : isGhostDetail ? (
          <nav
            aria-label={t('managerTeam.breadcrumb')}
            className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-neutral-500'
          >
            <Link
              to={`/manager/ghost-seat-review${ghostBackParams.size ? `?${ghostBackParams}` : ''}`}
              className='hover:text-brand-600'
            >
              {t('ghostSeat.title')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <span aria-current='page' className='font-medium text-neutral-900'>
              {t('ghostDetail.title')}
            </span>
          </nav>
        ) : isApprovalDetail ? (
          <nav
            aria-label={t('managerTeam.breadcrumb')}
            className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-neutral-500'
          >
            <Link to={`/manager/team-requests${search}`} className='hover:text-brand-600'>
              {t('manager.requests')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <Link to={`/manager/team-requests${search}`} className='hover:text-brand-600'>
              {t('teamRequests.title')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <span aria-current='page' className='font-medium text-neutral-900'>
              {id}
            </span>
          </nav>
        ) : isRequests ? (
          <div className='relative w-full max-w-xl'>
            <Search
              size={16}
              aria-hidden='true'
              className='pointer-events-none absolute top-2.5 left-3 text-neutral-500'
            />
            <input
              type='search'
              value={params.get('search') ?? ''}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                if (event.target.value) next.set('search', event.target.value)
                else next.delete('search')
                next.delete('page')
                setParams(next, { replace: true })
              }}
              aria-label={t('teamRequests.headerSearch')}
              placeholder={t('teamRequests.headerSearch')}
              className='w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-sm outline-brand-500'
            />
          </div>
        ) : isDetail ? (
          <Form method='get' action='/manager/my-team' className='relative w-full max-w-xl'>
            <Search
              size={16}
              aria-hidden='true'
              className='pointer-events-none absolute top-2.5 left-3 text-neutral-500'
            />
            <input
              type='search'
              name='search'
              aria-label={t('managerTeam.search')}
              placeholder={t('managerTeam.searchPlaceholder')}
              className='w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-sm outline-brand-500'
            />
          </Form>
        ) : (
          <nav aria-label={t('managerTeam.breadcrumb')} className='flex items-center gap-2 text-sm text-neutral-500'>
            {isTeam || isSoftware || isGhostReview || isCreateRequest || isAccessReview ? (
              <>
                <Link to='/manager/dashboard' className='hover:text-brand-600'>
                  {t('manager.dashboard')}
                </Link>
                <ChevronRight size={12} className='text-brand-200' aria-hidden='true' />
                <span aria-current='page' className='font-medium text-neutral-900'>
                  {t(
                    isAccessReview
                      ? 'accessReview.title'
                      : isCreateRequest
                        ? 'createEmployee.title'
                        : isGhostReview
                          ? 'ghostSeat.title'
                          : isSoftware
                            ? 'teamSoftware.title'
                            : 'manager.team'
                  )}
                </span>
              </>
            ) : (
              <span aria-current='page' className='font-medium text-neutral-900'>
                {t('manager.dashboard')}
              </span>
            )}
          </nav>
        )}
      </div>
      <div className='flex items-center gap-3 sm:gap-6'>
        {isRequests && (
          <span className='hidden rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-500 xl:block'>
            {t('teamRequests.team', { name: 'Product Team' })}
          </span>
        )}
        <LanguageSwitch />
        <button
          type='button'
          disabled
          title={t('manager.unavailable')}
          aria-label={t('manager.notifications')}
          className='relative p-1 text-neutral-500 disabled:cursor-not-allowed'
        >
          <Bell size={21} aria-hidden='true' />
          <span className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-danger text-[9px] font-bold text-white'>
            {new Intl.NumberFormat(i18n.resolvedLanguage).format(6)}
          </span>
        </button>
        <div className='flex items-center gap-3'>
          <span
            aria-hidden='true'
            className='flex size-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600'
          >
            {sampleManager.initials}
          </span>
          <div className='hidden text-sm sm:block'>
            <p className='font-medium'>{sampleManager.name}</p>
            <p className='text-xs text-neutral-500'>{t('managerTeam.role')}</p>
          </div>
          <ChevronDown size={12} aria-hidden='true' className='text-neutral-500' />
        </div>
      </div>
    </header>
  )
}
