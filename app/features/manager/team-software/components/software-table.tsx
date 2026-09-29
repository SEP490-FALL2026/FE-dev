import { Code2, Diamond, Hash, Layers, Video, Ellipsis } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SoftwareFilters } from '../hooks/use-software-filters'
import { FigmaMark } from '~/entities/software/figma-mark'

const icons = {
  figma: Layers,
  github: Code2,
  jira: Diamond,
  slack: Hash,
  adobe: Layers,
  notion: Layers,
  miro: Layers,
  zoom: Video
}
const brandMarks: Record<string, { tone: string; initial?: string }> = {
  figma: { tone: 'bg-pink-100 text-pink-500' },
  github: { tone: 'bg-slate-100 text-slate-800' },
  jira: { tone: 'bg-blue-100 text-blue-600' },
  slack: { tone: 'border border-slate-200 bg-white text-slate-800' },
  adobe: { tone: 'bg-red-100 text-red-600', initial: 'A' },
  notion: { tone: 'border border-slate-200 bg-slate-100 text-slate-800', initial: 'N' },
  miro: { tone: 'bg-yellow-400 text-slate-800', initial: 'M' },
  zoom: { tone: 'bg-blue-500 text-white' }
}
export function SoftwareTable({ visible, reset }: SoftwareFilters) {
  const { t, i18n } = useTranslation()
  const [expanded, setExpanded] = useState<string | null>(null)
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  const money = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' })
  return (
    <div className='overflow-x-auto'>
      <table id='team-software-table' className='w-full min-w-290 text-left text-sm text-neutral-500'>
        <caption className='sr-only'>{t('teamSoftware.title')}</caption>
        <thead className='border-b border-neutral-200 bg-brand-bg text-xs text-neutral-500'>
          <tr>
            {(
              [
                'software',
                'plan',
                'total',
                'inUse',
                'available',
                'usage',
                'expiring',
                'ghost',
                'monthlyCost',
                'status',
                'actions'
              ] as const
            ).map((key) => (
              <th scope='col' key={key} className='px-4 py-3 font-medium whitespace-nowrap'>
                {t(`teamSoftware.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-neutral-200'>
          {visible.map((item) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Layers
            const brand = brandMarks[item.id]
            const open = expanded === item.id
            return (
              <Fragment key={item.id}>
                <tr className='hover:bg-brand-bg'>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <span
                        aria-hidden='true'
                        className={`flex size-8 shrink-0 items-center justify-center rounded font-bold ${brand?.tone ?? 'bg-brand-100 text-brand-600'}`}
                      >
                        {item.id === 'figma' ? (
                          <FigmaMark />
                        ) : (
                          (brand?.initial ?? <Icon size={18} aria-hidden='true' />)
                        )}
                      </span>
                      <div>
                        <p className='font-medium whitespace-nowrap text-neutral-900'>{item.name}</p>
                        <p className='mt-0.5 text-xs text-neutral-500'>
                          {t(`teamSoftware.categories.${item.category}`)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>{item.plan}</td>
                  {(['total', 'inUse', 'available'] as const).map((key) => (
                    <td
                      key={key}
                      className={`px-4 py-3 text-center tabular-nums ${key === 'available' ? 'font-medium text-success' : ''}`}
                    >
                      {number.format(item[key])}
                    </td>
                  ))}
                  <td className='min-w-32 px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-medium'>{percent.format(item.usage)}</span>
                      <div aria-hidden='true' className='h-1.5 min-w-10 flex-1 overflow-hidden rounded bg-neutral-200'>
                        <div
                          style={{ width: `${item.usage * 100}%` }}
                          className={`h-full rounded ${item.usage >= 0.8 ? 'bg-brand-500' : item.usage < 0.5 ? 'bg-brand-100' : 'bg-brand-200'}`}
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-center ${item.expiring ? 'bg-brand-100 font-medium text-brand-600' : 'text-neutral-500'}`}
                  >
                    {number.format(item.expiring)}
                  </td>
                  <td
                    className={`px-4 py-3 text-center ${item.ghost ? 'bg-danger-bg font-medium text-danger' : 'text-neutral-500'}`}
                  >
                    {number.format(item.ghost)}
                  </td>
                  <td className='px-4 py-3 text-right font-medium whitespace-nowrap text-neutral-900'>
                    {money.format(item.monthlyCost)}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex rounded-full border border-success/20 bg-success-bg px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-success'>
                      {t('teamSoftware.active')}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-center'>
                    <button
                      type='button'
                      onClick={() => setExpanded(open ? null : item.id)}
                      aria-expanded={open}
                      aria-controls={`software-details-${item.id}`}
                      aria-label={t('teamSoftware.details', { name: item.name })}
                      className='rounded p-2 text-neutral-500 hover:bg-brand-100 hover:text-brand-600'
                    >
                      <Ellipsis size={18} aria-hidden='true' />
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr id={`software-details-${item.id}`}>
                    <td colSpan={11} className='bg-brand-100/50 p-4'>
                      <h3 className='mb-2 text-sm font-semibold'>
                        {t('teamSoftware.rowDetails', { name: item.name })}
                      </h3>
                      <p className='text-xs leading-relaxed text-neutral-500'>{t('teamSoftware.detailsHint')}</p>
                      <p className='mt-2 text-xs text-neutral-500'>{t('teamSoftware.sample')}</p>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
          {visible.length === 0 && (
            <tr>
              <td colSpan={11} className='p-12 text-center'>
                <p className='font-semibold'>{t('teamSoftware.empty')}</p>
                <p className='mt-2 text-sm text-neutral-500'>{t('teamSoftware.emptyHint')}</p>
                <button type='button' onClick={reset} className='mt-4 text-brand-600 hover:underline'>
                  {t('teamSoftware.reset')}
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
