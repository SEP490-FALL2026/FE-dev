import { ArrowRight, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TipsBanner() {
  const { t } = useTranslation()

  return (
    <section className='flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-5'>
      <div className='mt-0.5 shrink-0 text-brand-500'>
        <Lightbulb className='h-5 w-5' />
      </div>
      <div>
        <h4 className='mb-1 text-sm font-semibold text-neutral-900'>{t('dashboard.tips.title')}</h4>
        <p className='mb-2 text-xs leading-relaxed text-neutral-500'>{t('dashboard.tips.message')}</p>
        <a className='flex items-center gap-1 text-xs font-medium text-brand-500 hover:underline' href='#'>
          {t('dashboard.tips.learnMore')} <ArrowRight className='h-3 w-3' />
        </a>
      </div>
    </section>
  )
}
