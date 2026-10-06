type ManagerIdentityMarkProps = {
  className?: string
  name: string
  person?: boolean
}

export function ManagerIdentityMark({ className = '', name, person = false }: ManagerIdentityMarkProps) {
  const words = name.trim().split(/\s+/)
  const initials = person ? `${words[0]?.[0] ?? ''}${words.at(-1)?.[0] ?? ''}` : words[0]?.slice(0, 2)

  return (
    <span
      aria-hidden='true'
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft/60 text-xs font-extrabold tracking-tight text-foreground uppercase ${className}`}
    >
      {initials}
    </span>
  )
}
