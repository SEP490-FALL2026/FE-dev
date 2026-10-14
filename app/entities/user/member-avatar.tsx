import { useState } from 'react'

import type { TeamMember } from './team-member.types'

export function MemberAvatar({ member, large = false }: { member: TeamMember; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  return member.avatar && !failed ? (
    <img
      src={member.avatar}
      alt={member.name}
      loading='lazy'
      className={
        large
          ? 'size-24 shrink-0 rounded-full border-4 border-white object-cover shadow-xs'
          : 'size-8 shrink-0 rounded-full object-cover'
      }
      onError={() => setFailed(true)}
    />
  ) : (
    <span
      aria-hidden='true'
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600 ${large ? 'size-24 text-2xl' : 'size-8 text-xs'}`}
    >
      {member.initials}
    </span>
  )
}
