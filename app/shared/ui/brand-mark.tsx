type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg aria-hidden='true' className={className} fill='none' viewBox='0 0 256 256'>
      <path d='M128 35a93 93 0 1 0 93 93' stroke='currentColor' strokeLinecap='round' strokeWidth='34' />
      <path d='m128 92 36 36-36 36-36-36Z' fill='currentColor' />
    </svg>
  )
}
