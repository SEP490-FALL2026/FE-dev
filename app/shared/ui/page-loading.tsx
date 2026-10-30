import { LoaderCircle } from 'lucide-react'

interface LoadingIndicatorProps {
  message: string
}

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div role='status' aria-live='polite' className='flex flex-col items-center gap-7 text-center'>
      <div className='flex size-28 items-center justify-center rounded-full bg-primary/10 sm:size-32'>
        <LoaderCircle
          aria-hidden='true'
          className='size-16 animate-spin text-primary motion-reduce:animate-none sm:size-20'
          strokeWidth={1.5}
        />
      </div>
      <p className='max-w-sm text-lg font-medium leading-relaxed text-foreground sm:text-xl'>{message}</p>
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
