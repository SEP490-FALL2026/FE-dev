import { CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'sonner'

import { useTheme } from '~/shared/theme/theme-provider'

export function AppToaster() {
  const { theme } = useTheme()
  const { t: translate } = useTranslation('common')

  return (
    <Toaster
      theme={theme}
      position='top-right'
      closeButton
      duration={5000}
      visibleToasts={3}
      offset={24}
      mobileOffset={16}
      containerAriaLabel={translate('notifications.label')}
      icons={{
        success: <CircleCheck className='size-5 text-success-ink' strokeWidth={1.5} />,
        error: <CircleX className='size-5 text-danger-ink' strokeWidth={1.5} />,
        warning: <TriangleAlert className='size-5 text-warning-ink' strokeWidth={1.5} />,
        info: <Info className='size-5 text-info-ink' strokeWidth={1.5} />,
        loading: <LoaderCircle className='size-5 animate-spin motion-reduce:animate-none' strokeWidth={1.5} />,
        close: <X className='size-3.5' strokeWidth={1.5} />
      }}
      toastOptions={{
        closeButtonAriaLabel: translate('notifications.close'),
        style: {
          background: 'var(--theme-surface)',
          color: 'var(--theme-foreground)',
          border: '1px solid var(--theme-border)',
          fontFamily: 'inherit'
        },
        classNames: {
          toast: 'app-toast',
          description: '!text-muted-foreground',
          closeButton: '!border-border !bg-surface !text-muted-foreground'
        }
      }}
    />
  )
}
