import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ExportWorkflowCard() {
  const { t } = useTranslation()

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs'>
      <h3 className='mb-4 flex items-center gap-2 border-b border-neutral-200 pb-3 text-sm font-bold text-neutral-900'>
        <Clock className='h-4 w-4 text-brand-300' />
        <span>{t('dataExport.workflow.title')}</span>
      </h3>

      <ol className='relative ml-3 space-y-5 border-l-2 border-neutral-200 text-xs'>
        {/* Step 1 */}
        <li className='ml-4'>
          <div className='absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-brand-100' />
          <div className='font-bold text-neutral-900'>{t('dataExport.workflow.step1Title')}</div>
          <p className='mt-0.5 text-[11px] text-neutral-500'>{t('dataExport.workflow.step1Desc')}</p>
        </li>

        {/* Step 2 */}
        <li className='ml-4'>
          <div className='absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full bg-neutral-300 ring-4 ring-white' />
          <div className='font-bold text-neutral-600'>{t('dataExport.workflow.step2Title')}</div>
          <p className='mt-0.5 text-[11px] text-neutral-500'>{t('dataExport.workflow.step2Desc')}</p>
        </li>

        {/* Step 3 */}
        <li className='ml-4'>
          <div className='absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full bg-neutral-300 ring-4 ring-white' />
          <div className='font-bold text-neutral-600'>{t('dataExport.workflow.step3Title')}</div>
          <p className='mt-0.5 text-[11px] text-neutral-500'>{t('dataExport.workflow.step3Desc')}</p>
        </li>
      </ol>
    </div>
  )
}
