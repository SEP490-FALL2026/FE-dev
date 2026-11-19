import { useTranslation } from 'react-i18next'

import { setAppLanguage, type SupportedLanguage } from '~/shared/i18n/i18n'

const languages: SupportedLanguage[] = ['vi', 'en']

export function LanguageSwitch() {
  const { i18n, t } = useTranslation('common')
  const currentLanguage = i18n.resolvedLanguage?.split('-')[0] ?? 'vi'

  return (
    <div
      aria-label={t('language.selector')}
      className='flex h-10 w-[4.75rem] shrink-0 items-center rounded-full border border-border bg-surface/80 p-1 backdrop-blur'
      role='group'
    >
      {languages.map((language) => {
        const isCurrent = currentLanguage === language
        const languageName = t(language === 'vi' ? 'language.vietnamese' : 'language.english')

        return (
          <button
            aria-label={t('language.switchTo', { language: languageName })}
            aria-pressed={isCurrent}
            className='w-1/2 rounded-full py-1.5 text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-primary aria-pressed:bg-primary-soft aria-pressed:text-primary'
            key={language}
            onClick={() => void setAppLanguage(language)}
            type='button'
          >
            {t(language === 'vi' ? 'language.vietnameseShort' : 'language.englishShort')}
          </button>
        )
      })}
    </div>
  )
}
