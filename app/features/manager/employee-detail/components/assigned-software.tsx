import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { assignedSoftware } from '~/entities/license/employee-assignments-demo'
import { SoftwareLogo } from './software-logo'

export function AssignedSoftware({ onUsage }: { onUsage: () => void }) {
  const { t, i18n } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' })
  return (
    <section className='rounded-xl border border-neutral-200 bg-white shadow-xs'>
      <h2 className='border-b border-neutral-200 px-6 py-4 text-base font-semibold'>
        {t('employeeDetail.assignedTitle', { count: assignedSoftware.length })}
      </h2>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <caption className='sr-only'>{t('employeeDetail.assigned')}</caption>
          <thead className='border-b border-neutral-200 bg-brand-bg text-xs font-medium tracking-wider text-neutral-500 uppercase'>
            <tr>
              {(['software', 'plan', 'status', 'assignedOn', 'expiresOn', 'monthlyCostColumn', 'actions'] as const).map(
                (key) => (
                  <th key={key} scope='col' className='px-6 py-3 whitespace-nowrap'>
                    {key === 'actions' ? (
                      <span className='sr-only'>{t('employeeDetail.actions')}</span>
                    ) : (
                      t(`employeeDetail.${key}`)
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {assignedSoftware.map((app) => (
              <tr key={app.id} className='hover:bg-brand-bg'>
                <th scope='row' className='px-6 py-4 text-left font-normal whitespace-nowrap'>
                  <div className='flex items-center gap-4'>
                    <SoftwareLogo name={app.name} url={app.logo} />
                    <div>
                      <p className='text-sm font-medium'>{app.name}</p>
                      <p className='text-xs text-neutral-500'>{t(`employeeDetail.${app.category}`)}</p>
                    </div>
                  </div>
                </th>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <p className='text-sm'>{app.plan}</p>
                  <span className='mt-1 inline-flex rounded bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600'>
                    {t('employeeDetail.paid')}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span className='rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success'>
                    {t('managerTeam.active')}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-neutral-500'>
                  {date.format(new Date(`${app.assigned}T00:00:00Z`))}
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-neutral-500'>
                  {date.format(new Date(`${app.expires}T00:00:00Z`))}
                </td>
                <td className='px-6 py-4 text-sm tabular-nums'>{currency.format(app.cost)}</td>
                <td className='px-6 py-4'>
                  <details className='relative'>
                    <summary
                      aria-label={t('employeeDetail.softwareActions', { name: app.name })}
                      className='cursor-pointer list-none rounded border border-neutral-200 p-2 text-neutral-500'
                    >
                      <Ellipsis size={14} aria-hidden='true' />
                    </summary>
                    <div className='absolute right-0 bottom-full z-10 mb-2 w-48 rounded-lg border border-neutral-200 bg-white p-2 shadow-xs'>
                      <button
                        type='button'
                        onClick={onUsage}
                        className='w-full rounded px-2 py-2 text-left text-xs hover:bg-brand-100'
                      >
                        {t('employeeDetail.usage')}
                      </button>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='rounded-b-xl border-t border-neutral-200 bg-brand-bg px-6 py-3'>
        <button
          type='button'
          aria-expanded={expanded}
          aria-controls='employee-software-details'
          onClick={() => setExpanded(!expanded)}
          className='text-sm font-medium text-brand-600 hover:underline'
        >
          {t(expanded ? 'employeeDetail.hideSoftwareDetails' : 'employeeDetail.softwareDetails')}
        </button>
        <ul id='employee-software-details' hidden={!expanded} className='mt-3 space-y-2 text-xs text-neutral-500'>
          {assignedSoftware.map((app) => (
            <li key={app.id}>
              {t('employeeDetail.softwareSummary', {
                name: app.name,
                plan: app.plan,
                category: t(`employeeDetail.${app.category}`),
                cost: currency.format(app.cost)
              })}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
