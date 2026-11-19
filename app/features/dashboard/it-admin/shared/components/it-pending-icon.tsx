import { LoaderCircle } from 'lucide-react'

export function ItPendingIcon({ pending }: { pending: boolean }) {
  return pending ? <LoaderCircle aria-hidden strokeWidth={1.5} className='size-4 animate-spin' /> : null
}
