import { lazy, Suspense, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingIndicator } from '~/shared/ui/page-loading'

const Screen = lazy(() => import('./manager-screen').then((module) => ({ default: module.ManagerScreen })))

export function ManagerScreen(props: ComponentProps<typeof Screen>) {
  const { t } = useTranslation('errors')

  return (
    <Suspense
      fallback={
        <div className='grid min-h-80 place-items-center p-6'>
          <LoadingIndicator message={t('loading')} />
        </div>
      }
    >
      <Screen {...props} />
    </Suspense>
  )
}
