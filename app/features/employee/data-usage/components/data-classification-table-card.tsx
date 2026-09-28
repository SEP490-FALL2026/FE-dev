import { useTranslation } from 'react-i18next'
import type { ClassificationRow } from '../data-usage.types'

export function DataClassificationTableCard() {
  const { t } = useTranslation()

  const rows: ClassificationRow[] = [
    {
      id: 'identity',
      title: t('dataUsage.classification.rows.identity.title'),
      subtitle: t('dataUsage.classification.rows.identity.subtitle'),
      legalBasis: t('dataUsage.classification.rows.identity.legalBasis'),
      retention: t('dataUsage.classification.rows.identity.retention'),
      recipients: t('dataUsage.classification.rows.identity.recipients'),
      encryption: t('dataUsage.classification.rows.identity.encryption')
    },
    {
      id: 'entitlements',
      title: t('dataUsage.classification.rows.entitlements.title'),
      subtitle: t('dataUsage.classification.rows.entitlements.subtitle'),
      legalBasis: t('dataUsage.classification.rows.entitlements.legalBasis'),
      retention: t('dataUsage.classification.rows.entitlements.retention'),
      recipients: t('dataUsage.classification.rows.entitlements.recipients'),
      encryption: t('dataUsage.classification.rows.entitlements.encryption')
    },
    {
      id: 'telemetry',
      title: t('dataUsage.classification.rows.telemetry.title'),
      subtitle: t('dataUsage.classification.rows.telemetry.subtitle'),
      legalBasis: t('dataUsage.classification.rows.telemetry.legalBasis'),
      retention: t('dataUsage.classification.rows.telemetry.retention'),
      recipients: t('dataUsage.classification.rows.telemetry.recipients'),
      encryption: t('dataUsage.classification.rows.telemetry.encryption'),
      isRetentionHighlight: true
    },
    {
      id: 'requests',
      title: t('dataUsage.classification.rows.requests.title'),
      subtitle: t('dataUsage.classification.rows.requests.subtitle'),
      legalBasis: t('dataUsage.classification.rows.requests.legalBasis'),
      retention: t('dataUsage.classification.rows.requests.retention'),
      recipients: t('dataUsage.classification.rows.requests.recipients'),
      encryption: t('dataUsage.classification.rows.requests.encryption')
    }
  ]

  return (
    <section className='rounded-3xl border border-neutral-200 bg-white p-7 shadow-xs'>
      <div className='mb-6 flex items-center gap-3 border-b border-neutral-200/70 pb-4'>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-500'>
          {2}
        </div>
        <div>
          <h3 className='text-lg font-bold text-neutral-900'>{t('dataUsage.classification.title')}</h3>
          <p className='text-xs text-neutral-500'>{t('dataUsage.classification.subtitle')}</p>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-xs'>
          <thead>
            <tr className='border-y border-neutral-200 bg-[#FEFBF7] font-bold text-neutral-500'>
              <th className='px-4 py-3.5'>{t('dataUsage.classification.cols.category')}</th>
              <th className='px-4 py-3.5'>{t('dataUsage.classification.cols.legalBasis')}</th>
              <th className='px-4 py-3.5'>{t('dataUsage.classification.cols.retention')}</th>
              <th className='px-4 py-3.5'>{t('dataUsage.classification.cols.recipients')}</th>
              <th className='px-4 py-3.5 text-center'>{t('dataUsage.classification.cols.encryption')}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200/70'>
            {rows.map((row) => (
              <tr className='transition hover:bg-[#FEFBF7]/60' key={row.id}>
                <td className='px-4 py-3.5 font-bold text-neutral-900'>
                  {row.title}
                  <span className='block text-[11px] font-normal text-neutral-500'>{row.subtitle}</span>
                </td>
                <td className='px-4 py-3.5 text-neutral-500'>{row.legalBasis}</td>
                <td
                  className={`px-4 py-3.5 font-semibold ${row.isRetentionHighlight ? 'text-brand-500' : 'text-neutral-900'}`}
                >
                  {row.retention}
                </td>
                <td className='px-4 py-3.5 text-neutral-500'>{row.recipients}</td>
                <td className='px-4 py-3.5 text-center'>
                  <span className='inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600'>
                    {row.encryption}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
