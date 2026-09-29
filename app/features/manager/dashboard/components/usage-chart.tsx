import { Presentation } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { usage } from '../dashboard-demo'
import { DashboardPanel } from './dashboard-panel'

const series = [
  { key: 'total', color: '#FC7523' },
  { key: 'active', color: '#FCB978' },
  { key: 'inactive', color: '#3DB87F' }
] as const

export function UsageChart() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const table = (
    <table className='w-full text-left'>
      <caption className='sr-only'>{t('manager.usageTitle')}</caption>
      <thead>
        <tr>
          <th scope='col' className='p-2'>
            {t('manager.app')}
          </th>
          {series.map(({ key }) => (
            <th key={key} scope='col' className='p-2'>
              {t(`manager.${key}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {usage.map((app) => (
          <tr key={app.name} className='border-t border-neutral-200'>
            <th scope='row' className='p-2 font-medium'>
              {app.name}
            </th>
            {series.map(({ key }) => (
              <td key={key} className='p-2 tabular-nums'>
                {number.format(app[key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
  return (
    <DashboardPanel title={t('manager.usageTitle')} icon={Presentation} details={table}>
      <div className='mt-4 flex flex-wrap gap-3 text-xs text-neutral-500'>
        {series.map(({ key, color }) => (
          <span key={key} className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-sm' style={{ background: color }} />
            {t(`manager.${key}`)}
          </span>
        ))}
      </div>
      <div className='mt-6 overflow-x-auto pb-2'>
        <div className='relative min-w-[440px] pt-1'>
          <div
            aria-hidden='true'
            className='absolute inset-x-0 top-0 flex h-60 flex-col justify-between text-[10px] text-neutral-500'
          >
            {[200, 150, 100, 50, 0].map((n) => (
              <div key={n} className='border-b border-dashed border-neutral-200'>
                {number.format(n)}
              </div>
            ))}
          </div>
          <div className='relative grid h-60 grid-cols-6 gap-2 pl-7' aria-label={t('manager.usageTitle')} role='img'>
            {usage.map((app) => (
              <div key={app.name} className='flex items-end justify-center gap-1'>
                {series.map(({ key, color }) => (
                  <div
                    key={key}
                    className='w-3.5 rounded-t-sm transition-opacity hover:opacity-75'
                    style={{ height: `${app[key] / 2}%`, background: color }}
                    title={`${app.name} · ${t(`manager.${key}`)}: ${number.format(app[key])}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-6 gap-2 pt-2 pl-7 text-center text-[11px] text-neutral-500'>
            {usage.map((app) => (
              <span key={app.name}>{app.name}</span>
            ))}
          </div>
        </div>
      </div>
    </DashboardPanel>
  )
}
