import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

interface SoftwareDetailHeaderProps {
  name: string
  tagline: string
  onRequestChange: () => void
}

export function SoftwareDetailHeader({ name, tagline, onRequestChange }: SoftwareDetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className='space-y-5'>
      {/* Back Link */}
      <div>
        <NavLink
          className='inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition-colors hover:text-brand-500'
          to='/employee/my-software'
        >
          <ArrowLeft className='h-4 w-4' />
          {t('softwareDetail.backLink')}
        </NavLink>
      </div>

      {/* Main Header Banner */}
      <section className='flex flex-col justify-between gap-6 md:flex-row md:items-center'>
        <div className='flex items-start gap-4'>
          {/* Software Stylized Icon */}
          <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black p-2.5 shadow-md shadow-neutral-200'>
            <svg className='h-full w-full' fill='none' viewBox='0 0 38 57'>
              <path
                d='M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z'
                fill='#1ABCFE'
              />
              <path
                d='M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z'
                fill='#0ACF83'
              />
              <path d='M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z' fill='#FF7262' />
              <path d='M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z' fill='#F24E1E' />
              <path d='M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z' fill='#A259FF' />
            </svg>
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold text-neutral-900'>{name}</h1>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-status-active'>
                <span className='h-1.5 w-1.5 rounded-full bg-status-active' />
                {t('softwareDetail.generalInfo.statusActive')}
              </span>
            </div>
            <p className='mt-1 text-sm text-neutral-500'>{tagline}</p>

            {/* Tags */}
            <div className='mt-3 flex flex-wrap gap-2'>
              <span className='rounded-full border border-neutral-200 bg-white px-3 py-0.5 text-xs font-medium text-neutral-600 shadow-2xs'>
                {t('softwareDetail.tags.productivity')}
              </span>
              <span className='rounded-full border border-neutral-200 bg-white px-3 py-0.5 text-xs font-medium text-neutral-600 shadow-2xs'>
                {t('softwareDetail.tags.design')}
              </span>
              <span className='rounded-full border border-neutral-200 bg-white px-3 py-0.5 text-xs font-medium text-neutral-600 shadow-2xs'>
                {t('softwareDetail.tags.saas')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3 self-start md:self-center'>
          <button
            className='rounded-xl border border-brand-500 bg-white px-4 py-2 text-sm font-semibold text-brand-500 shadow-xs transition-colors hover:border-brand-600 hover:bg-brand-50'
            onClick={onRequestChange}
            type='button'
          >
            {t('softwareDetail.actions.requestChange')}
          </button>
          <button
            aria-label={t('softwareDetail.actions.moreOptions')}
            className='rounded-xl border border-neutral-200 bg-white p-2 text-neutral-500 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900'
            type='button'
          >
            <MoreVertical className='h-5 w-5' />
          </button>
        </div>
      </section>
    </div>
  )
}
