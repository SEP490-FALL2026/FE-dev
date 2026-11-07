import { useTranslation } from 'react-i18next'
import type { MonitoringNoticeResponseDtoData } from '~/shared/api/generated/model/monitoring-notices/monitoringNoticeResponseDtoData'

export function MonitoringNoticeContent({ notice }: { notice: NonNullable<MonitoringNoticeResponseDtoData> }) {
  const { t: translate } = useTranslation('devicePrivacy')
  return (
    <div className='space-y-4'>
      <p className='text-right font-mono text-sm tabular-nums'>
        {translate('version', { version: notice.versionNumber })}
      </p>
      <dl className='grid gap-5 sm:grid-cols-2'>
        {(['collected', 'notCollected', 'purpose', 'retention', 'stopRight'] as const).map((field) => (
          <div key={field}>
            <dt className='text-sm font-medium'>{translate(field)}</dt>
            <dd className='mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground'>
              {notice[field]}
            </dd>
          </div>
        ))}
      </dl>
      <p className='text-sm'>
        {translate('includesToolStatus')}: {translate(notice.includesToolStatus ? 'yes' : 'no')}
      </p>
    </div>
  )
}
