import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '~/shared/theme/theme-provider'

export function ThemeSwitch() {
  const { t } = useTranslation('theme')
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const nextThemeName = t(nextTheme)
  const Icon = theme === 'light' ? Moon : Sun

  return (
    <button
      aria-label={t('switchTo', { theme: nextThemeName })}
      aria-pressed={theme === 'dark'}
      className='inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface/80 text-muted-foreground backdrop-blur transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      onClick={toggleTheme}
      type='button'
    >
      <Icon aria-hidden='true' className='size-[1.125rem]' />
    </button>
  )
}
