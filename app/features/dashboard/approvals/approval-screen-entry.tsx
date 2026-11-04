import { lazy, Suspense, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingIndicator } from '~/shared/ui/page-loading'

const Screen = lazy(() => import('./approval-screen').then((module) => ({ default: module.ApprovalScreen })))

export function ApprovalScreen(props: ComponentProps<typeof Screen>) {
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
