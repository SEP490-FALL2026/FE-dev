import { useTranslation } from 'react-i18next'

export function RequestProgress() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <nav
      aria-label={t('createEmployee.progress')}
      className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'
    >
      <ol className='grid grid-cols-5 gap-2'>
        {(['employee', 'software', 'details', 'review', 'submit'] as const).map((step, index) => (
          <li key={step} aria-current={index === 0 ? 'step' : undefined} className='relative text-center'>
            {index < 4 && <span aria-hidden='true' className='absolute top-4 left-1/2 h-0.5 w-full bg-neutral-200' />}
            <span
              aria-hidden='true'
              className={`relative mx-auto flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium ${index === 0 ? 'border-brand-500 bg-brand-500 text-white' : 'border-neutral-200 bg-white text-neutral-500'}`}
            >
              {number.format(index + 1)}
            </span>
            <p
              className={`mt-3 text-[10px] font-semibold sm:text-sm ${index === 0 ? 'text-brand-600' : 'text-neutral-500'}`}
            >
              {t(`createEmployee.steps.${step}`)}
            </p>
            <p className='mt-1 hidden text-xs text-neutral-500 lg:block'>{t(`createEmployee.steps.${step}Hint`)}</p>
          </li>
        ))}
      </ol>
    </nav>
  )
}
