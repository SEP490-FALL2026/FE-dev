import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { MonitoredAppItem } from '../data-usage.types'

export function MonitoredAppsCard() {
  const { t } = useTranslation()

  const apps: (MonitoredAppItem & { icon: ReactNode })[] = [
    {
      id: 'figma',
      name: 'Figma',
      tier: t('dataUsage.apps.figma.tier'),
      status: t('dataUsage.apps.trackingActive'),
      integration: t('dataUsage.apps.figma.integration'),
      lastActivityLabel: t('dataUsage.apps.lastActivityLabel'),
      lastActivityValue: t('dataUsage.apps.figma.lastActivity'),
      collected: t('dataUsage.apps.figma.collected'),
      excluded: t('dataUsage.apps.figma.excluded'),
      purpose: t('dataUsage.apps.figma.purpose'),
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24'>
          <path d='M8 2h4a4 4 0 014 4 4 4 0 01-4 4H8V2z' fill='#0ACF83' />
          <path d='M4 6a4 4 0 014-4h4v8H8a4 4 0 01-4-4z' fill='#F24E1E' />
          <path d='M4 14a4 4 0 014-4h4v8H8a4 4 0 01-4-4z' fill='#A259FF' />
          <path d='M4 22a4 4 0 014-4h4v4a4 4 0 01-4 4 4 4 0 01-4-4z' fill='#1ABCFE' />
          <circle cx='14' cy='14' fill='#FF7262' r='4' />
        </svg>
      )
    },
    {
      id: 'github',
      name: 'GitHub',
      tier: t('dataUsage.apps.github.tier'),
      status: t('dataUsage.apps.trackingActive'),
      integration: t('dataUsage.apps.github.integration'),
      lastActivityLabel: t('dataUsage.apps.lastActivityLabel'),
      lastActivityValue: t('dataUsage.apps.github.lastActivity'),
      collected: t('dataUsage.apps.github.collected'),
      excluded: t('dataUsage.apps.github.excluded'),
      purpose: t('dataUsage.apps.github.purpose'),
      icon: (
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white'>
          <svg className='h-6 w-6 fill-current' viewBox='0 0 24 24'>
            <path
              clipRule='evenodd'
              d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
              fillRule='evenodd'
            />
          </svg>
        </div>
      )
    },
    {
      id: 'slack',
      name: 'Slack',
      tier: t('dataUsage.apps.slack.tier'),
      status: t('dataUsage.apps.trackingActive'),
      integration: t('dataUsage.apps.slack.integration'),
      lastActivityLabel: t('dataUsage.apps.lastActivityLabel'),
      lastActivityValue: t('dataUsage.apps.slack.lastActivity'),
      collected: t('dataUsage.apps.slack.collected'),
      excluded: t('dataUsage.apps.slack.excluded'),
      purpose: t('dataUsage.apps.slack.purpose'),
      icon: (
        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24'>
          <path
            d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z'
            fill='#E01E5A'
          />
          <path
            d='M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z'
            fill='#36C5F0'
          />
          <path
            d='M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z'
            fill='#2EB67D'
          />
          <path
            d='M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z'
            fill='#ECB22E'
          />
        </svg>
      )
    }
  ]

  return (
    <section className='rounded-3xl border border-neutral-200 bg-white p-7 shadow-xs'>
      <div className='mb-6 flex items-center justify-between border-b border-neutral-200/70 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-500'>
            {1}
          </div>
          <div>
            <h3 className='text-lg font-bold text-neutral-900'>{t('dataUsage.apps.title')}</h3>
            <p className='text-xs text-neutral-500'>{t('dataUsage.apps.subtitle')}</p>
          </div>
        </div>
        <span className='rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-500'>
          {t('dataUsage.apps.syncStatus')}
        </span>
      </div>

      <div className='space-y-4'>
        {apps.map((app) => (
          <div
            className='rounded-2xl border border-neutral-200 bg-[#FEFBF7] p-5 transition hover:border-brand-300'
            key={app.id}
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3.5'>
                {app.id === 'github' ? (
                  app.icon
                ) : (
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-xs'>
                    {app.icon}
                  </div>
                )}
                <div>
                  <div className='flex items-center gap-2'>
                    <h4 className='text-base font-bold text-neutral-900'>{app.name}</h4>
                    <span className='rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-500'>
                      {app.tier}
                    </span>
                    <span className='flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600'>
                      <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                      {app.status}
                    </span>
                  </div>
                  <p className='mt-1 text-xs text-neutral-500'>{app.integration}</p>
                </div>
              </div>
              <div className='text-right'>
                <span className='text-xs font-semibold text-neutral-500'>{app.lastActivityLabel}</span>
                <p className='text-xs font-bold text-neutral-900'>{app.lastActivityValue}</p>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-3 gap-3 border-t border-neutral-200 pt-3.5 text-xs'>
              <div className='rounded-xl border border-neutral-200/80 bg-white p-3'>
                <span className='block font-medium text-neutral-500'>{t('dataUsage.apps.cards.collectedLabel')}</span>
                <span className='mt-0.5 block font-semibold text-neutral-900'>{app.collected}</span>
              </div>
              <div className='rounded-xl border border-neutral-200/80 bg-white p-3'>
                <span className='block font-medium text-neutral-500'>{t('dataUsage.apps.cards.excludedLabel')}</span>
                <span className='mt-0.5 block font-semibold text-red-500'>{app.excluded}</span>
              </div>
              <div className='rounded-xl border border-neutral-200/80 bg-white p-3'>
                <span className='block font-medium text-neutral-500'>{t('dataUsage.apps.cards.purposeLabel')}</span>
                <span className='mt-0.5 block font-semibold text-brand-500'>{app.purpose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
