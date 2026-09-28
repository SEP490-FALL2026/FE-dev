import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AuditLogItem } from '../data-usage.types'

export function AccessAuditLogCard() {
  const { t } = useTranslation()

  const logs: AuditLogItem[] = [
    {
      id: 'log1',
      actor: t('dataUsage.auditLog.logs.log1.actor'),
      time: t('dataUsage.auditLog.logs.log1.time'),
      purpose: t('dataUsage.auditLog.logs.log1.purpose'),
      status: t('dataUsage.auditLog.logs.log1.status'),
      meta: t('dataUsage.auditLog.logs.log1.meta')
    },
    {
      id: 'log2',
      actor: t('dataUsage.auditLog.logs.log2.actor'),
      time: t('dataUsage.auditLog.logs.log2.time'),
      purpose: t('dataUsage.auditLog.logs.log2.purpose'),
      status: t('dataUsage.auditLog.logs.log2.status'),
      meta: t('dataUsage.auditLog.logs.log2.meta')
    },
    {
      id: 'log3',
      actor: t('dataUsage.auditLog.logs.log3.actor'),
      time: t('dataUsage.auditLog.logs.log3.time'),
      purpose: t('dataUsage.auditLog.logs.log3.purpose'),
      status: t('dataUsage.auditLog.logs.log3.status'),
      meta: t('dataUsage.auditLog.logs.log3.meta')
    }
  ]

  return (
    <div className='rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-4 flex items-center justify-between border-b border-neutral-200 pb-3'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-500'>
            <Eye className='h-4 w-4' />
          </div>
          <div>
            <h3 className='text-base font-bold text-neutral-900'>{t('dataUsage.auditLog.title')}</h3>
            <p className='text-xs text-neutral-500'>{t('dataUsage.auditLog.subtitle')}</p>
          </div>
        </div>
        <span className='text-[11px] font-bold text-brand-500'>{t('dataUsage.auditLog.timeframe')}</span>
      </div>

      <div className='space-y-4'>
        {logs.map((log) => (
          <div className='rounded-xl border border-neutral-200 bg-[#FEFBF7] p-3.5' key={log.id}>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-bold text-neutral-900'>{log.actor}</span>
              <span className='text-[11px] text-neutral-500'>{log.time}</span>
            </div>
            <p className='mt-1.5 text-xs text-neutral-500'>
              <strong className='text-neutral-900'>{t('dataUsage.auditLog.purposePrefix')}</strong> {log.purpose}
            </p>
            <div className='mt-2 flex items-center justify-between text-[11px]'>
              <span className='font-semibold text-emerald-600'>{log.status}</span>
              <span className='text-neutral-500'>{log.meta}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className='mt-4 w-full rounded-xl border border-brand-300 bg-brand-50/50 py-2 text-xs font-bold text-brand-500 transition hover:bg-brand-50'
        type='button'
      >
        {t('dataUsage.auditLog.viewHistory')}
      </button>
    </div>
  )
}
