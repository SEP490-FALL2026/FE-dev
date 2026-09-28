import { useTranslation } from 'react-i18next'

interface RequestHistoryCardProps {
  managerName: string
  submittedDate: string
  submittedTime: string
}

export function RequestHistoryCard({ managerName, submittedDate, submittedTime }: RequestHistoryCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-6 text-base font-bold text-neutral-900'>{t('requestDetail.history.title')}</h3>

      <div className='relative ml-2 space-y-6 border-l border-neutral-200 pl-3'>
        {/* Event 1 */}
        <div className='relative'>
          <div className='absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-white' />
          <div className='grid grid-cols-1 gap-1 md:grid-cols-[180px_1fr] md:gap-4'>
            <div className='pt-0.5 text-sm text-neutral-500'>{`${submittedDate} at 09:16 AM`}</div>
            <div>
              <h4 className='text-sm font-bold text-neutral-900'>{t('requestDetail.history.event1Title')}</h4>
              <p className='mt-1 text-sm text-neutral-600'>
                {t('requestDetail.history.event1Desc', { name: managerName })}
              </p>
            </div>
          </div>
        </div>

        {/* Event 2 */}
        <div className='relative'>
          <div className='absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-status-active ring-4 ring-white' />
          <div className='grid grid-cols-1 gap-1 md:grid-cols-[180px_1fr] md:gap-4'>
            <div className='pt-0.5 text-sm text-neutral-500'>{`${submittedDate} at ${submittedTime}`}</div>
            <div>
              <h4 className='text-sm font-bold text-neutral-900'>{t('requestDetail.history.event2Title')}</h4>
              <p className='mt-1 text-sm text-neutral-600'>{t('requestDetail.history.event2Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
