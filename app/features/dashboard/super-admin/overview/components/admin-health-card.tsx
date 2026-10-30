import { CircleCheck, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SuperAdminWatchResponseDtoData } from '~/shared/api/generated/model/super-admin-watch'
import { ADMIN_WATCH_STATUS } from '../enums/admin-watch-status'

export function AdminHealthCard({ data }: { data?: SuperAdminWatchResponseDtoData }) {
  const { t: translate } = useTranslation('admin')
  const healthy = data?.status === ADMIN_WATCH_STATUS.HEALTHY
  const Icon = healthy ? ShieldCheck : ShieldAlert
  return (
    <section className='admin-overview-surface flex h-full flex-col rounded-lg p-5 sm:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-sm font-semibold'>{translate('overview.redesign.accountHealth')}</h2>
        <Icon aria-hidden strokeWidth={1.5} className={`size-5 ${healthy ? 'text-success-ink' : 'text-warning-ink'}`} />
      </div>
      <div className='my-5 border-y border-border/70 py-5'>
        <p
          className={`flex items-center gap-2 text-lg font-semibold ${healthy ? 'text-success-ink' : 'text-warning-ink'}`}
        >
          <span aria-hidden className={`size-2 rounded-full ${healthy ? 'bg-success' : 'bg-warning'}`} />
          {translate(`overview.watchStates.${data?.status}`, { defaultValue: translate('unknown') })}
        </p>
        <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
          {translate(healthy ? 'overview.redesign.accountHealthyHint' : 'overview.redesign.accountNeedsAttentionHint')}
        </p>
      </div>
      {data?.holder && (
        <div className='mt-auto flex min-w-0 items-center gap-3'>
          <span
            aria-hidden
            className='grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'
          >
            <ShieldCheck strokeWidth={1.5} className='size-5' />
          </span>
          <div className='min-w-0'>
            <p className='mb-1 text-xs text-muted-foreground'>{translate('overview.redesign.currentHolder')}</p>
            <p className='truncate text-sm font-medium' title={data.holder.fullName}>
              {data.holder.fullName}
            </p>
          </div>
          {healthy && (
            <CircleCheck
              aria-label={translate('overview.ready')}
              strokeWidth={1.5}
              className='ml-auto size-5 shrink-0 text-success-ink'
            />
          )}
        </div>
      )}
      <div className='space-y-2'>
        {Object.entries(data?.reasons ?? {})
          .filter(([, active]) => active)
          .map(([reason]) => (
            <p key={reason} className='mt-3 text-sm text-danger-ink'>
              {translate(`overview.reasons.${reason}`, { defaultValue: translate('unknown') })}
            </p>
          ))}
        {Object.entries(data?.warnings ?? {})
          .filter(([, active]) => active)
          .map(([warning]) => (
            <p key={warning} className='mt-3 text-sm text-warning-ink'>
              {translate(`overview.warnings.${warning}`, { defaultValue: translate('overview.warning') })}
            </p>
          ))}
      </div>
    </section>
  )
}
