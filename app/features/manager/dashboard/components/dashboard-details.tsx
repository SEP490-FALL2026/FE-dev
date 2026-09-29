import { ClipboardList, DollarSign, Info, Link, RefreshCw, ShoppingBag, Undo2, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { costs, requests } from '../dashboard-demo'
import { DashboardPanel } from './dashboard-panel'

export function DashboardDetails({ start, end }: { start: string; end: string }) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  const icons = { newAccess: ShoppingBag, changePlan: RefreshCw, renewal: Link, returnLicense: Undo2 }
  const filtered = requests.filter((request) => request.date.slice(0, 10) >= start && request.date.slice(0, 10) <= end)
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
      <DashboardPanel
        title={t('manager.ghostTitle')}
        icon={Zap}
        action='viewAll'
        details={<p>{t('manager.ghostDetails')}</p>}
      >
        <div className='mt-4 grid grid-cols-2 gap-3'>
          {[
            { key: 'requiresReview', value: 12, days: 60 },
            { key: 'critical', value: 5, days: 90 }
          ].map((item) => (
            <div key={item.key} className='rounded-xl border border-neutral-200 bg-brand-bg p-3.5'>
              <p className='text-xs font-medium text-neutral-500'>{t(`manager.${item.key}`)}</p>
              <p className={`my-1 text-2xl font-bold ${item.key === 'critical' ? 'text-danger' : ''}`}>
                {number.format(item.value)}
              </p>
              <p className='text-[11px] text-neutral-500'>{t('manager.inactiveDays', { count: item.days })}</p>
            </div>
          ))}
        </div>
        <div className='mt-4 flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-brand-bg p-3'>
          <Info size={16} aria-hidden='true' className='mt-0.5 shrink-0 text-brand-500' />
          <p className='text-xs leading-relaxed text-neutral-500'>{t('manager.ghostTip')}</p>
        </div>
      </DashboardPanel>
      <DashboardPanel
        title={t('manager.recentTitle')}
        icon={ClipboardList}
        action='viewAll'
        details={<p>{t('manager.demo')}</p>}
      >
        <ul className='mt-3 divide-y divide-neutral-200'>
          {filtered.map((request) => {
            const Icon = icons[request.type]
            return (
              <li key={request.id} className='flex items-center justify-between gap-2 py-2.5'>
                <div className='flex min-w-0 items-center gap-3'>
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-brand-bg text-brand-500'>
                    <Icon size={16} aria-hidden='true' />
                  </span>
                  <div className='min-w-0'>
                    <h3 className='text-xs font-semibold'>
                      {t(`manager.${request.type}`, { software: request.software })}
                    </h3>
                    <p className='mt-0.5 text-[11px] text-neutral-500'>
                      {request.person} · <time dateTime={request.date}>{date.format(new Date(request.date))}</time>
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${request.status === 'pending' ? 'bg-brand-100 text-brand-600' : request.status === 'approved' ? 'bg-success-bg text-success' : 'border border-neutral-200 bg-brand-bg text-neutral-500'}`}
                >
                  {t(`manager.${request.status}`)}
                </span>
              </li>
            )
          })}
        </ul>
        {filtered.length === 0 && (
          <p role='status' className='py-8 text-sm text-neutral-500'>
            {t('manager.emptyRequests')}
          </p>
        )}
      </DashboardPanel>
      <DashboardPanel
        title={t('manager.costTitle')}
        icon={DollarSign}
        details={
          <table className='w-full text-left'>
            <caption className='sr-only'>{t('manager.costTitle')}</caption>
            <thead>
              <tr>
                <th scope='col' className='p-2'>
                  {t('manager.app')}
                </th>
                <th scope='col' className='p-2'>
                  {t('manager.cost')}
                </th>
                <th scope='col' className='p-2'>
                  {t('manager.share')}
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((app) => (
                <tr key={app.name}>
                  <th scope='row' className='p-2 font-medium'>
                    {app.name}
                  </th>
                  <td className='p-2'>{currency.format(app.amount)}</td>
                  <td className='p-2'>{percent.format(app.share / 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ol className='mt-3 space-y-3.5'>
          {costs.map((app, i) => (
            <li key={app.name} className='flex items-center gap-3'>
              <span className='w-3 text-xs text-neutral-500'>{number.format(i + 1)}</span>
              <span
                aria-hidden='true'
                className='flex size-6 shrink-0 items-center justify-center rounded border border-neutral-200 bg-brand-bg text-[10px] font-bold text-brand-600'
              >
                {app.name[0]}
              </span>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center justify-between gap-2 text-xs'>
                  <span className='truncate font-medium' title={app.name}>
                    {app.name}
                  </span>
                  <span className='shrink-0 font-semibold tabular-nums'>{currency.format(app.amount)}</span>
                </div>
                <div className='h-1.5 overflow-hidden rounded-full bg-neutral-100'>
                  <div
                    className={`h-full rounded-full ${i < 2 ? 'bg-brand-500' : 'bg-brand-200'}`}
                    style={{ width: `${app.share}%` }}
                  />
                </div>
              </div>
              <span className='w-8 text-right text-[11px] text-neutral-500'>{percent.format(app.share / 100)}</span>
            </li>
          ))}
        </ol>
      </DashboardPanel>
    </div>
  )
}
