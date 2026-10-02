import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { AppProviders } from '~/providers/app-providers'

import type { Route } from './+types/root'
import './app.css'

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation('common')

  return (
    <html lang={i18n.resolvedLanguage ?? 'vi'}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  )
}

export function HydrateFallback() {
  const { t } = useTranslation('errors')

  return (
    <main className='grid min-h-screen place-items-center p-6'>
      <p className='text-sm text-muted-foreground'>{t('loading')}</p>
    </main>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation('errors')
  let message: string = t('genericTitle')
  let details: string = t('genericDetails')
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? t('notFoundTitle') : t('genericTitle')
    details = error.status === 404 ? t('notFoundDetails') : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='container mx-auto p-6 pt-16'>
      <h1 className='text-2xl font-semibold'>{message}</h1>
      <p className='mt-2 text-muted-foreground'>{details}</p>
      {stack && (
        <pre className='mt-6 w-full overflow-x-auto rounded-lg border border-border bg-sidebar p-4 text-foreground'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
