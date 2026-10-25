import { CheckCircle2, Laptop } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserAccount } from '../../super-admin-data'

export interface OnboardingPromptModalProps {
  account: UserAccount | null
  isOpen: boolean
  onClose: () => void
  onIdentifyDevice: (account: UserAccount) => void
}

export function OnboardingPromptModal({
  account,
  isOpen,
  onClose,
  onIdentifyDevice
}: OnboardingPromptModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !account) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <div className='flex items-center gap-3'>
          <div className='grid size-10 place-items-center rounded-2xl bg-success/20 text-success shrink-0'>
            <CheckCircle2 className='size-6' />
          </div>
          <div>
            <h3 className='text-base font-bold text-foreground'>
              {t('superAdmin.accounts.onboardingPrompt.title')}
            </h3>
            <p className='text-xs text-muted-foreground'>
              {t('superAdmin.accounts.onboardingPrompt.personnelInfo', {
                code: account.employeeCode,
                name: account.name
              })}
            </p>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-primary/30 bg-primary-soft/20 p-4 space-y-2'>
          <div className='flex items-center gap-2 text-primary font-bold text-xs'>
            <Laptop className='size-4' />
            <span>{t('superAdmin.accounts.onboardingPrompt.deviceStepTitle')}</span>
          </div>

          <p className='text-xs text-foreground leading-relaxed'>
            {t('superAdmin.accounts.onboardingPrompt.deviceStepDesc', {
              name: account.name
            })}
          </p>
        </div>

        <div className='mt-6 flex items-center justify-end gap-3'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface-subtle transition'
            onClick={onClose}
            type='button'
          >
            {t('superAdmin.accounts.onboardingPrompt.skipBtn')}
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
            onClick={() => onIdentifyDevice(account)}
            type='button'
          >
            <Laptop className='size-4' />
            <span>{t('superAdmin.accounts.onboardingPrompt.bindNowBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
