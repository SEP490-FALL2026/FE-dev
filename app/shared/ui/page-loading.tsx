import { SentryMascot } from './sentry-mascot'

interface LoadingIndicatorProps {
  message: string
}

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div role='status' aria-live='polite' className='flex flex-col items-center gap-5 text-center'>
      <SentryMascot mood='hop' size={112} />
      <div className='flex flex-col items-center gap-3'>
        <p className='max-w-sm text-lg leading-relaxed font-medium text-foreground sm:text-xl'>{message}</p>
        <span aria-hidden='true' className='page-loading-dots flex gap-1.5'>
          <span className='size-1.5 rounded-full bg-primary' />
          <span className='size-1.5 rounded-full bg-primary' />
          <span className='size-1.5 rounded-full bg-primary' />
        </span>
      </div>
    </div>
  )
}

export function PageLoading({ message }: LoadingIndicatorProps) {
  return (
    <main className='grid min-h-svh place-items-center bg-background p-6'>
      <LoadingIndicator message={message} />
    </main>
  )
}
