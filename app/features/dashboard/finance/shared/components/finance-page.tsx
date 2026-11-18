import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { financeAreaOf, isValidFinanceTab } from '../../finance-nav'

/** Icon and menu-area eyebrow of the screen being shown, read from the `tab` URL parameter. */
function useScreenIdentity() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab = isValidFinanceTab(tabParam) ? tabParam : 'overview'
  const area = financeAreaOf(tab)
  const menuTab = area.tabs.find((item) => item.key === tab) ?? area.tabs[0]
  return { area: area.key, icon: menuTab?.icon ?? area.icon }
}

export function FinancePage({
  title,
  description,
  children,
  actions,
  hero = false,
  icon,
  eyebrow
}: {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  /** Overview screens render the header as the brand band shared with the other roles' overviews. */
  hero?: boolean
  /** Defaults to the menu icon of the current tab. */
  icon?: LucideIcon
  /** Defaults to the menu area of the current tab. */
  eyebrow?: string
}) {
  const { t: translate } = useTranslation('finance')
  const identity = useScreenIdentity()
  const Icon = icon ?? identity.icon
  const wrapper =
    'space-y-6 [&_button:enabled]:cursor-pointer [&_select:enabled]:cursor-pointer [&_summary]:cursor-pointer'
  if (hero)
    return (
      <div className={wrapper}>
        <header className='workspace-overview-hero workspace-hero-header flex flex-wrap items-end justify-between gap-4 rounded-xl px-5 py-6 sm:px-7 sm:py-7'>
          <div className='min-w-0 space-y-1'>
            <h1 className='text-2xl leading-tight font-semibold tracking-tight [text-wrap:balance]'>{title}</h1>
            {description && (
              <p className='max-w-2xl text-sm leading-relaxed opacity-80 [text-wrap:pretty]'>{description}</p>
            )}
          </div>
          {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
        </header>
        {children}
      </div>
    )
  return (
    <div className={wrapper}>
      <header className='page-banner flex flex-wrap items-center justify-between gap-4'>
        <div className='flex min-w-0 flex-1 items-start gap-3.5'>
          <span className='kpi-chip grid size-11 shrink-0 place-items-center rounded-xl'>
            <Icon aria-hidden className='size-5' strokeWidth={1.5} />
          </span>
          <div className='min-w-0 space-y-1'>
            <p className='text-[11px] font-semibold tracking-wider text-primary-ink uppercase'>
              {eyebrow ?? translate(`areas.${identity.area}`)}
            </p>
            <h1 className='text-2xl leading-tight font-semibold tracking-tight text-foreground [text-wrap:balance]'>
              {title}
            </h1>
            {description && (
              <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className='relative flex flex-wrap items-center gap-2'>{actions}</div>}
      </header>
      {children}
    </div>
  )
}
