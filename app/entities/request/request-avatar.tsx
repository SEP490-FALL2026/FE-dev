import { useState } from 'react'

import type { TeamRequest } from './manager-requests-demo'

export function RequestAvatar({ request, large = false }: { request: TeamRequest; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span
      aria-hidden='true'
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600 ${large ? 'size-12 text-base' : 'size-8 text-xs'}`}
    >
      {request.initials}
    </span>
  ) : (
    <img
      src={request.avatar}
      alt=''
      loading='lazy'
      referrerPolicy='no-referrer'
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${large ? 'size-12' : 'size-8'}`}
    />
  )
}
