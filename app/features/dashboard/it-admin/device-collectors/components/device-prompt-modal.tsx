import { Terminal, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface DevicePromptModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPrompt: { tool: string; prompt: string; response: string } | null
}

export function DevicePromptModal({ isOpen, onClose, selectedPrompt }: DevicePromptModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !selectedPrompt) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-primary'>
            <Terminal className='size-5' />
            <h3 className='text-base font-bold text-foreground'>
              {t('itAdmin.deviceCollectors.extra.promptDetail')}
              {selectedPrompt.tool})
            </h3>
          </div>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        <div className='space-y-3 text-xs'>
          <div>
            <span className='font-bold text-foreground block mb-1'>
              {t('itAdmin.deviceCollectors.extra.userPrompt')}
            </span>
            <div className='rounded-xl border border-border bg-surface-subtle p-3.5 font-mono leading-relaxed text-foreground'>
              {selectedPrompt.prompt}
            </div>
          </div>

          <div>
            <span className='font-bold text-foreground block mb-1'>
              {t('itAdmin.deviceCollectors.extra.modelResponse')}
            </span>
            <div className='rounded-xl border border-border bg-surface-subtle p-3.5 leading-relaxed text-muted-foreground max-h-48 overflow-y-auto'>
              {selectedPrompt.response}
            </div>
          </div>

          <p className='text-[0.68rem] text-muted-foreground italic'>
            {t('itAdmin.deviceCollectors.extra.auditNotice')}
          </p>
        </div>

        <div className='flex items-center justify-end pt-3 border-t border-border'>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.deviceCollectors.extra.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
