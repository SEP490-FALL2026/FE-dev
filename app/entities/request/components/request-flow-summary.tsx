import { useTranslation } from 'react-i18next'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import { REQUEST_LIMIT_EXEMPTION } from '../enums/request-limit-exemption'
import { REQUEST_WAITING_REASON } from '../enums/request-waiting-reason'

export function RequestFlowSummary({ request }: { request: AccessRequestResponseDtoDataRequest }) {
  const { t } = useTranslation('requestFlow')
  const hasContent =
    !!request.spend ||
    request.needStep.waitingReason === REQUEST_WAITING_REASON.NO_DEPARTMENT_HEAD ||
    request.limitExemption === REQUEST_LIMIT_EXEMPTION.TRANSFER_GRACE ||
    !!request.cancellation
  if (!hasContent) return null
  return (
    <section className='space-y-3 border-t border-border/60 pt-4'>
      {request.spend && (
        <dl className='text-sm'>
          <dt className='text-xs text-muted-foreground'>{t('stage')}</dt>
          <dd>{t(request.spend.stage, { defaultValue: t('unknown') })}</dd>
        </dl>
      )}
      {request.spend?.blockedReasons.map((reason) => (
        <p key={reason} className='text-sm text-warning'>
          {t(reason, { defaultValue: t('unknown') })}
        </p>
      ))}
      {request.spend?.refusalReason && (
        <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.spend.refusalReason}</p>
      )}
      {request.needStep.waitingReason === REQUEST_WAITING_REASON.NO_DEPARTMENT_HEAD && (
        <p role='status' className='text-sm text-warning-ink'>
          {t('personnel.waitingHead')}
        </p>
      )}
      {request.limitExemption === REQUEST_LIMIT_EXEMPTION.TRANSFER_GRACE && (
        <p className='text-sm text-primary-ink'>{t('personnel.exemption')}</p>
      )}
      {request.cancellation && (
        <div className='space-y-1 text-sm'>
          <h3 className='font-medium'>{t('personnel.cancellation')}</h3>
          <p>{t(`personnel.${request.cancellation.cause}`, { defaultValue: t('unknown') })}</p>
          <p className='text-xs text-muted-foreground'>
            {request.cancellation.cancelledBy?.fullName ?? t('personnel.system')}
          </p>
          {request.cancellation.note && (
            <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.cancellation.note}</p>
          )}
        </div>
      )}
    </section>
  )
}
