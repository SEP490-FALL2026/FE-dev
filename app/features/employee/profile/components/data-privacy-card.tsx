import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Database,
  Download,
  History,
  Info,
  Lock,
  Shield,
  ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function DataPrivacyCard() {
  const { t } = useTranslation()
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true)

  const storedCategories = [
    {
      id: 'personalInfo',
      bold: t('profile.dataPrivacy.dataStored.categories.personalInfo.bold'),
      text: t('profile.dataPrivacy.dataStored.categories.personalInfo.text')
    },
    {
      id: 'orgInfo',
      bold: t('profile.dataPrivacy.dataStored.categories.orgInfo.bold'),
      text: t('profile.dataPrivacy.dataStored.categories.orgInfo.text')
    },
    {
      id: 'softwareAssignments',
      bold: t('profile.dataPrivacy.dataStored.categories.softwareAssignments.bold'),
      text: t('profile.dataPrivacy.dataStored.categories.softwareAssignments.text')
    },
    {
      id: 'requestHistory',
      bold: t('profile.dataPrivacy.dataStored.categories.requestHistory.bold'),
      text: t('profile.dataPrivacy.dataStored.categories.requestHistory.text')
    },
    {
      id: 'usageSummary',
      bold: t('profile.dataPrivacy.dataStored.categories.usageSummary.bold'),
      text: t('profile.dataPrivacy.dataStored.categories.usageSummary.text')
    }
  ]

  const privacyActions = [
    {
      id: 'requestExport',
      icon: Download,
      title: t('profile.dataPrivacy.privacyRights.actions.requestExport.title'),
      subtitle: t('profile.dataPrivacy.privacyRights.actions.requestExport.subtitle'),
      to: '/employee/profile/data-export'
    },
    {
      id: 'viewUsage',
      icon: History,
      title: t('profile.dataPrivacy.privacyRights.actions.viewUsage.title'),
      subtitle: t('profile.dataPrivacy.privacyRights.actions.viewUsage.subtitle'),
      to: '/employee/profile/data-usage'
    },
    {
      id: 'manageConsent',
      icon: ShieldCheck,
      title: t('profile.dataPrivacy.privacyRights.actions.manageConsent.title'),
      subtitle: t('profile.dataPrivacy.privacyRights.actions.manageConsent.subtitle')
    }
  ]

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs' id='data-privacy'>
      {/* Card Header */}
      <div className='flex items-center gap-3 border-b border-neutral-200 pb-5'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
          <Shield className='h-5 w-5' />
        </div>
        <div>
          <h3 className='text-base font-bold text-neutral-900'>{t('profile.dataPrivacy.title')}</h3>
          <p className='text-xs text-neutral-500'>{t('profile.dataPrivacy.subtitle')}</p>
        </div>
      </div>

      {/* Two Sub-Sections Side-by-Side */}
      <div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-2'>
        {/* Left Sub-card: Data We Store About You */}
        <div className='flex flex-col justify-between rounded-xl border border-neutral-200 bg-[#FEFBF7] p-5'>
          <div>
            <div className='mb-1.5 flex items-center gap-2'>
              <Database className='h-4 w-4 text-brand-500' />
              <h4 className='text-sm font-bold text-neutral-900'>{t('profile.dataPrivacy.dataStored.title')}</h4>
            </div>
            <p className='mb-4 text-xs leading-relaxed text-neutral-500'>
              {t('profile.dataPrivacy.dataStored.description')}
            </p>

            <ul className='space-y-2.5 text-xs text-neutral-600'>
              {storedCategories.map((item) => (
                <li className='flex items-start gap-2' key={item.id}>
                  <span className='mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-status-active/15 text-status-active'>
                    <Check className='h-2.5 w-2.5 stroke-[3]' />
                  </span>
                  <span>
                    <strong className='font-medium text-neutral-900'>{item.bold}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-4 border-t border-neutral-200 pt-4'>
            <button
              className='inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-600'
              type='button'
            >
              {t('profile.dataPrivacy.dataStored.viewDetailedCategories')}
              <ArrowRight className='h-3.5 w-3.5' />
            </button>
          </div>
        </div>

        {/* Right Sub-card: Your Privacy Rights */}
        <div className='flex flex-col justify-between rounded-xl border border-neutral-200 bg-[#FEFBF7] p-5'>
          <div>
            <div className='mb-1.5 flex items-center gap-2'>
              <Lock className='h-4 w-4 text-brand-500' />
              <h4 className='text-sm font-bold text-neutral-900'>{t('profile.dataPrivacy.privacyRights.title')}</h4>
            </div>
            <p className='mb-4 text-xs leading-relaxed text-neutral-500'>
              {t('profile.dataPrivacy.privacyRights.description')}
            </p>

            <div className='space-y-2.5'>
              {privacyActions.map((action) => {
                const content = (
                  <>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white'>
                        <action.icon className='h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-neutral-900 transition-colors group-hover:text-brand-500'>
                          {action.title}
                        </p>
                        <p className='text-[11px] text-neutral-500'>{action.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className='h-4 w-4 text-neutral-400 transition-colors group-hover:text-brand-500' />
                  </>
                )

                if (action.to) {
                  return (
                    <Link
                      className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-3 text-left transition-all hover:border-brand-300 hover:shadow-xs'
                      key={action.id}
                      to={action.to}
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <button
                    className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-3 text-left transition-all hover:border-brand-300 hover:shadow-xs'
                    key={action.id}
                    type='button'
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legal / Regulatory Compliance Banner */}
      <div className='mt-5 flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4'>
        <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white'>
          <Info className='h-3.5 w-3.5' />
        </div>
        <p className='text-xs leading-relaxed text-neutral-600'>
          {t('profile.dataPrivacy.compliance.prefix')}{' '}
          <strong className='font-medium text-neutral-900'>{t('profile.dataPrivacy.compliance.law')}</strong>{' '}
          {t('profile.dataPrivacy.compliance.and')}{' '}
          <strong className='font-medium text-neutral-900'>{t('profile.dataPrivacy.compliance.decree')}</strong>
          {t('profile.dataPrivacy.compliance.suffix')}
        </p>
      </div>

      {/* Data Usage Notification Switch Toggle Row */}
      <div className='mt-5 flex items-center justify-between border-t border-neutral-200 pt-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
            <Bell className='h-5 w-5' />
          </div>
          <div>
            <h4 className='text-xs font-bold text-neutral-900'>{t('profile.dataPrivacy.notification.title')}</h4>
            <p className='text-xs text-neutral-500'>{t('profile.dataPrivacy.notification.description')}</p>
          </div>
        </div>

        {/* Interactive Toggle Switch */}
        <div className='flex items-center gap-2'>
          <button
            aria-checked={isNotificationEnabled}
            aria-label={t('profile.dataPrivacy.notification.toggleAriaLabel')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              isNotificationEnabled ? 'bg-brand-500' : 'bg-neutral-200'
            }`}
            onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
            role='switch'
            type='button'
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isNotificationEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className='select-none text-xs font-semibold text-neutral-900'>
            {isNotificationEnabled
              ? t('profile.dataPrivacy.notification.enabled')
              : t('profile.dataPrivacy.notification.disabled')}
          </span>
        </div>
      </div>
    </section>
  )
}
