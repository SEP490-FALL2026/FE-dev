import { ArrowRightLeft, CalendarPlus, ChevronRight, Plus, RotateCcw, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const actions = [
  { labelKey: 'dashboard.quickActions.createRequest', icon: Plus, primary: true },
  { labelKey: 'dashboard.quickActions.changePlan', icon: ArrowRightLeft, primary: false },
  { labelKey: 'dashboard.quickActions.requestRenewal', icon: CalendarPlus, primary: false },
  { labelKey: 'dashboard.quickActions.returnLicense', icon: RotateCcw, primary: false }
] as const

export function QuickActions() {
  const { t } = useTranslation()

  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'>
      <h3 className='mb-4 flex items-center gap-2 font-semibold text-neutral-900'>
        <Zap className='h-4 w-4 text-brand-500' />
        {t('dashboard.quickActions.title')}
      </h3>
      <div className='space-y-2'>
        {actions.map((action) => (
          <button
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
              action.primary
                ? 'bg-brand-500 font-medium text-white shadow-sm hover:bg-brand-600'
                : 'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50'
            }`}
            key={action.labelKey}
            type='button'
          >
            <span className='flex items-center gap-3 text-sm font-medium'>
              <action.icon className={`h-4 w-4 ${action.primary ? '' : 'text-brand-500'}`} />
              {t(action.labelKey)}
            </span>
            <ChevronRight className={`h-3 w-3 ${action.primary ? 'opacity-80' : 'text-neutral-500'}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
