import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { useDocumentTitle } from '~/shared/lib/use-document-title'

export function NotFoundPage() {
  const { t } = useTranslation('notFound')
  useDocumentTitle(t('documentTitle'))

  return (
    <main className='grid min-h-screen place-items-center px-6 py-16'>
      <div className='max-w-lg text-center'>
        <p className='text-sm font-semibold tracking-[0.2em] text-primary uppercase'>{t('eyebrow')}</p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-foreground'>{t('title')}</h1>
        <p className='mt-4 text-base leading-7 text-muted-foreground'>{t('description')}</p>
        <Link
          className='mt-8 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          to='/'
        >
          {t('action')}
        </Link>
      </div>
    </main>
  )
}
