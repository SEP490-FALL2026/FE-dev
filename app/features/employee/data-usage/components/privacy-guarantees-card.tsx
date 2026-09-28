import { ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function PrivacyGuaranteesCard() {
  const { t } = useTranslation()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const items = [
    {
      id: 'item1',
      bold: t('dataUsage.guarantees.item1Bold'),
      text: t('dataUsage.guarantees.item1Text')
    },
    {
      id: 'item2',
      bold: t('dataUsage.guarantees.item2Bold'),
      text: t('dataUsage.guarantees.item2Text')
    },
    {
      id: 'item3',
      bold: t('dataUsage.guarantees.item3Bold'),
      text: t('dataUsage.guarantees.item3Text')
    }
  ]

  return (
    <div className='rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-3 flex items-center gap-2 text-base font-bold text-neutral-900'>
        <ShieldCheck className='h-5 w-5 text-emerald-500' />
        {t('dataUsage.guarantees.title')}
      </h3>

      <ul className='space-y-2.5 text-xs text-neutral-600'>
        {items.map((item) => (
          <li className='flex items-start gap-2' key={item.id}>
            <X className='mt-0.5 h-4 w-4 shrink-0 text-red-500' />
            <span>
              <strong className='font-bold text-neutral-900'>{item.bold}</strong> {item.text}
            </span>
          </li>
        ))}
      </ul>

      <div className='mt-5 border-t border-neutral-200 pt-4'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold text-neutral-900'>{t('dataUsage.guarantees.toggleLabel')}</span>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              aria-label={t('dataUsage.guarantees.toggleAriaLabel')}
              checked={notificationsEnabled}
              className='peer sr-only'
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              type='checkbox'
            />
            <div className="h-5 w-10 rounded-full bg-neutral-200 peer peer-checked:bg-emerald-500 peer-focus:outline-hidden after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-neutral-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
          </label>
        </div>
        <p className='mt-1 text-[11px] text-neutral-500'>{t('dataUsage.guarantees.toggleSubtitle')}</p>
      </div>
    </div>
  )
}
