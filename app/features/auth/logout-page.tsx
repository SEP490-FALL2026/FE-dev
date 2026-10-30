import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { LoadingIndicator } from '~/shared/ui/page-loading'
import { logout } from './auth-session'

export function LogoutPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const started = useRef(false)
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/login', { replace: true }),
    onError: () => toast.error(t('session.logoutFailed'), { id: 'auth-logout' })
  })
  const { mutate } = mutation

  useEffect(() => {
    if (!started.current) {
      started.current = true
      mutate()
    }
  }, [mutate])

  return (
    <main className='grid min-h-svh place-items-center bg-background p-6'>
      <div className='text-center'>
        {!mutation.isError && <LoadingIndicator message={t('session.loggingOut')} />}
        {mutation.isError && (
          <button
            type='button'
            onClick={() => mutation.mutate()}
            className='mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground'
          >
            {t('session.retry')}
          </button>
        )}
      </div>
    </main>
  )
}
