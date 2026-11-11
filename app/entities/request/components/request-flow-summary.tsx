import { useTranslation } from 'react-i18next'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function RequestFlowSummary({ request }: { request: AccessRequestResponseDtoDataRequest }) {
  const { t } = useTranslation('requestFlow')
  const { formatDate } = useWorkspaceFormat()
  return (
    <section className='space-y-3 border-t border-border/60 pt-4'>
      <dl className='grid gap-4 text-sm sm:grid-cols-2'>
        <div>
          <dt className='text-xs text-muted-foreground'>{t('endDate')}</dt>
          <dd className='font-mono tabular-nums'>
            {request.expectedEndDate ? formatDate(request.expectedEndDate) : t('indefinite')}
          </dd>
        </div>
        {request.spend && (
          <div>
            <dt className='text-xs text-muted-foreground'>{t('stage')}</dt>
            <dd>{t(request.spend.stage, { defaultValue: t('unknown') })}</dd>
          </div>
        )}
      </dl>
      {request.spend?.blockedReasons.map((reason) => (
        <p key={reason} className='text-sm text-warning'>
          {t(reason, { defaultValue: t('unknown') })}
        </p>
      ))}
      {request.spend?.refusalReason && (
        <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.spend.refusalReason}</p>
      )}
      {request.flags.manyPaidSoftware && (
        <div className='text-sm'>
          <p className='font-medium'>{t('manyReason')}</p>
          <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.flags.manyPaidSoftware.reason}</p>
        </div>
      )}
    </section>
  )
}
