import { useTranslation } from 'react-i18next'

interface RequestActionsBarProps {
  onCancel: () => void
  onBack: () => void
  onContinue: () => void
}

export function RequestActionsBar({ onCancel, onBack, onContinue }: RequestActionsBarProps) {
  const { t } = useTranslation()

  return (
    <div className='flex items-center justify-between border-t border-neutral-200 pt-6'>
      <button
        className='rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-brand-50/50 hover:text-neutral-900'
        onClick={onCancel}
        type='button'
      >
        {t('requestNewSoftware.actions.cancel')}
      </button>

      <div className='flex items-center gap-3'>
        <button
          className='rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-brand-50/50 hover:text-neutral-900'
          onClick={onBack}
          type='button'
        >
          {t('requestNewSoftware.actions.back')}
        </button>
        <button
          className='rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-600'
          onClick={onContinue}
          type='button'
        >
          {t('requestNewSoftware.actions.continue')}
        </button>
      </div>
    </div>
  )
}
