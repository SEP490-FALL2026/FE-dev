import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { figmaDetail } from '../ghost-seat-detail-demo'

export function SeatEvidence({
  detailed,
  full = false,
  onView
}: {
  detailed: boolean
  full?: boolean
  onView?: () => void
}) {
  const { t } = useTranslation()
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-4 flex items-center gap-2 text-sm font-bold'>
        <FileText size={17} aria-hidden='true' className='text-brand-600' />
        {t('ghostDetail.evidenceTitle')}
      </h2>
      {detailed ? (
        <>
          <dl className='space-y-3 text-xs'>
            <div className='flex flex-wrap justify-between gap-2 border-b border-neutral-200 pb-3'>
              <dt className='text-neutral-500'>{t('ghostDetail.usageData')}</dt>
              <dd className='font-semibold text-success'>
                {t('ghostDetail.available')}
                <span className='ml-2 font-normal text-neutral-500'>
                  {t('ghostSeat.days', { count: figmaDetail.coverage })}
                </span>
              </dd>
            </div>
            <div className='border-b border-neutral-200 pb-3'>
              <dt className='text-neutral-500'>{t('ghostDetail.facts.source')}</dt>
              <dd className='mt-1 font-medium'>{t('ghostDetail.integration', { source: figmaDetail.source })}</dd>
            </div>
            <div className='border-b border-neutral-200 pb-3'>
              <dt className='text-neutral-500'>{t('ghostDetail.collected')}</dt>
              <dd>
                <ul className='mt-2 list-inside list-disc space-y-1 text-neutral-500'>
                  {(['activity', 'summary', 'events'] as const).map((key) => (
                    <li key={key}>{t(`ghostDetail.data.${key}`)}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className='flex flex-wrap justify-between gap-2 border-b border-neutral-200 pb-3'>
              <dt className='text-neutral-500'>{t('ghostDetail.facts.coverage')}</dt>
              <dd className='font-medium'>{t('ghostSeat.days', { count: figmaDetail.coverage })}</dd>
            </div>
            <div className='flex flex-wrap justify-between gap-2'>
              <dt className='text-neutral-500'>{t('ghostDetail.facts.definition')}</dt>
              <dd className='font-medium'>{t('ghostDetail.meaningful')}</dd>
            </div>
          </dl>
          {full && (
            <p className='mt-5 rounded-lg bg-brand-bg p-3 text-xs leading-relaxed text-neutral-500'>
              {t('ghostDetail.noRawEvidence')}
            </p>
          )}
        </>
      ) : (
        <p className='text-xs leading-relaxed text-neutral-500'>{t('ghostDetail.noEvidence')}</p>
      )}
      {onView && (
        <button
          type='button'
          onClick={onView}
          className='mt-5 w-full rounded-lg bg-brand-100 px-3 py-2.5 text-xs font-semibold text-brand-600 hover:bg-brand-200'
        >
          {t('ghostDetail.fullEvidence')}
        </button>
      )}
    </section>
  )
}
