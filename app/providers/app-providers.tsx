import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import { createQueryClient } from '~/shared/api/query-client'
import { i18n, initializeBrowserLanguage } from '~/shared/i18n/i18n'
import { ThemeProvider } from '~/shared/theme/theme-provider'
import { AppToaster } from '~/shared/ui/app-toaster'
import { PageLoading } from '~/shared/ui/page-loading'
import { configureAuthQueryClient, initializeAuthSession } from '~/features/auth/auth-session'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  useEffect(() => {
    void initializeBrowserLanguage()
    configureAuthQueryClient(queryClient)
    void initializeAuthSession()
    return () => configureAuthQueryClient(null)
  }, [queryClient])

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<PageLoading message={i18n.t('errors:loading')} />}>{children}</Suspense>
          <AppToaster />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
